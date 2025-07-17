// Rutas de la API
export const API_ROUTES = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
  },
  PRODUCTS: {
    LIST: '/products',
    SEARCH: '/products/search',
    DETAIL: (id: number) => `/products/${id}`,
  },
  CATEGORIES: {
    LIST: '/categories',
    DETAIL: (id: number) => `/categories/${id}`,
  },
  ORDERS: {
    LIST: '/orders',
    CREATE: '/orders',
    DETAIL: (id: number) => `/orders/${id}`,
    USER_ORDERS: (userId: number) => `/orders/user/${userId}`,
  },
} as const;

// Estados de orden
export const ORDER_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
} as const;

// Configuración de paginación
export const PAGINATION = {
  DEFAULT_LIMIT: 12,
  MAX_LIMIT: 100,
} as const;

// Configuración de localStorage
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'user',
  CART: 'cart',
} as const; 