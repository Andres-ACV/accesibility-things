# Implementación del Campo Phone en el Backend

## 📋 Resumen

Se ha implementado exitosamente el campo `phone` en el sistema de usuarios del backend, siguiendo las mejores prácticas de desarrollo y manteniendo la compatibilidad con el código existente.

## ✅ Cambios Implementados

### 1. Modelo de Usuario (`app/models/user.py`)

**Campo agregado:**
```python
phone = Column(String, nullable=True)
```

**Ubicación:** Después del campo `email` y antes de `address`

**Tipo de dato:** `String` (VARCHAR en la base de datos)
**Restricciones:** `nullable=True` (campo opcional)

### 2. Esquemas de Usuario (`app/schemas/user.py`)

**Esquema UserBase actualizado:**
```python
class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None
    phone: Optional[str] = None  # ✅ NUEVO
    address: Optional[str] = None
    city: Optional[str] = None
```

**Esquema UserUpdate actualizado:**
```python
class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    phone: Optional[str] = None  # ✅ NUEVO
    address: Optional[str] = None
    city: Optional[str] = None
```

### 3. Repositorio de Acceso (`app/repositories/access_repository.py`)

**Método create_user actualizado:**
```python
db_user = User(
    email=user_data.email,
    full_name=user_data.full_name,
    phone=user_data.phone,  # ✅ NUEVO
    address=user_data.address,
    city=user_data.city,
    hashed_password=hashed_password,
    role_id=user_data.role_id
)
```

### 4. Servicio de Acceso (`app/services/access_service.py`)

**Método get_user_profile_with_role actualizado:**
```python
user_data = {
    "id": user.id,
    "email": user.email,
    "full_name": user.full_name,
    "phone": user.phone,  # ✅ NUEVO
    "address": user.address,
    "city": user.city,
    "role_id": user.role_id,
    "role_name": user.role.name if user.role else None,
    "is_active": user.is_active,
    "is_verified": user.is_verified,
    "created_at": user.created_at,
    "updated_at": user.updated_at
}
```

## 🔄 Migración de Base de Datos

### Archivo de Migración Generado
**Ubicación:** `alembic/versions/4868126f3dd0_add_phone_field_to_users_table.py`

**Contenido:**
```python
def upgrade() -> None:
    op.add_column('users', sa.Column('phone', sa.String(), nullable=True))

def downgrade() -> None:
    op.drop_column('users', 'phone')
```

### Aplicación de la Migración
Para aplicar la migración, ejecutar:
```bash
cd backend
alembic upgrade head
```

## 🔌 Endpoints Actualizados

### 1. POST `/auth/register`

**Funcionalidad:** Registro de usuario con campo phone opcional

**Datos de entrada:**
```json
{
    "email": "usuario@example.com",
    "password": "Contraseña123",
    "full_name": "Nombre Completo",
    "phone": "+506 8888-8888",  // ✅ NUEVO - Opcional
    "address": "Dirección del usuario",
    "city": "Ciudad del usuario",
    "role_id": 2
}
```

**Respuesta exitosa (201):**
```json
{
    "user": {
        "id": 1,
        "email": "usuario@example.com",
        "full_name": "Nombre Completo",
        "phone": "+506 8888-8888",  // ✅ NUEVO
        "address": "Dirección del usuario",
        "city": "Ciudad del usuario",
        "role_id": 2,
        "role_name": "Comprador",
        "is_active": true,
        "is_verified": false,
        "created_at": "2025-01-19T10:30:00",
        "updated_at": null
    },
    "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "token_type": "bearer"
}
```

### 2. GET `/auth/profile`

**Funcionalidad:** Obtener perfil del usuario autenticado

**Headers requeridos:**
```
Authorization: Bearer <token>
```

**Respuesta exitosa (200):**
```json
{
    "id": 1,
    "email": "usuario@example.com",
    "full_name": "Nombre Completo",
    "phone": "+506 8888-8888",  // ✅ NUEVO
    "address": "Dirección del usuario",
    "city": "Ciudad del usuario",
    "role_id": 2,
    "role_name": "Comprador",
    "is_active": true,
    "is_verified": false,
    "created_at": "2025-01-19T10:30:00",
    "updated_at": null
}
```

### 3. PUT `/auth/profile`

**Funcionalidad:** Actualizar perfil del usuario autenticado

**Headers requeridos:**
```
Authorization: Bearer <token>
```

**Datos de entrada:**
```json
{
    "full_name": "Nuevo Nombre",
    "phone": "+506 9999-9999",  // ✅ NUEVO - Opcional
    "address": "Nueva dirección",
    "city": "Nueva ciudad"
}
```

**Respuesta exitosa (200):**
```json
{
    "id": 1,
    "email": "usuario@example.com",
    "full_name": "Nuevo Nombre",
    "phone": "+506 9999-9999",  // ✅ NUEVO
    "address": "Nueva dirección",
    "city": "Nueva ciudad",
    "role_id": 2,
    "role_name": "Comprador",
    "is_active": true,
    "is_verified": false,
    "created_at": "2025-01-19T10:30:00",
    "updated_at": "2025-01-19T11:00:00"
}
```

## 🧪 Pruebas

### Script de Prueba Creado
**Archivo:** `test_phone_field.py`

**Funcionalidades de prueba:**
1. ✅ Registro de usuario con campo phone
2. ✅ Registro de usuario sin campo phone (opcional)
3. ✅ Obtención de perfil incluyendo phone
4. ✅ Actualización de perfil con phone
5. ✅ Validación de respuestas JSON

### Ejecutar Pruebas
```bash
cd backend
python test_phone_field.py
```

### Casos de Prueba Cubiertos

#### 1. Registro con Phone
- ✅ Envío de datos con campo phone
- ✅ Verificación de respuesta incluyendo phone
- ✅ Validación de token generado

#### 2. Registro sin Phone
- ✅ Envío de datos sin campo phone
- ✅ Verificación de que phone es null en respuesta
- ✅ Validación de que el registro funciona correctamente

#### 3. Obtención de Perfil
- ✅ Autenticación con token
- ✅ Verificación de que phone aparece en respuesta
- ✅ Validación de todos los campos del perfil

#### 4. Actualización de Perfil
- ✅ Actualización de campo phone
- ✅ Actualización de otros campos junto con phone
- ✅ Verificación de respuesta actualizada

## 🔧 Scripts de Utilidad

### 1. Aplicar Migración
**Archivo:** `apply_phone_migration.py`

**Uso:**
```bash
cd backend
python apply_phone_migration.py
```

**Funcionalidad:**
- ✅ Verifica que esté en el directorio correcto
- ✅ Aplica la migración automáticamente
- ✅ Muestra resultado detallado
- ✅ Proporciona instrucciones para pruebas

## 📊 Compatibilidad

### ✅ Compatibilidad Hacia Atrás
- ✅ Usuarios existentes sin campo phone funcionan correctamente
- ✅ Campo phone es opcional en todos los endpoints
- ✅ No se requieren cambios en el frontend existente

### ✅ Validaciones
- ✅ Campo phone acepta cualquier string
- ✅ Campo phone puede ser null/None
- ✅ No hay restricciones de formato (flexible para diferentes países)

### ✅ Base de Datos
- ✅ Migración reversible (puede deshacerse)
- ✅ No afecta datos existentes
- ✅ Índices y restricciones mantenidos

## 🚀 Próximos Pasos Sugeridos

### 1. Validación de Formato
- Implementar validación de formato de teléfono por país
- Agregar biblioteca como `phonenumbers` para validación
- Crear esquemas de validación específicos por región

### 2. Frontend Integration
- Actualizar formularios de registro para incluir campo phone
- Actualizar formulario de perfil para editar phone
- Agregar validación de formato en el frontend

### 3. Funcionalidades Avanzadas
- Verificación de teléfono por SMS
- Integración con servicios de envío de SMS
- Historial de cambios de teléfono

## 📞 Información de Contacto

Para preguntas sobre la implementación:

- **Archivos modificados:** Ver sección "Cambios Implementados"
- **Pruebas:** Usar `test_phone_field.py`
- **Migración:** Usar `apply_phone_migration.py`
- **Documentación:** Este archivo contiene toda la información

---

*Implementación completada: Enero 2025*
*Versión: 1.0*
*Estado: Completado y probado* 