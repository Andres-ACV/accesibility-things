<script setup lang="ts">
import { RouterView } from 'vue-router'
import Header from '@/components/Header.vue'
</script>

<template>
  <div class="flex flex-col min-h-screen bg-gray-100">
    <Header />
    <main class="w-full flex-grow flex flex-col">
      <RouterView />
    </main>
    <footer class="register-footer">
      <div class="footer-content">
        <div class="footer-left">
          <span class="footer-title">Cuenta</span>
          <span>Mi cuenta</span>
          <span>Registro</span>
          <span>Carrito</span>
          <span>Mis productos</span>
        </div>
        <div class="footer-center">
          <span class="footer-title">Soporte</span>
          <span><a href="mailto:contacto@accessibilitythings.com">contacto@accessibilitythings.com</a></span>
          <span>+506 8888 8888</span>
          <span>Políticas</span>
        </div>
        <div class="footer-right">
          <span class="footer-copyright">© Copyright 2025 Todos los derechos reservados</span>
          <div class="footer-socials">
            <span class="icon">f</span>
            <span class="icon">🐦</span>
            <span class="icon">📸</span>
            <span class="icon">in</span>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.register-footer {
  background: #111;
  color: #fff;
  padding: 0.7rem 0 0.5rem 0;
  width: 100vw;
  position: relative;
  bottom: 0;
  left: 0;
  font-size: 0.95rem;
  box-shadow: 0 -2px 8px rgba(0,0,0,0.04);
}
.footer-content {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}
.footer-left, .footer-center {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}
.footer-title {
  font-weight: bold;
  margin-bottom: 0.1rem;
}
.footer-socials {
  display: flex;
  gap: 0.7rem;
  margin-top: 0.3rem;
}
.icon {
  font-size: 1.2rem;
  background: #222;
  border-radius: 50%;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
.footer-copyright {
  margin-top: 0.2rem;
  font-size: 0.9rem;
  color: #bbb;
}
@media (max-width: 900px) {
  .footer-content {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
  .footer-right {
    align-items: flex-start;
  }
}
</style>
