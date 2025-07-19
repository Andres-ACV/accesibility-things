import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { CartItem, Product } from '@/types/cart';

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([]);

  // Getters
  const cartItems = computed(() => items.value);
  const itemCount = computed(() => 
    items.value.reduce((total, item) => total + item.quantity, 0)
  );
  const total = computed(() => 
    items.value.reduce((sum, item) => sum + (parseFloat(item.unit_price) * item.quantity), 0)
  );

  // Actions
  const addToCart = (product: Product, quantity: number = 1) => {
    const existingItem = items.value.find(item => item.product.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      items.value.push({
        id: Date.now(), // ID temporal
        product,
        quantity,
        unit_price: product.price,
      });
    }
  };

  const removeFromCart = (productId: number) => {
    const index = items.value.findIndex(item => item.product.id === productId);
    if (index > -1) {
      items.value.splice(index, 1);
    }
  };

  const updateQuantity = (productId: number, quantity: number) => {
    const item = items.value.find(item => item.product.id === productId);
    if (item) {
      if (quantity <= 0) {
        removeFromCart(productId);
      } else {
        item.quantity = quantity;
      }
    }
  };

  const clearCart = () => {
    items.value = [];
  };

  return {
    items,
    cartItems,
    itemCount,
    total,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  };
}, {
  persist: true,
}); 