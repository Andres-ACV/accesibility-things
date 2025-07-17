<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start xl:gap-x-16">
        <!-- Formulario de envío -->
        <div class="lg:col-span-7">
          <h1 class="text-3xl font-bold text-gray-900 mb-8">Información de Envío</h1>
          
          <form @submit.prevent="handleCheckout" class="space-y-6">
            <!-- Información personal -->
            <div class="bg-white rounded-lg shadow p-6">
              <h2 class="text-lg font-semibold text-gray-900 mb-4">Información Personal</h2>
              
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label for="firstName" class="block text-sm font-medium text-gray-700">
                    Nombre
                  </label>
                  <input
                    id="firstName"
                    v-model="form.firstName"
                    type="text"
                    required
                    class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                
                <div>
                  <label for="lastName" class="block text-sm font-medium text-gray-700">
                    Apellidos
                  </label>
                  <input
                    id="lastName"
                    v-model="form.lastName"
                    type="text"
                    required
                    class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                
                <div class="sm:col-span-2">
                  <label for="email" class="block text-sm font-medium text-gray-700">
                    Correo Electrónico
                  </label>
                  <input
                    id="email"
                    v-model="form.email"
                    type="email"
                    required
                    class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                
                <div class="sm:col-span-2">
                  <label for="phone" class="block text-sm font-medium text-gray-700">
                    Teléfono
                  </label>
                  <input
                    id="phone"
                    v-model="form.phone"
                    type="tel"
                    required
                    class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>

            <!-- Dirección de envío -->
            <div class="bg-white rounded-lg shadow p-6">
              <h2 class="text-lg font-semibold text-gray-900 mb-4">Dirección de Envío</h2>
              
              <div class="space-y-4">
                <div>
                  <label for="address" class="block text-sm font-medium text-gray-700">
                    Dirección
                  </label>
                  <input
                    id="address"
                    v-model="form.address"
                    type="text"
                    required
                    class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Calle, número, apartamento"
                  />
                </div>
                
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label for="city" class="block text-sm font-medium text-gray-700">
                      Ciudad
                    </label>
                    <input
                      id="city"
                      v-model="form.city"
                      type="text"
                      required
                      class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <label for="state" class="block text-sm font-medium text-gray-700">
                      Provincia
                    </label>
                    <input
                      id="state"
                      v-model="form.state"
                      type="text"
                      required
                      class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <label for="zipCode" class="block text-sm font-medium text-gray-700">
                      Código Postal
                    </label>
                    <input
                      id="zipCode"
                      v-model="form.zipCode"
                      type="text"
                      required
                      class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label for="country" class="block text-sm font-medium text-gray-700">
                    País
                  </label>
                  <select
                    id="country"
                    v-model="form.country"
                    required
                    class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Seleccionar país</option>
                    <option value="CR">Costa Rica</option>
                    <option value="US">Estados Unidos</option>
                    <option value="MX">México</option>
                    <option value="ES">España</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Notas adicionales -->
            <div class="bg-white rounded-lg shadow p-6">
              <h2 class="text-lg font-semibold text-gray-900 mb-4">Información Adicional</h2>
              
              <div>
                <label for="notes" class="block text-sm font-medium text-gray-700">
                  Notas de envío (opcional)
                </label>
                <textarea
                  id="notes"
                  v-model="form.notes"
                  rows="3"
                  class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Instrucciones especiales para la entrega..."
                ></textarea>
              </div>
            </div>

            <!-- Botones -->
            <div class="flex justify-between">
              <router-link
                to="/cart"
                class="px-6 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Volver al Carrito
              </router-link>
              
              <button
                type="submit"
                :disabled="isLoading"
                class="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ isLoading ? 'Procesando...' : 'Confirmar Pedido' }}
              </button>
            </div>
          </form>
        </div>

        <!-- Resumen del pedido -->
        <div class="lg:col-span-5 mt-8 lg:mt-0">
          <div class="bg-white rounded-lg shadow p-6 sticky top-8">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Resumen del Pedido</h2>
            
            <!-- Productos -->
            <div class="space-y-3 mb-6">
              <div
                v-for="item in cartItems"
                :key="item.id"
                class="flex items-center"
              >
                <img
                  :src="item.product.images?.[0]?.image_url || '/placeholder-product.jpg'"
                  :alt="item.product.name"
                  class="w-12 h-12 object-cover rounded"
                />
                <div class="ml-3 flex-1">
                  <h4 class="text-sm font-medium text-gray-900">
                    {{ item.product.name }}
                  </h4>
                  <p class="text-sm text-gray-500">
                    Cantidad: {{ item.quantity }}
                  </p>
                </div>
                <div class="text-sm font-medium text-gray-900">
                  {{ formatPrice(parseFloat(item.unit_price) * item.quantity) }}
                </div>
              </div>
            </div>
            
            <!-- Totales -->
            <div class="border-t pt-4 space-y-2">
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Subtotal:</span>
                <span class="font-medium">{{ formatPrice(total) }}</span>
              </div>
              
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Envío:</span>
                <span class="font-medium">Gratis</span>
              </div>
              
              <div class="border-t pt-2">
                <div class="flex justify-between text-lg font-semibold">
                  <span>Total:</span>
                  <span class="text-indigo-600">{{ formatPrice(total) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'
import { useOrderService } from '@/services/orderService'
import { formatPrice } from '@/utils/helpers'

const router = useRouter()
const cartStore = useCartStore()
const authStore = useAuthStore()

// Estado del formulario
const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  zipCode: '',
  country: '',
  notes: ''
})

const isLoading = ref(false)

// Computed
const cartItems = computed(() => cartStore.cartItems)
const total = computed(() => cartStore.total)

// Métodos
const handleCheckout = async () => {
  try {
    isLoading.value = true
    
    // Crear la orden
    const orderData = {
      user_id: authStore.currentUser?.id || 0,
      status: 'pending' as const,
      total_amount: total.value.toString(),
      shipping_address: `${form.address}, ${form.city}, ${form.state} ${form.zipCode}, ${form.country}`,
      items: cartItems.value.map(item => ({
        product_id: item.product.id,
        quantity: item.quantity,
        unit_price: item.unit_price
      }))
    }
    
    // Aquí llamarías al servicio para crear la orden
    // const order = await OrderService.createOrder(orderData)
    
    // Limpiar el carrito
    cartStore.clearCart()
    
    // Redirigir a confirmación
    router.push('/orders')
  } catch (error) {
    console.error('Error al procesar el pedido:', error)
    // Aquí podrías mostrar un mensaje de error
  } finally {
    isLoading.value = false
  }
}
</script> 