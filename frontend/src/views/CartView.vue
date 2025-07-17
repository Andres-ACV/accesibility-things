<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start xl:gap-x-16">
        <div class="lg:col-span-7">
          <h1 class="text-3xl font-bold text-gray-900 mb-8">Carrito de Compras</h1>
          
          <!-- Carrito vacío -->
          <div v-if="cartItems.length === 0" class="text-center py-12">
            <div class="text-gray-500 text-lg mb-4">Tu carrito está vacío</div>
            <router-link
              to="/catalog"
              class="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Continuar Comprando
            </router-link>
          </div>

          <!-- Lista de productos -->
          <div v-else class="space-y-4">
            <div
              v-for="item in cartItems"
              :key="item.id"
              class="bg-white rounded-lg shadow p-6"
            >
              <div class="flex items-center">
                <img
                  :src="item.product.images?.[0]?.image_url || '/placeholder-product.jpg'"
                  :alt="item.product.name"
                  class="w-20 h-20 object-cover rounded-md"
                />
                
                <div class="ml-4 flex-1">
                  <h3 class="text-lg font-semibold text-gray-900">
                    {{ item.product.name }}
                  </h3>
                  <p class="text-gray-600 text-sm mt-1">
                    {{ item.product.description }}
                  </p>
                  <div class="flex items-center justify-between mt-2">
                    <div class="flex items-center space-x-2">
                      <label class="text-sm text-gray-700">Cantidad:</label>
                      <select
                        :value="item.quantity"
                        @change="updateQuantity(item.product.id, parseInt($event.target.value))"
                        class="border border-gray-300 rounded px-2 py-1 text-sm"
                      >
                        <option v-for="n in 10" :key="n" :value="n">{{ n }}</option>
                      </select>
                    </div>
                    
                    <div class="text-right">
                      <div class="text-lg font-semibold text-indigo-600">
                        {{ formatPrice(item.unit_price) }}
                      </div>
                      <div class="text-sm text-gray-500">
                        Total: {{ formatPrice(parseFloat(item.unit_price) * item.quantity) }}
                      </div>
                    </div>
                  </div>
                </div>
                
                <button
                  @click="removeFromCart(item.product.id)"
                  class="ml-4 text-red-600 hover:text-red-800"
                  title="Eliminar del carrito"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Resumen del carrito -->
        <div class="lg:col-span-5 mt-8 lg:mt-0">
          <div class="bg-white rounded-lg shadow p-6 sticky top-8">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Resumen del Pedido</h2>
            
            <div class="space-y-3">
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Subtotal ({{ itemCount }} productos):</span>
                <span class="font-medium">{{ formatPrice(total) }}</span>
              </div>
              
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Envío:</span>
                <span class="font-medium">Gratis</span>
              </div>
              
              <div class="border-t pt-3">
                <div class="flex justify-between text-lg font-semibold">
                  <span>Total:</span>
                  <span class="text-indigo-600">{{ formatPrice(total) }}</span>
                </div>
              </div>
            </div>
            
            <div class="mt-6 space-y-3">
              <router-link
                to="/checkout"
                class="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Proceder al Checkout
              </router-link>
              
              <router-link
                to="/catalog"
                class="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Continuar Comprando
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useCartStore } from '@/stores/cart'
import { formatPrice } from '@/utils/helpers'

const cartStore = useCartStore()

// Computed
const cartItems = computed(() => cartStore.cartItems)
const itemCount = computed(() => cartStore.itemCount)
const total = computed(() => cartStore.total)

// Métodos
const updateQuantity = (productId: number, quantity: number) => {
  cartStore.updateQuantity(productId, quantity)
}

const removeFromCart = (productId: number) => {
  cartStore.removeFromCart(productId)
}
</script> 