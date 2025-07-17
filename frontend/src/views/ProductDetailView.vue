<template>
  <div class="product-detail">
    <div class="container mx-auto px-4 py-8">
      <!-- Loading state -->
      <div v-if="loading" class="flex justify-center items-center min-h-64">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>

      <!-- Error state -->
      <div v-else-if="error" class="text-center py-8">
        <div class="text-red-600 text-xl mb-4">{{ error }}</div>
        <button 
          @click="loadProduct" 
          class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Reintentar
        </button>
      </div>

      <!-- Product content -->
      <div v-else-if="product" class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Product images -->
        <div class="product-images">
          <div class="main-image mb-4">
            <img 
              :src="selectedImage || product.images[0]?.url || '/placeholder-product.jpg'" 
              :alt="product.name"
              class="w-full h-96 object-cover rounded-lg shadow-lg"
            />
          </div>
          
          <!-- Thumbnail images -->
          <div v-if="product.images && product.images.length > 1" class="thumbnails flex gap-2 overflow-x-auto">
            <img 
              v-for="(image, index) in product.images" 
              :key="index"
              :src="image.url" 
              :alt="`${product.name} - imagen ${index + 1}`"
              @click="selectedImage = image.url"
              class="w-20 h-20 object-cover rounded cursor-pointer border-2 transition-all"
              :class="selectedImage === image.url ? 'border-blue-600' : 'border-gray-200 hover:border-gray-400'"
            />
          </div>
        </div>

        <!-- Product info -->
        <div class="product-info">
          <h1 class="text-3xl font-bold text-gray-900 mb-4">{{ product.name }}</h1>
          
          <!-- Price -->
          <div class="price mb-6">
            <span class="text-3xl font-bold text-green-600">${{ product.price }}</span>
            <span v-if="product.original_price && product.original_price > product.price" class="text-lg text-gray-500 line-through ml-2">
              ${{ product.original_price }}
            </span>
          </div>

          <!-- Description -->
          <div class="description mb-6">
            <h3 class="text-lg font-semibold mb-2">Descripción</h3>
            <p class="text-gray-700 leading-relaxed">{{ product.description }}</p>
          </div>

          <!-- Category -->
          <div class="category mb-6">
            <h3 class="text-lg font-semibold mb-2">Categoría</h3>
            <span class="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
              {{ product.category?.name || 'Sin categoría' }}
            </span>
          </div>

          <!-- Colors -->
          <div v-if="product.colors && product.colors.length > 0" class="colors mb-6">
            <h3 class="text-lg font-semibold mb-2">Colores disponibles</h3>
            <div class="flex gap-2">
              <div 
                v-for="color in product.colors" 
                :key="color.id"
                class="w-8 h-8 rounded-full border-2 cursor-pointer transition-all"
                :class="selectedColor?.id === color.id ? 'border-gray-800 scale-110' : 'border-gray-300 hover:border-gray-500'"
                :style="{ backgroundColor: color.hex_code }"
                @click="selectedColor = color"
                :title="color.name"
              ></div>
            </div>
          </div>

          <!-- Stock -->
          <div class="stock mb-6">
            <h3 class="text-lg font-semibold mb-2">Disponibilidad</h3>
            <span 
              class="inline-block px-3 py-1 rounded-full text-sm font-medium"
              :class="product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
            >
              {{ product.stock > 0 ? `${product.stock} unidades disponibles` : 'Agotado' }}
            </span>
          </div>

          <!-- Add to cart section -->
          <div class="add-to-cart">
            <div class="quantity-selector mb-4">
              <label for="quantity" class="block text-lg font-semibold mb-2">Cantidad</label>
              <div class="flex items-center border rounded-lg w-32">
                <button 
                  @click="decreaseQuantity"
                  :disabled="quantity <= 1"
                  class="px-3 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50"
                >
                  -
                </button>
                <input 
                  id="quantity"
                  v-model.number="quantity"
                  type="number"
                  min="1"
                  :max="product.stock"
                  class="flex-1 text-center border-none focus:outline-none"
                />
                <button 
                  @click="increaseQuantity"
                  :disabled="quantity >= product.stock"
                  class="px-3 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50"
                >
                  +
                </button>
              </div>
            </div>

            <button 
              @click="addToCart"
              :disabled="product.stock === 0 || addingToCart"
              class="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold text-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span v-if="addingToCart">Agregando...</span>
              <span v-else>{{ product.stock > 0 ? 'Agregar al carrito' : 'Agotado' }}</span>
            </button>

            <!-- Success message -->
            <div v-if="showSuccessMessage" class="mt-4 p-3 bg-green-100 text-green-800 rounded-lg">
              ¡Producto agregado al carrito exitosamente!
            </div>
          </div>
        </div>
      </div>

      <!-- Back button -->
      <div class="mt-8">
        <button 
          @click="$router.go(-1)"
          class="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
          Volver
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import ProductService from '@/services/productService'
import type { Product, ProductColor } from '@/types/product'

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()

// Reactive data
const product = ref<Product | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const selectedImage = ref<string | null>(null)
const selectedColor = ref<ProductColor | null>(null)
const quantity = ref(1)
const addingToCart = ref(false)
const showSuccessMessage = ref(false)

// Computed
const productId = computed(() => route.params.id as string)

// Methods
const loadProduct = async () => {
  try {
    loading.value = true
    error.value = null
    const productData = await ProductService.getProduct(productId.value)
    product.value = productData
    
    // Set default selected color if available
    if (productData.colors && productData.colors.length > 0) {
      selectedColor.value = productData.colors[0]
    }
  } catch (err) {
    console.error('Error loading product:', err)
    error.value = 'Error al cargar el producto. Por favor, inténtalo de nuevo.'
  } finally {
    loading.value = false
  }
}

const increaseQuantity = () => {
  if (product.value && quantity.value < product.value.stock) {
    quantity.value++
  }
}

const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--
  }
}

const addToCart = async () => {
  if (!product.value || product.value.stock === 0) return

  try {
    addingToCart.value = true
    
    const cartItem = {
      product_id: product.value.id,
      quantity: quantity.value,
      color_id: selectedColor.value?.id || null
    }
    
    await cartStore.addToCart(cartItem)
    
    // Show success message
    showSuccessMessage.value = true
    setTimeout(() => {
      showSuccessMessage.value = false
    }, 3000)
    
    // Reset quantity
    quantity.value = 1
  } catch (err) {
    console.error('Error adding to cart:', err)
    error.value = 'Error al agregar al carrito. Por favor, inténtalo de nuevo.'
  } finally {
    addingToCart.value = false
  }
}

// Lifecycle
onMounted(() => {
  loadProduct()
})
</script>

<style scoped>
.product-detail {
  min-height: 100vh;
  background-color: #f8fafc;
}

.thumbnails::-webkit-scrollbar {
  height: 4px;
}

.thumbnails::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 2px;
}

.thumbnails::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 2px;
}

.thumbnails::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}
</style> 