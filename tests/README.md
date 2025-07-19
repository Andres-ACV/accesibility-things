# 🧪 Sistema de Testing Modular - Accessibility Things

## 📋 Información General

Este sistema de testing está diseñado específicamente para **validar el cumplimiento de la rúbrica universitaria** del proyecto Accessibility Things. La estructura es modular para facilitar el mantenimiento y permitir testing granular de cada criterio de evaluación.

### 🎯 Objetivo Principal
**Obtener calificación "Excelente" (3 puntos) en todas las categorías de la rúbrica**

## 📊 Distribución por Criterios de Rúbrica

| Categoría | Peso | Puntos | Criterio "Excelente" |
|-----------|------|---------|---------------------|
| **Accesibilidad** | 28% | 5.6 pts | Todos los criterios WCAG funcionando |
| **Funcionalidades** | 48% | 9.6 pts | 4 casos de uso completos |
| **Interfaz Gráfica** | 24% | 4.8 pts | Estética + Ortografía + Flujo |
| **TOTAL** | **100%** | **20 pts** | **Meta: 20/20 puntos** |

## 🗂️ Estructura de Archivos

```
tests/
├── index.html                    # Portal principal de testing
├── README.md                     # Esta documentación
│
├── accessibility/                # Tests de accesibilidad (28% de la nota)
│   ├── index.html               # Centro de control de accesibilidad
│   ├── high-contrast.test.html  # Test de alto contraste (7%)
│   ├── keyboard-nav.test.html   # Test de navegación por teclado (7%)
│   ├── image-alt.test.html      # Test de texto alternativo (7%)
│   └── screen-reader.test.html  # Test de lector de pantalla (7%)
│
├── unit/                        # Tests unitarios (48% de la nota)
│   ├── index.html               # Centro de control unitario
│   ├── auth.test.html           # Caso 1: Autenticación (12%)
│   ├── catalog.test.html        # Caso 2: Catálogo (12%)
│   ├── cart.test.html           # Caso 3: Carrito (12%) - PRINCIPAL
│   └── crud.test.html           # Caso 4: CRUD Productos (12%)
│
├── integration/                 # Tests de integración
│   ├── index.html               # Centro de control de integración
│   ├── user-flow.test.html      # Flujo completo de usuario
│   ├── data-persistence.test.html # Persistencia de datos
│   └── cross-browser.test.html  # Compatibilidad cross-browser
│
└── ui/                          # Tests de interfaz (24% de la nota)
    ├── index.html               # Centro de control de UI
    ├── visual-design.test.html  # Diseño visual (10%)
    ├── navigation.test.html     # Flujo de navegación (8%)
    ├── spelling.test.html       # Control de ortografía (6%)
    └── responsive.test.html     # Diseño responsivo
```

## 🧩 Filosofía Modular

### ✅ Principios de Diseño
- **Archivos pequeños**: Máximo 500 líneas por test
- **Responsabilidad única**: Cada archivo testa una funcionalidad específica
- **Independencia**: Tests pueden ejecutarse de forma individual o en conjunto
- **Mantenibilidad**: Fácil identificación y corrección de problemas

### 🔄 Flujo de Testing
1. **Portal Principal** (`tests/index.html`) - Navegación a todas las categorías
2. **Centros de Control** - Coordinación por tipo de test
3. **Tests Específicos** - Validación granular de criterios
4. **Reportes** - Generación de resultados detallados

## 🎯 Tests por Categoría

### 1. Tests de Accesibilidad (28% - 5.6 puntos)

#### 🔧 Alto Contraste (7% de la nota)
- **Criterio**: Control implementado y funcional
- **Tests**:
  - Existencia del control toggle
  - Funcionalidad del cambio de colores
  - Ratios WCAG AA (4.5:1 mínimo)
  - Persistencia en localStorage

#### ⌨️ Navegación por Teclado (7% de la nota)
- **Criterio**: 100% funcional en orden correcto
- **Tests**:
  - Tab order lógico y secuencial
  - Skip links funcionando
  - Estados de foco visibles
  - Todos los elementos interactivos accesibles

#### 🖼️ Texto Alternativo (7% de la nota)
- **Criterio**: Texto alternativo completo y modificable
- **Tests**:
  - Todas las imágenes tienen alt text
  - Descripciones detalladas y útiles
  - Sistema para editar alt text
  - Imágenes decorativas con alt=""

#### 🔊 Lector de Pantalla (7% de la nota)
- **Criterio**: 100% de acceso sin problemas
- **Tests**:
  - Etiquetas ARIA correctas
  - Navegación por landmarks
  - Anuncios apropiados de cambios
  - Formularios completamente accesibles

### 2. Tests Unitarios (48% - 9.6 puntos)

#### 🔐 Caso 1: Autenticación (12% de la nota)
- **Completitud (4%)**: Registro + Login + Validaciones
- **Persistencia (4%)**: localStorage para usuarios
- **Comprensibilidad (4%)**: Proceso claro (≤3 pasos)

#### 🔍 Caso 2: Catálogo (12% de la nota)
- **Completitud (4%)**: Búsqueda + Filtros + Resultados
- **Persistencia (4%)**: Filtros y estado mantenidos
- **Comprensibilidad (4%)**: Búsqueda intuitiva

#### 🛒 Caso 3: Carrito (12% de la nota) - **PRINCIPAL**
- **Completitud (4%)**: Agregar + Modificar + Eliminar + Calcular
- **Persistencia (4%)**: Carrito entre sesiones
- **Comprensibilidad (4%)**: Checkout claro (≤3 pasos)

#### 📦 Caso 4: CRUD Productos (12% de la nota)
- **Completitud (4%)**: Crear + Leer + Actualizar + Eliminar
- **Persistencia (4%)**: Datos con metadatos completos
- **Comprensibilidad (4%)**: Interface clara para vendedores

### 3. Tests de Interfaz (24% - 4.8 puntos)

#### 🎨 Diseño Visual (10% de la nota)
- **Criterio**: Estética agradable con principios de diseño
- **Tests**:
  - Principios de color y contraste
  - Tipografía y espaciado
  - Alineación y ordenamiento

#### 📝 Control de Ortografía (6% de la nota)
- **Criterio**: 0 faltas de ortografía
- **Tests**:
  - Textos de interfaz (menús, botones)
  - Contenido y descripciones
  - Mensajes de error y validación

#### 🧭 Flujo de Navegación (8% de la nota)
- **Criterio**: Navegación clara donde todas las opciones son fáciles de ubicar
- **Tests**:
  - Menú principal claro
  - Flujos de usuario intuitivos
  - Orientación y breadcrumbs

## 🚀 Instrucciones de Uso

### Ejecución Individual
1. Navegar a `tests/index.html` en el navegador
2. Seleccionar la categoría deseada
3. Ejecutar tests específicos según necesidad

### Ejecución Completa
1. Desde el portal principal, hacer clic en "Ejecutar Todos los Tests"
2. Esperar completación de todas las categorías
3. Revisar reporte consolidado

### Ejecución por Categoría
1. Ir al centro de control de la categoría (ej: `tests/accessibility/index.html`)
2. Usar "Ejecutar Todos los Tests" de esa categoría
3. Revisar resultados específicos

## 📈 Interpretación de Resultados

### Escala de Calificación
- **90-100%**: EXCELENTE (3 puntos) ✅
- **70-89%**: BUENO (2 puntos) ⚠️
- **<70%**: REQUIERE MEJORA (1 punto) ❌

### Criterios de Éxito
Para obtener la máxima calificación (20/20):
- Accesibilidad: ≥90% en cada uno de los 4 criterios
- Funcionalidades: ≥90% en cada uno de los 4 casos de uso
- Interfaz: ≥90% en estética, 100% en ortografía, ≥90% en navegación

## 🔧 Configuración Técnica

### Tecnologías Utilizadas
- **HTML5**: Estructura semántica accesible
- **CSS3**: Estilos con variables para temas
- **JavaScript Vanilla**: Lógica de testing sin dependencias
- **localStorage**: Persistencia de resultados

### Compatibilidad
- **Navegadores**: Chrome 80+, Firefox 75+, Safari 13+, Edge 80+
- **Dispositivos**: Desktop, tablet, móvil
- **Lectores de pantalla**: NVDA, JAWS, VoiceOver

### Herramientas de Validación Recomendadas
- **axe DevTools**: Auditorías automáticas de accesibilidad
- **Lighthouse**: Métricas de rendimiento y accesibilidad
- **Color Contrast Analyzer**: Verificación manual de contraste
- **NVDA**: Testing con lector de pantalla gratuito

## 📝 Mantenimiento

### Agregar Nuevos Tests
1. Crear archivo en la carpeta apropiada
2. Seguir el patrón de nomenclatura: `nombre.test.html`
3. Actualizar el índice correspondiente
4. Documentar en este README

### Modificar Tests Existentes
1. Mantener compatibilidad con la estructura existente
2. Actualizar documentación si es necesario
3. Verificar que no se rompa la integración

### Actualizar Criterios de Rúbrica
1. Modificar porcentajes en los centros de control
2. Ajustar tests según nuevos requisitos
3. Actualizar esta documentación

## 🎓 Contexto Universitario

Este sistema está específicamente diseñado para el **Proyecto de Diseño de Software** con los siguientes objetivos académicos:

- Demostrar conocimiento de testing sistemático
- Validar cumplimiento de estándares de accesibilidad
- Evidenciar calidad en desarrollo de software
- Facilitar evaluación objetiva según rúbrica

**Meta final**: Calificación "Excelente" en todas las categorías para obtener 20/20 puntos.

---

**Última actualización**: Enero 2025  
**Versión**: 1.0  
**Autor**: Sistema de Testing Modular para Accessibility Things 