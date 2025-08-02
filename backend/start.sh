#!/bin/bash

# Script de inicio para el backend
# Ejecuta migraciones y luego inicia la aplicación

set -e

echo "🚀 Iniciando backend..."

# Ejecutar migraciones
echo "🔄 Ejecutando migraciones de Alembic..."
if ! python init_migrations.py; then
    echo "⚠️  Error en migraciones, intentando resetear base de datos..."
    if python reset_database.py; then
        echo "✅ Base de datos reseteada exitosamente"
    else
        echo "❌ Error reseteando base de datos"
        exit 1
    fi
fi

# Iniciar la aplicación
echo "🚀 Iniciando aplicación FastAPI..."
exec uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload 