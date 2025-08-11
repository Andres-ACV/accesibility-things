# Diagrama General del Sistema - Accessibility Things

## 🏗️ Diagrama de Arquitectura Completa

```
                                    ACCESSIBILITY THINGS - E-COMMERCE PLATFORM
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                                    USUARIO FINAL                                                                │
│                                              ┌─────────────────────┐                                                        │
│                                              │      NAVEGADOR      │                                                        │
│                                              │   (Chrome, Firefox, │                                                        │
│                                              │   Safari, Edge)     │                                                        │
│                                              │                     │                                                        │
│                                              │ • HTML Rendering    │                                                        │
│                                              │ • JavaScript Engine │                                                        │
│                                              │ • Local Storage     │                                                        │
│                                              │ • Session Storage   │                                                        │
│                                              │ • Accessibility APIs│                                                        │
│                                              └─────────────────────┘                                                        │
└─────────────────────────────────────────────────────────┬───────────────────────────────────────────────────────────────────┘
                                                          │ HTTP/HTTPS
                                                          │ Port 9000
                                                          ▼
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                               CAPA DE PRESENTACIÓN                                                             │
│                                          ┌─────────────────────────┐                                                        │
│                                          │   SERVIDOR FRONTEND     │                                                        │
│                                          │   (start-frontend.py)   │                                                        │
│                                          │                         │                                                        │
│                                          │ • Python HTTP Server    │                                                        │
│                                          │ • Puerto: 9000          │                                                        │
│                                          │ • Servir archivos static│                                                        │
│                                          │ • Headers CORS          │                                                        │
│                                          │ • Headers de seguridad  │                                                        │
│                                          │ • Logging personalizado │                                                        │
│                                          └─────────────────────────┘                                                        │
│                                                          │                                                                   │
│                                                          │ Sirve archivos desde                                             │
│                                                          ▼                                                                   │
│                    ┌─────────────────────────────────────────────────────────────────────────────────────────────┐          │
│                    │                              FRONTEND SPA                                                     │          │
│                    │                                                                                               │          │
│                    │  ┌───────────────────────┐  ┌───────────────────────┐  ┌───────────────────────┐         │          │
│                    │  │     PÁGINAS HTML      │  │     ESTILOS CSS       │  │   MÓDULOS JAVASCRIPT  │         │          │
│                    │  │                       │  │                       │  │                       │         │          │
│                    │  │ • index.html          │  │ • main.css            │  │ • main.js             │         │          │
│                    │  │ • catalogo.html       │  │ • accessibility.css   │  │ • api-service.js      │         │          │
│                    │  │ • carrito.html        │  │                       │  │ • data-manager-       │         │          │
│                    │  │ • detalle.html        │  │ Características:      │  │   optimized.js        │         │          │
│                    │  │ • checkout.html       │  │ • WCAG 2.1/2.2 AA     │  │ • ui-controller.js    │         │          │
│                    │  │ • profile.html        │  │ • Alto contraste      │  │ • accessibility.js    │         │          │
│                    │  │ • login.html          │  │ • Responsive design   │  │                       │         │          │
│                    │  │ • register.html       │  │ • Variables CSS       │  │ Patrones:             │         │          │
│                    │  │ • orden-completada    │  │ • Grid/Flexbox        │  │ • Singleton           │         │          │
│                    │  │ • orderDetail.html    │  │ • Media queries       │  │ • Observer            │         │          │
│                    │  │                       │  │                       │  │ • Strategy            │         │          │
│                    │  │ Características:      │  │                       │  │ • Factory             │         │          │
│                    │  │ • Semántica HTML5     │  │                       │  │ • Command             │         │          │
│                    │  │ • ARIA attributes     │  │                       │  │                       │         │          │
│                    │  │ • Navegación teclado  │  │                       │  │                       │         │          │
│                    │  │ • Skip links          │  │                       │  │                       │         │          │
│                    │  │ • Landmarks           │  │                       │  │                       │         │          │
│                    │  └───────────────────────┘  └───────────────────────┘  └───────────────────────┘         │          │
│                    │                                                                                               │          │
│                    │  ┌───────────────────────┐  ┌───────────────────────┐  ┌───────────────────────┐         │          │
│                    │  │     RECURSOS          │  │      DATOS LOCAL      │  │      PRUEBAS          │         │          │
│                    │  │                       │  │                       │  │                       │         │          │
│                    │  │ • images/             │  │ • productos.json      │  │ • accessibility/      │         │          │
│                    │  │ • assets/images/      │  │ • usuarios.json       │  │ • ui/                 │         │          │
│                    │  │                       │  │                       │  │ • unit/               │         │          │
│                    │  │ Formatos:             │  │ Propósito:            │  │                       │         │          │
│                    │  │ • SVG (accesible)     │  │ • Fallback data       │  │ Tests:                │         │          │
│                    │  │ • WebP (optimizado)   │  │ • Desarrollo local    │  │ • Contraste           │         │          │
│                    │  │ • JPG/PNG             │  │ • Testing             │  │ • Navegación teclado  │         │          │
│                    │  │ • Placeholder SVG     │  │                       │  │ • Carrito funcional   │         │          │
│                    │  └───────────────────────┘  └───────────────────────┘  └───────────────────────┘         │          │
│                    └─────────────────────────────────────────────────────────────────────────────────────────────┘          │
└─────────────────────────────────────────────────────────┬───────────────────────────────────────────────────────────────────┘
                                                          │
                                                          │ Fetch API
                                                          │ HTTP/JSON
                                                          │ Port 8000
                                                          ▼
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                                CAPA DE LÓGICA                                                                  │
│                                          ┌─────────────────────────┐                                                        │
│                                          │    BACKEND API          │                                                        │
│                                          │    (FastAPI)            │                                                        │
│                                          │                         │                                                        │
│                                          │ • Python 3.9+          │                                                        │
│                                          │ • Puerto: 8000          │                                                        │
│                                          │ • API REST              │                                                        │
│                                          │ • Documentación OpenAPI │                                                        │
│                                          │ • Autenticación JWT     │                                                        │
│                                          │ • Validación Pydantic   │                                                        │
│                                          └─────────────────────────┘                                                        │
│                                                          │                                                                   │
│                    ┌─────────────────────────────────────┼─────────────────────────────────────────────┐                    │
│                    │                                     ▼                                             │                    │
│                    │                          ARQUITECTURA EN CAPAS                                    │                    │
│                    │                                                                                   │                    │
│                    │ ┌─────────────────────────────────────────────────────────────────────────────┐ │                    │
│                    │ │                           API LAYER                                         │ │                    │
│                    │ │                                                                             │ │                    │
│                    │ │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐         │ │                    │
│                    │ │  │ access.py   │ │products.py  │ │ orders.py   │ │categories.py│         │ │                    │
│                    │ │  │             │ │             │ │             │ │             │         │ │                    │
│                    │ │  │• Login      │ │• CRUD       │ │• Carrito    │ │• Filtros    │         │ │                    │
│                    │ │  │• Register   │ │• Búsqueda   │ │• Checkout   │ │• Gestión    │   ...   │ │                    │
│                    │ │  │• JWT        │ │• Filtros    │ │• Historial  │ │             │         │ │                    │
│                    │ │  │• Profile    │ │• Rating     │ │             │ │             │         │ │                    │
│                    │ │  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘         │ │                    │
│                    │ └─────────────────────────────────────────────────────────────────────────────┘ │                    │
│                    │                                     │                                             │                    │
│                    │                                     ▼                                             │                    │
│                    │ ┌─────────────────────────────────────────────────────────────────────────────┐ │                    │
│                    │ │                        SERVICE LAYER                                        │ │                    │
│                    │ │                                                                             │ │                    │
│                    │ │  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐             │ │                    │
│                    │ │  │access_service.py│ │product_service  │ │order_service.py │             │ │                    │
│                    │ │  │                 │ │                 │ │                 │             │ │                    │
│                    │ │  │• Autenticación  │ │• Lógica negocio │ │• Procesamiento  │             │ │                    │
│                    │ │  │• Autorización   │ │• Validaciones   │ │• Cálculos       │      ...    │ │                    │
│                    │ │  │• Password hash  │ │• Transformación │ │• Estado ordenes │             │ │                    │
│                    │ │  │• Token gen.     │ │• Paginación     │ │• Notificaciones │             │ │                    │
│                    │ │  └─────────────────┘ └─────────────────┘ └─────────────────┘             │ │                    │
│                    │ └─────────────────────────────────────────────────────────────────────────────┘ │                    │
│                    │                                     │                                             │                    │
│                    │                                     ▼                                             │                    │
│                    │ ┌─────────────────────────────────────────────────────────────────────────────┐ │                    │
│                    │ │                      REPOSITORY LAYER                                       │ │                    │
│                    │ │                                                                             │ │                    │
│                    │ │  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐             │ │                    │
│                    │ │  │access_repository│ │category_repo    │ │role_repository  │             │ │                    │
│                    │ │  │                 │ │                 │ │                 │             │ │                    │
│                    │ │  │• CRUD operations│ │• Query builders │ │• Data access    │             │ │                    │
│                    │ │  │• Query abstrac. │ │• Filtros SQL    │ │• Joins          │      ...    │ │                    │
│                    │ │  │• Data mapping   │ │• Agregaciones   │ │• Transacciones  │             │ │                    │
│                    │ │  │• Error handling │ │• Optimización   │ │                 │             │ │                    │
│                    │ │  └─────────────────┘ └─────────────────┘ └─────────────────┘             │ │                    │
│                    │ └─────────────────────────────────────────────────────────────────────────────┘ │                    │
│                    │                                     │                                             │                    │
│                    │                                     ▼                                             │                    │
│                    │ ┌─────────────────────────────────────────────────────────────────────────────┐ │                    │
│                    │ │                         MODEL LAYER                                         │ │                    │
│                    │ │                                                                             │ │                    │
│                    │ │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │ │                    │
│                    │ │  │  User    │ │ Product  │ │  Order   │ │Category  │ │  Color   │       │ │                    │
│                    │ │  │          │ │          │ │          │ │          │ │          │       │ │                    │
│                    │ │  │• id      │ │• id      │ │• id      │ │• id      │ │• id      │       │ │                    │
│                    │ │  │• email   │ │• name    │ │• number  │ │• name    │ │• name    │  ...  │ │                    │
│                    │ │  │• password│ │• price   │ │• total   │ │• desc    │ │• hex     │       │ │                    │
│                    │ │  │• profile │ │• rating  │ │• status  │ │          │ │          │       │ │                    │
│                    │ │  │• role    │ │• images  │ │• items   │ │          │ │          │       │ │                    │
│                    │ │  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘       │ │                    │
│                    │ │                                                                             │ │                    │
│                    │ │  ┌──────────┐ ┌──────────┐ ┌──────────┐                                 │ │                    │
│                    │ │  │OrderItem │ │ProdColor │ │ProdImage │        Relaciones:               │ │                    │
│                    │ │  │          │ │          │ │          │        • One-to-Many             │ │                    │
│                    │ │  │• quantity│ │• product │ │• url     │        • Many-to-Many            │ │                    │
│                    │ │  │• price   │ │• color   │ │• alt_text│        • Foreign Keys            │ │                    │
│                    │ │  │• rating  │ │          │ │          │        • SQLAlchemy ORM          │ │                    │
│                    │ │  └──────────┘ └──────────┘ └──────────┘                                 │ │                    │
│                    │ └─────────────────────────────────────────────────────────────────────────────┘ │                    │
│                    │                                     │                                             │                    │
│                    │                                     ▼                                             │                    │
│                    │ ┌─────────────────────────────────────────────────────────────────────────────┐ │                    │
│                    │ │                       SCHEMA LAYER (DTOs)                                  │ │                    │
│                    │ │                                                                             │ │                    │
│                    │ │  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐             │ │                    │
│                    │ │  │   Validation    │ │   Request DTOs  │ │  Response DTOs  │             │ │                    │
│                    │ │  │                 │ │                 │ │                 │             │ │                    │
│                    │ │  │• Pydantic       │ │• UserCreate     │ │• UserResponse   │             │ │                    │
│                    │ │  │• Type hints     │ │• ProductCreate  │ │• ProductResponse│             │ │                    │
│                    │ │  │• Field validate │ │• OrderCreate    │ │• OrderResponse  │             │ │                    │
│                    │ │  │• Custom rules   │ │• LoginRequest   │ │• TokenResponse  │             │ │                    │
│                    │ │  │• Error messages │ │                 │ │• ErrorResponse  │             │ │                    │
│                    │ │  └─────────────────┘ └─────────────────┘ └─────────────────┘             │ │                    │
│                    │ └─────────────────────────────────────────────────────────────────────────────┘ │                    │
│                    │                                     │                                             │                    │
│                    │                                     ▼                                             │                    │
│                    │ ┌─────────────────────────────────────────────────────────────────────────────┐ │                    │
│                    │ │                      CONFIG LAYER                                           │ │                    │
│                    │ │                                                                             │ │                    │
│                    │ │  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐             │ │                    │
│                    │ │  │   database.py   │ │   settings.py   │ │     main.py     │             │ │                    │
│                    │ │  │                 │ │                 │ │                 │             │ │                    │
│                    │ │  │• SQLAlchemy     │ │• Environment    │ │• FastAPI app    │             │ │                    │
│                    │ │  │• Connection     │ │• Variables      │ │• Middleware     │             │ │                    │
│                    │ │  │• Session mgmt   │ │• Security keys  │ │• CORS config    │             │ │                    │
│                    │ │  │• Engine config  │ │• DB credentials │ │• Route register │             │ │                    │
│                    │ │  └─────────────────┘ └─────────────────┘ └─────────────────┘             │ │                    │
│                    │ └─────────────────────────────────────────────────────────────────────────────┘ │                    │
│                    └─────────────────────────────────────────────────────────────────────────────────┘                    │
└─────────────────────────────────────────────────────────┬───────────────────────────────────────────────────────────────────┘
                                                          │
                                                          │ SQLAlchemy ORM
                                                          │ PostgreSQL Protocol
                                                          │ Port 5432
                                                          ▼
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                              CAPA DE PERSISTENCIA                                                              │
│                                          ┌─────────────────────────┐                                                        │
│                                          │    BASE DE DATOS        │                                                        │
│                                          │    (PostgreSQL)         │                                                        │
│                                          │                         │                                                        │
│                                          │ • PostgreSQL 14+        │                                                        │
│                                          │ • Puerto: 5432          │                                                        │
│                                          │ • ACID Compliance       │                                                        │
│                                          │ • Índices optimizados   │                                                        │
│                                          │ • Constraints           │                                                        │
│                                          │ • Triggers              │                                                        │
│                                          └─────────────────────────┘                                                        │
│                                                          │                                                                   │
│                    ┌─────────────────────────────────────┼─────────────────────────────────────────────┐                    │
│                    │                                     ▼                                             │                    │
│                    │                              ESQUEMA DE DATOS                                     │                    │
│                    │                                                                                   │                    │
│                    │ ┌─────────────────────────────────────────────────────────────────────────────┐ │                    │
│                    │ │                           TABLAS PRINCIPALES                                 │ │                    │
│                    │ │                                                                             │ │                    │
│                    │ │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐     │ │                    │
│                    │ │  │    users     │ │   products   │ │    orders    │ │  categories  │     │ │                    │
│                    │ │  │              │ │              │ │              │ │              │     │ │                    │
│                    │ │  │ PK: id       │ │ PK: id       │ │ PK: id       │ │ PK: id       │     │ │                    │
│                    │ │  │    email     │ │    name      │ │order_number  │ │    name      │     │ │                    │
│                    │ │  │    password  │ │    price     │ │ total_amount │ │ description  │     │ │                    │
│                    │ │  │    full_name │ │    rating    │ │    status    │ │              │     │ │                    │
│                    │ │  │    phone     │ │    category  │ │   user_id FK │ │              │     │ │                    │
│                    │ │  │    address   │ │   seller FK  │ │              │ │              │     │ │                    │
│                    │ │  │   role_id FK │ │              │ │              │ │              │     │ │                    │
│                    │ │  └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘     │ │                    │
│                    │ └─────────────────────────────────────────────────────────────────────────────┘ │                    │
│                    │                                     │                                             │                    │
│                    │                                     ▼                                             │                    │
│                    │ ┌─────────────────────────────────────────────────────────────────────────────┐ │                    │
│                    │ │                         TABLAS DE RELACIÓN                                  │ │                    │
│                    │ │                                                                             │ │                    │
│                    │ │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐     │ │                    │
│                    │ │  │ order_items  │ │product_colors│ │product_images│ │    roles     │     │ │                    │
│                    │ │  │              │ │              │ │              │ │              │     │ │                    │
│                    │ │  │ PK: id       │ │ PK: id       │ │ PK: id       │ │ PK: id       │     │ │                    │
│                    │ │  │order_id   FK │ │product_id FK │ │product_id FK │ │    name      │     │ │                    │
│                    │ │  │product_id FK │ │color_id   FK │ │    url       │ │ description  │     │ │                    │
│                    │ │  │   quantity   │ │              │ │  alt_text    │ │              │     │ │                    │
│                    │ │  │    price     │ │              │ │              │ │              │     │ │                    │
│                    │ │  │rating_client │ │              │ │              │ │              │     │ │                    │
│                    │ │  └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘     │ │                    │
│                    │ └─────────────────────────────────────────────────────────────────────────────┘ │                    │
│                    │                                     │                                             │                    │
│                    │                                     ▼                                             │                    │
│                    │ ┌─────────────────────────────────────────────────────────────────────────────┐ │                    │
│                    │ │                        ÍNDICES Y OPTIMIZACIÓN                               │ │                    │
│                    │ │                                                                             │ │                    │
│                    │ │  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐             │ │                    │
│                    │ │  │   Índices B-Tree│ │   Constraints   │ │   Performance   │             │ │                    │
│                    │ │  │                 │ │                 │ │                 │             │ │                    │
│                    │ │  │• Primary Keys   │ │• Foreign Keys   │ │• Query plans    │             │ │                    │
│                    │ │  │• Email unique   │ │• Check rules    │ │• Execution time │             │ │                    │
│                    │ │  │• Search fields  │ │• NOT NULL       │ │• Index usage    │             │ │                    │
│                    │ │  │• Join columns   │ │• Unique keys    │ │• Connection pool│             │ │                    │
│                    │ │  └─────────────────┘ └─────────────────┘ └─────────────────┘             │ │                    │
│                    │ └─────────────────────────────────────────────────────────────────────────────┘ │                    │
│                    └─────────────────────────────────────────────────────────────────────────────────┘                    │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘

                                        ┌─────────────────────────────────────────────────┐
                                        │              HERRAMIENTAS DE DESARROLLO          │
                                        │                                                 │
                                        │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐│
                                        │  │   Docker    │ │   Alembic   │ │   Scripts   ││
                                        │  │             │ │             │ │             ││
                                        │  │• Backend    │ │• Migrations │ │• init_db.py ││
                                        │  │• PostgreSQL │ │• Versioning │ │• seed_data  ││
                                        │  │• Volumes    │ │• Rollback   │ │• reset_db   ││
                                        │  │• Networks   │ │• Auto-gen   │ │• start.sh   ││
                                        │  └─────────────┘ └─────────────┘ └─────────────┘│
                                        └─────────────────────────────────────────────────┘
```

---

## 📝 Explicación Detallada de Cada Componente

### 🌐 **USUARIO FINAL**
El punto de entrada del sistema donde los usuarios interactúan con la aplicación a través de navegadores web modernos.

**Componentes:**
- **Navegador Web**: Chrome, Firefox, Safari, Edge con soporte completo para estándares web
- **APIs del Navegador**: localStorage, sessionStorage, Fetch API, Accessibility APIs
- **Tecnologías Asistivas**: Lectores de pantalla, navegación por teclado, zoom

### 🎨 **CAPA DE PRESENTACIÓN**

#### **Servidor Frontend (start-frontend.py)**
Servidor HTTP personalizado desarrollado en Python que sirve los archivos estáticos del frontend.

**Características:**
- **Puerto**: 9000
- **Funcionalidad**: Servir archivos estáticos, headers CORS, headers de seguridad
- **Tecnología**: Python `http.server` con customizaciones
- **Propósito**: Desarrollo local y testing

#### **Frontend SPA (Single Page Application)**
Aplicación web moderna desarrollada con tecnologías estándar web.

**Páginas HTML:**
- `index.html` - Página principal con catálogo destacado
- `catalogo.html` - Búsqueda y filtrado de productos
- `carrito.html` - Gestión del carrito de compras
- `detalle.html` - Vista detallada de productos
- `checkout.html` - Proceso de compra
- `profile.html` - Gestión de perfil de usuario
- `login.html` / `register.html` - Autenticación

**Estilos CSS:**
- `main.css` - Estilos principales del sistema
- `accessibility.css` - Estilos específicos para accesibilidad
- **Características**: WCAG 2.1/2.2 AA, alto contraste, responsive design

**Módulos JavaScript:**
- `main.js` - Orquestador principal (Template Method Pattern)
- `api-service.js` - Comunicación HTTP (Factory Pattern)
- `data-manager-optimized.js` - Gestión de datos (Singleton + Strategy)
- `ui-controller.js` - Control de UI (Observer + Command)
- `accessibility.js` - Controles de accesibilidad

### ⚙️ **CAPA DE LÓGICA**

#### **Backend API (FastAPI)**
API REST desarrollada en Python con FastAPI, implementando una arquitectura en capas.

**Tecnologías:**
- **Framework**: FastAPI (Python 3.9+)
- **Puerto**: 8000
- **Documentación**: OpenAPI/Swagger automática
- **Autenticación**: JWT (JSON Web Tokens)
- **Validación**: Pydantic schemas

#### **Arquitectura en Capas:**

**1. API Layer (Capa de API)**
- **access.py** - Endpoints de autenticación y autorización
- **products.py** - CRUD de productos, búsqueda, filtros
- **orders.py** - Gestión de carrito, checkout, historial
- **categories.py** - Gestión de categorías y filtros
- **colors.py** - Gestión de colores de productos
- **roles.py** - Gestión de roles de usuario

**2. Service Layer (Capa de Servicios)**
- **access_service.py** - Lógica de autenticación, hash de passwords
- **product_service.py** - Lógica de negocio de productos, validaciones
- **order_service.py** - Procesamiento de órdenes, cálculos
- **category_service.py** - Lógica de categorización
- **color_service.py** - Gestión de colores
- **role_service.py** - Gestión de permisos

**3. Repository Layer (Capa de Repositorio)**
- **access_repository.py** - Acceso a datos de usuarios
- **category_repository.py** - Queries de categorías
- **color_repository.py** - Gestión de datos de colores
- **role_repository.py** - Acceso a datos de roles

**4. Model Layer (Capa de Modelos)**
Modelos de dominio que representan las entidades del negocio:
- **User** - Usuarios del sistema
- **Product** - Productos del catálogo
- **Order** - Órdenes de compra
- **OrderItem** - Ítems de las órdenes
- **Category** - Categorías de productos
- **Color** - Colores disponibles
- **ProductColor** - Relación producto-color
- **ProductImage** - Imágenes de productos
- **Role** - Roles de usuario

**5. Schema Layer (DTOs - Data Transfer Objects)**
Esquemas de validación y serialización usando Pydantic:
- **Request DTOs**: UserCreate, ProductCreate, OrderCreate
- **Response DTOs**: UserResponse, ProductResponse, OrderResponse
- **Validation**: Reglas de negocio, tipos de datos, mensajes de error

**6. Config Layer (Capa de Configuración)**
- **database.py** - Configuración SQLAlchemy, gestión de sesiones
- **settings.py** - Variables de entorno, configuración de seguridad
- **main.py** - Aplicación FastAPI, middleware, registro de rutas

### 🗄️ **CAPA DE PERSISTENCIA**

#### **Base de Datos PostgreSQL**
Sistema de gestión de base de datos relacional robusto y escalable.

**Características:**
- **Versión**: PostgreSQL 14+
- **Puerto**: 5432
- **Propiedades**: ACID compliance, transacciones, índices optimizados

#### **Esquema de Datos:**

**Tablas Principales:**
- **users** - Información de usuarios, perfiles, autenticación
- **products** - Catálogo de productos, precios, ratings
- **orders** - Órdenes de compra, estados, totales
- **categories** - Categorías de productos para filtrado

**Tablas de Relación:**
- **order_items** - Ítems específicos en cada orden
- **product_colors** - Colores disponibles por producto
- **product_images** - Múltiples imágenes por producto
- **roles** - Roles y permisos de usuario

**Optimización:**
- **Índices B-Tree**: Campos de búsqueda frecuente
- **Constraints**: Integridad referencial, validaciones
- **Performance**: Planes de consulta optimizados

### 🛠️ **HERRAMIENTAS DE DESARROLLO**

#### **Docker**
Containerización para desarrollo y despliegue:
- **Backend Container**: FastAPI + dependencias
- **PostgreSQL Container**: Base de datos con volúmenes persistentes
- **Docker Compose**: Orquestación de servicios

#### **Alembic**
Sistema de migraciones de base de datos:
- **Versioning**: Control de versiones del esquema
- **Auto-generation**: Generación automática de migraciones
- **Rollback**: Capacidad de revertir cambios

#### **Scripts de Utilidad**
- **init_db.py** - Inicialización de base de datos
- **init_seed.py** - Datos de prueba y desarrollo
- **reset_database.py** - Reinicio completo de la DB
- **start.sh** - Script de inicio para desarrollo

---

## 🔄 **Flujo de Datos Principal**

1. **Usuario** accede desde navegador → **Frontend Server** (Puerto 9000)
2. **Frontend** carga SPA → Ejecuta **JavaScript modules**
3. **JavaScript** realiza peticiones → **Backend API** (Puerto 8000)
4. **API Layer** recibe request → **Service Layer** procesa lógica
5. **Service** consulta → **Repository Layer** → **Database** (Puerto 5432)
6. **Database** retorna datos → **Repository** → **Service** → **API**
7. **API** responde JSON → **Frontend** actualiza **UI**
8. **Usuario** ve resultado en **navegador**

---

## 🎯 **Patrones Arquitectónicos Implementados**

- **Layered Architecture** - Separación clara de responsabilidades
- **Repository Pattern** - Abstracción de acceso a datos
- **Service Layer Pattern** - Lógica de negocio centralizada
- **MVC Adaptado** - Model-View-Controller para frontend
- **Singleton Pattern** - Gestión centralizada de datos
- **Observer Pattern** - Actualizaciones reactivas de UI
- **Factory Pattern** - Creación de objetos y requests
- **Strategy Pattern** - Múltiples fuentes de datos
- **Command Pattern** - Encapsulación de acciones de usuario
