# Ecommerce Backend API

Backend API para sistema de ecommerce con autenticación JWT y base de datos PostgreSQL.

## Estructura del Proyecto

```
backend/
├── app/
│   ├── api/              # Endpoints de la API
│   │   └── access.py     # Endpoints de autenticación
│   ├── config/           # Configuración
│   │   ├── database.py   # Configuración de base de datos
│   │   └── settings.py   # Variables de entorno
│   ├── models/           # Modelos de SQLAlchemy
│   │   └── user.py       # Modelo de usuario
│   ├── repositories/     # Acceso a datos
│   │   └── access_repository.py
│   ├── schemas/          # Schemas de Pydantic
│   │   └── user.py       # Schemas de usuario
│   ├── services/         # Lógica de negocio
│   │   └── access_service.py
│   └── main.py           # Aplicación principal
├── alembic/              # Migraciones de base de datos
├── requirements.txt      # Dependencias
└── README.md
```

## Configuración

1. **Instalar dependencias:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Configurar variables de entorno:**
   Crear archivo `.env` en el directorio `backend/` con:
   ```
   DATABASE_URL=postgresql://user:password@localhost/ecommerce_db
   SECRET_KEY=your-super-secret-key-change-this-in-production
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   ```

3. **Configurar base de datos:**
   - Crear base de datos PostgreSQL
   - Ejecutar migraciones:
   ```bash
   alembic upgrade head
   ```

## Endpoints Disponibles

### Autenticación (`/auth`)

- `POST /auth/register` - Crear cuenta (requiere email, password, full_name)
- `POST /auth/login` - Iniciar sesión (requiere email y password)
- `POST /auth/forgot-password` - Olvidar contraseña
- `POST /auth/reset-password` - Resetear contraseña
- `PUT /auth/profile` - Editar perfil (requiere autenticación)

## Ejecutar la Aplicación

```bash
uvicorn app.main:app --reload
```

La API estará disponible en: http://localhost:8000
Documentación automática: http://localhost:8000/docs

## Migraciones

- Crear nueva migración:
  ```bash
  alembic revision --autogenerate -m "descripción"
  ```

- Aplicar migraciones:
  ```bash
  alembic upgrade head
  ```

- Revertir migración:
  ```bash
  alembic downgrade -1
  ``` 