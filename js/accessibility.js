/* ==========================================================================
   Accessibility Things - JavaScript de Accesibilidad
   ========================================================================== */

// Esperar a que el DOM esté cargado
document.addEventListener('DOMContentLoaded', function() {
    initializeAccessibilityControls();
});

// Inicializar controles de accesibilidad
function initializeAccessibilityControls() {
    initializeHighContrast();
    initializeFontSize();
    initializeKeyboardShortcuts();
    loadAccessibilityPreferences();
    
    console.log('Accessibility Things: Controles de accesibilidad inicializados');
}

// Control de alto contraste
function initializeHighContrast() {
    const highContrastToggle = document.getElementById('high-contrast-toggle');
    
    if (highContrastToggle) {
        highContrastToggle.addEventListener('click', function() {
            toggleHighContrast();
        });
        
        // Manejar tecla Enter para accesibilidad
        highContrastToggle.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleHighContrast();
            }
        });
    }
}

// Alternar modo de alto contraste
function toggleHighContrast() {
    const body = document.body;
    const toggle = document.getElementById('high-contrast-toggle');
    
    if (body.classList.contains('high-contrast')) {
        // Desactivar alto contraste
        body.classList.remove('high-contrast');
        toggle.setAttribute('aria-pressed', 'false');
        toggle.querySelector('.sr-only').textContent = 'Activar';
        
        // Guardar preferencia
        localStorage.setItem('high-contrast', 'false');
        
        // Anunciar cambio
        announceToScreenReader('Modo de alto contraste desactivado');
    } else {
        // Activar alto contraste
        body.classList.add('high-contrast');
        toggle.setAttribute('aria-pressed', 'true');
        toggle.querySelector('.sr-only').textContent = 'Desactivar';
        
        // Guardar preferencia
        localStorage.setItem('high-contrast', 'true');
        
        // Anunciar cambio
        announceToScreenReader('Modo de alto contraste activado');
    }
}

// Control de tamaño de fuente
function initializeFontSize() {
    const fontSizeToggle = document.getElementById('font-size-toggle');
    
    if (fontSizeToggle) {
        fontSizeToggle.addEventListener('click', function() {
            toggleFontSize();
        });
        
        // Manejar tecla Enter para accesibilidad
        fontSizeToggle.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleFontSize();
            }
        });
    }
}

// Alternar tamaño de fuente
function toggleFontSize() {
    const body = document.body;
    const toggle = document.getElementById('font-size-toggle');
    
    if (body.classList.contains('large-font')) {
        // Desactivar fuente grande
        body.classList.remove('large-font');
        toggle.setAttribute('aria-pressed', 'false');
        toggle.querySelector('.sr-only').textContent = 'Aumentar';
        
        // Guardar preferencia
        localStorage.setItem('large-font', 'false');
        
        // Anunciar cambio
        announceToScreenReader('Tamaño de fuente normal');
    } else {
        // Activar fuente grande
        body.classList.add('large-font');
        toggle.setAttribute('aria-pressed', 'true');
        toggle.querySelector('.sr-only').textContent = 'Reducir';
        
        // Guardar preferencia
        localStorage.setItem('large-font', 'true');
        
        // Anunciar cambio
        announceToScreenReader('Tamaño de fuente aumentado');
    }
}

// Atajos de teclado para accesibilidad
function initializeKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        // Ctrl + Alt + H para alto contraste
        if (e.ctrlKey && e.altKey && e.key === 'h') {
            e.preventDefault();
            toggleHighContrast();
        }
        
        // Ctrl + Alt + F para tamaño de fuente
        if (e.ctrlKey && e.altKey && e.key === 'f') {
            e.preventDefault();
            toggleFontSize();
        }
        
        // Ctrl + Alt + S para saltar al contenido principal
        if (e.ctrlKey && e.altKey && e.key === 's') {
            e.preventDefault();
            const mainContent = document.getElementById('main-content');
            if (mainContent) {
                mainContent.focus();
                mainContent.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
}

// Cargar preferencias de accesibilidad guardadas
function loadAccessibilityPreferences() {
    // Cargar preferencia de alto contraste
    const highContrastPreference = localStorage.getItem('high-contrast');
    if (highContrastPreference === 'true') {
        document.body.classList.add('high-contrast');
        const toggle = document.getElementById('high-contrast-toggle');
        if (toggle) {
            toggle.setAttribute('aria-pressed', 'true');
            toggle.querySelector('.sr-only').textContent = 'Desactivar';
        }
    }
    
    // Cargar preferencia de tamaño de fuente
    const fontSizePreference = localStorage.getItem('large-font');
    if (fontSizePreference === 'true') {
        document.body.classList.add('large-font');
        const toggle = document.getElementById('font-size-toggle');
        if (toggle) {
            toggle.setAttribute('aria-pressed', 'true');
            toggle.querySelector('.sr-only').textContent = 'Reducir';
        }
    }
    
    // Detectar preferencias del sistema
    detectSystemPreferences();
}

// Detectar preferencias del sistema
function detectSystemPreferences() {
    // Detectar preferencia de movimiento reducido
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.body.classList.add('reduced-motion');
        console.log('Movimiento reducido detectado');
    }
    
    // Detectar preferencia de alto contraste del sistema
    if (window.matchMedia && window.matchMedia('(prefers-contrast: high)').matches) {
        // Solo aplicar si el usuario no ha establecido una preferencia manual
        if (!localStorage.getItem('high-contrast')) {
            document.body.classList.add('high-contrast');
            const toggle = document.getElementById('high-contrast-toggle');
            if (toggle) {
                toggle.setAttribute('aria-pressed', 'true');
                toggle.querySelector('.sr-only').textContent = 'Desactivar';
            }
            console.log('Alto contraste del sistema detectado');
        }
    }
    
    // Escuchar cambios en las preferencias del sistema
    if (window.matchMedia) {
        const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        motionQuery.addListener(function(e) {
            if (e.matches) {
                document.body.classList.add('reduced-motion');
            } else {
                document.body.classList.remove('reduced-motion');
            }
        });
        
        const contrastQuery = window.matchMedia('(prefers-contrast: high)');
        contrastQuery.addListener(function(e) {
            // Solo aplicar si el usuario no ha establecido una preferencia manual
            if (!localStorage.getItem('high-contrast')) {
                if (e.matches) {
                    document.body.classList.add('high-contrast');
                } else {
                    document.body.classList.remove('high-contrast');
                }
            }
        });
    }
}

// Funciones de anuncio para lectores de pantalla
function announceToScreenReader(message, priority = 'polite') {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    // Limpiar después de un tiempo
    setTimeout(() => {
        if (document.body.contains(announcement)) {
            document.body.removeChild(announcement);
        }
    }, 1000);
}

// Mejorar foco para navegación por teclado
function enhanceKeyboardNavigation() {
    // Agregar indicadores visuales mejorados para el foco
    const focusableElements = document.querySelectorAll(
        'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    focusableElements.forEach(element => {
        element.addEventListener('focus', function() {
            this.classList.add('keyboard-focus');
        });
        
        element.addEventListener('blur', function() {
            this.classList.remove('keyboard-focus');
        });
    });
}

// Gestión de roles ARIA dinámicos
function manageAriaRoles() {
    // Actualizar contadores y estados dinámicos
    const updateAriaLabels = () => {
        // Actualizar contador del carrito
        const cartCount = document.getElementById('cart-count');
        if (cartCount) {
            const count = parseInt(cartCount.textContent) || 0;
            cartCount.setAttribute('aria-label', `${count} productos en el carrito`);
        }
        
        // Actualizar estados de formulario
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            const invalidFields = form.querySelectorAll('[aria-invalid="true"]');
            if (invalidFields.length > 0) {
                form.setAttribute('aria-invalid', 'true');
            } else {
                form.setAttribute('aria-invalid', 'false');
            }
        });
    };
    
    // Ejecutar inicialmente y observar cambios
    updateAriaLabels();
    
    // Observar cambios en el DOM
    const observer = new MutationObserver(updateAriaLabels);
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true
    });
}

// Gestión de regiones landmarks dinámicas
function manageLandmarks() {
    // Asegurar que las regiones principales tengan nombres accesibles
    const landmarks = {
        banner: document.querySelector('[role="banner"], header'),
        navigation: document.querySelector('[role="navigation"], nav'),
        main: document.querySelector('[role="main"], main'),
        complementary: document.querySelector('[role="complementary"], aside'),
        contentinfo: document.querySelector('[role="contentinfo"], footer')
    };
    
    Object.entries(landmarks).forEach(([role, element]) => {
        if (element && !element.getAttribute('aria-label') && !element.getAttribute('aria-labelledby')) {
            // Agregar etiquetas predeterminadas para regiones sin nombres
            const labels = {
                banner: 'Encabezado de página',
                navigation: 'Navegación principal',
                main: 'Contenido principal',
                complementary: 'Información complementaria',
                contentinfo: 'Pie de página'
            };
            
            element.setAttribute('aria-label', labels[role]);
        }
    });
}

// Validar accesibilidad automáticamente
function validateAccessibility() {
    const issues = [];
    
    // Verificar imágenes sin alt text
    const images = document.querySelectorAll('img:not([alt])');
    if (images.length > 0) {
        issues.push(`${images.length} imágenes sin texto alternativo`);
    }
    
    // Verificar botones sin etiquetas
    const buttons = document.querySelectorAll('button:not([aria-label]):not([aria-labelledby])');
    buttons.forEach(button => {
        if (!button.textContent.trim()) {
            issues.push('Botón sin etiqueta encontrado');
        }
    });
    
    // Verificar formularios sin etiquetas
    const inputs = document.querySelectorAll('input:not([aria-label]):not([aria-labelledby])');
    inputs.forEach(input => {
        const label = document.querySelector(`label[for="${input.id}"]`);
        if (!label && input.type !== 'hidden') {
            issues.push(`Campo de formulario sin etiqueta: ${input.name || input.id}`);
        }
    });
    
    // Verificar jerarquía de encabezados
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    let previousLevel = 0;
    headings.forEach(heading => {
        const level = parseInt(heading.tagName.charAt(1));
        if (level > previousLevel + 1) {
            issues.push(`Salto en jerarquía de encabezados: ${heading.tagName}`);
        }
        previousLevel = level;
    });
    
    // Mostrar advertencias en consola si hay problemas
    if (issues.length > 0) {
        console.warn('Problemas de accesibilidad detectados:', issues);
    } else {
        console.log('Validación de accesibilidad pasada ✓');
    }
    
    return issues;
}

// Inicializar funciones adicionales cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    enhanceKeyboardNavigation();
    manageAriaRoles();
    manageLandmarks();
    
    // Validar accesibilidad en desarrollo
    if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
        setTimeout(validateAccessibility, 1000);
    }
});

// Exportar funciones para uso externo
window.AccessibilityControls = {
    toggleHighContrast,
    toggleFontSize,
    announceToScreenReader,
    validateAccessibility
}; 

// =====================================================
// EFECTOS VISUALES Y ANIMACIONES MODERNAS
// =====================================================

/**
 * Inicializar efectos visuales modernos
 */
function initModernEffects() {
    // Animaciones de entrada en viewport
    initScrollAnimations();
    
    // Efectos de carga suaves
    initLoadingEffects();
    
    // Micro-interacciones
    initMicroInteractions();
    
    // Efectos de formularios mejorados
    initFormEffects();
    
    console.log('Efectos visuales modernos inicializados ✨');
}

/**
 * Animaciones al hacer scroll (Intersection Observer)
 */
function initScrollAnimations() {
    // Verificar soporte del navegador
    if (!('IntersectionObserver' in window)) {
        console.log('IntersectionObserver no soportado');
        return;
    }
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-viewport');
                // Anunciar contenido cargado para lectores de pantalla
                if (entry.target.hasAttribute('data-announce')) {
                    announceToScreenReader(entry.target.getAttribute('data-announce'));
                }
            }
        });
    }, observerOptions);
    
    // Observar elementos con animación
    const animatedElements = document.querySelectorAll(
        '.product-card, .category-card, .feature-card, .animate-on-scroll'
    );
    
    animatedElements.forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });
}

/**
 * Efectos de carga suaves
 */
function initLoadingEffects() {
    // Añadir clase fade-in a elementos principales
    const mainElements = document.querySelectorAll('main, .main-content, .hero-section');
    mainElements.forEach(el => {
        el.classList.add('fade-in');
    });
    
    // Efecto de carga escalonada para tarjetas
    const cards = document.querySelectorAll('.product-card, .category-card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        card.classList.add('slide-up');
    });
}

/**
 * Micro-interacciones y efectos hover mejorados
 */
function initMicroInteractions() {
    // Efecto ripple en botones
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', createRippleEffect);
    });
    
    // Efectos de carrito animados
    initCartEffects();
    
    // Efectos de navegación mejorados
    initNavigationEffects();
}

/**
 * Crear efecto ripple en botones
 */
function createRippleEffect(event) {
    const button = event.currentTarget;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s ease-out;
        pointer-events: none;
        z-index: 1;
    `;
    
    // Asegurar posición relativa del botón
    if (getComputedStyle(button).position === 'static') {
        button.style.position = 'relative';
    }
    
    button.appendChild(ripple);
    
    // Remover el elemento después de la animación
    setTimeout(() => {
        if (ripple.parentNode) {
            ripple.parentNode.removeChild(ripple);
        }
    }, 600);
}

/**
 * Efectos de carrito mejorados
 */
function initCartEffects() {
    // Animación al actualizar contador del carrito
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        const originalUpdateCounter = window.updateCartCounter;
        if (originalUpdateCounter) {
            window.updateCartCounter = function() {
                originalUpdateCounter();
                // Añadir efecto de pulso al actualizar
                cartCount.style.animation = 'none';
                setTimeout(() => {
                    cartCount.style.animation = 'pulse 0.5s ease-in-out';
                }, 10);
            };
        }
    }
}

/**
 * Efectos de navegación mejorados
 */
function initNavigationEffects() {
    const navLinks = document.querySelectorAll('.main-nav a');
    
    navLinks.forEach(link => {
        // Efecto de onda en hover
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-1px)';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
        
        // Efecto de focus mejorado para teclado
        link.addEventListener('focus', function() {
            announceToScreenReader(`Navegando a ${this.textContent}`);
        });
    });
}

/**
 * Efectos de formularios mejorados
 */
function initFormEffects() {
    const formControls = document.querySelectorAll('.form-control, input, textarea, select');
    
    formControls.forEach(control => {
        // Efectos de focus
        control.addEventListener('focus', function() {
            this.parentElement?.classList.add('form-group-focused');
        });
        
        control.addEventListener('blur', function() {
            this.parentElement?.classList.remove('form-group-focused');
        });
        
        // Validación visual en tiempo real
        control.addEventListener('input', function() {
            if (this.checkValidity()) {
                this.classList.add('valid');
                this.classList.remove('invalid');
            } else if (this.value.length > 0) {
                this.classList.add('invalid');
                this.classList.remove('valid');
            }
        });
    });
}

/**
 * Efectos de notificaciones mejorados
 */
function enhanceNotifications() {
    // Override del sistema de notificaciones existente
    const originalShowNotification = window.showNotification;
    if (originalShowNotification) {
        window.showNotification = function(message, type = 'info', duration = 5000) {
            const notification = originalShowNotification(message, type, duration);
            
            // Añadir efectos visuales modernos
            if (notification) {
                notification.classList.add('notification-enhanced');
                
                // Efecto de entrada suave
                notification.style.transform = 'translateX(100%)';
                notification.style.opacity = '0';
                
                setTimeout(() => {
                    notification.style.transition = 'all 0.3s ease-out';
                    notification.style.transform = 'translateX(0)';
                    notification.style.opacity = '1';
                }, 10);
                
                // Efecto de salida suave
                setTimeout(() => {
                    notification.style.transform = 'translateX(100%)';
                    notification.style.opacity = '0';
                }, duration - 300);
            }
            
            return notification;
        };
    }
}

/**
 * Mejorar indicadores de carga
 */
function enhanceLoadingStates() {
    // Interceptar formularios para mostrar estados de carga
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const submitBtn = form.querySelector('button[type="submit"], input[type="submit"]');
            if (submitBtn && !submitBtn.classList.contains('loading')) {
                submitBtn.classList.add('loading');
                submitBtn.setAttribute('aria-label', 'Procesando...');
                
                // Anunciar estado de carga
                announceToScreenReader('Procesando formulario...');
                
                // Remover estado de carga después de un tiempo
                setTimeout(() => {
                    submitBtn.classList.remove('loading');
                    submitBtn.removeAttribute('aria-label');
                }, 2000);
            }
        });
    });
}

/**
 * Añadir estilos de animación CSS dinámicamente
 */
function addAnimationStyles() {
    // Solo añadir si no existen
    if (document.getElementById('modern-animations')) return;
    
    const style = document.createElement('style');
    style.id = 'modern-animations';
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(2);
                opacity: 0;
            }
        }
        
        .form-group-focused {
            transform: translateY(-2px);
            transition: transform 0.2s ease;
        }
        
        .notification-enhanced {
            backdrop-filter: blur(10px);
            border-left: 4px solid var(--color-acento, #2b6cb0);
        }
        
        .btn.loading {
            opacity: 0.7;
            cursor: not-allowed;
        }
        
        /* Mejoras de accesibilidad visual */
        .skip-link:focus {
            z-index: 9999;
        }
        
        /* Reducir animaciones si el usuario las prefiere reducidas */
        @media (prefers-reduced-motion: reduce) {
            *,
            *::before,
            *::after {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
        }
    `;
    
    document.head.appendChild(style);
}

// Inicializar efectos modernos cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Pequeño retraso para asegurar que otros scripts estén cargados
    setTimeout(() => {
        addAnimationStyles();
        initModernEffects();
        enhanceNotifications();
        enhanceLoadingStates();
    }, 100);
});

// Inicializar efectos adicionales cuando la página esté completamente cargada
window.addEventListener('load', function() {
    // Añadir efecto de aparición suave a la página completa
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease-in-out';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// =====================================================
// FIN DE EFECTOS VISUALES Y ANIMACIONES MODERNAS
// ===================================================== 