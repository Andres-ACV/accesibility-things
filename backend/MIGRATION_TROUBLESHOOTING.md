# Solución de Problemas - Migraciones Alembic

## 🚨 **Error: DependentObjectsStillExist**

### **Problema:**
```
cannot drop table product_types because other objects depend on it
DETAIL: constraint products_product_type_id_fkey on table products depends on table product_types
```

### **Causa:**
La migración intenta eliminar una tabla antes de eliminar las restricciones de clave foránea que dependen de ella.

### **Solución:**
1. **Corregir el orden** en la migración:
   ```python
   # ❌ Incorrecto
   op.drop_table('product_types')
   op.drop_constraint('products_product_type_id_fkey', 'products')
   
   # ✅ Correcto
   op.drop_constraint('products_product_type_id_fkey', 'products')
   op.drop_table('product_types')
   ```

2. **Resetear la base de datos** (si es necesario):
   ```bash
   # El script start.sh ahora maneja esto automáticamente
   docker-compose restart
   ```

## 🔧 **Comandos de Resolución:**

### **1. Ver estado actual:**
```bash
alembic current
alembic history
```

### **2. Resetear completamente:**
```bash
# Eliminar volumen de datos
docker-compose down -v

# Recrear desde cero
docker-compose up
```

### **3. Resetear migraciones:**
```bash
# Dentro del contenedor
alembic downgrade base
alembic upgrade head
```

### **4. Forzar migración específica:**
```bash
# Marcar como aplicada sin ejecutar
alembic stamp head

# O aplicar hasta una migración específica
alembic upgrade 10f6dfd517b0
```

## 🛠️ **Scripts de Resolución:**

### **reset_database.py**
- Resetea completamente la base de datos
- Ejecuta `alembic downgrade base`
- Luego ejecuta `alembic upgrade head`

### **init_migrations.py**
- Ejecuta migraciones normalmente
- Si falla, el script de inicio llama a `reset_database.py`

## 📋 **Flujo de Resolución Automática:**

1. **Inicio del contenedor**
2. **Ejecuta `init_migrations.py`**
3. **Si falla → Ejecuta `reset_database.py`**
4. **Si falla → Error crítico**
5. **Si éxito → Inicia aplicación**

## ⚠️ **Prevención de Problemas:**

### **1. Orden correcto en migraciones:**
```python
def upgrade() -> None:
    # 1. Eliminar restricciones primero
    op.drop_constraint('fk_name', 'table_name')
    
    # 2. Eliminar columnas
    op.drop_column('table_name', 'column_name')
    
    # 3. Eliminar tablas
    op.drop_table('table_name')
    
    # 4. Crear nuevas estructuras
    op.create_table('new_table', ...)
```

### **2. Usar CASCADE cuando sea apropiado:**
```python
# Para eliminar tabla con dependencias
op.execute('DROP TABLE product_types CASCADE')
```

### **3. Verificar migraciones antes de aplicar:**
```bash
# Revisar contenido de la migración
cat alembic/versions/latest_migration.py

# Probar en desarrollo primero
alembic upgrade head
alembic downgrade -1
```

## 🎯 **Casos Comunes:**

### **Caso 1: Tabla ya existe**
```bash
# Error: table already exists
# Solución: Resetear base de datos
docker-compose down -v && docker-compose up
```

### **Caso 2: Restricción no existe**
```bash
# Error: constraint does not exist
# Solución: Verificar nombre exacto de la restricción
# O usar try/catch en la migración
```

### **Caso 3: Columna no existe**
```bash
# Error: column does not exist
# Solución: Verificar si la columna existe antes de eliminarla
```

## 🔍 **Debugging:**

### **1. Ver logs detallados:**
```bash
docker-compose logs backend
```

### **2. Conectar a la base de datos:**
```bash
docker-compose exec db psql -U postgres -d ecommerce
```

### **3. Verificar tablas:**
```sql
\dt
\d table_name
```

### **4. Verificar restricciones:**
```sql
SELECT conname, conrelid::regclass, confrelid::regclass 
FROM pg_constraint 
WHERE contype = 'f';
```

## 🚀 **Solución Rápida:**

Si tienes problemas persistentes:

1. **Parar contenedores:**
   ```bash
   docker-compose down -v
   ```

2. **Limpiar imágenes (opcional):**
   ```bash
   docker system prune -a
   ```

3. **Recrear todo:**
   ```bash
   docker-compose up --build
   ```

4. **Verificar funcionamiento:**
   ```bash
   curl http://localhost:8000/health
   ```

## 📚 **Recursos Adicionales:**

- [Documentación de Alembic](https://alembic.sqlalchemy.org/)
- [SQLAlchemy Migrations](https://docs.sqlalchemy.org/en/14/core/constraints.html)
- [PostgreSQL Constraints](https://www.postgresql.org/docs/current/ddl-constraints.html) 