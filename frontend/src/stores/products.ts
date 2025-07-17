import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import ProductService from '@/services/productService';
import type { Product, ProductSearchParams } from '@/types/product';

export const useProductsStore = defineStore('products', () => {
  const products = ref<Product[]>([]);
  const categories = ref<any[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Getters
  const allProducts = computed(() => products.value);
  const allCategories = computed(() => categories.value);

  // Actions
  const fetchProducts = async (params?: ProductSearchParams) => {
    try {
      isLoading.value = true;
      error.value = null;
      const data = await ProductService.getProducts(params);
      products.value = data;
    } catch (err) {
      error.value = 'Error al cargar productos';
      console.error('Error fetching products:', err);
    } finally {
      isLoading.value = false;
    }
  };

  const searchProducts = async (query: string, params?: ProductSearchParams) => {
    try {
      isLoading.value = true;
      error.value = null;
      const data = await ProductService.searchProducts(query, params);
      products.value = data;
    } catch (err) {
      error.value = 'Error al buscar productos';
      console.error('Error searching products:', err);
    } finally {
      isLoading.value = false;
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await ProductService.getCategories();
      categories.value = data;
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const getProductById = async (id: number): Promise<Product | null> => {
    try {
      const product = await ProductService.getProduct(id);
      return product;
    } catch (err) {
      console.error('Error fetching product:', err);
      return null;
    }
  };

  return {
    products,
    categories,
    isLoading,
    error,
    allProducts,
    allCategories,
    fetchProducts,
    searchProducts,
    fetchCategories,
    getProductById,
  };
}); 