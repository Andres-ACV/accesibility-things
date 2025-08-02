# Usa una imagen base de Python oficial
FROM python:3.9-slim

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos de requerimientos e instala las dependencias
COPY ./requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r /app/requirements.txt

# Copia todo el código de la aplicación
COPY ./app /app
COPY ./alembic /app/alembic
COPY ./alembic.ini /app/alembic.ini
COPY ./init_migrations.py /app/init_migrations.py
COPY ./reset_database.py /app/reset_database.py

# Exponer el puerto por defecto de uvicorn
EXPOSE 8000

# Script de inicio que ejecuta migraciones y luego inicia la app
COPY ./start.sh /app/start.sh
RUN chmod +x /app/start.sh

CMD ["/app/start.sh"]