#!/usr/bin/env python3
"""
Script para resetear la base de datos y empezar desde cero con las migraciones
"""

import os
import subprocess
import time
from sqlalchemy import create_engine, text
from sqlalchemy.exc import OperationalError

def wait_for_database(database_url: str, max_retries: int = 30):
    """Esperar a que la base de datos esté disponible"""
    print("🔄 Esperando a que la base de datos esté disponible...")
    
    for i in range(max_retries):
        try:
            engine = create_engine(database_url)
            with engine.connect() as conn:
                conn.execute(text("SELECT 1"))
            print("✅ Base de datos disponible")
            return True
        except OperationalError:
            print(f"⏳ Intento {i+1}/{max_retries}: Base de datos no disponible, esperando...")
            time.sleep(2)
    
    print("❌ No se pudo conectar a la base de datos")
    return False

def reset_database():
    """Resetear la base de datos completamente"""
    try:
        print("🔄 Reseteando base de datos...")
        
        # Eliminar todas las migraciones aplicadas
        result = subprocess.run(
            ["alembic", "downgrade", "base"],
            capture_output=True,
            text=True,
            cwd="/app"
        )
        
        if result.returncode == 0:
            print("✅ Base de datos reseteada exitosamente")
            print(result.stdout)
            return True
        else:
            print("⚠️  Error al resetear (puede ser normal si no hay migraciones):")
            print(result.stderr)
            return True  # Continuamos de todas formas
            
    except Exception as e:
        print(f"⚠️  Error: {e}")
        return True  # Continuamos de todas formas

def run_migrations():
    """Ejecutar migraciones de Alembic"""
    try:
        print("🔄 Ejecutando migraciones de Alembic...")
        
        # Ejecutar migración
        result = subprocess.run(
            ["alembic", "upgrade", "head"],
            capture_output=True,
            text=True,
            cwd="/app"
        )
        
        if result.returncode == 0:
            print("✅ Migraciones ejecutadas exitosamente")
            print(result.stdout)
            return True
        else:
            print("❌ Error ejecutando migraciones:")
            print(result.stderr)
            return False
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def main():
    """Función principal"""
    print("🚀 Reseteando y reinicializando base de datos...")
    
    # Obtener URL de la base de datos
    database_url = os.getenv("DATABASE_URL")
    if not database_url:
        print("❌ DATABASE_URL no configurada")
        return False
    
    # Esperar a que la base de datos esté disponible
    if not wait_for_database(database_url):
        return False
    
    # Resetear base de datos
    if not reset_database():
        return False
    
    # Ejecutar migraciones
    if not run_migrations():
        return False
    
    print("🎉 Base de datos reseteada e inicializada correctamente")
    return True

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1) 