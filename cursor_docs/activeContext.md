# Accessibility Things - Contexto Activo de Desarrollo

## Estado Actual del Proyecto

**Tipo:** Proyecto Universitario - Avance Proyecto Diseño de Software (Prototipo Funcional)

## Documentación Completada

### ✅ Análisis y Diseño Previo
- **Análisis competitivo** realizado sobre 8 plataformas del sector
- **Análisis de personas** con encuesta a 14 usuarios potenciales
- **Inventario de contenidos** estructurado por módulos funcionales
- **Mockups de alta fidelidad** creados en Figma para validación de diseño

## Enfoque Actual: Desarrollo Según Rúbrica Universitaria

### 🎯 Objetivo Principal: Cumplir 100% los Criterios de Evaluación

**Meta:** Obtener calificación "Excelente" (3 puntos) en todas las categorías de la rúbrica

### ⚠️ IMPORTANTE: Protocolo de Desarrollo
**Antes de generar cualquier código HTML, CSS o JavaScript, el AI DEBE:**
1. Revisar las reglas de accesibilidad web en su memoria (WCAG 2.1/2.2)
2. Aplicar patrones de HTML semántico y ARIA apropiados
3. Asegurar cumplimiento con criterios específicos de la rúbrica
4. Implementar navegación por teclado y compatibilidad con lectores de pantalla

### 📋 Criterios de Evaluación a Cumplir

#### 1. Interfaz Gráfica (24% - 4.8 puntos)
- **Estética (10%)**: Principios de diseño, colores, ordenamiento de botones, alineación
- **Ortografía (6%)**: Cero faltas de ortografía en toda la interfaz
- **Flujo de funcionalidades (8%)**: Navegación clara y entendible

#### 2. Accesibilidad (28% - 5.6 puntos)
- **Alto contraste (7%)**: Control de alto contraste implementado y funcional
- **Navegación por teclado (7%)**: 100% funcional en orden correcto
- **Descripción de imágenes/videos (7%)**: Texto alternativo completo y modificable
- **Lector de pantalla (7%)**: 100% compatible con tecnologías asistivas

#### 3. Casos de Uso Funcionales (48% - 9.6 puntos)
**Caso de Uso 1: Registro y Autenticación de Usuario**
- Completitud: Registro completo con validaciones
- Persistencia: Almacenamiento de datos de usuario
- Comprensibilidad: Proceso claro de registro/login

**Caso de Uso 2: Navegación y Búsqueda de Productos**
- Completitud: Catálogo con filtros funcionales
- Persistencia: Filtros aplicados y resultados consistentes
- Comprensibilidad: Búsqueda intuitiva y resultados claros

**Caso de Uso 3: Gestión de Carrito de Compras (Principal)**
- Completitud: Agregar, modificar, eliminar productos del carrito
- Persistencia: Carrito se mantiene entre sesiones
- Comprensibilidad: Proceso de compra claro paso a paso

**Caso de Uso 4: Publicación y Gestión de Productos (Vendedores)**
- Completitud: CRUD completo de productos
- Persistencia: Productos guardados con imágenes y metadatos
- Comprensibilidad: Interface clara para vendedores

## Decisiones Técnicas para Proyecto Universitario

### Stack Tecnológico Simplificado
1. **HTML5 Semántico** - Control total sobre accesibilidad y cumplimiento WCAG
2. **CSS3 con Variables** - Alto contraste implementable y principios de diseño
3. **JavaScript Vanilla** - Funcionalidad sin dependencias externas
4. **localStorage** - Persistencia de datos sin base de datos externa

### Enfoque en Criterios de Rúbrica
1. **Estética con propósito** - Diseño que cumple principios y es agradable visualmente
2. **Accesibilidad como prioridad** - 28% del puntaje total
3. **Funcionalidades completas** - 4 casos de uso funcionando al 100%
4. **Proceso comprensible** - Navegación clara e intuitiva

## Próximos Pasos por Fase

### Fase 1: Estructura Base (Semana 1-2)
1. **Setup del proyecto** - Estructura de carpetas HTML/CSS/JS
2. **Páginas principales** - index.html, catalogo.html, carrito.html, perfil.html
3. **CSS base** - Variables de color, tipografía, botones accesibles
4. **Navegación básica** - Enlaces entre páginas funcionando

### Fase 2: Implementación de Casos de Uso (Semana 3-4)
1. **Caso de Uso 1** - Registro y autenticación con localStorage
2. **Caso de Uso 2** - Catálogo con búsqueda y filtros funcionales
3. **Caso de Uso 3** - Carrito persistente y proceso de compra
4. **Caso de Uso 4** - CRUD de productos para vendedores

### Fase 3: Accesibilidad y Pulido (Semana 5-6)
1. **Controle de alto contraste** - Implementación completa
2. **Navegación por teclado** - Testing y ajustes
3. **Textos alternativos** - Sistema para modificar alt text
4. **Testing con lector de pantalla** - Compatibilidad al 100%

## Retos para Cumplir la Rúbrica

### Interfaz Gráfica (24%)
- **Estética agradable** manteniendo principios de accesibilidad
- **Cero errores ortográficos** en toda la interfaz
- **Flujo de navegación intuitivo** para todos los usuarios

### Accesibilidad (28%)
- **Control de alto contraste** que funcione en toda la aplicación
- **Navegación por teclado** en el orden correcto para todos los elementos
- **Sistema robusto** para textos alternativos modificables
- **Compatibilidad total** con lectores de pantalla

### Funcionalidades (48%)
- **CRUD completo** funcionando sin errores
- **Persistencia confiable** usando localStorage
- **Procesos comprensibles** para usuarios no técnicos

## Métricas de Éxito (Basadas en Rúbrica)

### Para Obtener "Excelente" (3 puntos) en Cada Criterio:
- **Estética**: Diseño agradable que integra principios de color, ordenamiento y alineación
- **Ortografía**: 0 faltas de ortografía
- **Flujo**: Navegación clara donde todas las opciones son fáciles de ubicar
- **Alto contraste**: Control implementado y funcional
- **Navegación por teclado**: 100% funcional en orden correcto
- **Descripción de recursos**: Texto alternativo completo y modificable
- **Lector de pantalla**: 100% de acceso sin problemas
- **Completitud**: Cada funcionalidad cumple al 100%
- **Persistencia**: CRUD completo con acceso preciso a la información
- **Comprensibilidad**: Procesos claros y entendibles

## Herramientas Necesarias

### Desarrollo
- **Editor de código**: VSCode/Cursor con extensiones de accesibilidad
- **Servidor local**: Live Server para testing
- **Control de versiones**: Git para el proyecto

### Testing de Accesibilidad
- **NVDA**: Lector de pantalla para testing (gratuito)
- **axe DevTools**: Extensión del navegador para auditorías automáticas
- **Lighthouse**: Para métricas de accesibilidad
- **Color Contrast Analyzer**: Verificación de contraste

### Estructura de Archivos Simplificada
```
accessibility-things/
├── cursor_docs/          # Documentación del proyecto
├── index.html           # Página principal
├── catalogo.html        # Búsqueda y listado de productos
├── carrito.html         # Gestión del carrito
├── perfil.html          # Gestión de usuario y productos
├── css/
│   ├── main.css         # Estilos principales
│   └── accessibility.css # Estilos para accesibilidad
├── js/
│   ├── main.js          # Funcionalidad principal
│   ├── carrito.js       # Lógica del carrito
│   └── accessibility.js # Controles de accesibilidad
├── data/
│   ├── productos.json   # Datos de productos
│   └── usuarios.json    # Datos de usuarios
└── assets/
    └── images/          # Imágenes de productos
```

## Cronograma para Entrega (Junio 23, 2025)

**6 semanas disponibles = Desarrollo factible con tiempo para testing y pulido** 