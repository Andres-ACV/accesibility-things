# Accessibility Things - Contexto del Producto

## Propósito del Proyecto

**Accessibility Things** es una plataforma web full-stack especializada que facilita la compra y venta de artículos pensados específicamente para personas con discapacidad, adultos mayores, embarazadas y otros grupos contemplados en la Ley 7600 de Costa Rica.

## Problemática que Resuelve

Las personas con necesidades especiales frecuentemente enfrentan múltiples barreras al momento de adquirir productos adaptados a sus necesidades:

1. **Falta de centralización**: Los productos especializados están dispersos en múltiples plataformas
2. **Limitada accesibilidad**: La mayoría de plataformas de comercio electrónico no cumplen con estándares de accesibilidad
3. **Información insuficiente**: Falta de detalles técnicos y especificaciones para tomar decisiones informadas
4. **Confianza limitada**: Ausencia de espacios especializados que generen confianza en la calidad de los productos
5. **Falta de persistencia**: Necesidad de sistemas robustos que mantengan información de productos, usuarios y órdenes

## Arquitectura de la Solución

### **Stack Tecnológico**
- **Backend**: FastAPI (Python) con PostgreSQL
- **Frontend**: HTML5 + CSS3 + JavaScript ES6+ (consumiendo APIs REST)
- **Base de datos**: PostgreSQL con migraciones Alembic
- **Infraestructura**: Docker y Docker Compose para contenedorización
- **APIs**: Sistema RESTful completo para autenticación, productos, órdenes y categorías

### **Componentes Principales**
1. **Backend API**: Servicios RESTful con autenticación JWT
2. **Base de datos relacional**: PostgreSQL para persistencia robusta
3. **Frontend accesible**: Interfaz que consume APIs manteniendo accesibilidad web
4. **Sistema de contenedores**: Docker para desarrollo y despliegue consistente

## Misión

Crear un espacio inclusivo donde usuarios puedan encontrar, vender y gestionar productos diseñados para distintos tipos de discapacidad, promoviendo tanto la inclusión como la autonomía de las personas con necesidades especiales, con una arquitectura técnica sólida y escalable.

## Visión

Ser la plataforma líder en Latinoamérica para la comercialización de productos de accesibilidad, estableciendo el estándar tanto de inclusión digital como de arquitectura técnica robusta, mejorando la calidad de vida de las personas con discapacidad.

## Público Objetivo

### Cliente sin discapacidad (Cuidador)
- Personas que cuidan familiares con necesidades especiales
- Tutores o cuidadores profesionales
- **Necesidad**: Encontrar productos adaptados de forma rápida y confiable con información persistente

### Cliente con discapacidad
- Personas con discapacidad motora, visual, auditiva o cognitiva
- Adultos mayores con limitaciones funcionales
- **Necesidad**: Acceder autónomamente a un catálogo accesible con datos actualizados en tiempo real

### Vendedor de artículos
- Personas o empresas que fabrican productos especializados
- Emprendedores del sector de tecnología asistiva
- **Necesidad**: Plataforma centralizada para gestionar inventario y contactar compradores

## Valor Diferencial Técnico

1. **Accesibilidad Web**: Cumplimiento estricto de pautas WCAG 2.1/2.2 en frontend
2. **Arquitectura Escalable**: Backend API REST con FastAPI y PostgreSQL
3. **Especialización**: Enfoque exclusivo en productos de accesibilidad
4. **Simplicidad**: Flujos de compra optimizados para usuarios con discapacidad
5. **Confianza**: Sistema de verificación de vendedores y productos con persistencia en BD
6. **Robustez**: Datos persistentes con integridad referencial
7. **Inclusión Social**: Promoción de la autonomía e independencia
8. **Containerización**: Despliegue consistente y escalable con Docker

## Funcionalidades Core Implementadas

### **Sistema de Autenticación**
- Registro y login con JWT tokens
- Roles diferenciados (comprador/vendedor)
- Perfiles de usuario con información de accesibilidad

### **Gestión de Productos**
- CRUD completo de productos con categorías
- Sistema de búsqueda y filtros
- Imágenes y metadatos de accesibilidad

### **Gestión de Órdenes**
- Carritos de compra persistentes
- Órdenes con items detallados
- Historial de compras por usuario

### **Categorías y Colores**
- Sistema de categorización por tipo de discapacidad
- Códigos de colores para identificación visual accesible

## Impacto Social y Técnico Esperado

### **Social**
- Mejorar el acceso a productos de calidad para personas con discapacidad
- Fomentar el emprendimiento inclusivo
- Establecer nuevos estándares de accesibilidad en e-commerce
- Crear una comunidad de apoyo y intercambio de experiencias

### **Técnico**
- Demostrar arquitectura full-stack accesible y escalable
- Establecer patrones de desarrollo inclusivo
- Crear referencia de implementación WCAG 2.1/2.2
- Mostrar integración efectiva de accesibilidad con arquitectura moderna

## Arquitectura de Datos

### **Entidades Principales**
- **Users**: Información de usuarios con preferencias de accesibilidad
- **Products**: Productos con metadatos específicos de accesibilidad
- **Categories**: Clasificación por tipos de discapacidad
- **Colors**: Sistema de colores accesibles para identificación
- **Orders**: Órdenes de compra con items detallados
- **Roles**: Sistema de permisos diferenciados

### **Relaciones Clave**
- Usuario → Múltiples Órdenes
- Orden → Múltiples Items de Productos
- Producto → Categoría y Color
- Usuario → Rol (comprador/vendedor) 