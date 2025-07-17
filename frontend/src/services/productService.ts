import api from './api';
import type { Product, ProductSearchParams } from '@/types/product';

export class ProductService {
  static async getProducts(params?: ProductSearchParams): Promise<Product[]> {
    const response = await api.get<Product[]>('/products', { params });
    return response.data;
  }

  static async searchProducts(query: string, params?: ProductSearchParams): Promise<Product[]> {
    const response = await api.get<Product[]>('/products/search', {
      params: { q: query, ...params },
    });
    return response.data;
  }

  static async getProduct(id: number): Promise<Product> {
    const response = await api.get<Product>(`/products/${id}`);
    return response.data;
  }

  static async getCategories(): Promise<any[]> {
    const response = await api.get('/categories');
    return response.data;
  }
}

export default ProductService; 