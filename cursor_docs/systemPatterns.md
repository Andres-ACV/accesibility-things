# Accessibility Things - Patrones del Sistema

## Arquitectura General del Sistema

### Principios de Diseño

1. **Accesibilidad Universal**: Todo componente debe ser utilizab
le por personas con discapacidad
2. **Semántica HTML5**: Uso correcto de elementos estructurales y semánticos
3. **Progressive Enhancement**: Funcionalidad básica sin JavaScript, mejorada con interactividad
4. **Responsive Web Design**: Diseño web adaptable a diferentes tamaños de pantalla

## Estructura de Módulos

### Módulo de Autenticación
```
├── Registro de usuarios
├── Inicio de sesión  
├── Recuperación de contraseña
└── Verificación de cuenta
```

**Patrones de accesibilidad:**
- Formularios con etiquetas explícitas (`<label for="id">`)
- Mensajes de error asociados con `aria-describedby`
- Validación en tiempo real accesible
- Navegación por teclado fluida

### Módulo de Gestión de Perfiles
```
├── Visualización de perfil
├── Edición de datos personales
├── Configuración de preferencias de accesibilidad
└── Historial de actividad
```

**Patrones de accesibilidad:**
- Campos de formulario agrupados con `<fieldset>` y `<legend>`
- Indicadores de campos obligatorios accesibles
- Confirmaciones de cambios claras

### Módulo de Gestión de Productos
```
├── Catálogo navegable
├── Búsqueda y filtros especializados
├── Detalle de producto
├── Crear/editar/eliminar productos (vendedores)
└── Sistema de categorización
```

**Patrones de accesibilidad:**
- Navegación por categorías con breadcrumbs
- Filtros implementados con `<select>` y checkboxes accesibles
- Imágenes con texto alternativo descriptivo
- Tablas de especificaciones técnicas marcadas correctamente

### Módulo de Carrito y Checkout
```
├── Gestión de carrito de compras
├── Proceso de checkout simplificado
├── Información de envío
└── Confirmación de pedido
```

**Patrones de accesibilidad:**
- Proceso lineal y claro con indicadores de progreso
- Botones de acción claramente etiquetados
- Resúmenes de pedido en formato de tabla accesible
- Confirmaciones y errores anunciados por lectores de pantalla

### Módulo de Estadísticas (Vendedores)
```
├── Dashboard de ventas
├── Métricas por producto
├── Reportes descargables
└── Análisis de rendimiento
```

**Patrones de accesibilidad:**
- Gráficos con descripciones textuales alternativas
- Tablas de datos con encabezados correctamente asociados
- Datos exportables en formato accesible

## Patrones de Componentes Accesibles

### Estructura de Página Base

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Título específico - Accessibility Things</title>
</head>
<body>
    <!-- Enlaces de omisión -->
    <a href="#main-content" class="skip-link">Saltar al contenido principal</a>
    
    <!-- Encabezado de página -->
    <header role="banner">
        <nav role="navigation" aria-label="Navegación principal">
            <!-- Menú principal -->
        </nav>
    </header>
    
    <!-- Contenido principal -->
    <main id="main-content" role="main">
        <h1>Título de la página</h1>
        <!-- Contenido de la página -->
    </main>
    
    <!-- Contenido complementario -->
    <aside role="complementary">
        <!-- Filtros, información adicional -->
    </aside>
    
    <!-- Pie de página -->
    <footer role="contentinfo">
        <!-- Información institucional -->
    </footer>
</body>
</html>
```

### Patrón de Navegación Principal

```html
<nav role="navigation" aria-label="Navegación principal">
    <ul role="menubar">
        <li role="none">
            <a href="/" role="menuitem" aria-current="page">Inicio</a>
        </li>
        <li role="none">
            <a href="/catalogo" role="menuitem">Catálogo</a>
        </li>
        <li role="none">
            <button role="menuitem" aria-expanded="false" aria-haspopup="true">
                Categorías
            </button>
            <ul role="menu" aria-label="Submenu de categorías">
                <li role="none">
                    <a href="/movilidad" role="menuitem">Movilidad</a>
                </li>
                <!-- Más elementos -->
            </ul>
        </li>
    </ul>
</nav>
```

### Patrón de Ficha de Producto

```html
<article class="producto" itemscope itemtype="https://schema.org/Product">
    <header>
        <h2 itemprop="name">Nombre del Producto</h2>
    </header>
    
    <div class="producto-imagenes">
        <img src="producto.jpg" 
             alt="Descripción detallada del producto incluyendo características visuales importantes"
             itemprop="image">
    </div>
    
    <div class="producto-info">
        <div class="precio" itemprop="offers" itemscope itemtype="https://schema.org/Offer">
            <span class="sr-only">Precio:</span>
            <span itemprop="price">$150.00</span>
            <meta itemprop="priceCurrency" content="USD">
        </div>
        
        <div class="descripcion" itemprop="description">
            <h3>Descripción</h3>
            <p>Descripción detallada del producto...</p>
        </div>
        
        <div class="especificaciones">
            <h3>Especificaciones Técnicas</h3>
            <table class="tabla-specs">
                <caption class="sr-only">Especificaciones técnicas del producto</caption>
                <tbody>
                    <tr>
                        <th scope="row">Peso</th>
                        <td>2.5 kg</td>
                    </tr>
                    <tr>
                        <th scope="row">Dimensiones</th>
                        <td>50 x 30 x 15 cm</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    
    <div class="producto-acciones">
        <button type="button" class="btn btn-primary" aria-describedby="agregar-carrito-desc">
            Agregar al carrito
        </button>
        <div id="agregar-carrito-desc" class="sr-only">
            Agrega este producto a tu carrito de compras
        </div>
    </div>
</article>
```

### Patrón de Formularios Accesibles

```html
<form class="formulario-accesible" novalidate>
    <fieldset>
        <legend>Información Personal</legend>
        
        <div class="campo-grupo">
            <label for="nombre">Nombre completo *</label>
            <input type="text" 
                   id="nombre" 
                   name="nombre"
                   required
                   aria-describedby="nombre-ayuda nombre-error"
                   aria-invalid="false">
            <div id="nombre-ayuda" class="ayuda">
                Ingrese su nombre completo como aparece en su documento de identidad
            </div>
            <div id="nombre-error" class="error" role="alert" aria-live="polite">
                <!-- Mensaje de error aparece aquí -->
            </div>
        </div>
        
        <div class="campo-grupo">
            <label for="email">Correo electrónico *</label>
            <input type="email" 
                   id="email" 
                   name="email"
                   required
                   aria-describedby="email-ayuda email-error"
                   autocomplete="email">
            <div id="email-ayuda" class="ayuda">
                Usaremos este correo para comunicarnos contigo
            </div>
            <div id="email-error" class="error" role="alert" aria-live="polite">
                <!-- Mensaje de error aparece aquí -->
            </div>
        </div>
    </fieldset>
    
    <button type="submit" class="btn btn-primary">
        Guardar información
    </button>
</form>
```

### Patrón de Sistema de Filtros

```html
<aside class="filtros" role="complementary" aria-label="Filtros de búsqueda">
    <h2>Filtrar productos</h2>
    
    <form class="filtros-form">
        <fieldset>
            <legend>Tipo de discapacidad</legend>
            <div class="checkbox-grupo">
                <input type="checkbox" id="motora" name="discapacidad[]" value="motora">
                <label for="motora">Motora</label>
            </div>
            <div class="checkbox-grupo">
                <input type="checkbox" id="visual" name="discapacidad[]" value="visual">
                <label for="visual">Visual</label>
            </div>
            <div class="checkbox-grupo">
                <input type="checkbox" id="auditiva" name="discapacidad[]" value="auditiva">
                <label for="auditiva">Auditiva</label>
            </div>
        </fieldset>
        
        <fieldset>
            <legend>Rango de precio</legend>
            <div class="rango-precio">
                <label for="precio-min">Precio mínimo</label>
                <input type="number" 
                       id="precio-min" 
                       name="precio_min"
                       min="0"
                       aria-describedby="precio-ayuda">
                
                <label for="precio-max">Precio máximo</label>
                <input type="number" 
                       id="precio-max" 
                       name="precio_max"
                       min="0"
                       aria-describedby="precio-ayuda">
                
                <div id="precio-ayuda" class="ayuda">
                    Ingrese el rango de precios en dólares
                </div>
            </div>
        </fieldset>
        
        <button type="submit" class="btn btn-secondary">
            Aplicar filtros
        </button>
        <button type="reset" class="btn btn-outline">
            Limpiar filtros
        </button>
    </form>
</aside>
```

## Patrones de CSS Accesible

### Variables CSS para Accesibilidad

```css
:root {
    /* Colores con contraste WCAG AA */
    --color-primario: #1a365d; /* Ratio: 8.32:1 */
    --color-secundario: #2d3748; /* Ratio: 7.43:1 */
    --color-texto: #1a202c; /* Ratio: 16.68:1 */
    --color-enlace: #2b6cb0; /* Ratio: 4.89:1 */
    --color-error: #c53030; /* Ratio: 5.93:1 */
    --color-exito: #38a169; /* Ratio: 4.52:1 */
    
    /* Espaciado escalable */
    --espacio-xs: 0.25rem;
    --espacio-sm: 0.5rem;
    --espacio-md: 1rem;
    --espacio-lg: 1.5rem;
    --espacio-xl: 2rem;
    
    /* Tipografía accesible */
    --fuente-base: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
    --tamaño-base: 16px;
    --interlineado-base: 1.5;
    
    /* Tamaños mínimos táctiles */
    --tamaño-tactil-min: 44px;
}
```

### Patrones de Focus Visible

```css
/* Focus visible para navegación por teclado */
:focus-visible {
    outline: 2px solid var(--color-primario);
    outline-offset: 2px;
    border-radius: 4px;
}

/* Remover outline default solo cuando se usa focus-visible */
:focus:not(:focus-visible) {
    outline: none;
}

/* Botones y enlaces con estados accesibles */
.btn {
    min-height: var(--tamaño-tactil-min);
    min-width: var(--tamaño-tactil-min);
    padding: var(--espacio-sm) var(--espacio-md);
    border: 2px solid transparent;
    transition: all 0.2s ease-in-out;
}

.btn:hover {
    border-color: var(--color-primario);
}

.btn:focus-visible {
    outline: 2px solid var(--color-primario);
    outline-offset: 2px;
}
```

### Utilidades de Accesibilidad

```css
/* Texto solo para lectores de pantalla */
.sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
}

/* Skip links */
.skip-link {
    position: absolute;
    top: -40px;
    left: 6px;
    background: var(--color-primario);
    color: white;
    padding: 8px;
    text-decoration: none;
    border-radius: 4px;
    z-index: 1000;
}

.skip-link:focus {
    top: 6px;
}

/* Contenido reducido para usuarios con preferencias de movimiento */
@media (prefers-reduced-motion: reduce) {
    * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }
}
```

## Patrones de JavaScript Accesible

### Gestión de Foco

```javascript
// Clase para manejar foco de manera accesible
class FocusManager {
    static trapFocus(element) {
        const focusableElements = element.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        element.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                if (e.shiftKey && document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                } else if (!e.shiftKey && document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        });
    }
    
    static returnFocus(previousElement) {
        if (previousElement && typeof previousElement.focus === 'function') {
            previousElement.focus();
        }
    }
}
```

### Anuncios para Lectores de Pantalla

```javascript
// Clase para anuncios accesibles
class ScreenReaderAnnouncer {
    constructor() {
        this.liveRegion = this.createLiveRegion();
    }
    
    createLiveRegion() {
        const region = document.createElement('div');
        region.setAttribute('aria-live', 'polite');
        region.setAttribute('aria-atomic', 'true');
        region.className = 'sr-only';
        document.body.appendChild(region);
        return region;
    }
    
    announce(message, priority = 'polite') {
        this.liveRegion.setAttribute('aria-live', priority);
        this.liveRegion.textContent = message;
        
        // Limpiar después de un tiempo
        setTimeout(() => {
            this.liveRegion.textContent = '';
        }, 1000);
    }
}
```

## Decisiones Arquitectónicas Clave

### 1. HTML Semántico como Base
- Uso de elementos HTML5 apropiados antes de ARIA
- Estructura lógica de encabezados
- Formularios nativamente accesibles

### 2. CSS Responsive para Aplicación Web
- Breakpoints basados en contenido, no en dispositivos
- Unidades relativas para escalabilidad
- Soporte para preferencias de usuario (reduced-motion, high-contrast)

### 3. JavaScript Progresivo
- Funcionalidad básica sin JavaScript
- Mejoras incrementales con JS
- Degradación elegante

### 4. Testing Integrado
- Validación automática de WCAG en CI/CD
- Testing manual con lectores de pantalla
- Validación de contraste y escalabilidad

Esta arquitectura asegura que Accessibility Things sea verdaderamente inclusivo y utilizable por todas las personas, independientemente de sus capacidades o las tecnologías que utilicen para acceder al contenido. 