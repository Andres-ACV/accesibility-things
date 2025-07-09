# Accessibility Things - Progreso del Proyecto Universitario

## Estado General del Proyecto

**Tipo:** Proyecto Universitario - Avance Proyecto Diseño de Software (Prototipo Funcional)  
**Fecha de entrega:** Junio 23, 2025 11:45 PM  
**Valor:** 50% del curso - 20 puntos total  
**Progreso Global:** 30% Completado (Documentación lista, iniciando desarrollo)  
**Fase Actual:** Desarrollo del Prototipo según Rúbrica  

---

## ✅ Trabajo Completado

### 📋 Documentación y Análisis (100% Completado)

#### Documentación del Proyecto
- **Estado:** ✅ Completado
- **Descripción:** Documentación completa alineada con rúbrica universitaria
- **Archivos creados:**
  - `productContext.md` - Contexto del proyecto de e-commerce accesible
  - `activeContext.md` - Criterios de rúbrica y casos de uso definidos
  - `systemPatterns.md` - Patrones de accesibilidad y diseño
  - `techContext.md` - Stack HTML/CSS/JS y herramientas
  - `progress.md` - Este archivo de seguimiento
- **Valor para rúbrica:** Base para aplicar patrones arquitectónicos y metodologías

#### Análisis Previo (Completado en fases anteriores)
- **Estado:** ✅ Completado
- **Análisis competitivo:** 8 plataformas de accesibilidad evaluadas
- **Análisis de usuarios:** 14 personas encuestadas, 3 perfiles definidos
- **Mockups de referencia:** Disponibles en Figma para guía visual
- **Valor para rúbrica:** Fundamento para decisiones de diseño de software

### 🎯 Casos de Uso Identificados (Definición Completada)

#### Caso de Uso 1: Registro y Autenticación
- **Estado:** ✅ Definido - ⏳ Por implementar
- **Completitud requerida:** Formularios de registro/login con validaciones
- **Persistencia requerida:** localStorage para datos de usuario
- **Comprensibilidad requerida:** Proceso claro de 2-3 pasos

#### Caso de Uso 2: Navegación y Búsqueda de Productos
- **Estado:** ✅ Definido - ⏳ Por implementar
- **Completitud requerida:** Catálogo con filtros por categoría/precio
- **Persistencia requerida:** Filtros aplicados se mantienen
- **Comprensibilidad requerida:** Búsqueda intuitiva con resultados claros

#### Caso de Uso 3: Gestión de Carrito (Principal)
- **Estado:** ✅ Definido - ⏳ Por implementar
- **Completitud requerida:** Agregar/modificar/eliminar productos
- **Persistencia requerida:** Carrito se mantiene entre sesiones
- **Comprensibilidad requerida:** Proceso de compra paso a paso

#### Caso de Uso 4: Gestión de Productos (Vendedores)
- **Estado:** ✅ Definido - ⏳ Por implementar
- **Completitud requerida:** CRUD completo de productos
- **Persistencia requerida:** Productos con metadatos e imágenes
- **Comprensibilidad requerida:** Interface clara para vendedores

---

## ⏳ Roadmap para Cumplir la Rúbrica (6 Semanas Restantes)

### 🎯 Distribución de Puntos según Rúbrica

| Categoría | Peso | Puntos | Criterios de "Excelente" |
|-----------|------|---------|--------------------------|
| **Interfaz Gráfica** | 24% | 4.8 pts | Estética agradable + 0 errores ortográficos + flujo claro |
| **Accesibilidad** | 28% | 5.6 pts | Alto contraste + teclado + alt text + lector pantalla |
| **Caso de Uso 1** | 12% | 2.4 pts | Registro/Auth: Completitud + Persistencia + Comprensibilidad |
| **Caso de Uso 2** | 12% | 2.4 pts | Búsqueda: Completitud + Persistencia + Comprensibilidad |
| **Caso de Uso 3** | 12% | 2.4 pts | Carrito: Completitud + Persistencia + Comprensibilidad |
| **Caso de Uso 4** | 12% | 2.4 pts | CRUD Productos: Completitud + Persistencia + Comprensibilidad |
| **TOTAL** | **100%** | **20 pts** | Meta: Excelente (3 puntos) en todas las categorías |

---

## 📅 Cronograma Detallado por Semana

### 🏗️ Semana 1-2: Interfaz Gráfica Base (Enfoque: 24% de la nota)

**Objetivo:** Establecer la base estética y flujo de navegación

#### Día 1-2: Setup del Proyecto
- **Tarea:** Estructura de carpetas y archivos base
  ```
  accessibility-things/
  ├── index.html, catalogo.html, carrito.html, perfil.html
  ├── css/main.css, css/accessibility.css
  ├── js/main.js, js/carrito.js, js/accessibility.js
  ├── data/productos.json, data/usuarios.json
  └── assets/images/
  ```
- **Criterio rúbrica:** Base para implementar estética y flujo

#### Día 3-5: Estética (10% de la nota total)
- **Tarea:** Implementar principios de diseño
  - Variables CSS para colores con contraste WCAG AA
  - Tipografía legible (mínimo 16px) y jerarquía clara
  - Botones con espaciado correcto y alineación consistente
  - Layout responsivo usando flexbox/grid
- **Meta:** "Estética agradable que integra principios de diseño"

#### Día 6-7: Flujo de Funcionalidades (8% de la nota total)
- **Tarea:** Navegación clara e intuitiva
  - Menú principal lógico y consistente
  - Breadcrumbs y orientación visual
  - Enlaces entre páginas funcionando
  - Proceso de navegación comprensible
- **Meta:** "Navegación clara donde todas las opciones son fáciles de ubicar"

#### Día 8-10: Control de Ortografía (6% de la nota total)
- **Tarea:** Revisión exhaustiva de TODOS los textos
  - Corrector automático + revisión manual
  - Lista de verificación por página
  - Double-check en formularios y mensajes
- **Meta:** "0 faltas de ortografía en toda la interfaz"

### ⚡ Semana 3-4: Accesibilidad (Enfoque: 28% de la nota)

**Objetivo:** Implementar todos los criterios de accesibilidad para obtener máxima puntuación

#### Semana 3: Alto Contraste + Navegación por Teclado (14%)
- **Alto Contraste (7% de la nota):**
  - Botón toggle para modo alto contraste
  - CSS variables para intercambio de colores
  - Persistencia en localStorage
  - Testing con Color Contrast Analyzer
  - **Meta:** "Control implementado y funcional"

- **Navegación por Teclado (7% de la nota):**
  - Tab order lógico en TODOS los elementos
  - Skip links para saltar navegación
  - Estados de foco visibles y distintivos
  - Testing completo usando solo teclado
  - **Meta:** "100% funcional en orden correcto"

#### Semana 4: Alt Text + Lector de Pantalla (14%)
- **Descripción de Imágenes (7% de la nota):**
  - Sistema para subir imágenes de productos
  - Campo obligatorio para texto alternativo
  - Interface para editar alt text existente
  - Validaciones de longitud y calidad
  - **Meta:** "Texto alternativo completo y modificable"

- **Lector de Pantalla (7% de la nota):**
  - Testing exhaustivo con NVDA (gratuito)
  - Corrección de etiquetas ARIA
  - Mensajes de estado para cambios dinámicos
  - Anuncios apropiados para SPA behavior
  - **Meta:** "100% de acceso sin problemas"

### 🛠️ Semana 5: Casos de Uso 1 y 2 (24% de la nota)

#### Caso de Uso 1: Registro y Autenticación (12% = 2.4 puntos)
- **Completitud (4%):** Formularios funcionando al 100%
  - Registro con validaciones (nombre, email, contraseña)
  - Login con autenticación
  - Recuperación de contraseña simulada
- **Persistencia (4%):** localStorage para usuarios
  - Datos de usuario guardados correctamente
  - Sesión persistente entre recargas
  - Manejo de múltiples usuarios
- **Comprensibilidad (4%):** Proceso claro
  - Máximo 3 pasos para registro completo
  - Mensajes de feedback claros
  - Navegación intuitiva entre login/registro

#### Caso de Uso 2: Navegación y Búsqueda (12% = 2.4 puntos)
- **Completitud (4%):** Catálogo con filtros funcionando
  - Lista de productos desde JSON
  - Filtros por categoría, precio, tipo de discapacidad
  - Buscador con resultados en tiempo real
- **Persistencia (4%):** Filtros y búsquedas se mantienen
  - Filtros aplicados persisten al navegar
  - Historial de búsquedas guardado
- **Comprensibilidad (4%):** Búsqueda intuitiva
  - Resultados claros y ordenados
  - Feedback de "no resultados"

### 🛒 Semana 6: Casos de Uso 3 y 4 (24% de la nota)

#### Caso de Uso 3: Carrito de Compras - PRINCIPAL (12% = 2.4 puntos)
- **Completitud (4%):** Carrito funcionando al 100%
  - Agregar productos con cantidades
  - Modificar cantidades existentes
  - Eliminar productos del carrito
  - Calcular totales correctamente
- **Persistencia (4%):** Carrito entre sesiones
  - localStorage mantiene carrito
  - Recuperación después de cerrar navegador
  - Sincronización con usuario loggeado
- **Comprensibilidad (4%):** Proceso paso a paso
  - Visual feedback al agregar productos
  - Proceso de checkout claro (max 3 pasos)
  - Confirmación de pedido entendible

#### Caso de Uso 4: CRUD de Productos (12% = 2.4 puntos)
- **Completitud (4%):** CRUD completo funcionando
  - Crear productos con todos los campos
  - Leer/listar productos del vendedor
  - Actualizar productos existentes
  - Eliminar productos
- **Persistencia (4%):** Datos precisos y accesibles
  - Productos guardados con metadatos completos
  - Imágenes asociadas correctamente
  - Datos recuperables y editables
- **Comprensibilidad (4%):** Interface clara
  - Formulario de producto intuitivo
  - Listado organizado para gestión
  - Acciones claras (editar/eliminar)

---

## 🎯 Criterios de Éxito por Categoría

### ✅ Interfaz Gráfica (24% - 4.8 puntos)
- [ ] **Estética agradable** que integra principios de colores, ordenamiento y alineación
- [ ] **0 faltas de ortografía** en toda la interfaz
- [ ] **Flujo de navegación claro** donde todas las opciones son fáciles de ubicar

### ✅ Accesibilidad (28% - 5.6 puntos)  
- [ ] **Control de alto contraste** implementado y funcional en toda la app
- [ ] **Navegación por teclado** 100% funcional en orden correcto
- [ ] **Texto alternativo** completo y modificable para todos los recursos
- [ ] **Lector de pantalla** con 100% de acceso sin problemas

### ✅ Funcionalidades (48% - 9.6 puntos)
- [ ] **Caso 1 - Auth:** Completitud + Persistencia + Comprensibilidad = 2.4 pts
- [ ] **Caso 2 - Búsqueda:** Completitud + Persistencia + Comprensibilidad = 2.4 pts  
- [ ] **Caso 3 - Carrito:** Completitud + Persistencia + Comprensibilidad = 2.4 pts
- [ ] **Caso 4 - CRUD:** Completitud + Persistencia + Comprensibilidad = 2.4 pts

---

## 📋 Checklist Final para Entrega

### Pre-entrega (Semana 6)
- [ ] Testing completo de accesibilidad con NVDA
- [ ] Validación HTML/CSS sin errores
- [ ] Verificación de contraste con herramientas automáticas  
- [ ] Prueba de todos los casos de uso por persona externa
- [ ] Revisión final de ortografía
- [ ] Screenshots de cada criterio funcionando

### Meta Final
**20/20 puntos** - Calificación "Excelente" en todas las categorías
- Documentación de usuario finalizada

---

## 📝 Notas de Desarrollo

### Lessons Learned
1. **Figma como herramienta**: Excelente para validación temprana de flujos
2. **Análisis de usuarios**: Crítico para priorizar funcionalidades correctas
3. **Documentación previa**: Acelera significativamente la implementación

### Decisiones Pendientes
- [ ] Definir estrategia de datos de prueba
- [ ] Seleccionar herramienta específica de testing A11y
- [ ] Establecer pipeline de CI/CD con validaciones

### Recursos Adicionales Necesarios
- Consulta con usuarios reales con discapacidad para validación
- Revisión por experto en accesibilidad antes del lanzamiento
- Testing en dispositivos reales (no solo emuladores)

---

**Última actualización:** Enero 2025  
**Responsable:** Equipo de desarrollo Accessibility Things  
**Próxima revisión:** Al completar Hito 1 