/* ==========================================================================
   Accessibility Things - JavaScript Principal
   ========================================================================== */

// Esperar a que el DOM esté cargado
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOM cargado, esperando scripts...');
    
    // Esperar un momento para que todos los scripts se carguen
    setTimeout(() => {
        initializeApp();
        
        // Verificar y configurar formularios después de la inicialización
        setTimeout(() => {
            const loginForm = document.querySelector('#login-form form');
            console.log('📋 Formulario de login encontrado:', !!loginForm);
            
            // Configuración universal de formularios de autenticación
            setupUniversalAuthForms();
            
            // Forzar configuración de formularios si UIController está disponible
            if (typeof uiController !== 'undefined' && uiController.setupAuthForms) {
                console.log('🔧 Forzando configuración de formularios...');
                uiController.setupAuthForms();
            }
            
            if (loginForm) {
                console.log('🔗 Event listeners en formulario:', loginForm._listeners || 'No detectados');
            }
        }, 500);
    }, 100);
});

// Función principal de inicialización
function initializeApp() {
    console.log('🚀 Iniciando aplicación...');
    
    // Verificar si los managers están disponibles
    console.log('📊 DataManager disponible:', typeof dataManager !== 'undefined');
    console.log('🎮 UIController disponible:', typeof uiController !== 'undefined');
    
    // Inicializar componentes
    initializeCartCounter();
    initializeUserSession();
    initializeKeyboardNavigation();
    initializeFormValidation();
    initializeLoadingStates();
    initializeLogout();
    
    // Mensaje de confirmación en consola
    console.log('🎯 Aplicación inicializada correctamente');

    // === DEBUGGING GLOBAL ===
    // Exponer funciones de debugging para facilitar troubleshooting (si existen)
    if (typeof uiController !== 'undefined') {
        window.debugDB = () => uiController.debugDatabase();
        window.testLogin = (email, password) => uiController.testLogin(email, password);
        window.getUIController = () => uiController;
    }
    
    if (typeof dataManager !== 'undefined') {
        window.getDataManager = () => dataManager;
    }
    
    console.log('🔧 Funciones de debugging disponibles:');
    console.log('- debugDB() - Ver estado de la base de datos');
    console.log('- testLogin(email, password) - Probar login');
    console.log('- getDataManager() - Acceder al data manager');
    console.log('- getUIController() - Acceder al UI controller');
}

// Gestión del contador del carrito
function initializeCartCounter() {
    const cartCountElement = document.getElementById('cart-count');
    
    if (cartCountElement) {
        // Obtener cantidad del carrito desde localStorage
        const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
        const totalItems = cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0);
        
        cartCountElement.textContent = totalItems;
        cartCountElement.setAttribute('aria-label', `${totalItems} productos en el carrito`);
    }
}

// Gestión de sesión de usuario
function initializeUserSession() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    
    // Mostrar/ocultar secciones basadas en el estado de sesión
    const authSection = document.getElementById('auth-section');
    const profileSection = document.getElementById('profile-section');
    
    if (currentUser) {
        // Usuario logueado
        if (authSection) authSection.style.display = 'none';
        if (profileSection) {
            profileSection.style.display = 'block';
            updateUserInfo(currentUser);
        }
    } else {
        // Usuario no logueado
        if (authSection) authSection.style.display = 'block';
        if (profileSection) profileSection.style.display = 'none';
    }
}

// Actualizar información del usuario en la interfaz
function updateUserInfo(user) {
    const userNameElement = document.getElementById('user-name');
    const userTypeElement = document.getElementById('user-type');
    
    if (userNameElement) {
        // Obtener nombre y apellido desde datos_personales si existe, sino usar propiedades directas
        const nombre = user.datos_personales?.nombre || user.nombre || 'Usuario';
        const apellido = user.datos_personales?.apellidos || user.apellido || '';
        userNameElement.textContent = `${nombre} ${apellido}`.trim();
    }
    
    if (userTypeElement) {
        userTypeElement.textContent = user.tipo === 'vendedor' ? 'Vendedor' : 'Comprador';
    }
    
    // Mostrar/ocultar elementos específicos del vendedor
    if (user.tipo === 'vendedor') {
        document.body.classList.add('user-seller');
    } else {
        document.body.classList.remove('user-seller');
    }
}

// Navegación por teclado mejorada
function initializeKeyboardNavigation() {
    // Detectar navegación por teclado
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-user');
        }
    });
    
    // Detectar uso del mouse
    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-user');
    });
    
    // Manejar teclas especiales
    document.addEventListener('keydown', function(e) {
        // Escape para cerrar modales/formularios
        if (e.key === 'Escape') {
            closeOpenModals();
        }
        
        // Enter en elementos con rol button
        if (e.key === 'Enter' && e.target.getAttribute('role') === 'button') {
            e.target.click();
        }
    });
}

// Validación de formularios
function initializeFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            if (!validateForm(form)) {
                e.preventDefault();
            }
        });
        
        // Validación en tiempo real
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(input);
            });
        });
    });
}

// Validar formulario completo
function validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });
    
    return isValid;
}

// Validar campo individual
function validateField(input) {
    const value = input.value.trim();
    const isRequired = input.hasAttribute('required');
    const type = input.type;
    
    // Limpiar errores previos
    clearFieldError(input);
    
    // Validar campo requerido
    if (isRequired && !value) {
        showFieldError(input, 'Este campo es obligatorio');
        return false;
    }
    
    // Validar email
    if (type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showFieldError(input, 'Ingresa una dirección de email válida');
            return false;
        }
    }
    
    // Validar contraseña (solo aplicar validación fuerte en registro, no en login)
    if (type === 'password' && value) {
        // Solo aplicar validación de contraseña fuerte en formularios de registro
        const isRegistrationPassword = input.id.includes('register') || input.closest('form').id === 'register-form';
        
        if (isRegistrationPassword) {
            if (value.length < 8) {
                showFieldError(input, 'La contraseña debe tener al menos 8 caracteres');
                return false;
            }
            
            if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
                showFieldError(input, 'La contraseña debe contener al menos una mayúscula, una minúscula y un número');
                return false;
            }
        }
    }
    
    // Validar confirmación de contraseña
    if (input.name === 'password_confirm' && value) {
        const passwordInput = input.form.querySelector('input[name="password"]');
        if (passwordInput && value !== passwordInput.value) {
            showFieldError(input, 'Las contraseñas no coinciden');
            return false;
        }
    }
    
    return true;
}

// Mostrar error en campo
function showFieldError(input, message) {
    const errorId = `${input.id}-error`;
    const errorElement = document.getElementById(errorId);
    
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
    
    input.setAttribute('aria-invalid', 'true');
    const formGroup = input.closest('.form-group');
    if (formGroup) {
        formGroup.classList.add('has-error');
    }
}

// Limpiar error en campo
function clearFieldError(input) {
    const errorId = `${input.id}-error`;
    const errorElement = document.getElementById(errorId);
    
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    }
    
    input.setAttribute('aria-invalid', 'false');
    const formGroup = input.closest('.form-group');
    if (formGroup) {
        formGroup.classList.remove('has-error');
    }
}

// Configuración universal de formularios de autenticación
function setupUniversalAuthForms() {
    console.log('🌐 Configurando formularios universales...');
    
    // Buscar todos los formularios que contengan campos de email y password
    const allForms = document.querySelectorAll('form');
    
    allForms.forEach(form => {
        const emailField = form.querySelector('input[type="email"]');
        const passwordField = form.querySelector('input[type="password"]');
        
        // Si el formulario tiene email y password, configurarlo
        if (emailField && passwordField) {
            console.log('📋 Configurando formulario:', form.className || 'sin clase');
            
            // Agregar event listener si no lo tiene ya
            if (!form.hasAttribute('data-configured')) {
                form.setAttribute('data-configured', 'true');
                
                form.addEventListener('submit', function(e) {
                    console.log('🚀 Formulario interceptado!');
                    e.preventDefault();
                    
                    const email = emailField.value.trim();
                    const password = passwordField.value.trim();
                    
                    if (!email || !password) {
                        console.log('❌ Email o contraseña vacíos');
                        return;
                    }
                    
                    // Intentar login usando UIController si está disponible
                    if (typeof uiController !== 'undefined' && uiController.processLogin) {
                        console.log('🔐 Ejecutando login con UIController.processLogin...');
                        uiController.processLogin(form);
                    } else {
                        console.log('❌ UIController.processLogin no disponible');
                    }
                });
                
                console.log('✅ Formulario configurado con event listener');
            }
        }
    });
}

// Funcionalidad de cerrar sesión
function initializeLogout() {
    const logoutBtn = document.getElementById('logout-btn');
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            console.log('🚪 Cerrando sesión...');
            
            // Limpiar datos de sesión
            localStorage.removeItem('currentUser');
            localStorage.removeItem('userSession');
            
            // Anunciar a lectores de pantalla
            announceToScreenReader('Sesión cerrada correctamente');
            
            // Redirigir a página principal
            window.location.href = 'index.html';
        });
        console.log('🚪 Botón de logout configurado');
    }
}

// Estados de carga
function initializeLoadingStates() {
    // Mostrar indicador de carga en formularios
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function() {
            const submitButton = form.querySelector('button[type="submit"]');
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.classList.add('loading');
                
                // Simular carga (en una app real esto sería una llamada API)
                setTimeout(() => {
                    submitButton.disabled = false;
                    submitButton.classList.remove('loading');
                }, 2000);
            }
        });
    });
}

// Cerrar modales abiertos
function closeOpenModals() {
    const modals = document.querySelectorAll('.modal, .form-modal');
    modals.forEach(modal => {
        if (modal.style.display === 'block') {
            modal.style.display = 'none';
        }
    });
}

// Anuncios para lectores de pantalla
function announceToScreenReader(message, priority = 'polite') {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    // Limpiar después de un tiempo
    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
}

// Utilidades generales
const Utils = {
    // Formatear precio en colones
    formatPrice: function(price) {
        return new Intl.NumberFormat('es-CR', {
            style: 'currency',
            currency: 'CRC',
            minimumFractionDigits: 0
        }).format(price);
    },
    
    // Formatear fecha
    formatDate: function(date) {
        return new Intl.DateTimeFormat('es-CR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(date);
    },
    
    // Generar ID único
    generateId: function() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },
    
    // Debounce para búsquedas
    debounce: function(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
};

// Función de debug para testing manual
function debugLogin() {
    console.log('🔧 DEBUGGING LOGIN MANUAL...');
    console.log('📊 DataManager:', typeof dataManager !== 'undefined' ? 'OK' : 'FALTA');
    console.log('🎮 UIController:', typeof uiController !== 'undefined' ? 'OK' : 'FALTA');
    
    if (typeof uiController !== 'undefined') {
        const email = document.getElementById('login-email')?.value || 'vendedor@test.com';
        const password = document.getElementById('login-password')?.value || 'vendedor123';
        
        console.log('📧 Email:', email);
        console.log('🔒 Password:', password ? '***' : 'VACÍO');
        
        // Intentar login manual
        try {
            if (uiController.testLogin) {
                console.log('🚀 Ejecutando testLogin...');
                uiController.testLogin(email, password);
            } else {
                console.log('❌ testLogin no disponible');
            }
        } catch (error) {
            console.error('💥 Error en debug login:', error);
        }
    } else {
        console.log('❌ UIController no está disponible');
    }
}

// Exportar funciones globales
window.AccessibilityThings = {
    announceToScreenReader,
    Utils,
    initializeApp
};

// Exponer función de debug globalmente
window.debugLogin = debugLogin; 