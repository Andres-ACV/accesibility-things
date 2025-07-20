/**
 * API Service para conectar con el backend FastAPI
 * Maneja autenticación JWT y localStorage solo para token y usuario actual
 */
class ApiService {
    constructor() {
        this.baseURL = 'http://localhost:8000';
        this.tokenKey = 'accessibility_things_token';
        this.userKey = 'accessibility_things_user';
    }

    // Métodos de autenticación
    getStoredToken() {
        return localStorage.getItem(this.tokenKey);
    }

    setStoredToken(token) {
        if (token) {
            localStorage.setItem(this.tokenKey, token);
        } else {
            localStorage.removeItem(this.tokenKey);
        }
    }

    // Métodos de headers de autenticación
    getAuthHeaders() {
        const token = this.getStoredToken();
        const headers = {
            'Content-Type': 'application/json',
        };
        
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        
        return headers;
    }

    // Método genérico para hacer requests
    async makeRequest(url, options = {}) {
        try {
            console.log(`📡 API Request: ${options.method || 'GET'} ${url}`);
            
            const config = {
                headers: this.getAuthHeaders(),
                ...options
            };

            const response = await fetch(url, config);
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const errorMessage = errorData.detail || `HTTP error! status: ${response.status}`;
                console.error(`❌ API Error: ${response.status} - ${errorMessage}`);
                throw new Error(errorMessage);
            }
            
            const data = await response.json();
            console.log(`✅ API Response: ${url}`, data);
            return data;
        } catch (error) {
            console.error('❌ API request failed:', error);
            throw error;
        }
    }

    // Métodos HTTP básicos
    async post(url, data) {
        return this.makeRequest(url, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    async get(url) {
        return this.makeRequest(url, {
            method: 'GET'
        });
    }

    async put(url, data) {
        return this.makeRequest(url, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    async delete(url) {
        return this.makeRequest(url, {
            method: 'DELETE'
        });
    }

    // Métodos de autenticación
    async register(userData) {
        const response = await this.post(`${this.baseURL}/auth/register`, userData);
        if (response.access_token) {
            this.setStoredToken(response.access_token);
            this.setCurrentUser(response.user);
        }
        return response;
    }

    async login(credentials) {
        const response = await this.post(`${this.baseURL}/auth/login`, credentials);
        if (response.access_token) {
            this.setStoredToken(response.access_token);
            // Obtener información del usuario
            const userProfile = await this.getProfile();
            this.setCurrentUser(userProfile);
        }
        return response;
    }

    async getProfile() {
        return this.get(`${this.baseURL}/auth/profile`);
    }

    async updateProfile(profileData) {
        return this.put(`${this.baseURL}/auth/profile`, profileData);
    }

    logout() {
        this.setStoredToken(null);
        this.setCurrentUser(null);
        localStorage.removeItem(this.userKey);
    }

    isAuthenticated() {
        return !!this.getStoredToken();
    }

    getCurrentUser() {
        const userStr = localStorage.getItem(this.userKey);
        return userStr ? JSON.parse(userStr) : null;
    }

    setCurrentUser(user) {
        if (user) {
            localStorage.setItem(this.userKey, JSON.stringify(user));
        } else {
            localStorage.removeItem(this.userKey);
        }
    }

    // Métodos de productos
    async getProducts(params = {}) {
        const queryParams = new URLSearchParams();
        
        if (params.skip) queryParams.append('skip', params.skip);
        if (params.limit) queryParams.append('limit', params.limit);
        if (params.category_id) queryParams.append('category_id', params.category_id);
        
        const url = `${this.baseURL}/products?${queryParams.toString()}`;
        return this.get(url);
    }

    async searchProducts(query, params = {}) {
        const queryParams = new URLSearchParams();
        queryParams.append('q', query);
        
        if (params.skip) queryParams.append('skip', params.skip);
        if (params.limit) queryParams.append('limit', params.limit);
        
        const url = `${this.baseURL}/products/search?${queryParams.toString()}`;
        return this.get(url);
    }

    async getProduct(id) {
        return this.get(`${this.baseURL}/products/${id}`);
    }

    async getTopSellingProducts(limit = 4) {
        const queryParams = new URLSearchParams();
        if (limit) queryParams.append('limit', limit);
        
        const url = `${this.baseURL}/products/top_selling?${queryParams.toString()}`;
        return this.get(url);
    }

    // Métodos de categorías
    async getCategories() {
        console.log('🔄 Llamando a getCategories...');
        return this.get(`${this.baseURL}/categories`);
    }

    // Métodos de roles
    async getRoles() {
        console.log('🔄 Llamando a getRoles...');
        return this.get(`${this.baseURL}/roles`);
    }

    // Métodos de órdenes
    async createOrder(orderData) {
        return this.post(`${this.baseURL}/orders`, orderData);
    }

    async getUserOrders(userId) {
        return this.get(`${this.baseURL}/orders/user/${userId}`);
    }

    // Método para verificar salud del backend
    async checkBackendHealth() {
        try {
            const response = await fetch(`${this.baseURL}/health`);
            return response.ok;
        } catch (error) {
            console.error('Backend health check failed:', error);
            return false;
        }
    }

    // Métodos de validación
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    validatePassword(password) {
        return password.length >= 6;
    }
}

// Crear instancia global
const apiService = new ApiService();

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ApiService;
} 