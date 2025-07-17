# API Endpoints Documentation

## Autenticación

### POST /auth/register
Registrar un nuevo usuario
```json
{
  "email": "usuario@ejemplo.com",
  "password": "contraseña123",
  "full_name": "Nombre Completo"
}
```

### POST /auth/login
Iniciar sesión
```json
{
  "email": "usuario@ejemplo.com",
  "password": "contraseña123"
}
```

### POST /auth/refresh
Renovar token de acceso
```json
{
  "refresh_token": "token_refresh"
}
```

## Productos

### GET /products
Obtener lista de productos
- Query params:
  - `skip`: Número de registros a saltar (default: 0)
  - `limit`: Número máximo de registros (default: 100, max: 100)
  - `category_id`: Filtrar por categoría (opcional)

### GET /products/search
Buscar productos por nombre o descripción
- Query params:
  - `q`: Término de búsqueda (requerido)
  - `skip`: Número de registros a saltar (default: 0)
  - `limit`: Número máximo de registros (default: 100, max: 100)

### GET /products/{product_id}
Obtener un producto específico por ID

### POST /products
Crear un nuevo producto
```json
{
  "name": "Producto Ejemplo",
  "description": "Descripción del producto",
  "price": "29.99",
  "category_id": 1,
  "seller_id": 1
}
```

### PUT /products/{product_id}
Actualizar un producto
```json
{
  "name": "Nuevo Nombre",
  "price": "39.99",
  "is_active": true
}
```

### DELETE /products/{product_id}
Eliminar un producto

## Categorías

### GET /categories
Obtener lista de categorías
- Query params:
  - `skip`: Número de registros a saltar (default: 0)
  - `limit`: Número máximo de registros (default: 100, max: 100)

### GET /categories/{category_id}
Obtener una categoría específica por ID

### POST /categories
Crear una nueva categoría
```json
{
  "name": "Electrónicos",
  "description": "Productos electrónicos y tecnología"
}
```

### PUT /categories/{category_id}
Actualizar una categoría
```