# Accessibility Things - Proyecto de Accesibilidad Web

Este proyecto tiene como objetivo demostrar ejemplos prácticos de desarrollo web accesible siguiendo las pautas WCAG 2.1/2.2.

## 🏗️ Arquitectura del Proyecto

- **Backend**: FastAPI (Python) con PostgreSQL
- **Frontend**: HTML estático servido con servidor HTTP simple
- **Base de datos**: PostgreSQL con Alembic para migraciones
- **Containerización**: Docker y Docker Compose

## 📋 Prerrequisitos

- Docker y Docker Compose instalados
- Python 3.x para el servidor frontend
- Git para clonar el repositorio

## 🚀 Configuración e Instalación

### 1. Clonar el repositorio

```bash
git clone <repository-url>
cd accesibility-things
```

### 2. Configurar variables de entorno

El proyecto incluye un archivo `.env` con la configuración de la base de datos. Verificar que contenga:

```bash
POSTGRES_DB=accessibility_db
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password
```

### 3. Levantar los servicios con Docker

```bash
docker compose up --build
```

Esto iniciará:
- **Backend**: FastAPI en puerto 8000
- **Base de datos**: PostgreSQL en puerto 5432

### 4. Ejecutar migraciones de base de datos

Una vez que los contenedores estén funcionando, ejecutar:

```bash
docker exec accesibility-things-backend-1 alembic upgrade head
```

### 5. Cargar datos iniciales (seed)

```bash
docker exec accesibility-things-backend-1 python /app/init_seed.py
```

### 6. Iniciar el servidor frontend

En una nueva terminal, navegar al directorio frontend y iniciar el servidor:

```bash
cd frontend
python3 -m http.server 3000
```

## ✅ Verificación de la Instalación

Una vez completados todos los pasos, verificar que los servicios estén funcionando:

- **Backend API**: [http://localhost:8000](http://localhost:8000)
- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **API Docs (Swagger)**: [http://localhost:8000/docs](http://localhost:8000/docs)

## 🧼 Comandos Útiles

### Apagar los contenedores

```bash
docker compose down
```

### Ver logs de los servicios

```bash
# Ver todos los logs
docker compose logs

# Ver logs específicos del backend
docker compose logs backend

# Ver logs específicos de la base de datos
docker compose logs db
```

### Acceder al contenedor del backend

```bash
docker exec -it accesibility-things-backend-1 bash
```

### Resetear la base de datos

```bash
docker exec accesibility-things-backend-1 python /app/reset_database.py
```

## 🛠️ Desarrollo

### Estructura del proyecto

```
├── backend/                 # API FastAPI
│   ├── app/                # Código de la aplicación
│   ├── alembic/            # Migraciones de BD
│   ├── requirements.txt    # Dependencias Python
│   └── init_seed.py        # Script de datos iniciales
├── frontend/               # Frontend HTML estático
│   ├── *.html             # Páginas del sitio
│   ├── css/               # Estilos CSS
│   ├── js/                # JavaScript
│   └── images/            # Imágenes
├── docker-compose.yml      # Configuración Docker
└── .env                   # Variables de entorno
```

### Ejecutar tests

```bash
# Tests del backend
docker exec accesibility-things-backend-1 python -m pytest

# Tests específicos
docker exec accesibility-things-backend-1 python -m pytest test_api.py -v
```

## 📝 Notas Importantes

- El frontend se sirve como archivos estáticos usando el servidor HTTP de Python
- El backend incluye documentación automática de la API en `/docs`
- Las migraciones de base de datos se manejan con Alembic
- Los datos de ejemplo se cargan automáticamente con el script `init_seed.py`

## 🔧 Solución de Problemas

### El backend no puede conectarse a la base de datos
- Verificar que el contenedor de PostgreSQL esté funcionando: `docker ps`
- Revisar los logs: `docker compose logs db`

### Error de puertos ocupados
- Cambiar los puertos en `docker-compose.yml` si 8000 o 5432 están ocupados
- O detener los servicios que usen esos puertos

### Problemas con migraciones
- Resetear la base de datos: `docker exec accesibility-things-backend-1 python /app/reset_database.py`
- Ejecutar migraciones nuevamente: `docker exec accesibility-things-backend-1 alembic upgrade head`

## 📚 Documentación Adicional

- `frontend/FRONTEND_DOCUMENTATION.md` - Documentación detallada del frontend
- `backend/IMPLEMENTATION_SUMMARY.md` - Resumen de implementación del backend
- `backend/PHONE_FIELD_IMPLEMENTATION.md` - Implementación específica del campo teléfono 


### Para Renderizar la Presentación

# Renderizar presentación HTML
quarto render presentacion-accesibilidad.qmd