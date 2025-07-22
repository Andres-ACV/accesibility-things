/**
 * Data Manager Optimizado
 * Usa backend FastAPI como única fuente de verdad para datos de productos, usuarios y categorías
 * localStorage se usa exclusivamente para carrito y sesión de usuario
 */
class DataManagerOptimized {
    constructor() {
        console.log('🔧 Inicializando DataManagerOptimized...');
        
        // Verificar si apiService está disponible globalmente
        if (typeof window.apiService !== 'undefined') {
            this.apiService = window.apiService;
            console.log('✅ Usando apiService global existente');
        } else if (typeof ApiService !== 'undefined') {
            this.apiService = new ApiService();
            console.log('✅ Creando nueva instancia de ApiService');
        } else {
            console.error('❌ Ni apiService global ni clase ApiService están disponibles');
            this.apiService = null;
        }
        
        this.localData = {
            carrito: [],
            currentUser: null
        };
        this.backendData = {
            productos: [],
            categorias: []
        };
        
        console.log('✅ DataManagerOptimized inicializado');
    }

    /**
     * Inicializar el data manager
     */
    async init() {
        try {
            // Cargar datos del backend (única fuente de verdad)
            await this.loadFromBackend();
            
            // Cargar datos locales (carrito, usuario actual)
            this.loadLocalData();
            
        } catch (error) {
            console.error('Error inicializando DataManager:', error);
            // Si el backend no está disponible, mostrar error al usuario
            this.handleBackendUnavailable();
        }
    }

    /**
     * Cargar datos desde el backend (única fuente de verdad)
     */
    async loadFromBackend() {
        try {
            console.log('🔄 Cargando datos desde el backend...');
            
            // Verificar que apiService esté disponible
            if (!this.apiService) {
                throw new Error('API Service no está disponible');
            }
            
            console.log('📡 API Service disponible:', this.apiService);
            
            // Verificar conectividad del backend
            console.log('🏥 Verificando salud del backend...');
            const isHealthy = await this.apiService.checkBackendHealth();
            if (!isHealthy) {
                throw new Error('Backend no está disponible');
            }
            console.log('✅ Backend está saludable');
            
            // Cargar productos
            console.log('📦 Cargando productos...');
            const productos = await this.apiService.getProducts();
            this.backendData.productos = productos;
            console.log(`✅ ${productos.length} productos cargados`);
            
            // Cargar categorías
            console.log('📂 Cargando categorías...');
            const categorias = await this.apiService.getCategories();
            this.backendData.categorias = categorias;
            console.log(`✅ ${categorias.length} categorías cargadas`);
            
        } catch (error) {
            console.error('❌ Error cargando desde backend:', error);
            throw new Error(`No se pudo conectar con el servidor: ${error.message}`);
        }
    }

    /**
     * Manejar cuando el backend no está disponible
     */
    handleBackendUnavailable() {
        // Mostrar mensaje de error al usuario
        const errorMessage = 'El servidor no está disponible en este momento. Por favor, intenta más tarde.';
        
        // Crear elemento de notificación
        const notification = document.createElement('div');
        notification.className = 'notification notification-error';
        notification.innerHTML = `
            <strong>Error de Conexión</strong>
            <p>${errorMessage}</p>
        `;
        
        // Insertar al inicio del body
        document.body.insertBefore(notification, document.body.firstChild);
        
        // Remover después de 10 segundos
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 10000);
    }

    /**
     * Cargar datos locales (carrito, usuario)
     */
    loadLocalData() {
        try {
            const carrito = localStorage.getItem('carrito');
            const currentUser = localStorage.getItem('current_user');
            
            this.localData.carrito = carrito ? JSON.parse(carrito) : [];
            this.localData.currentUser = currentUser ? JSON.parse(currentUser) : null;
            
        } catch (error) {
            console.error('Error cargando datos locales:', error);
            this.localData.carrito = [];
            this.localData.currentUser = null;
        }
    }

    // ===== AUTENTICACIÓN =====

    /**
     * Registrar usuario
     */
    async registerUser(userData) {
        try {
            const response = await this.apiService.register(userData);
            return response;
        } catch (error) {
            throw new Error(error.message || 'Error en el registro');
        }
    }

    /**
     * Iniciar sesión
     */
    async loginUser(email, password, rememberMe = false) {
        try {
            const response = await this.apiService.login({ email, password });
            
            // Obtener perfil del usuario
            const userProfile = await this.apiService.getProfile();
            this.apiService.setCurrentUser(userProfile);
            
            // Guardar usuario en localStorage para persistencia de sesión
            localStorage.setItem('current_user', JSON.stringify(userProfile));
            this.localData.currentUser = userProfile;
            
            return userProfile;
        } catch (error) {
            throw new Error(error.message || 'Error en el inicio de sesión');
        }
    }

    /**
     * Cerrar sesión
     */
    logout() {
        this.apiService.logout();
        localStorage.removeItem('current_user');
        this.localData.currentUser = null;
    }

    /**
     * Obtener usuario actual
     */
    getCurrentUser() {
        return this.localData.currentUser || this.apiService.getCurrentUser();
    }

    /**
     * Verificar si el usuario está autenticado
     */
    isAuthenticated() {
        return this.apiService.isAuthenticated();
    }

    // ===== GESTIÓN DE PRODUCTOS =====

    /**
     * Obtener productos con filtros
     */
    async getProductos(filters = {}) {
        try {
            // Los productos siempre vienen del backend
            let productos = this.backendData.productos;
            
            // Aplicar filtros locales si es necesario
            if (Object.keys(filters).length > 0) {
                productos = this.filterProductosLocal(productos, filters);
            }
            
            return productos;
        } catch (error) {
            console.error('Error obteniendo productos:', error);
            throw new Error('No se pudieron cargar los productos');
        }
    }

    /**
     * Filtrar productos localmente
     */
    filterProductosLocal(productos, filters) {
        let filtered = [...productos];
        
        if (filters.categoria) {
            filtered = filtered.filter(p => p.category_id === filters.categoria);
        }
        
        if (filters.precio_min !== undefined) {
            filtered = filtered.filter(p => p.price >= filters.precio_min);
        }
        
        if (filters.precio_max !== undefined) {
            filtered = filtered.filter(p => p.price <= filters.precio_max);
        }
        
        if (filters.busqueda) {
            const searchTerm = filters.busqueda.toLowerCase();
            filtered = filtered.filter(p => 
                p.name.toLowerCase().includes(searchTerm) ||
                p.description.toLowerCase().includes(searchTerm)
            );
        }
        
        return filtered;
    }

    /**
     * Buscar productos
     */
    async searchProductos(query) {
        try {
            const productos = await this.apiService.searchProducts(query);
            return productos;
        } catch (error) {
            console.error('Error buscando productos:', error);
            throw new Error('No se pudo realizar la búsqueda');
        }
    }

    /**
     * Obtener producto por ID
     */
    async getProductoById(id) {
        try {
            const producto = await this.apiService.getProduct(id);
            return producto;
        } catch (error) {
            console.error('Error obteniendo producto:', error);
            throw new Error('No se pudo cargar el producto');
        }
    }

    /**
     * Obtener productos paginados y ordenados desde el backend
     */
    async getProductosPaginado({ page = 1, limit = 4, sort_by = 'id', sort_order = 'asc', category_id = null, min_price = null, max_price = null, min_avg_rating = null, color_id = null, search = '' } = {}) {
        try {
            const params = { page, limit, sort_by, sort_order };
            if (category_id) params.category_id = category_id;
            if (min_price) params.min_price = min_price;
            if (max_price) params.max_price = max_price;
            if (min_avg_rating) params.min_avg_rating = min_avg_rating;
            if (color_id) params.color_id = color_id;
            if (search && search.trim() !== '') params.search = search.trim();
            const response = await this.apiService.getProducts(params);
            return response;
        } catch (error) {
            console.error('Error obteniendo productos paginados:', error);
            throw new Error('No se pudieron cargar los productos');
        }
    }

    async getProductoDetalle(id) {
        return this.apiService.getProductDetail(id);
    }

    // ===== GESTIÓN DE CARRITO =====

    /**
     * Agregar producto al carrito
     */
    addToCart(productId, quantity = 1) {
        const existingItem = this.localData.carrito.find(item => item.productId === productId);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.localData.carrito.push({
                productId: productId,
                quantity: quantity,
                addedAt: new Date().toISOString()
            });
        }
        
        this.saveCartToStorage();
        this.updateCartCounter();
    }

    /**
     * Actualizar cantidad en carrito
     */
    updateCartQuantity(productId, quantity) {
        const item = this.localData.carrito.find(item => item.productId === productId);
        
        if (item) {
            if (quantity <= 0) {
                this.removeFromCart(productId);
            } else {
                item.quantity = quantity;
                this.saveCartToStorage();
                this.updateCartCounter();
            }
        }
    }

    /**
     * Remover producto del carrito
     */
    removeFromCart(productId) {
        this.localData.carrito = this.localData.carrito.filter(item => item.productId !== productId);
        this.saveCartToStorage();
        this.updateCartCounter();
    }

    /**
     * Limpiar carrito
     */
    clearCart() {
        this.localData.carrito = [];
        this.saveCartToStorage();
        this.updateCartCounter();
    }

    /**
     * Obtener carrito
     */
    getCart() {
        return this.localData.carrito;
    }

    /**
     * Calcular total del carrito
     */
    getCartTotal() {
        return this.localData.carrito.reduce((total, item) => {
            const producto = this.backendData.productos.find(p => p.id === item.productId);
            return total + (producto ? producto.price * item.quantity : 0);
        }, 0);
    }

    /**
     * Obtener cantidad de items en carrito
     */
    getCartItemCount() {
        return this.localData.carrito.reduce((count, item) => count + item.quantity, 0);
    }

    /**
     * Guardar carrito en localStorage
     */
    saveCartToStorage() {
        try {
            localStorage.setItem('carrito', JSON.stringify(this.localData.carrito));
        } catch (error) {
            console.error('Error guardando carrito:', error);
        }
    }

    /**
     * Actualizar contador del carrito en la UI
     */
    updateCartCounter() {
        const cartBadge = document.querySelector('.cart-badge');
        if (cartBadge) {
            const count = this.getCartItemCount();
            cartBadge.textContent = count;
            cartBadge.style.display = count > 0 ? 'inline' : 'none';
        }
    }

    // ===== GESTIÓN DE ÓRDENES =====

    /**
     * Crear orden
     */
    async createOrder(orderData) {
        try {
            const order = await this.apiService.createOrder(orderData);
            
            // Limpiar carrito después de crear la orden
            this.clearCart();
            
            return order;
        } catch (error) {
            console.error('Error creando orden:', error);
            throw new Error('No se pudo crear la orden');
        }
    }

    /**
     * Obtener órdenes del usuario
     */
    async getUserOrders() {
        try {
            const currentUser = this.getCurrentUser();
            if (!currentUser) {
                throw new Error('Usuario no autenticado');
            }
            
            const orders = await this.apiService.getUserOrders(currentUser.id);
            return orders;
        } catch (error) {
            console.error('Error obteniendo órdenes:', error);
            throw new Error('No se pudieron cargar las órdenes');
        }
    }

    // ===== UTILIDADES =====

    /**
     * Generar ID único para usuario
     */
    generateUserId() {
        return Date.now() + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Generar ID único para orden
     */
    generateOrderId() {
        return 'ORD-' + Date.now() + Math.random().toString(36).substr(2, 5);
    }

    /**
     * Obtener categorías
     */
    async getCategorias() {
        try {
            return this.backendData.categorias;
        } catch (error) {
            console.error('Error obteniendo categorías:', error);
            throw new Error('No se pudieron cargar las categorías');
        }
    }

    /**
     * Validar datos de usuario
     */
    validateUserData(userData) {
        const errors = [];
        
        if (!userData.email || !userData.email.includes('@')) {
            errors.push('Email válido es requerido');
        }
        
        if (!userData.password || userData.password.length < 6) {
            errors.push('Contraseña debe tener al menos 6 caracteres');
        }
        
        if (!userData.full_name || userData.full_name.trim().length < 2) {
            errors.push('Nombre completo es requerido');
        }
        
        return errors;
    }
}

// Crear instancia global
const dataManagerOptimized = new DataManagerOptimized();
window.dataManagerOptimized = dataManagerOptimized; // <-- Asegura acceso global
// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DataManagerOptimized;
}