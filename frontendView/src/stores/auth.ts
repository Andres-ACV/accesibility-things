import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import AuthService from '@/services/authService';
import type { User, LoginRequest, RegisterRequest } from '@/types/auth';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const isAuthenticated = ref(false);
  const isLoading = ref(false);

  // Getters
  const currentUser = computed(() => user.value);
  const isLoggedIn = computed(() => isAuthenticated.value);

  // Actions
  const login = async (credentials: LoginRequest) => {
    try {
      isLoading.value = true;
      const response = await AuthService.login(credentials);
      
      // Guardar tokens
      localStorage.setItem('access_token', response.access_token);
      localStorage.setItem('refresh_token', response.refresh_token);
      
      // Obtener información del usuario
      const userData = await AuthService.getCurrentUser();
      user.value = userData;
      isAuthenticated.value = true;
      
      // Guardar usuario en localStorage
      localStorage.setItem('user', JSON.stringify(userData));
      
      return response;
    } catch (error) {
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  const register = async (userData: RegisterRequest) => {
    try {
      isLoading.value = true;
      const response = await AuthService.register(userData);
      
      // Guardar tokens
      localStorage.setItem('access_token', response.access_token);
      localStorage.setItem('refresh_token', response.refresh_token);
      
      // Obtener información del usuario
      const userInfo = await AuthService.getCurrentUser();
      user.value = userInfo;
      isAuthenticated.value = true;
      
      // Guardar usuario en localStorage
      localStorage.setItem('user', JSON.stringify(userInfo));
      
      return response;
    } catch (error) {
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  const logout = () => {
    AuthService.logout();
    user.value = null;
    isAuthenticated.value = false;
  };

  const initializeAuth = () => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('access_token');
    
    if (storedUser && token) {
      user.value = JSON.parse(storedUser);
      isAuthenticated.value = true;
    }
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    currentUser,
    isLoggedIn,
    login,
    register,
    logout,
    initializeAuth,
  };
}, {
  persist: true,
}); 