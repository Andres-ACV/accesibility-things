<template>
  <div class="register-bg min-h-screen w-full flex flex-col justify-between">
    <div class="flex-center">
      <div class="register-container">
        <!-- Imagen a la izquierda en desktop -->
        <div class="register-img">
          <img class="img-side" src="/register-side.webp" alt="Cuidador asistiendo a una persona mayor en una cama con un arnés de elevación">
        </div>
        <!-- Formulario a la derecha -->
        <div class="register-form">
          <div class="text-center mb-6">
            <h2 class="text-3xl md:text-4xl font-bold text-main-blue" id="register-title">
              Crear una cuenta
            </h2>
            <p class="text-gray-600 mt-3" style="color: #111 !important;">
              Introduzca sus datos
            </p>
          </div>
          <form class="space-y-6" @submit.prevent="handleRegister" aria-labelledby="register-title" role="form">
            <div>
              <label for="full_name" class="block text-sm font-semibold text-gray-600">Nombre completo</label>
              <input
                id="full_name"
                v-model="form.full_name"
                name="full_name"
                type="text"
                required
                autocomplete="name"
                :class="['input-field', touched.full_name && isEmpty(form.full_name) ? 'input-error' : '']"
                placeholder="Nombre completo"
                aria-required="true"
                @blur="touched.full_name = true"
              />
              <div v-if="touched.full_name && isEmpty(form.full_name)" class="text-red-500 text-xs mt-1">Campo obligatorio</div>
            </div>
            <div>
              <label for="email" class="block text-sm font-semibold text-gray-600">Correo electrónico</label>
              <input
                id="email"
                v-model="form.email"
                name="email"
                type="email"
                required
                autocomplete="email"
                :class="['input-field', (touched.email && isEmpty(form.email)) || emailAlreadyRegistered ? 'input-error' : '']"
                placeholder="Correo electrónico"
                aria-required="true"
                @blur="touched.email = true"
              />
              <div v-if="touched.email && isEmpty(form.email)" class="text-red-500 text-xs mt-1">Campo obligatorio</div>
            </div>
            <div v-if="error || emailAlreadyRegistered" class="text-red-500 text-sm text-center pt-2" role="alert">
              <span v-if="error">{{ error }}</span>
              <span v-else-if="emailAlreadyRegistered">Correo ya registrado</span>
            </div>
            <div>
              <label for="address" class="block text-sm font-semibold text-gray-600">Dirección</label>
              <input
                id="address"
                v-model="form.address"
                name="address"
                type="text"
                autocomplete="street-address"
                :class="['input-field', touched.address && isEmpty(form.address) ? 'input-error' : '']"
                placeholder="Dirección"
                @blur="touched.address = true"
              />
              <div v-if="touched.address && isEmpty(form.address)" class="text-red-500 text-xs mt-1">Campo obligatorio</div>
            </div>
            <div>
              <label for="city" class="block text-sm font-semibold text-gray-600">Ciudad</label>
              <input
                id="city"
                v-model="form.city"
                name="city"
                type="text"
                autocomplete="address-level2"
                :class="['input-field', touched.city && isEmpty(form.city) ? 'input-error' : '']"
                placeholder="Ciudad"
                @blur="touched.city = true"
              />
              <div v-if="touched.city && isEmpty(form.city)" class="text-red-500 text-xs mt-1">Campo obligatorio</div>
            </div>
            <div>
              <label for="password" class="block text-sm font-semibold text-gray-600">Contraseña</label>
              <input
                id="password"
                v-model="form.password"
                name="password"
                type="password"
                required
                autocomplete="new-password"
                :class="['input-field', (touched.password && isEmpty(form.password)) || (form.password.length > 0 && form.password.length < 8) ? 'input-error' : '']"
                placeholder="Mínimo 8 caracteres"
                aria-required="true"
                @blur="touched.password = true"
              />
              <div v-if="touched.password && isEmpty(form.password)" class="text-red-500 text-xs mt-1">Campo obligatorio</div>
              <div v-else-if="form.password.length > 0 && form.password.length < 8" class="text-red-500 text-xs mt-1">Mínimo 8 caracteres</div>
            </div>
            <div>
              <label for="role_id" class="block text-sm font-semibold text-gray-600">Rol</label>
              <select
                id="role_id"
                v-model="form.role_id"
                name="role_id"
                required
                class="input-field"
                @blur="touched.role_id = true"
              >
                <option value="" disabled>Seleccione un rol</option>
                <option v-for="role in roles" :key="role.id" :value="role.id">
                  {{ role.name.charAt(0).toUpperCase() + role.name.slice(1) }}
                </option>
              </select>
            </div>
            <button type="submit" :disabled="isLoading" class="register-btn">
              {{ isLoading ? 'Creando cuenta...' : 'Crear cuenta' }}
            </button>
          </form>
          <div class="mt-8 text-center">
            <router-link to="/login" class="font-medium text-main-blue hover:text-slate-900">
              ¿Ya tiene cuenta? <span class="font-semibold underline">Iniciar sesión</span>
            </router-link>
          </div>
        </div>
      </div>
    </div>
    <footer class="register-footer">
      <!-- ...footer igual... -->
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import RoleService, { type Role } from '@/services/roleService'

const router = useRouter()
const authStore = useAuthStore()

const form = reactive({
  full_name: '',
  email: '',
  address: '',
  city: '',
  password: '',
  role_id: ''
})

const error = ref('')
const isLoading = ref(false)
const roles = ref<Role[]>([])
const emailAlreadyRegistered = ref(false)
const touched = reactive({
  full_name: false,
  email: false,
  address: false,
  city: false,
  password: false
})

onMounted(async () => {
  try {
    const allRoles = await RoleService.getAvailableRoles()
    roles.value = allRoles.filter(r => r.name.toLowerCase() === 'vendedor' || r.name.toLowerCase() === 'comprador')
    // Selecciona 'vendedor' por defecto
    const vendedor = roles.value.find(r => r.name.toLowerCase() === 'vendedor')
    if (vendedor) form.role_id = vendedor.id.toString()
  } catch (err) {
    console.error("Error loading roles:", err)
    error.value = 'No se pudieron cargar los roles.'
  }
})

const isEmpty = (val: string) => !val || val.trim() === ''

// Elimina el error visual de contraseña si ya tiene 8 o más caracteres
watch(() => form.password, (val) => {
  if (val.length >= 8 && error.value === 'La contraseña debe tener al menos 8 caracteres.') {
    error.value = ''
  }
})

watch(() => form.email, () => {
  emailAlreadyRegistered.value = false
})

const handleRegister = async () => {
  touched.full_name = true
  touched.email = true
  touched.address = true
  touched.city = true
  touched.password = true

  if (
    isEmpty(form.full_name) ||
    isEmpty(form.email) ||
    isEmpty(form.address) ||
    isEmpty(form.city) ||
    isEmpty(form.password)
  ) {
    error.value = 'Por favor complete todos los campos obligatorios.'
    return
  }
  if (form.password.length < 8) {
    error.value = 'La contraseña debe tener al menos 8 caracteres.'
    return
  }
  try {
    isLoading.value = true
    error.value = ''
    emailAlreadyRegistered.value = false
    await authStore.register({
      ...form,
      role_id: Number(form.role_id)
    })
    router.push('/login')
  } catch (err: any) {
    if (err.response?.data?.detail === "Email already registered") {
      emailAlreadyRegistered.value = true
      error.value = ''
    } else {
      error.value = err.response?.data?.detail || 'Error al crear la cuenta. Verifique sus datos.'
      emailAlreadyRegistered.value = false
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.register-bg {
  background: #f8f9fa;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
.text-main-blue {
  color: #435484;
}
.input-field {
  margin-top: 0.5rem;
  display: block;
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  background-color: #f7fafc;
  color: #2d3748;
  font-size: 1rem;
  transition: border-color 0.3s, box-shadow 0.3s;
}
.input-field::placeholder {
  color: #a0aec0;
  opacity: 1;
}
.input-field:focus {
  outline: none;
  border-color: #435484;
  box-shadow: 0 0 0 2px rgba(67, 84, 132, 0.2);
}
.input-field.input-error {
  border-color: #ef4444 !important;
  background-color: #fff1f2;
}
.register-btn {
  width: 100%;
  padding: 1rem 0;
  border-radius: 0.5rem;
  background: #435484;
  color: #fff;
  font-weight: 600;
  font-size: 1.1rem;
  border: none;
  transition: background 0.2s;
  margin-top: 0.5rem;
  box-shadow: 0 2px 8px rgba(67, 84, 132, 0.08);
}
.register-btn:hover, .register-btn:focus {
  background: #2d3954;
}
.register-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 500px;
  background: #fff;
  box-shadow: 0 2px 16px rgba(0,0,0,0.07);
  border-radius: 16px;
  overflow: hidden;
  height: 100%;
  max-width: 100vw;
}
@media (min-width: 768px) {
  .register-container {
    flex-direction: row;
    height: 80vh;
    min-height: 600px;
    min-width: 900px;
  }
}
.register-img {
  display: none;
}
@media (min-width: 768px) {
  .register-img {
    display: block;
    width: 50%;
    height: 100%;
  }
}
.img-side {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  display: block;
}
.register-form {
  width: 100%;
  background: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 2.5rem 2rem;
  height: 100%;
}
@media (min-width: 768px) {
  .register-form {
    width: 50%;
    min-width: 340px;
    padding: 2.5rem 2.5rem;
    height: 100%;
  }
}
label.block.text-sm.font-semibold {
  color: #111 !important;
}
.text-red-500 {
  color: #ef4444 !important;
}
</style> 