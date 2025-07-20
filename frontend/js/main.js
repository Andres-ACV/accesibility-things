/* ==========================================================================
   Accessibility Things - Script Principal
   Inicialización y configuración global de la aplicación
   localStorage se usa exclusivamente para carrito y sesión de usuario
   ========================================================================== */

// Variables globales
let dataManager;
let uiController;

// Inicializar aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Iniciando Accessibility Things...');
    initializeApp();
});

// Función principal de inicialización
function initializeApp() {
    try {
        // Inicializar gestores de datos
        initializeDataManagers();
        
        // Inicializar controles de accesibilidad
        if (typeof initializeAccessibilityControls === 'function') {
            initializeAccessibilityControls();
        }
        
        // Inicializar contador del carrito
        initializeCartCounter();
        
        // Inicializar sesión de usuario
        initializeUserSession();
        
        // Inicializar navegación por teclado
        initializeKeyboardNavigation();
        
        // Inicializar validación de formularios
        initializeFormValidation();
        
        // Inicializar formularios de autenticación universales
        setupUniversalAuthForms();
        
        // Inicializar logout
        initializeLogout();
        
        // Inicializar estados de carga
        initializeLoadingStates();
        
        // Al final de initializeApp, agregar la inicialización de categorías dinámicas solo si estamos en la homepage
        // Inicializar categorías dinámicas en la homepage
        if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname === '/frontend/' || window.location.pathname === '/frontend/index.html') {
            initializeDynamicCategories();
        }
        
        console.log('✅ Aplicación inicializada correctamente');
        
    } catch (error) {
        console.error('❌ Error inicializando aplicación:', error);
        showErrorMessage('Error al inicializar la aplicación. Por favor, recarga la página.');
    }
}

// Inicializar gestores de datos
function initializeDataManagers() {
    try {
        // Intentar usar DataManagerOptimized si está disponible
        if (typeof DataManagerOptimized !== 'undefined') {
            dataManager = new DataManagerOptimized();
            console.log('📊 Usando DataManagerOptimized');
        } else if (typeof DataManager !== 'undefined') {
            dataManager = new DataManager();
            console.log('📊 Usando DataManager');
        } else {
            throw new Error('No se encontró ningún gestor de datos disponible');
        }
        
        // Inicializar UI Controller
        if (typeof UIController !== 'undefined') {
            uiController = new UIController();
            uiController.init();
            console.log('🎨 UIController inicializado');
        }
        
    } catch (error) {
        console.error('❌ Error inicializando gestores de datos:', error);
        throw error;
    }
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
        // Obtener nombre completo
        const fullName = user.full_name || user.nombre || 'Usuario';
        userNameElement.textContent = fullName;
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
    
    // Validar contraseña
    if (type === 'password' && value) {
        // Solo aplicar validación de contraseña fuerte en formularios de registro
        const isRegistrationPassword = input.id.includes('register') || input.closest('form').id === 'register-form';
        
        if (isRegistrationPassword) {
            if (value.length < 6) {
                showFieldError(input, 'La contraseña debe tener al menos 6 caracteres');
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
    
    input.removeAttribute('aria-invalid');
    const formGroup = input.closest('.form-group');
    if (formGroup) {
        formGroup.classList.remove('has-error');
    }
}

// Configurar formularios de autenticación universales
function setupUniversalAuthForms() {
    // Login form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(loginForm);
            const email = formData.get('email');
            const password = formData.get('password');
            const rememberMe = formData.get('remember_me') === 'on';
            
            try {
                if (dataManager && typeof dataManager.loginUser === 'function') {
                    const result = await dataManager.loginUser(email, password, rememberMe);
                    
                    if (result.success) {
                        showSuccessMessage('Inicio de sesión exitoso');
                        setTimeout(() => {
                            window.location.reload();
                        }, 1000);
                    } else {
                        showErrorMessage(result.message);
                    }
                } else {
                    showErrorMessage('Sistema de autenticación no disponible');
                }
            } catch (error) {
                console.error('Error en login:', error);
                showErrorMessage('Error al iniciar sesión. Intenta nuevamente.');
            }
        });
    }
    
    // Register form
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(registerForm);
            const userData = {
                email: formData.get('email'),
                password: formData.get('password'),
                full_name: formData.get('full_name'),
                address: formData.get('address') || '',
                city: formData.get('city') || '',
                tipo: formData.get('user_type') || 'comprador'
            };
            
            try {
                if (dataManager && typeof dataManager.registerUser === 'function') {
                    const result = await dataManager.registerUser(userData);
                    
                    if (result.success) {
                        showSuccessMessage('Cuenta creada exitosamente');
                        setTimeout(() => {
                            window.location.reload();
                        }, 1000);
                    } else {
                        showErrorMessage(result.message);
                    }
                } else {
                    showErrorMessage('Sistema de registro no disponible');
                }
            } catch (error) {
                console.error('Error en registro:', error);
                showErrorMessage('Error al crear la cuenta. Intenta nuevamente.');
            }
        });
    }
}

// Inicializar logout
function initializeLogout() {
    const logoutButtons = document.querySelectorAll('.logout-btn, [data-action="logout"]');
    
    logoutButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            try {
                // Limpiar datos de sesión
                localStorage.removeItem('currentUser');
                localStorage.removeItem('userSession');
                
                // Limpiar carrito si es necesario
                if (dataManager && typeof dataManager.clearCart === 'function') {
                    dataManager.clearCart();
                }
                
                showSuccessMessage('Sesión cerrada exitosamente');
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
                
            } catch (error) {
                console.error('Error en logout:', error);
                showErrorMessage('Error al cerrar sesión');
            }
        });
    });
}

// Inicializar estados de carga
function initializeLoadingStates() {
    // Mostrar indicador de carga en formularios
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function() {
            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<span class="loading-spinner"></span> Procesando...';
            }
        });
    });
}

// Cerrar modales abiertos
function closeOpenModals() {
    const modals = document.querySelectorAll('.modal, .popup, [role="dialog"]');
    modals.forEach(modal => {
        if (modal.style.display === 'block') {
            modal.style.display = 'none';
        }
    });
}

// Anunciar mensajes al lector de pantalla
function announceToScreenReader(message, priority = 'polite') {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    // Remover después de un tiempo
    setTimeout(() => {
        if (announcement.parentNode) {
            announcement.parentNode.removeChild(announcement);
        }
    }, 1000);
}

// Función debounce para optimizar eventos
function debounce(func, wait) {
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

// Mostrar mensaje de éxito
function showSuccessMessage(message) {
    const notification = document.createElement('div');
    notification.className = 'notification notification-success';
    notification.innerHTML = `
        <strong>Éxito</strong>
        <p>${message}</p>
    `;
    
    document.body.insertBefore(notification, document.body.firstChild);
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 5000);
}

// Mostrar mensaje de error
function showErrorMessage(message) {
    const notification = document.createElement('div');
    notification.className = 'notification notification-error';
    notification.innerHTML = `
        <strong>Error</strong>
        <p>${message}</p>
    `;
    
    document.body.insertBefore(notification, document.body.firstChild);
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 10000);
}

// Función de debug para login (solo en desarrollo)
function debugLogin() {
    console.log('🔍 Debug: Estado actual de la aplicación');
    console.log('DataManager:', dataManager);
    console.log('UIController:', uiController);
    console.log('localStorage cart:', localStorage.getItem('cart'));
    console.log('localStorage currentUser:', localStorage.getItem('currentUser'));
} 

/**
 * Cargar y renderizar dinámicamente las categorías principales desde el backend
 */
async function initializeDynamicCategories() {
    const categoriesGrid = document.querySelector('.categories-grid');
    if (!categoriesGrid) return;

    // Estado de carga
    categoriesGrid.innerHTML = '<p id="categories-loading">Cargando categorías...</p>';

    try {
        const categories = await apiService.getCategories();
        if (!Array.isArray(categories) || categories.length === 0) {
            categoriesGrid.innerHTML = '<p id="categories-empty">No hay categorías disponibles.</p>';
            return;
        }
        // Renderizar categorías
        categoriesGrid.innerHTML = '';
        categories.forEach(cat => {
            // Construir href amigable (puedes ajustar la convención de URL aquí)
            const href = `catalogo.html?categoria=${encodeURIComponent(cat.id)}`;
            // Crear elemento
            const a = document.createElement('a');
            a.className = 'category-card';
            a.href = href;
            a.setAttribute('aria-describedby', `cat-desc-${cat.id}`);
            // Icono opcional (puedes mapear por nombre si lo deseas)
            let icon = '📦';
            if (cat.name.toLowerCase().includes('movilidad')) icon = '🦽';
            else if (cat.name.toLowerCase().includes('visual')) icon = '👁️';
            else if (cat.name.toLowerCase().includes('auditiva')) icon = '👂';
            else if (cat.name.toLowerCase().includes('embarazo')) icon = '🤱';
            // Estructura interna
            a.innerHTML = `
                <h3><span aria-hidden="true">${icon}</span> ${cat.name}</h3>
                <p id="cat-desc-${cat.id}">${cat.description || ''}</p>
            `;
            categoriesGrid.appendChild(a);
        });
    } catch (error) {
        categoriesGrid.innerHTML = `<p id="categories-error">Error al cargar categorías.</p>`;
        console.error('Error cargando categorías:', error);
    }
} 