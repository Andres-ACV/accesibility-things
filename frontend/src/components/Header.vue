<template>
  <header class="header-bar">
    <nav class="header-nav">
      <!-- Logo a la izquierda -->
      <RouterLink to="/" class="header-logo">Accessibility Things</RouterLink>
      <!-- Todo lo demás a la derecha -->
      <div class="header-actions-group">
        <RouterLink to="/catalog" class="header-link">Ver todos los artículos</RouterLink>
        <div class="search-box">
          <input type="text" placeholder="Búsqueda rápida" class="search-input" />
          <button class="search-btn" aria-label="Buscar">
            <img src="@/assets/icons/search.svg" alt="Buscar" class="icon-svg" />
          </button>
        </div>
        <RouterLink to="/cart" class="header-icon" aria-label="Carrito">
          <img src="@/assets/icons/cart.svg" alt="Carrito" class="icon-svg" />
        </RouterLink>
        <RouterLink v-if="authStore.isAuthenticated" to="/profile" class="header-icon" aria-label="Perfil">
          <img src="@/assets/icons/user.svg" alt="Perfil" class="icon-svg" />
        </RouterLink>
        <RouterLink v-else to="/login" class="header-icon" aria-label="Iniciar sesión">
          <img src="@/assets/icons/user.svg" alt="Iniciar sesión" class="icon-svg" />
        </RouterLink>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
</script>

<style scoped>
.header-bar {
  position: sticky;
  top: 0;
  z-index: 50;
  background: #fff;
  border-bottom: 1.5px solid #e5e7eb;
  width: 100%;
  min-height: 62px;
  font-family: 'Inter', Arial, sans-serif;
  box-shadow: none;
  border-top: none;
  border-left: none;
  border-right: none;
}
.header-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0.5rem 2.5rem 0.5rem 2.5rem;
  min-height: 62px;
}
.header-logo {
  font-size: 1.55rem;
  font-weight: 700;
  color: #111;
  text-decoration: none;
  letter-spacing: -0.5px;
  margin-right: 2.5rem;
  font-family: 'Inter', Arial, sans-serif;
}
.header-actions-group {
  display: flex;
  align-items: center;
  gap: 1.2rem;
}
.header-link {
  font-size: 1rem;
  color: #222;
  text-decoration: none;
  font-weight: 500;
  margin: 0 1.5rem 0 0;
  transition: color 0.2s;
  font-family: 'Inter', Arial, sans-serif;
}
.header-link:hover {
  color: #435484;
}
.search-box {
  display: flex;
  align-items: center;
  border: 1.5px solid #d1d5db;
  border-radius: 7px;
  background: #fff;
  padding: 0 0.5rem;
  margin-right: 0.7rem;
  height: 2.3rem;
  min-width: 180px;
}
.search-input {
  border: none;
  outline: none;
  background: transparent;
  font-size: 1.04rem;
  color: #222;
  width: 9.5rem;
  padding: 0 0.3rem;
  font-family: 'Inter', Arial, sans-serif;
}
.search-input::placeholder {
  color: #b0b0b0;
  font-weight: 400;
  opacity: 1;
}
.search-btn {
  background: #435484;
  border: none;
  border-radius: 4px;
  padding: 0.22rem 0.55rem;
  margin-left: 0.2rem;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: background 0.2s;
  height: 1.7rem;
}
.search-btn:hover {
  background: #2d3954;
}
.icon-svg {
  width: 1.7rem;
  height: 1.7rem;
  display: block;
}
.header-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 0.2rem;
  color: #222;
  transition: color 0.2s;
  font-size: 1.38rem;
  width: 2.1rem;
  height: 2.1rem;
  border-radius: 50%;
  background: transparent;
}
.header-icon:hover {
  color: #435484;
  background: #f3f4f6;
}
@media (max-width: 900px) {
  .header-nav {
    flex-direction: column;
    gap: 0.7rem;
    padding: 0.7rem 1rem;
    min-height: unset;
  }
  .header-actions-group {
    margin-top: 0.5rem;
  }
}
</style>