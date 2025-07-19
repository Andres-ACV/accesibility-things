<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Mis Pedidos</h1>
      
      <!-- Estado de carga -->
      <div v-if="isLoading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="text-center py-12">
        <div class="text-red-600 text-lg">{{ error }}</div>
        <button
          @click="loadOrders"
          class="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Reintentar
        </button>
      </div>

      <!-- Lista de pedidos -->
      <div v-else>
        <!-- Sin pedidos -->
        <div v-if="orders.length === 0" class="text-center py-12">
          <div class="text-gray-500 text-lg mb-4">No tienes pedidos aún</div>
          <router-link
            to="/catalog"
            class="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Comenzar a Comprar
          </router-link>
        </div>

        <!-- Pedidos -->
        <div v-else class="space-y-6">
          <div
            v-for="order in orders"
            :key="order.id"
            class="bg-white rounded-lg shadow overflow-hidden"
          >
            <!-- Header del pedido -->
            <div class="px-6 py-4 border-b border-gray-200">
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="text-lg font-semibold text-gray-900">
                    Pedido #{{ order.id }}
                  </h3>
                  <p class="text-sm text-gray-500">
                    {{ formatDate(order.created_at || '') }}
                  </p>
                </div>
                <div class="flex items-center space-x-4">
                  <span
                    :class="getStatusClass(order.status)"
                    class="px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {{ getStatusText(order.status) }}
                  </span>
                  <span class="text-lg font-semibold text-indigo-600">
                    {{ formatPrice(order.total_amount) }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Productos del pedido -->
            <div class="px-6 py-4">
              <div class="space-y-3">
                <div
                  v-for="item in order.items"
                  :key="item.id"
                  class="flex items-center"
                >
                  <img
                    :src="item.product?.images?.[0]?.image_url || '/placeholder-product.jpg'"
                    :alt="item.product?.name"
                    class="w-16 h-16 object-cover rounded"
                  />
                  <div class="ml-4 flex-1">
                    <h4 class="text-sm font-medium text-gray-900">
                      {{ item.product?.name }}
                    </h4>
                    <p class="text-sm text-gray-500">
                      Cantidad: {{ item.quantity }}
                    </p>
                  </div>
                  <div class="text-sm font-medium text-gray-900">
                    {{ formatPrice(item.unit_price) }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Dirección de envío -->
            <div class="px-6 py-4 bg-gray-50">
              <h4 class="text-sm font-medium text-gray-900 mb-2">
                Dirección de Envío
              </h4>
              <p class="text-sm text-gray-600">
                {{ order.shipping_address }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { formatPrice, formatDate } from '@/utils/helpers'

const authStore = useAuthStore()

// Estado local
const orders = ref([])
const isLoading = ref(false)
const error = ref('')

// Métodos
const loadOrders = async () => {
  if (!authStore.currentUser) return
  
  try {
    isLoading.value = true
    error.value = ''
    
    // Aquí llamarías al servicio para obtener las órdenes
    // const userOrders = await OrderService.getUserOrders(authStore.currentUser.id)
    // orders.value = userOrders
    
    // Por ahora, simulamos datos
    orders.value = []
  } catch (err: any) {
    error.value = 'Error al cargar los pedidos'
    console.error('Error loading orders:', err)
  } finally {
    isLoading.value = false
  }
}

const getStatusClass = (status: string) => {
  const classes = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
  }
  return classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-800'
}

const getStatusText = (status: string) => {
  const texts = {
    pending: 'Pendiente',
    processing: 'Procesando',
    shipped: 'Enviado',
    delivered: 'Entregado',
    cancelled: 'Cancelado'
  }
  return texts[status as keyof typeof texts] || status
}

// Lifecycle
onMounted(() => {
  loadOrders()
})
</script> 