# System Patterns - Accessibility Things
**Última actualización: 14 Enero 2025 - ARQUITECTURA FINAL**

## 🏗️ ARQUITECTURA TÉCNICA IMPLEMENTADA

### **Patrones de Diseño Aplicados**
- ✅ **Module Pattern** - Encapsulación de funcionalidades
- ✅ **Observer Pattern** - Eventos y notificaciones
- ✅ **Factory Pattern** - Creación de componentes UI
- ✅ **Singleton Pattern** - DataManager y UIController
- ✅ **Strategy Pattern** - Diferentes tipos de validación
- ✅ **Command Pattern** - Operaciones de carrito y productos

## 🔧 COMPONENTES PRINCIPALES

### **1. DataManager (Singleton)**
**Responsabilidad:** Gestión central de datos y estado de la aplicación

```javascript
class DataManager {
    // Estado de la aplicación
    productos: Array<Producto>
    usuarios: Array<Usuario> 
    categorias: Array<Categoria>
    carrito: Array<ItemCarrito>
    currentUser: Usuario | null
    
    // Métodos CRUD implementados
    init() // Inicialización y carga de datos
    loadAllData() // Carga productos.json y usuarios.json
    
    // Gestión de productos
    searchProductos(term) // Búsqueda por múltiples campos
    filterProductosByCategory(categoria) // Filtrado por categoría
    filterProductosByAccessibilityType(tipo) // Filtro accesibilidad
    sortProducts(productos, criteria) // Ordenamiento múltiple
    
    // Gestión de usuarios
    registerUser(userData) // Registro con validación
    loginUser(email, password) // Autenticación
    getCurrentUser() // Usuario actual
    
    // Gestión de carrito
    addToCart(productId, quantity) // Agregar productos
    updateCartItem(productId, quantity) // Modificar cantidades
    removeFromCart(productId) // Eliminar productos
    getCartTotal() // Cálculo de totales
    
    // Gestión de productos (vendedores)
    createProduct(productData) // Crear producto nuevo
    updateProduct(productId, updatedData) // Editar existente
    deleteProduct(productId) // Eliminar producto
    getSellerProducts(sellerId) // Productos del vendedor
    
    // Persistencia
    saveToLocalStorage() // Guardar estado
    loadFromLocalStorage() // Cargar estado
}
```

### **2. UIController (Singleton)**
**Responsabilidad:** Control de la interfaz de usuario y eventos

```javascript
class UIController {
    constructor(dataManager) // Inyección de dependencia
    
    // Inicialización por página
    initializePage() // Detecta página actual y configura
    initializeHomePage() // Configuración página principal
    initializeCatalogPage() // Configuración catálogo
    initializeCartPage() // Configuración carrito
    initializeProfilePage() // Configuración perfil
    
    // Renderizado de componentes
    displayProducts(productos) // Tarjetas de productos
    displayUserInfo() // Información del usuario
    displayCart() // Contenido del carrito
    displaySellerProducts() // Productos del vendedor
    
    // Gestión de eventos
    setupEventListeners() // Event delegation pattern
    setupAuthForms() // Formularios de autenticación
    setupProductFormListeners() // Gestión de productos
    setupCartListeners() // Eventos del carrito
    
    // Notificaciones y feedback
    showNotification(message, type) // Sistema de notificaciones
    showValidationError(input, message) // Errores de validación
    announceToScreenReader(message) // Accesibilidad
}
```

### **3. AccessibilityManager (Module)**
**Responsabilidad:** Gestión de funcionalidades de accesibilidad

```javascript
const AccessibilityManager = {
    // Controles de accesibilidad
    initAccessibilityControls() // Inicialización general
    
    // Alto contraste
    toggleHighContrast() // Toggle modo alto contraste
    loadHighContrastPreference() // Cargar preferencia guardada
    
    // Tamaño de fuente
    toggleFontSize() // Aumentar/reducir fuente
    loadFontSizePreference() // Cargar preferencia guardada
    
    // Navegación por teclado
    setupKeyboardNavigation() // Configurar shortcuts
    setupSkipLinks() // Enlaces de salto
    
    // Lectores de pantalla
    announceToScreenReader(message) // Anuncios dinámicos
    setupAriaLiveRegions() // Regiones live para actualizaciones
    
    // Validación automática
    validateAccessibility() // Verificar criterios WCAG
    reportAccessibilityIssues() // Reportar problemas encontrados
}
```

## 🔄 FLUJO DE DATOS IMPLEMENTADO

### **1. Inicialización de la Aplicación**
```
1. main.js → initializeApp()
2. DataManager.init() → Cargar datos JSON + localStorage
3. UIController.initializePage() → Detectar página y configurar
4. AccessibilityManager.initAccessibilityControls() → Activar controles
5. Efectos visuales modernos → initModernEffects()
```

### **2. Flujo de Autenticación**
```
1. Usuario completa formulario login/registro
2. UIController captura evento submit
3. DataManager.loginUser() o registerUser()
4. Validación de datos y credenciales
5. Actualización de currentUser
6. UIController.displayUserInfo() → Actualizar UI
7. localStorage → Persistir sesión
8. Redirección o actualización de permisos
```

### **3. Flujo de Gestión de Carrito**
```
1. Usuario hace clic "Agregar al carrito"
2. UIController captura evento
3. DataManager.addToCart(productId, quantity)
4. Validación de stock y permisos
5. Actualización del array carrito
6. localStorage → Persistir carrito
7. UIController.updateCartCounter() → Actualizar contador
8. AccessibilityManager.announceToScreenReader() → Anunciar cambio
```

### **4. Flujo de Gestión de Productos (Vendedores)**
```
1. Vendedor completa formulario de producto
2. UIController.setupProductFormListeners() → Captura evento
3. Validación en tiempo real de campos
4. DataManager.createProduct(productData)
5. Generación automática de ID y metadatos
6. Asignación de colores por categoría
7. localStorage → Persistir productos personalizados
8. UIController.displaySellerProducts() → Actualizar lista
9. Notificación de éxito + anuncio accesible
```

## 🗃️ ESTRUCTURA DE DATOS

### **Producto**
```javascript
{
    id: "MOV001",
    nombre: "Silla de Ruedas Manual",
    categoria: "movilidad", // movilidad|visual|auditiva|cognitiva|embarazo
    subcategoria: "sillas_ruedas",
    precio: 185000,
    moneda: "CRC",
    descripcion: "Descripción breve",
    descripcion_larga: "Descripción detallada",
    especificaciones: {
        peso: "16 kg",
        capacidad_maxima: "120 kg",
        material: "Aluminio"
    },
    imagen_principal: "URL",
    alt_text_principal: "Descripción para lectores de pantalla",
    vendedor_id: "VEND001",
    stock: 8,
    disponible: true,
    accesibilidad_tipo: ["motora"],
    edad_recomendada: "adultos",
    etiquetas: ["tag1", "tag2"]
}
```

### **Usuario**
```javascript
{
    id: "usuario123",
    email: "usuario@email.com", 
    password: "hasheada",
    tipo: "comprador", // comprador|vendedor
    datos_personales: {
        nombre: "Juan Pérez",
        telefono: "88887777",
        fecha_nacimiento: "1985-03-15"
    },
    direccion: {
        provincia: "San José",
        canton: "San José", 
        distrito: "Carmen",
        direccion_exacta: "Calle 1, Casa 23"
    },
    perfil_accesibilidad: {
        tiene_discapacidad: false,
        tipo_discapacidad: [],
        necesidades_especificas: [],
        preferencias_navegacion: {
            alto_contraste: false,
            tamaño_texto: "normal",
            navegacion_teclado: false
        }
    }
}
```

### **Item de Carrito**
```javascript
{
    productId: "MOV001",
    quantity: 2,
    addedAt: "2025-01-14T10:30:00Z",
    price: 185000 // Precio al momento de agregar
}
```

## 🎨 PATRONES DE UI/UX IMPLEMENTADOS

### **1. Responsive Design Pattern**
- **Mobile-first approach** con breakpoints estratégicos
- **Flexbox y Grid** para layouts adaptativos  
- **Relative units** (rem, em, %) para escalabilidad
- **Media queries** para ajustes específicos por dispositivo

### **2. Component-Based Architecture**
```javascript
// Factory Pattern para componentes UI
const ComponentFactory = {
    createProductCard(product) {
        return `
            <article class="product-card animate-on-scroll" data-announce="Producto ${product.nombre} cargado">
                <div class="product-image">
                    <img src="${product.imagen_principal}" 
                         alt="${product.alt_text_principal}">
                </div>
                <div class="product-info">
                    <h3>${product.nombre}</h3>
                    <p class="product-category">${product.categoria}</p>
                    <p class="product-price">₡${product.precio.toLocaleString()}</p>
                    <button class="btn btn-primary add-to-cart" 
                            data-product-id="${product.id}">
                        Agregar al carrito
                    </button>
                </div>
            </article>
        `;
    }
}
```

### **3. State Management Pattern**
```javascript
// Centralización del estado en DataManager
const AppState = {
    // Estado de la aplicación
    currentUser: null,
    products: [],
    cart: [],
    filters: {},
    
    // Observers para cambios de estado
    observers: [],
    
    // Notificar cambios
    notify(eventType, data) {
        this.observers.forEach(observer => {
            if (observer.eventType === eventType) {
                observer.callback(data);
            }
        });
    },
    
    // Suscribirse a cambios
    subscribe(eventType, callback) {
        this.observers.push({ eventType, callback });
    }
}
```

## ♿ PATRONES DE ACCESIBILIDAD

### **1. Progressive Enhancement**
- **Base funcional** sin JavaScript
- **Mejoras incrementales** con JS habilitado
- **Fallbacks accesibles** para todas las funciones

### **2. Semantic HTML Pattern**
```html
<!-- Estructura semántica implementada -->
<header role="banner">
    <nav role="navigation" aria-label="Navegación principal">
    
<main role="main">
    <section aria-labelledby="products-heading">
        <h2 id="products-heading">Catálogo de Productos</h2>
        
<aside role="complementary" aria-label="Filtros de búsqueda">

<footer role="contentinfo">
```

### **3. ARIA Enhancement Pattern**
```javascript
// Mejoras ARIA dinámicas
function enhanceWithAria(element, role, label) {
    element.setAttribute('role', role);
    element.setAttribute('aria-label', label);
    element.setAttribute('tabindex', '0');
}

// Live regions para actualizaciones dinámicas
const liveRegion = document.createElement('div');
liveRegion.setAttribute('aria-live', 'polite');
liveRegion.setAttribute('aria-atomic', 'true');
liveRegion.className = 'sr-only';
```

## 🔐 PATRONES DE SEGURIDAD

### **1. Client-Side Validation Pattern**
```javascript
const ValidationPatterns = {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
    
    validate(field, value) {
        switch(field) {
            case 'email':
                return this.email.test(value);
            case 'password':
                return this.password.test(value);
            default:
                return true;
        }
    }
}
```

### **2. Data Sanitization Pattern**
```javascript
function sanitizeInput(input) {
    return input
        .trim()
        .replace(/[<>]/g, '') // Básico XSS prevention
        .substring(0, 1000); // Limite de longitud
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
```

## 📱 PATRONES DE PERFORMANCE

### **1. Lazy Loading Pattern**
```javascript
// Intersection Observer para carga diferida
const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            imageObserver.unobserve(img);
        }
    });
});
```

### **2. Debouncing Pattern**
```javascript
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

// Aplicado a búsqueda en tiempo real
const debouncedSearch = debounce(performSearch, 300);
```

## 🎯 PATRONES DE TESTING

### **1. Unit Testing Pattern**
```javascript
const TestRunner = {
    tests: [],
    
    addTest(name, testFunction) {
        this.tests.push({ name, test: testFunction });
    },
    
    runTest(testName) {
        const test = this.tests.find(t => t.name === testName);
        if (!test) return { success: false, error: 'Test not found' };
        
        try {
            const result = test.test();
            return { success: true, result };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}
```

### **2. Accessibility Testing Pattern**
```javascript
const AccessibilityTester = {
    validateWCAG() {
        const issues = [];
        
        // Verificar contraste
        if (!this.checkColorContrast()) {
            issues.push('Contraste insuficiente detectado');
        }
        
        // Verificar estructura de encabezados
        if (!this.checkHeadingStructure()) {
            issues.push('Estructura de encabezados incorrecta');
        }
        
        return issues;
    }
}
```

---

## 🏆 ARQUITECTURA FINAL CONSEGUIDA

### **✅ Características Implementadas**
- **Modular y Escalable** - Componentes independientes
- **Mantenible** - Código limpio y documentado  
- **Accesible** - WCAG 2.1 AA compliance
- **Performante** - Optimizaciones múltiples
- **Responsive** - Adaptable a todos los dispositivos
- **Robusta** - Manejo de errores comprehensivo

### **🎯 Patrones de Calidad Enterprise**
- **Separation of Concerns** - Responsabilidades claras
- **DRY (Don't Repeat Yourself)** - Código reutilizable
- **SOLID Principles** - Diseño orientado a objetos
- **Progressive Enhancement** - Funcionalidad incremental
- **Graceful Degradation** - Fallbacks funcionales

**Arquitectura lista para entrega universitaria y uso en producción** 🚀 