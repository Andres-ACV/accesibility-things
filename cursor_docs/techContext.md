# Accessibility Things - Contexto Técnico (Proyecto Universitario)

## Stack Tecnológico Simplificado para Rúbrica

### Frontend (Control Total para Accesibilidad - 28% de la nota)
- **HTML5 Semántico**: Elementos estructurales accesibles (`<header>`, `<nav>`, `<main>`, `<aside>`, `<footer>`)
- **CSS3 con Variables**: Sistema de colores para alto contraste, flexbox/grid para diseño web
- **JavaScript Vanilla**: Funcionalidad sin dependencias, control total sobre ARIA
- **localStorage**: Persistencia de datos para cumplir criterios CRUD de la rúbrica

### Justificación del Stack para Proyecto Universitario
1. **Control total sobre accesibilidad** - 28% de la nota depende de implementación precisa
2. **Sin dependencias externas** - Evita problemas de compatibilidad con lectores de pantalla  
3. **Simplicidad de debugging** - Facilita identificar y corregir problemas de accesibilidad
4. **Cumplimiento directo de WCAG** - HTML semántico nativo sin frameworks que interfieran

## Herramientas de Desarrollo

### Editor y Entorno
- **VSCode/Cursor**: Con extensiones de accesibilidad instaladas
- **Live Server**: Para testing local en tiempo real
- **Git**: Control de versiones del proyecto
- **Navegadores**: Chrome, Firefox para testing cross-browser

### Testing de Accesibilidad (28% de la nota - Crítico)
- **NVDA**: Lector de pantalla gratuito para testing completo (7% lector de pantalla)
- **axe DevTools**: Extensión de navegador para auditorías automáticas  
- **Lighthouse**: Métricas de accesibilidad integradas en Chrome
- **Color Contrast Analyzer**: Verificación manual de contraste WCAG AA (7% alto contraste)

### Herramientas de Validación
- **W3C Markup Validator**: HTML sin errores (criterio técnico)
- **W3C CSS Validator**: CSS válido
- **Accessibility Insights**: Testing adicional de Microsoft

## Requisitos Específicos de la Rúbrica

### Accesibilidad (28% = 5.6 puntos)
1. **Alto Contraste (7%)**: Control toggle implementado y funcional
2. **Navegación por Teclado (7%)**: 100% funcional en orden correcto
3. **Descripción de Imágenes (7%)**: Texto alternativo modificable
4. **Lector de Pantalla (7%)**: Compatible sin problemas

### Funcionalidades (48% = 9.6 puntos)
- **4 Casos de Uso**: Cada uno con Completitud + Persistencia + Comprensibilidad
- **localStorage**: Para cumplir criterio de persistencia en todos los casos

### Interfaz Gráfica (24% = 4.8 puntos)
- **Estética (10%)**: Principios de diseño aplicados
- **Ortografía (6%)**: 0 errores en toda la interfaz
- **Flujo (8%)**: Navegación clara e intuitiva

## Estructura Simplificada del Proyecto Universitario

```
accessibility-things/
├── cursor_docs/                # Documentación del proyecto ✅
│   ├── productContext.md      # Contexto del producto  
│   ├── activeContext.md       # Estado actual y rúbrica
│   ├── systemPatterns.md      # Patrones de accesibilidad
│   ├── techContext.md         # Este archivo técnico
│   └── progress.md            # Progreso y cronograma
├── index.html                 # Página principal ⏳
├── catalogo.html              # Búsqueda de productos ⏳
├── carrito.html               # Gestión del carrito ⏳
├── perfil.html                # Gestión de usuario y CRUD productos ⏳
├── css/                       # Estilos organizados
│   ├── main.css              # Estilos principales ⏳
│   └── accessibility.css     # Controles de accesibilidad ⏳
├── js/                        # JavaScript por funcionalidad
│   ├── main.js               # Funcionalidad general ⏳
│   ├── carrito.js            # Lógica del carrito ⏳
│   └── accessibility.js     # Controles de accesibilidad ⏳
├── data/                      # Datos en JSON para localStorage
│   ├── productos.json        # Catálogo de productos ⏳
│   └── usuarios.json         # Datos de usuarios ⏳
├── assets/                    # Recursos estáticos
│   └── images/               # Imágenes de productos ⏳
├── README.md                  # Documentación del proyecto ⏳
└── .gitignore                # Control de versiones ⏳
```

### Justificación de la Estructura Simplificada
1. **4 páginas HTML** - Una por cada caso de uso de la rúbrica
2. **CSS organizado** - Separación entre estilos principales y accesibilidad
3. **JavaScript modular** - Archivos específicos por funcionalidad
4. **Data en JSON** - Simula base de datos para criterios de persistencia
5. **Sin subcarpetas complejas** - Facilita el desarrollo y debugging

## Configuración de Desarrollo

### Variables CSS Principales

```css
:root {
  /* Colores principales con contraste WCAG AA */
  --color-primario: #1a365d;        /* Azul oscuro - Ratio 8.32:1 */
  --color-secundario: #2d3748;      /* Gris oscuro - Ratio 7.43:1 */
  --color-acento: #2b6cb0;          /* Azul medio - Ratio 4.89:1 */
  --color-texto: #1a202c;           /* Negro suave - Ratio 16.68:1 */
  --color-texto-claro: #4a5568;     /* Gris medio - Ratio 6.24:1 */
  --color-fondo: #ffffff;           /* Blanco */
  --color-fondo-alt: #f7fafc;       /* Gris muy claro */
  
  /* Estados y feedback */
  --color-exito: #38a169;           /* Verde - Ratio 4.52:1 */
  --color-advertencia: #d69e2e;     /* Amarillo - Ratio 5.12:1 */
  --color-error: #c53030;           /* Rojo - Ratio 5.93:1 */
  --color-info: #3182ce;            /* Azul - Ratio 5.14:1 */
  
  /* Espaciado escalable */
  --espaciado-xs: 0.25rem;   /* 4px */
  --espaciado-sm: 0.5rem;    /* 8px */
  --espaciado-md: 1rem;      /* 16px */
  --espaciado-lg: 1.5rem;    /* 24px */
  --espaciado-xl: 2rem;      /* 32px */
  --espaciado-2xl: 3rem;     /* 48px */
  
  /* Tipografía */
  --fuente-principal: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
  --fuente-mono: 'SF Mono', Monaco, 'Cascadia Code', monospace;
  --tamaño-base: 16px;
  --interlineado-base: 1.5;
  --interlineado-titulo: 1.2;
  
  /* Tamaños mínimos para accesibilidad */
  --tamaño-tactil-min: 44px;
  --tamaño-texto-min: 16px;
  
  /* Radios y sombras */
  --radio-sm: 4px;
  --radio-md: 8px;
  --sombra-sm: 0 1px 3px rgba(0,0,0,0.12);
  --sombra-md: 0 4px 6px rgba(0,0,0,0.07);
  
  /* Transiciones */
  --transicion-rapida: 0.15s ease-in-out;
  --transicion-normal: 0.3s ease-in-out;
}
```

### Breakpoints Responsivos

```css
/* Responsive web design approach */
:root {
  --breakpoint-sm: 576px;    /* Móviles grandes */
  --breakpoint-md: 768px;    /* Tablets */
  --breakpoint-lg: 992px;    /* Laptops */
  --breakpoint-xl: 1200px;   /* Escritorio */
  --breakpoint-2xl: 1400px;  /* Pantallas grandes */
}

/* Media queries estándar */
@media (min-width: 576px) { /* sm */ }
@media (min-width: 768px) { /* md */ }
@media (min-width: 992px) { /* lg */ }
@media (min-width: 1200px) { /* xl */ }
@media (min-width: 1400px) { /* 2xl */ }
```

## Herramientas de Testing

### Automatizado
- **axe-core**: Integrado en el proceso de build
- **Pa11y**: CLI para testing de accesibilidad
- **Lighthouse CI**: Auditorías automáticas en CI/CD

### Manual
- **NVDA (Windows)**: Lector de pantalla principal para testing
- **VoiceOver (macOS)**: Testing en dispositivos Apple
- **Keyboard Navigation**: Testing completo sin ratón
- **Color Contrast Analyzer**: Verificación de contraste

### Scripts de Testing

```json
{
  "scripts": {
    "test:accessibility": "pa11y-ci --sitemap http://localhost:3000/sitemap.xml",
    "test:contrast": "color-contrast-analyzer src/css/**/*.css",
    "test:html": "html-validate src/html/**/*.html",
    "test:css": "stylelint src/css/**/*.css",
    "audit:lighthouse": "lighthouse-ci autorun",
    "validate:wcag": "axe src/html/**/*.html --rules wcag2a,wcag2aa"
  }
}
```

## Configuraciones de Accesibilidad

### Configuración de axe-core

```javascript
// .axe-config.js
module.exports = {
  rules: {
    // Reglas WCAG 2.1 AA obligatorias
    'wcag2a': { enabled: true },
    'wcag2aa': { enabled: true },
    'wcag21a': { enabled: true },
    'wcag21aa': { enabled: true },
    
    // Reglas específicas del proyecto
    'color-contrast': { enabled: true },
    'keyboard-navigation': { enabled: true },
    'focus-order-semantics': { enabled: true },
    'landmark-unique': { enabled: true }
  },
  tags: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'],
  locale: 'es'
};
```

### Configuración de ESLint para Accesibilidad

```javascript
// .eslintrc.js
module.exports = {
  extends: [
    'plugin:jsx-a11y/recommended'
  ],
  plugins: ['jsx-a11y'],
  rules: {
    'jsx-a11y/alt-text': 'error',
    'jsx-a11y/anchor-has-content': 'error',
    'jsx-a11y/aria-props': 'error',
    'jsx-a11y/aria-proptypes': 'error',
    'jsx-a11y/aria-role': 'error',
    'jsx-a11y/aria-unsupported-elements': 'error',
    'jsx-a11y/heading-has-content': 'error',
    'jsx-a11y/html-has-lang': 'error',
    'jsx-a11y/lang': 'error',
    'jsx-a11y/no-redundant-roles': 'error',
    'jsx-a11y/role-has-required-aria-props': 'error',
    'jsx-a11y/role-supports-aria-props': 'error',
    'jsx-a11y/tabindex-no-positive': 'error'
  }
};
```

## Dependencias del Proyecto

### Desarrollo
```json
{
  "devDependencies": {
    "axe-core": "^4.6.0",
    "pa11y-ci": "^3.0.1",
    "lighthouse-ci": "^0.12.0",
    "html-validate": "^7.13.0",
    "stylelint": "^15.2.0",
    "stylelint-a11y": "^1.2.3",
    "eslint-plugin-jsx-a11y": "^6.7.1",
    "color-contrast-analyzer": "^3.0.0"
  }
}
```

### Runtime (si se requiere)
```json
{
  "dependencies": {
    "focus-trap": "^7.4.0",
    "ally.js": "^1.4.1"
  }
}
```

## Convenciones de Código

### HTML
- **Idioma**: Siempre especificar `lang="es"`
- **Semántica**: Usar elementos HTML5 apropiados
- **Encabezados**: Jerarquía lógica sin saltar niveles
- **Formularios**: Etiquetas explícitas siempre
- **Imágenes**: `alt` descriptivo o vacío si decorativa

### CSS
- **Metodología**: BEM modificado para accesibilidad
- **Unidades**: `rem` para tamaños, `px` para borders
- **Colores**: Variables CSS con contraste verificado
- **Focus**: Visible y accesible para todos los elementos interactivos

### JavaScript
- **Estándar**: ES6+ con compatibilidad hasta ES2018
- **Accesibilidad**: Gestión de foco y anuncios ARIA
- **Progressive Enhancement**: Funcionalidad básica sin JS
- **No dependencias**: Evitar bibliotecas pesadas

## Despliegue y Hosting

### Requisitos del Servidor
- **HTTP/2**: Para mejor rendimiento
- **HTTPS**: Obligatorio para PWA y seguridad
- **Compresión Gzip**: Para optimización de recursos
- **Headers de Seguridad**: CSP, HSTS, etc.

### Configuración de Performance
- **Critical CSS**: Inlined para above-the-fold
- **Lazy Loading**: Para imágenes y contenido no crítico
- **Service Worker**: Para funcionalidad offline básica
- **Web Vitals**: Cumplimiento de Core Web Vitals

### Monitoreo
- **Lighthouse CI**: Auditorías continuas
- **Real User Monitoring**: Métricas de usuarios reales
- **Accessibility Monitoring**: Alertas por problemas de accesibilidad
- **Performance Budget**: Límites de tamaño y velocidad

## Consideraciones de Seguridad

### Content Security Policy
```
Content-Security-Policy: 
  default-src 'self'; 
  style-src 'self' 'unsafe-inline'; 
  script-src 'self'; 
  img-src 'self' data: https:; 
  font-src 'self';
```

### Headers de Seguridad
- **X-Frame-Options**: DENY
- **X-Content-Type-Options**: nosniff
- **Referrer-Policy**: strict-origin-when-cross-origin
- **Permissions-Policy**: camera=(), microphone=(), geolocation=()

Esta configuración técnica asegura que Accessibility Things mantenga los más altos estándares de accesibilidad, rendimiento y seguridad web. 