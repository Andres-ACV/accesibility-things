# Accessibility Things - Proyecto de Accesibilidad Web

Este proyecto tiene como objetivo demostrar ejemplos prácticos de desarrollo web accesible siguiendo las pautas WCAG 2.1/2.2. Es un ecommerce educativo que implementa características de accesibilidad para personas con discapacidades.

## 🏗️ Arquitectura del Proyecto

- **Backend**: FastAPI (Python 3.x) con PostgreSQL 14
- **Frontend**: HTML5 semántico con JavaScript vanilla y CSS accesible
- **Base de datos**: PostgreSQL con Alembic para migraciones
- **Containerización**: Docker y Docker Compose
- **Servidor Frontend**: Python HTTP Server personalizado (puerto 9000)
- **API**: FastAPI con documentación automática Swagger/OpenAPI

## 📋 Prerrequisitos

- **Docker Desktop** y **Docker Compose** instalados
- **Python 3.8+** para el servidor frontend
- **Git** para clonar el repositorio  
- **Navegador moderno** (Chrome 80+, Firefox 75+, Safari 13+, Edge 80+)
- **8GB RAM** recomendados para contenedores Docker

## 🚀 Configuración e Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/Andres-ACV/accesibility-things.git
cd accesibility-things
```

### 2. Configurar variables de entorno

El proyecto incluye un archivo `.env` en la raíz con la configuración de la base de datos:

```env
POSTGRES_DB=accessibility_things_db
POSTGRES_USER=admin
POSTGRES_PASSWORD=password
DATABASE_URL=postgresql://admin:password@localhost:5432/accessibility_things_db
SECRET_KEY=your-super-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

**Nota**: En producción, cambiar estos valores por credenciales seguras.

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

**Opción 1 - Usando el servidor personalizado (Recomendado):**
```bash
# Desde la raíz del proyecto
python start-frontend.py
```

**Opción 2 - Usando Python HTTP Server básico:**
```bash
cd frontend
python -m http.server 9000
```

**Opción 3 - En Windows con PowerShell:**
```powershell
# Si tienes configurado el script de PowerShell
.\start-frontend.ps1
```

El servidor frontend estará disponible en el puerto **9000** por defecto.

## ✅ Verificación de la Instalación

Una vez completados todos los pasos, verificar que los servicios estén funcionando:

- **Backend API**: [http://localhost:8000](http://localhost:8000)
- **Frontend**: [http://localhost:9000](http://localhost:9000) 
- **API Docs (Swagger)**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **API Redoc**: [http://localhost:8000/redoc](http://localhost:8000/redoc)
- **Health Check**: [http://localhost:8000/health](http://localhost:8000/health)

### 🔗 Páginas disponibles:
- **Inicio**: [http://localhost:9000/](http://localhost:9000/)
- **Catálogo**: [http://localhost:9000/catalogo.html](http://localhost:9000/catalogo.html)
- **Carrito**: [http://localhost:9000/carrito.html](http://localhost:9000/carrito.html)
- **Perfil**: [http://localhost:9000/profile.html](http://localhost:9000/profile.html)
- **Login**: [http://localhost:9000/login.html](http://localhost:9000/login.html)
- **Registro**: [http://localhost:9000/register.html](http://localhost:9000/register.html)
- **Tests de Accesibilidad**: [http://localhost:9000/tests/](http://localhost:9000/tests/)

## 🧼 Comandos Útiles

### Gestión de contenedores Docker

```bash
# Apagar los contenedores
docker compose down

# Reconstruir y reiniciar
docker compose up --build

# Ver logs de todos los servicios
docker compose logs

# Ver logs específicos del backend
docker compose logs backend

# Ver logs específicos de la base de datos
docker compose logs db

# Ver logs en tiempo real
docker compose logs -f
```

### Acceso a contenedores

```bash
# Acceder al contenedor del backend
docker exec -it accesibility-things-backend-1 bash

# Acceder a PostgreSQL directamente
docker exec -it accesibility-things-db-1 psql -U admin -d accessibility_things_db
```

### Gestión de base de datos

```bash
# Resetear la base de datos
docker exec accesibility-things-backend-1 python /app/reset_database.py

# Ver estado de migraciones
docker exec accesibility-things-backend-1 alembic current

# Crear nueva migración
docker exec accesibility-things-backend-1 alembic revision --autogenerate -m "descripcion"

# Aplicar migraciones pendientes
docker exec accesibility-things-backend-1 alembic upgrade head
```

## 🛠️ Desarrollo

### Estructura del proyecto

```
├── backend/                    # API FastAPI
│   ├── app/                   # Código principal de la aplicación
│   │   ├── api/              # Endpoints de la API
│   │   ├── config/           # Configuración (BD, settings)
│   │   ├── models/           # Modelos SQLAlchemy
│   │   ├── repositories/     # Capa de acceso a datos
│   │   ├── schemas/          # Schemas Pydantic
│   │   ├── services/         # Lógica de negocio
│   │   └── main.py          # Aplicación FastAPI principal
│   ├── alembic/              # Migraciones de BD
│   │   └── versions/         # Archivos de migración
│   ├── requirements.txt      # Dependencias Python
│   ├── Dockerfile           # Imagen Docker del backend
│   ├── init_seed.py         # Script de datos iniciales
│   ├── init_db.py           # Inicialización de BD
│   └── reset_database.py    # Reset completo de BD
├── frontend/                   # Frontend HTML estático
│   ├── *.html               # Páginas del sitio web
│   ├── css/                 # Hojas de estilo
│   │   ├── main.css         # Estilos principales
│   │   └── accessibility.css # Estilos de accesibilidad
│   ├── js/                  # JavaScript modular
│   │   ├── main.js          # Script principal
│   │   ├── accessibility.js # Funciones de accesibilidad
│   │   ├── api-service.js   # Comunicación con API
│   │   └── ui-controller.js # Control de interfaz
│   ├── images/              # Recursos gráficos
│   ├── data/                # Datos JSON de ejemplo
│   ├── tests/               # Suite de testing modular
│   │   ├── accessibility/   # Tests de accesibilidad WCAG
│   │   ├── unit/           # Tests unitarios de funcionalidad
│   │   └── ui/             # Tests de interfaz de usuario
│   └── assets/             # Recursos adicionales
├── Documentation/             # Documentación del proyecto
│   ├── presentacion-accesibilidad.qmd  # Presentación Quarto
│   ├── arquitectura.md      # Documentación de arquitectura
│   └── Imagenes/           # Imágenes para documentación
├── docker-compose.yml        # Configuración Docker Compose
├── .env                     # Variables de entorno
├── start-frontend.py        # Servidor HTTP personalizado
└── README.md               # Esta documentación
```

### Tecnologías utilizadas

#### Backend
- **FastAPI 0.104.1**: Framework web moderno y rápido
- **SQLAlchemy 2.0.23**: ORM para base de datos
- **Alembic 1.12.1**: Migraciones de base de datos
- **Pydantic 2.5.0**: Validación de datos y serialización
- **PostgreSQL 14**: Base de datos relacional
- **Uvicorn**: Servidor ASGI de alta performance

#### Frontend
- **HTML5 Semántico**: Estructura accesible
- **CSS3 con Variables**: Theming y estilos responsive
- **JavaScript ES6+**: Sin frameworks, vanilla JS
- **Web APIs**: LocalStorage, Fetch API, Web Components

#### Herramientas de Desarrollo
- **Docker & Docker Compose**: Containerización
- **Python HTTP Server**: Servidor de desarrollo
- **Quarto**: Generación de presentaciones
- **Git**: Control de versiones

### Testing y Quality Assurance

```bash
# Tests del backend (desde el contenedor)
docker exec accesibility-things-backend-1 python -m pytest

# Tests específicos con verbose
docker exec accesibility-things-backend-1 python -m pytest tests/ -v

# Tests con coverage
docker exec accesibility-things-backend-1 python -m pytest --cov=app tests/

# Tests de accesibilidad (desde el navegador)
# Ir a: http://localhost:9000/tests/
```

### Sistema de Testing Modular Frontend

El proyecto incluye un sistema completo de testing para validar:

- **Accesibilidad WCAG 2.1/2.2** (28% de evaluación)
  - Alto contraste y temas
  - Navegación por teclado
  - Texto alternativo en imágenes
  - Compatibilidad con lectores de pantalla

- **Funcionalidades** (48% de evaluación)
  - Autenticación y registro
  - Catálogo y búsqueda
  - Carrito de compras
  - CRUD de productos

- **Interfaz de Usuario** (24% de evaluación)
  - Diseño visual y estética
  - Flujo de navegación
  - Control ortográfico
  - Diseño responsive

### Características de Accesibilidad Implementadas

#### ♿ WCAG 2.1 Level AA Compliance
- **Contraste de Color**: Ratios mínimos 4.5:1 (texto normal) y 3:1 (texto grande)
- **Navegación por Teclado**: Tab order lógico y skip links
- **Texto Alternativo**: Imágenes descriptivas y decorativas apropiadas
- **Landmarks ARIA**: Navegación semántica para lectores de pantalla
- **Focus Management**: Estados de foco visibles y lógicos

#### 🎨 Características Especiales
- **Alto Contraste**: Toggle para tema de alto contraste
- **Escalabilidad**: Texto escalable hasta 200% sin pérdida de funcionalidad
- **Responsive**: Diseño adaptativo para todos los dispositivos
- **Semántica HTML5**: Estructura accesible por defecto

## 📝 Notas Importantes

### Configuración del Proyecto
- El frontend se sirve con un **servidor HTTP personalizado** en Python (puerto 9000)
- El backend incluye **documentación automática** Swagger/OpenAPI en `/docs`
- Las migraciones de base de datos se manejan con **Alembic**
- Los datos de ejemplo se cargan automáticamente con `init_seed.py`
- El proyecto utiliza **variables de entorno** para configuración segura

### Características Técnicas
- **CORS habilitado** para desarrollo local
- **Autenticación JWT** para usuarios
- **Base de datos normalizada** con relaciones apropiadas
- **Validación de datos** con Pydantic schemas
- **Logging estructurado** para debugging

### Compatibilidad
- **Navegadores**: Chrome 80+, Firefox 75+, Safari 13+, Edge 80+
- **Lectores de pantalla**: NVDA, JAWS, VoiceOver, ORCA
- **Dispositivos**: Desktop, tablet, móvil (responsive design)
- **Sistemas operativos**: Windows, macOS, Linux

### Rendimiento
- **Tiempo de carga**: <3 segundos en conexiones normales
- **Optimización de imágenes**: Formatos WebP y SVG
- **Caching**: Headers apropiados para recursos estáticos
- **Minificación**: CSS y JS optimizados para producción

## 🔧 Solución de Problemas

### Problemas de Conectividad

#### El backend no puede conectarse a la base de datos
```bash
# Verificar que los contenedores estén funcionando
docker ps

# Revisar logs de la base de datos
docker compose logs db

# Verificar variables de entorno
docker exec accesibility-things-backend-1 printenv | grep POSTGRES

# Reiniciar solo la base de datos
docker compose restart db
```

#### Error de puertos ocupados
```bash
# Verificar qué proceso usa el puerto 8000
netstat -ano | findstr :8000   # Windows
lsof -i :8000                  # macOS/Linux

# Cambiar puertos en docker-compose.yml si es necesario
# O detener el servicio conflictivo
```

### Problemas de Base de Datos

#### Problemas con migraciones
```bash
# Ver estado actual de migraciones
docker exec accesibility-things-backend-1 alembic current

# Ver historial de migraciones
docker exec accesibility-things-backend-1 alembic history

# Resetear completamente la base de datos
docker exec accesibility-things-backend-1 python /app/reset_database.py

# Aplicar todas las migraciones nuevamente
docker exec accesibility-things-backend-1 alembic upgrade head

# Si hay conflictos, bajar a una migración específica
docker exec accesibility-things-backend-1 alembic downgrade <revision_id>
```

#### Base de datos corrupta o inconsistente
```bash
# Destruir completamente los volúmenes y recrear
docker compose down -v
docker volume rm accesibility-things_postgres_data
docker compose up --build
```

### Problemas del Frontend

#### El servidor frontend no inicia
```bash
# Verificar que Python esté instalado
python --version

# Verificar que el directorio frontend existe
ls frontend/  # macOS/Linux
dir frontend\ # Windows

# Usar servidor alternativo
cd frontend
python -m http.server 9000
```

#### Problemas de CORS
- Verificar que el backend tenga CORS habilitado
- Comprobar que las URLs en `js/api-service.js` apunten a `localhost:8000`
- En desarrollo, el CORS está configurado para permitir todos los orígenes

### Problemas de Docker

#### Contenedores no se construyen
```bash
# Limpiar cache de Docker
docker system prune -a

# Reconstruir desde cero
docker compose down
docker compose build --no-cache
docker compose up
```

#### Memoria insuficiente
```bash
# Verificar uso de memoria
docker stats

# Aumentar memoria disponible para Docker Desktop
# En la configuración: Resources > Memory > 4GB o más
```

### Debugging Avanzado

#### Logs detallados
```bash
# Logs en tiempo real de todos los servicios
docker compose logs -f

# Logs específicos con timestamps
docker compose logs -f -t backend

# Logs de errores únicamente
docker compose logs backend 2>&1 | grep -i error
```

#### Acceso directo a la base de datos
```bash
# Conectar a PostgreSQL
docker exec -it accesibility-things-db-1 psql -U admin -d accessibility_things_db

# Comandos útiles dentro de psql:
# \dt          - Listar tablas
# \d users     - Describir tabla users
# \q           - Salir
```

## 📚 Documentación Adicional

### Documentación del Proyecto
- **📁 `Documentation/`** - Documentación completa del proyecto
  - `arquitectura.md` - Documentación técnica de arquitectura
  - `presentacion-accesibilidad.qmd` - Presentación Quarto del proyecto
  - `PSWE04_Arquitectura_Andres_Danny.pdf` - Documento de arquitectura
  - `PSWE04_Figma_Andres_Danny.pdf` - Diseños y mockups

### Documentación Técnica Frontend
- **📁 `frontend/tests/README.md`** - Sistema de testing modular completo
- **📁 `frontend/css/`** - Estilos CSS con documentación inline
- **📁 `frontend/js/`** - Módulos JavaScript documentados

### APIs y Schemas
- **Swagger UI**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc**: [http://localhost:8000/redoc](http://localhost:8000/redoc)
- **Esquemas de Base de Datos**: Ver archivos en `backend/app/models/`

### Estándares y Guías
- **WCAG 2.1 Guidelines**: [Web Content Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- **FastAPI Documentation**: [https://fastapi.tiangolo.com/](https://fastapi.tiangolo.com/)
- **PostgreSQL Docs**: [https://www.postgresql.org/docs/14/](https://www.postgresql.org/docs/14/)

## 🎓 Contexto Académico

### Objetivo del Proyecto
Este proyecto fue desarrollado como parte del curso **"Diseño de Software"** en CENFOTEC, con los siguientes objetivos de aprendizaje:

- Implementar principios de **accesibilidad web** (WCAG 2.1/2.2)
- Aplicar **arquitectura de software** moderna y escalable
- Demostrar **testing sistemático** y validación de calidad
- Crear **documentación técnica** completa y profesional

### Criterios de Evaluación
El proyecto se evalúa según los siguientes criterios:

| Criterio | Peso | Descripción |
|----------|------|-------------|
| **Accesibilidad** | 28% | Cumplimiento WCAG 2.1 AA |
| **Funcionalidades** | 48% | 4 casos de uso completos |
| **Interfaz Gráfica** | 24% | Diseño, navegación y ortografía |

### Meta: **20/20 puntos** - Calificación "Excelente" en todas las categorías

## 🎨 Para Renderizar la Presentación

### Usando Quarto
```bash
# Navegar al directorio de documentación
cd Documentation/

# Renderizar presentación HTML
quarto render presentacion-accesibilidad.qmd

# Servir la presentación localmente
quarto preview presentacion-accesibilidad.qmd
```

### Visualizar Presentación
- **Archivo HTML**: `Documentation/presentacion-accesibilidad.html`
- **Modo Presentación**: Abrir en navegador y presionar `F` para fullscreen
- **Navegación**: Usar flechas o `Espacio` para navegar

## 🚀 Despliegue en Producción

### Variables de Entorno para Producción
```env
# Base de datos
DATABASE_URL=postgresql://user:password@host:5432/database
POSTGRES_DB=accessibility_things_prod
POSTGRES_USER=prod_user
POSTGRES_PASSWORD=secure_password_here

# Seguridad
SECRET_KEY=your-super-secure-secret-key-256-bits
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60

# CORS (especificar dominios específicos)
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

### Consideraciones de Seguridad
- Cambiar todas las contraseñas por defecto
- Usar HTTPS en producción
- Configurar CORS para dominios específicos
- Implementar rate limiting
- Configurar backup automático de base de datos

---

## 👥 Autores

- **Andrés Arrieta** - Desarrollo Backend y Base de Datos
- **Danny Mora** - Desarrollo Frontend y Accesibilidad

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork del proyecto
2. Crear una rama para tu feature (`git checkout -b feature/nueva-feature`)
3. Commit de tus cambios (`git commit -m 'Agregar nueva feature'`)
4. Push a la rama (`git push origin feature/nueva-feature`)
5. Abrir un Pull Request

---

**Última actualización**: Agosto 2025  
**Versión**: 2.0  
**Estado**: Activo en desarrollo