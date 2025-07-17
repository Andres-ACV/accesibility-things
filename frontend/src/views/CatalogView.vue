<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header del catálogo -->
    <div class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Catálogo de Productos</h1>
            <p class="mt-2 text-sm text-gray-600">
              Encuentra los mejores productos de accesibilidad
            </p>
          </div>
          
          <!-- Búsqueda -->
          <div class="mt-4 sm:mt-0 sm:ml-6">
            <div class="relative">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Buscar productos..."
                class="w-full sm:w-80 pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                @input="handleSearch"
              />
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Filtros -->
        <div class="mt-6 flex flex-wrap gap-4">
          <select
            v-model="selectedCategory"
            @change="handleCategoryChange"
            class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Todas las categorías</option>
            <option
              v-for="category in categories"
              :key="category.id"
              :value="category.id"
            >
              {{ category.name }}
            </option>
          </select>
          
          <select
            v-model="sortBy"
            @change="handleSortChange"
            class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="name">Ordenar por nombre</option>
            <option value="price_asc">Precio: menor a mayor</option>
            <option value="price_desc">Precio: mayor a menor</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Contenido principal -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Estado de carga -->
      <div v-if="isLoading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="text-center py-12">
        <div class="text-red-600 text-lg">{{ error }}</div>
        <button
          @click="loadProducts"
          class="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Reintentar
        </button>
      </div>

      <!-- Productos -->
      <div v-else>
        <!-- Sin resultados -->
        <div v-if="products.length === 0" class="text-center py-12">
          <div class="text-gray-500 text-lg">No se encontraron productos</div>
          <button
            @click="clearFilters"
            class="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Limpiar filtros
          </button>
        </div>

        <!-- Grid de productos -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div
            v-for="product in products"
            :key="product.id"
            class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <div class="aspect-w-1 aspect-h-1 w-full">
              <img
                :src="product.images?.[0]?.image_url || '/placeholder-product.jpg'"
                :alt="product.name"
                class="w-full h-48 object-cover"
              />
            </div>
            <div class="p-4">
              <h3 class="text-lg font-semibold text-gray-900 mb-2">
                {{ product.name }}
              </h3>
              <p class="text-gray-600 text-sm mb-3 line-clamp-2">
                {{ product.description }}
              </p>
              <div class="flex items-center justify-between">
                <span class="text-xl font-bold text-indigo-600">
                  {{ formatPrice(product.price) }}
                </span>
                <button
                  @click="addToCart(product)"
                  class="px-3 py-1 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 transition-colors flex items-center gap-2"
                >
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Agregar
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Paginación -->
        <div v-if="totalPages > 1" class="mt-8 flex justify-center">
          <nav class="flex items-center space-x-2">
            <button
              @click="changePage(currentPage - 1)"
              :disabled="currentPage === 1"
              class="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Anterior
            </button>
            
            <span class="px-3 py-2 text-gray-700">
              Página {{ currentPage }} de {{ totalPages }}
            </span>
            
            <button
              @click="changePage(currentPage + 1)"
              :disabled="currentPage === totalPages"
              class="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Siguiente
            </button>
          </nav>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useProductsStore } from '@/stores/products'
import { useCartStore } from '@/stores/cart'
import { formatPrice } from '@/utils/helpers'

const productsStore = useProductsStore()
const cartStore = useCartStore()

// Estado local
const searchQuery = ref('')
const selectedCategory = ref('')
const sortBy = ref('name')
const currentPage = ref(1)
const itemsPerPage = 12

// Computed
const products = computed(() => productsStore.allProducts)
const categories = computed(() => productsStore.allCategories)
const isLoading = computed(() => productsStore.isLoading)
const error = computed(() => productsStore.error)

const totalPages = computed(() => {
  // Esto se calcularía basado en la respuesta del backend
  return Math.ceil(products.value.length / itemsPerPage)
})

// Métodos
const loadProducts = async () => {
  const params: any = {
    skip: (currentPage.value - 1) * itemsPerPage,
    limit: itemsPerPage
  }
  
  if (selectedCategory.value) {
    params.category_id = selectedCategory.value
  }
  
  await productsStore.fetchProducts(params)
}

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    productsStore.searchProducts(searchQuery.value.trim())
  } else {
    loadProducts()
  }
}

const handleCategoryChange = () => {
  currentPage.value = 1
  loadProducts()
}

const handleSortChange = () => {
  // Implementar lógica de ordenamiento
  loadProducts()
}

const changePage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    loadProducts()
  }
}

const clearFilters = () => {
  searchQuery.value = ''
  selectedCategory.value = ''
  sortBy.value = 'name'
  currentPage.value = 1
  loadProducts()
}

const addToCart = (product: any) => {
  cartStore.addToCart(product, 1)
  // Aquí podrías mostrar una notificación de éxito
}

// Lifecycle
onMounted(async () => {
  await Promise.all([
    loadProducts(),
    productsStore.fetchCategories()
  ])
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style> 