# Guía de Migraciones - Alembic

## 🎯 **¿Por qué usar migraciones?**

### **Antes (Problema):**
```python
# En main.py - CREA TABLAS DESDE CERO CADA VEZ
Base.metadata.create_all(bind=engine)
```

**Problemas:**
- ❌ Pérdida de datos al reiniciar
- ❌ No hay control de versiones
- ❌ No se puede hacer rollback
- ❌ No es producción-ready

### **Ahora (Solución):**
```bash
# Usa migraciones de Alembic para control de versiones
alembic upgrade head
```

**Beneficios:**
- ✅ Datos persisten entre reinicios
- ✅ Control de versiones de la base de datos
- ✅ Rollback de cambios
- ✅ Seguro para producción

## 🚀 **Cómo funciona ahora:**

### **1. Inicio del contenedor:**
```bash
docker-compose up
```

### **2. Proceso automático:**
1. **Espera** a que PostgreSQL esté disponible
2. **Ejecuta migraciones** con `alembic upgrade head`
3. **Inicia la aplicación** FastAPI

### **3. Persistencia:**
- Los datos se guardan en el volumen `postgres_data`
- Las tablas **NO se recrean** al reiniciar
- Solo se aplican **nuevas migraciones**

## 📋 **Comandos de Alembic útiles:**

### **Crear nueva migración:**
```bash
cd backend
alembic revision --autogenerate -m "descripción del cambio"
```

### **Ver estado de migraciones:**
```bash
alembic current    # Migración actual
alembic history    # Historial de migraciones
alembic show head  # Ver última migración
```

### **Aplicar migraciones:**
```bash
alembic upgrade head     # Aplicar todas las migraciones
alembic upgrade +1       # Aplicar una migración más
alembic upgrade 123abc   # Aplicar hasta migración específica
```

### **Revertir migraciones:**
```bash
alembic downgrade -1     # Revertir una migración
alembic downgrade base   # Revertir todas las migraciones
alembic downgrade 123abc # Revertir hasta migración específica
```

### **Generar migración automática:**
```bash
# Alembic detecta cambios en los modelos automáticamente
alembic revision --autogenerate -m "agregar campo nuevo"
```

## 🔧 **Estructura de archivos:**

```
backend/
├── alembic/
│   ├── versions/           # Migraciones
│   │   ├── 123abc_initial.py
│   │   └── 456def_add_users.py
│   ├── env.py             # Configuración de Alembic
│   └── script.py.mako     # Template para migraciones
├── alembic.ini           # Configuración principal
├── init_migrations.py    # Script de inicialización
├── start.sh             # Script de inicio del contenedor
└── app/
    └── models/          # Modelos SQLAlchemy
```

## 📝 **Flujo de trabajo recomendado:**

### **1. Desarrollo local:**
```bash
# Hacer cambios en los modelos
# Crear migración
alembic revision --autogenerate -m "mi cambio"

# Aplicar migración
alembic upgrade head

# Probar cambios
```

### **2. Producción:**
```bash
# El contenedor ejecuta automáticamente:
# 1. init_migrations.py
# 2. alembic upgrade head
# 3. uvicorn app.main:app
```

## ⚠️ **Consideraciones importantes:**

### **1. Nunca modificar migraciones existentes:**
- Las migraciones ya aplicadas **NO se deben cambiar**
- Crear **nuevas migraciones** para cambios adicionales

### **2. Backup antes de migraciones:**
```bash
# En producción, siempre hacer backup
pg_dump mydb > backup.sql
```

### **3. Probar migraciones:**
```bash
# Probar en desarrollo antes de producción
alembic upgrade head
alembic downgrade -1
alembic upgrade head
```

### **4. Revisar migraciones generadas:**
```bash
# Siempre revisar el contenido de las migraciones
# antes de aplicarlas
cat alembic/versions/latest_migration.py
```

## 🎯 **Ventajas del nuevo sistema:**

1. **Persistencia**: Los datos sobreviven a reinicios
2. **Control de versiones**: Historial completo de cambios
3. **Rollback**: Puedes deshacer cambios
4. **Producción-ready**: Seguro para entornos productivos
5. **Colaboración**: Equipo puede sincronizar cambios de BD
6. **Debugging**: Fácil identificar problemas de esquema

## 🚀 **Próximos pasos:**

1. **Ejecutar el sistema actualizado:**
   ```bash
   docker-compose down -v  # Eliminar volumen actual
   docker-compose up       # Crear nuevo volumen con migraciones
   ```

2. **Verificar que funciona:**
   ```bash
   # Los datos deberían persistir entre reinicios
   docker-compose restart
   ```

3. **Crear nuevas migraciones cuando hagas cambios:**
   ```bash
   # Después de cambiar modelos
   alembic revision --autogenerate -m "nuevo cambio"
   ``` 