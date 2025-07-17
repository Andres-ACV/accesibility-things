#!/usr/bin/env python3
"""
Script para verificar la configuración de la base de datos
"""
import os
from app.config.settings import settings

print("=== Configuración de Base de Datos ===")
print(f"DATABASE_URL: {settings.database_url}")
print(f"Secret Key: {settings.secret_key}")
print(f"Algorithm: {settings.algorithm}")

print("\n=== Variables de Entorno ===")
print(f"POSTGRES_DB: {os.getenv('POSTGRES_DB', 'No definida')}")
print(f"POSTGRES_USER: {os.getenv('POSTGRES_USER', 'No definida')}")
print(f"POSTGRES_PASSWORD: {os.getenv('POSTGRES_PASSWORD', 'No definida')}")
print(f"DATABASE_URL (env): {os.getenv('DATABASE_URL', 'No definida')}")

print("\n=== Verificando archivo .env ===")
env_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env")
print(f"Ruta del archivo .env: {env_path}")
print(f"¿Existe el archivo .env? {os.path.exists(env_path)}")

if os.path.exists(env_path):
    print("Contenido del archivo .env:")
    with open(env_path, 'r') as f:
        for line in f:
            if line.strip() and not line.startswith('#'):
                print(f"  {line.strip()}")
else:
    print("El archivo .env no existe en la ruta especificada") 