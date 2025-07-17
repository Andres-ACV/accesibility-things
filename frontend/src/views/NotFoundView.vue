<template>
  <div class="not-found">
    <div class="container mx-auto px-4 py-16">
      <div class="text-center">
        <!-- 404 Icon -->
        <div class="mb-8">
          <svg 
            class="mx-auto h-32 w-32 text-gray-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              stroke-linecap="round" 
              stroke-linejoin="round" 
              stroke-width="1" 
              d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </div>

        <!-- 404 Text -->
        <h1 class="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 class="text-2xl font-semibold text-gray-700 mb-4">Página no encontrada</h2>
        
        <!-- Description -->
        <p class="text-gray-600 mb-8 max-w-md mx-auto">
          Lo sentimos, la página que buscas no existe o ha sido movida. 
          Puedes volver al inicio o explorar nuestros productos.
        </p>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            @click="$router.push('/')"
            class="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Ir al inicio
          </button>
          
          <button 
            @click="$router.push('/catalog')"
            class="bg-gray-100 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
          >
            Ver catálogo
          </button>
        </div>

        <!-- Search Suggestion -->
        <div class="mt-12 p-6 bg-gray-50 rounded-lg max-w-md mx-auto">
          <h3 class="text-lg font-semibold text-gray-800 mb-3">¿Buscas algo específico?</h3>
          <p class="text-gray-600 mb-4">
            Puedes usar nuestro buscador para encontrar productos de accesibilidad.
          </p>
          <button 
            @click="$router.push('/catalog')"
            class="text-blue-600 hover:text-blue-800 font-medium underline"
          >
            Explorar productos →
          </button>
        </div>

        <!-- Help Links -->
        <div class="mt-8 text-sm text-gray-500">
          <p class="mb-2">¿Necesitas ayuda? Contacta con nuestro soporte:</p>
          <div class="flex justify-center gap-4">
            <a href="mailto:soporte@accesibility-things.com" class="text-blue-600 hover:text-blue-800">
              Email
            </a>
            <span>•</span>
            <a href="tel:+1234567890" class="text-blue-600 hover:text-blue-800">
              Teléfono
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<style scoped>
.not-found {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  display: flex;
  align-items: center;
}

/* Animation for the 404 text */
h1 {
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

/* Hover effects for buttons */
button {
  transition: all 0.3s ease;
}

button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Responsive adjustments */
@media (max-width: 640px) {
  h1 {
    font-size: 4rem;
  }
  
  h2 {
    font-size: 1.5rem;
  }
}
</style> 