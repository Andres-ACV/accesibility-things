from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api.access import router as auth_router
from .api.products import router as products_router
from .api.categories import router as categories_router
from .api.colors import router as colors_router
from .api.orders import router as orders_router
from .api.roles import router as roles_router
from .config.database import engine
from .models.user import User, Base

# Las tablas se crean usando migraciones de Alembic
# Base.metadata.create_all(bind=engine)  # Comentado para usar migraciones

app = FastAPI(
    title="Ecommerce API",
    description="API para sistema de ecommerce con autenticación",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción, especificar dominios específicos
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router)
app.include_router(products_router)
app.include_router(categories_router)
app.include_router(colors_router)
app.include_router(orders_router)
app.include_router(roles_router)

@app.get("/")
def read_root():
    return {"message": "Ecommerce API - Bienvenido!"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}