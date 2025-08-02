# System Patterns - Accessibility Things
**Última actualización: Enero 2025 - ARQUITECTURA FULL-STACK**

## 🏗️ ARQUITECTURA TÉCNICA IMPLEMENTADA

### **Patrones de Diseño Aplicados**
- ✅ **Service Layer Pattern** - Servicios backend con lógica de negocio separada
- ✅ **Repository Pattern** - Acceso a datos abstraído con SQLAlchemy ORM
- ✅ **API Gateway Pattern** - FastAPI como punto de entrada único
- ✅ **Dependency Injection** - FastAPI's built-in DI system
- ✅ **Observer Pattern** - Eventos frontend y notificaciones
- ✅ **Factory Pattern** - Creación de componentes UI dinámicos
- ✅ **Adapter Pattern** - Integración entre frontend y backend APIs
- ✅ **Strategy Pattern** - Diferentes tipos de autenticación y validación

## 🔧 COMPONENTES PRINCIPALES BACKEND

### **1. FastAPI Application (Core)**
**Responsabilidad:** Punto de entrada principal y configuración de la aplicación

```python
# app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import auth, products, orders, categories

app = FastAPI(
    title="Accessibility Things API",
    description="API para e-commerce de productos de accesibilidad",
    version="1.0.0"
)

# Configuración CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registro de routers
app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(products.router, prefix="/products", tags=["Products"])
app.include_router(orders.router, prefix="/orders", tags=["Orders"])
app.include_router(categories.router, prefix="/categories", tags=["Categories"])
```

### **2. Service Layer Pattern (Business Logic)**
**Responsabilidad:** Lógica de negocio separada de endpoints y modelos

```python
# app/services/product_service.py
from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.product import Product
from app.schemas.product import ProductCreate, ProductUpdate

class ProductService:
    def __init__(self, db: Session):
        self.db = db
    
    def create_product(self, product_data: ProductCreate) -> Product:
        """Crear un nuevo producto con validación"""
        # Validar categoría y color existen
        category = self.db.query(Category).filter(
            Category.id == product_data.category_id
        ).first()
        if not category:
            raise ValueError("Categoría no encontrada")
        
        # Crear producto
        db_product = Product(**product_data.dict())
        self.db.add(db_product)
        self.db.commit()
        self.db.refresh(db_product)
        
        return db_product
    
    def get_products(self, filters: dict = None, skip: int = 0, limit: int = 100) -> List[Product]:
        """Obtener productos con filtros y paginación"""
        query = self.db.query(Product).filter(Product.active == True)
        
        if filters:
            if filters.get('category_id'):
                query = query.filter(Product.category_id == filters['category_id'])
            
            if filters.get('search'):
                search_term = f"%{filters['search']}%"
                query = query.filter(Product.name.ilike(search_term))
        
        return query.offset(skip).limit(limit).all()
    
    def update_product(self, product_id: int, product_data: ProductUpdate) -> Product:
        """Actualizar producto existente"""
        db_product = self.db.query(Product).filter(Product.id == product_id).first()
        if not db_product:
            raise ValueError("Producto no encontrado")
        
        update_data = product_data.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_product, key, value)
        
        self.db.commit()
        self.db.refresh(db_product)
        return db_product
    
    def delete_product(self, product_id: int) -> bool:
        """Soft delete de producto"""
        db_product = self.db.query(Product).filter(Product.id == product_id).first()
        if not db_product:
            return False
        
        db_product.active = False
        self.db.commit()
        return True
```

### **3. Repository Pattern (Data Access)**
**Responsabilidad:** Abstracción del acceso a datos con SQLAlchemy

```python
# app/models/product.py
from sqlalchemy import Column, Integer, String, Text, Numeric, ForeignKey, Boolean, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

class Product(Base):
    __tablename__ = "products"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)
    description = Column(Text)
    price = Column(Numeric(10, 2), nullable=False)
    stock = Column(Integer, default=0)
    active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Foreign Keys
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False)
    color_id = Column(Integer, ForeignKey("colors.id"), nullable=False)
    
    # Relationships
    category = relationship("Category", back_populates="products")
    color = relationship("Color", back_populates="products")
    order_items = relationship("OrderItem", back_populates="product")
```

### **4. Authentication Service (JWT)**
**Responsabilidad:** Gestión de autenticación y autorización

```python
# app/services/auth_service.py
from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from app.models.user import User
from app.schemas.user import UserCreate

class AuthService:
    def __init__(self, db: Session):
        self.db = db
        self.pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
        self.SECRET_KEY = "your-secret-key-here"
        self.ALGORITHM = "HS256"
        self.ACCESS_TOKEN_EXPIRE_MINUTES = 30
    
    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        return self.pwd_context.verify(plain_password, hashed_password)
    
    def get_password_hash(self, password: str) -> str:
        return self.pwd_context.hash(password)
    
    def create_access_token(self, data: dict, expires_delta: Optional[timedelta] = None):
        to_encode = data.copy()
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(minutes=15)
        
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, self.SECRET_KEY, algorithm=self.ALGORITHM)
        return encoded_jwt
    
    def authenticate_user(self, email: str, password: str) -> Optional[User]:
        user = self.db.query(User).filter(User.email == email).first()
        if not user:
            return None
        if not self.verify_password(password, user.hashed_password):
            return None
        return user
    
    def register_user(self, user_data: UserCreate) -> User:
        # Verificar que el email no exista
        existing_user = self.db.query(User).filter(User.email == user_data.email).first()
        if existing_user:
            raise ValueError("Email ya registrado")
        
        # Crear nuevo usuario
        hashed_password = self.get_password_hash(user_data.password)
        db_user = User(
            email=user_data.email,
            phone=user_data.phone,
            hashed_password=hashed_password,
            role_id=1  # Default: buyer role
        )
        
        self.db.add(db_user)
        self.db.commit()
        self.db.refresh(db_user)
        
        return db_user
```

### **5. API Router Pattern (Endpoints)**
**Responsabilidad:** Definición de endpoints RESTful con validación

```python
# app/api/products.py
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.services.product_service import ProductService
from app.schemas.product import Product, ProductCreate, ProductUpdate
from app.api.dependencies import get_current_user

router = APIRouter()

@router.get("/", response_model=List[Product])
async def get_products(
    category_id: Optional[int] = Query(None),
    search: Optional[str] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """Obtener productos con filtros opcionales"""
    service = ProductService(db)
    filters = {}
    if category_id:
        filters['category_id'] = category_id
    if search:
        filters['search'] = search
    
    products = service.get_products(filters, skip, limit)
    return products

@router.post("/", response_model=Product, status_code=201)
async def create_product(
    product_data: ProductCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Crear nuevo producto (solo vendedores)"""
    if current_user.role.name != "seller":
        raise HTTPException(status_code=403, detail="Solo vendedores pueden crear productos")
    
    try {
        service = ProductService(db)
        product = service.create_product(product_data)
        return product
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.put("/{product_id}", response_model=Product)
async def update_product(
    product_id: int,
    product_data: ProductUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Actualizar producto existente"""
    service = ProductService(db)
    try {
        product = service.update_product(product_id, product_data)
        return product
    } catch (ValueError as e) {
        raise HTTPException(status_code=404, detail=str(e))
```

## 🔄 PATRONES DE INTEGRACIÓN FRONTEND-BACKEND

### **1. API Client Pattern (Frontend)**
**Responsabilidad:** Abstracción de llamadas HTTP al backend

```javascript
// js/api-service.js
class APIService {
    constructor() {
        this.baseURL = 'http://localhost:8000';
        this.token = localStorage.getItem('accessToken');
    }
    
    async makeRequest(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...(this.token && { 'Authorization': `Bearer ${this.token}` }),
                ...options.headers
            },
            ...options
        };
        
        try {
            const response = await fetch(url, config);
            
            if (!response.ok) {
                if (response.status === 401) {
                    this.handleUnauthorized();
                    throw new Error('No autorizado');
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                return await response.json();
            }
            return await response.text();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }
    
    // Authentication methods
    async register(userData) {
        const response = await this.makeRequest('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
        
        if (response.access_token) {
            this.setToken(response.access_token);
        }
        
        return response;
    }
    
    async login(credentials) {
        const response = await this.makeRequest('/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams(credentials)
        });
        
        if (response.access_token) {
            this.setToken(response.access_token);
        }
        
        return response;
    }
    
    setToken(token) {
        this.token = token;
        localStorage.setItem('accessToken', token);
    }
    
    clearToken() {
        this.token = null;
        localStorage.removeItem('accessToken');
    }
    
    handleUnauthorized() {
        this.clearToken();
        window.location.href = '/login.html';
    }
}
```

### **2. Hybrid Data Management Pattern**
**Responsabilidad:** Gestión de datos con fallback a localStorage

```javascript
// js/data-manager-optimized.js
class DataManager {
    constructor() {
        this.apiService = new APIService();
        this.fallbackToLocalStorage = true;
        this.currentUser = null;
        this.productos = [];
        this.carrito = [];
    }
    
    async init() {
        try {
            // Intentar cargar desde backend primero
            await this.loadFromBackend();
            this.dataSource = 'backend';
        } catch (error) {
            console.warn('Backend no disponible, usando localStorage:', error);
            if (this.fallbackToLocalStorage) {
                this.loadFromLocalStorage();
                this.dataSource = 'localStorage';
            }
        }
        
        // Cargar sesión actual
        await this.loadCurrentUser();
    }
    
    async loadFromBackend() {
        try {
            // Cargar productos desde API
            const productsResponse = await this.apiService.getProducts();
            this.productos = Array.isArray(productsResponse) ? productsResponse : productsResponse.data || [];
            
            // Cargar categorías
            const categoriesResponse = await this.apiService.getCategories();
            this.categorias = Array.isArray(categoriesResponse) ? categoriesResponse : categoriesResponse.data || [];
            
            console.log('Datos cargados desde backend exitosamente');
            return true;
        } catch (error) {
            console.error('Error loading from backend:', error);
            throw error;
        }
    }
    
    loadFromLocalStorage() {
        // Fallback a datos locales
        const savedProducts = localStorage.getItem('accessibility-things-productos');
        if (savedProducts) {
            this.productos = JSON.parse(savedProducts);
        }
        
        const savedCart = localStorage.getItem('accessibility-things-carrito');
        if (savedCart) {
            this.carrito = JSON.parse(savedCart);
        }
    }
    
    async syncWithBackend() {
        if (this.dataSource === 'localStorage' && this.currentUser) {
            try {
                // Sincronizar carrito con órdenes del backend
                if (this.carrito.length > 0) {
                    await this.syncCartWithBackend();
                }
                
                // Recargar datos desde backend
                await this.loadFromBackend();
                this.dataSource = 'backend';
            } catch (error) {
                console.error('Error syncing with backend:', error);
            }
        }
    }
}
```

### **3. State Management Pattern (Frontend)**
**Responsabilidad:** Gestión centralizada del estado de la aplicación

```javascript
// js/state-manager.js
class StateManager {
    constructor() {
        this.state = {
            user: null,
            products: [],
            cart: [],
            filters: {},
            ui: {
                loading: false,
                error: null,
                notifications: []
            }
        };
        
        this.listeners = new Map();
    }
    
    // Observer Pattern para cambios de estado
    subscribe(key, callback) {
        if (!this.listeners.has(key)) {
            this.listeners.set(key, []);
        }
        this.listeners.get(key).push(callback);
    }
    
    notify(key, value) {
        if (this.listeners.has(key)) {
            this.listeners.get(key).forEach(callback => callback(value));
        }
    }
    
    // Setters que notifican cambios
    setUser(user) {
        this.state.user = user;
        this.notify('user', user);
    }
    
    setProducts(products) {
        this.state.products = products;
        this.notify('products', products);
    }
    
    setLoading(loading) {
        this.state.ui.loading = loading;
        this.notify('loading', loading);
    }
    
    setError(error) {
        this.state.ui.error = error;
        this.notify('error', error);
    }
    
    addNotification(notification) {
        this.state.ui.notifications.push({
            id: Date.now(),
            ...notification
        });
        this.notify('notifications', this.state.ui.notifications);
    }
    
    removeNotification(id) {
        this.state.ui.notifications = this.state.ui.notifications.filter(n => n.id !== id);
        this.notify('notifications', this.state.ui.notifications);
    }
}
```

## 🗄️ PATRONES DE BASE DE DATOS

### **1. Migration Pattern (Alembic)**
**Responsabilidad:** Gestión de cambios en esquema de base de datos

```python
# alembic/versions/0001_initial_tables.py
"""Initial tables

Revision ID: 0001
Revises: 
Create Date: 2025-01-15 10:00:00
"""
from alembic import op
import sqlalchemy as sa

# revision identifiers
revision = '0001'
down_revision = None
branch_labels = None
depends_on = None

def upgrade():
    # Crear tabla roles
    op.create_table('roles',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(length=50), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('name')
    )
    
    # Crear tabla usuarios
    op.create_table('users',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('email', sa.String(length=255), nullable=False),
        sa.Column('phone', sa.String(length=20), nullable=True),
        sa.Column('hashed_password', sa.String(length=255), nullable=False),
        sa.Column('role_id', sa.Integer(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.ForeignKeyConstraint(['role_id'], ['roles.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    
    # Insertar roles por defecto
    op.execute("""
        INSERT INTO roles (name, description) VALUES 
        ('buyer', 'Comprador regular'),
        ('seller', 'Vendedor de productos')
    """)

def downgrade():
    op.drop_table('users')
    op.drop_table('roles')
```

### **2. Seeding Pattern**
**Responsabilidad:** Inicialización de datos de prueba y configuración

```python
# init_seed.py
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models import Role, Category, Color, User, Product
from app.services.auth_service import AuthService

def seed_categories():
    db = SessionLocal()
    
    categories_data = [
        {"id": 1, "name": "Movilidad", "accessibility_type": "motor"},
        {"id": 2, "name": "Visual", "accessibility_type": "visual"},
        {"id": 3, "name": "Auditiva", "accessibility_type": "auditory"},
        {"id": 4, "name": "Cognitiva", "accessibility_type": "cognitive"}
    ]
    
    for cat_data in categories_data:
        existing = db.query(Category).filter(Category.id == cat_data['id']).first()
        if not existing:
            category = Category(**cat_data)
            db.add(category)
    
    db.commit()
    db.close()

def seed_products():
    db = SessionLocal()
    
    products_data = [
        {
            "name": "Silla de Ruedas Manual",
            "description": "Silla de ruedas ligera y plegable para uso diario",
            "price": 185000.00,
            "category_id": 1,
            "color_id": 1,
            "stock": 10
        },
        {
            "name": "Bastón Blanco Plegable",
            "description": "Bastón de movilidad para personas con discapacidad visual",
            "price": 25000.00,
            "category_id": 2,
            "color_id": 2,
            "stock": 15
        }
    ]
    
    for prod_data in products_data:
        existing = db.query(Product).filter(Product.name == prod_data['name']).first()
        if not existing:
            product = Product(**prod_data)
            db.add(product)
    
    db.commit()
    db.close()

def main():
    print("Iniciando seed de datos...")
    seed_categories()
    seed_products()
    print("Seed completado exitosamente")

if __name__ == "__main__":
    main()
```

## ♿ PATRONES DE ACCESIBILIDAD PRESERVADOS

### **1. Progressive Enhancement Pattern**
**Responsabilidad:** Funcionalidad básica sin JavaScript, mejoras incrementales

```javascript
// js/accessibility-manager.js
class AccessibilityManager {
    constructor() {
        this.features = {
            highContrast: false,
            fontSize: 'normal',
            screenReader: false,
            keyboardNavigation: true
        };
        
        this.init();
    }
    
    init() {
        // Cargar preferencias guardadas
        this.loadPreferences();
        
        // Configurar controles de accesibilidad
        this.setupAccessibilityControls();
        
        // Configurar navegación por teclado
        this.setupKeyboardNavigation();
        
        // Configurar soporte para lectores de pantalla
        this.setupScreenReaderSupport();
        
        // Detectar preferencias del sistema
        this.detectSystemPreferences();
    }
    
    setupAccessibilityControls() {
        const controls = document.querySelector('.accessibility-controls');
        if (!controls) return;
        
        // Toggle alto contraste
        const contrastBtn = controls.querySelector('#toggle-contrast');
        if (contrastBtn) {
            contrastBtn.addEventListener('click', () => this.toggleHighContrast());
        }
        
        // Toggle tamaño de fuente
        const fontBtn = controls.querySelector('#toggle-font-size');
        if (fontBtn) {
            fontBtn.addEventListener('click', () => this.toggleFontSize());
        }
    }
    
    toggleHighContrast() {
        this.features.highContrast = !this.features.highContrast;
        document.body.classList.toggle('high-contrast', this.features.highContrast);
        
        // Anunciar cambio a lectores de pantalla
        this.announceToScreenReader(
            this.features.highContrast 
                ? 'Modo de alto contraste activado' 
                : 'Modo de alto contraste desactivado'
        );
        
        // Guardar preferencia
        this.savePreferences();
    }
    
    announceToScreenReader(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = message;
        
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }
    
    detectSystemPreferences() {
        // Detectar preferencia de movimiento reducido
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.body.classList.add('reduced-motion');
        }
        
        // Detectar preferencia de alto contraste
        if (window.matchMedia('(prefers-contrast: high)').matches) {
            this.features.highContrast = true;
            document.body.classList.add('high-contrast');
        }
    }
}
```

### **2. ARIA Enhancement Pattern**
**Responsabilidad:** Mejoras dinámicas de accesibilidad con ARIA

```javascript
// js/aria-enhancer.js
class ARIAEnhancer {
    static enhanceProductCard(element, product) {
        // Establecer roles y labels
        element.setAttribute('role', 'article');
        element.setAttribute('aria-labelledby', `product-${product.id}-title`);
        
        // Establecer título con ID único
        const title = element.querySelector('h3');
        if (title) {
            title.id = `product-${product.id}-title`;
        }
        
        // Mejorar botón de agregar al carrito
        const addButton = element.querySelector('.add-to-cart');
        if (addButton) {
            addButton.setAttribute('aria-describedby', `product-${product.id}-description`);
            addButton.setAttribute('aria-label', `Agregar ${product.name} al carrito por ${product.price} colones`);
        }
        
        // Mejorar información de precio
        const price = element.querySelector('.product-price');
        if (price) {
            price.setAttribute('aria-label', `Precio ${product.price} colones`);
        }
    }
    
    static enhanceFormField(field, label) {
        const fieldId = field.id || `field-${Date.now()}`;
        field.id = fieldId;
        
        if (label) {
            label.setAttribute('for', fieldId);
        }
        
        // Agregar ARIA attributes según el tipo
        if (field.required) {
            field.setAttribute('aria-required', 'true');
        }
        
        // Setup validación en tiempo real
        field.addEventListener('blur', function() {
            ARIAEnhancer.validateField(this);
        });
    }
    
    static validateField(field) {
        const isValid = field.checkValidity();
        const errorId = `${field.id}-error`;
        
        // Remover error anterior
        const existingError = document.getElementById(errorId);
        if (existingError) {
            existingError.remove();
        }
        
        if (!isValid) {
            // Crear mensaje de error
            const errorMsg = document.createElement('div');
            errorMsg.id = errorId;
            errorMsg.className = 'error-message';
            errorMsg.setAttribute('role', 'alert');
            errorMsg.textContent = field.validationMessage;
            
            // Insertar después del campo
            field.parentNode.insertBefore(errorMsg, field.nextSibling);
            
            // Establecer aria-describedby
            field.setAttribute('aria-describedby', errorId);
            field.setAttribute('aria-invalid', 'true');
        } else {
            field.removeAttribute('aria-describedby');
            field.removeAttribute('aria-invalid');
        }
    }
}
```

---

## 🏆 ARQUITECTURA FINAL CONSEGUIDA

### **✅ Patrones Implementados**
- **Backend Patterns:** Service Layer, Repository, API Gateway, Dependency Injection
- **Frontend Patterns:** API Client, State Management, Progressive Enhancement, Observer
- **Data Patterns:** Migration, Seeding, ORM Relations, Transaction Management
- **Security Patterns:** JWT Authentication, Role-based Access, Input Validation
- **Accessibility Patterns:** ARIA Enhancement, Keyboard Navigation, Screen Reader Support

### **🎯 Características Arquitecturales**
- **Scalable:** Servicios separados y containerizados
- **Maintainable:** Código modular con responsabilidades claras
- **Secure:** JWT + SQL injection prevention + CORS configurado
- **Accessible:** WCAG 2.1 AA compliance preservado en nueva arquitectura
- **Robust:** Error handling + fallbacks + comprehensive testing
- **Modern:** Async/await + Type hints + API-first approach

### **🔄 Integration Patterns**
- **API-First:** Frontend consume APIs REST del backend
- **Hybrid Data:** Backend primario con fallback a localStorage
- **Progressive Sync:** Sincronización automática cuando backend disponible
- **Token Management:** JWT con refresh automático
- **Error Boundaries:** Manejo elegante de errores de conectividad

**Arquitectura full-stack sólida, escalable y accesible implementada exitosamente** 🚀 