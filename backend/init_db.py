#!/usr/bin/env python3
"""
Script para inicializar la base de datos
"""
from app.config.database import engine
from app.models.user import Base

def init_database():
    """Crear todas las tablas en la base de datos"""
    print("Creando tablas en la base de datos...")
    Base.metadata.create_all(bind=engine)
    print("¡Tablas creadas exitosamente!")

if __name__ == "__main__":
    init_database() 