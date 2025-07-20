# Endpoint de Productos Más Vendidos

## Descripción

Este endpoint permite obtener los productos más vendidos de la base de datos, calculados basándose en la cantidad total vendida de cada producto a través de las órdenes.

## Endpoint

```
GET /products/top_selling
```

## Parámetros de Consulta

| Parámetro | Tipo | Requerido | Descripción | Valor por defecto | Rango |
|-----------|------|-----------|-------------|-------------------|-------|
| `limit` | integer | No | Número máximo de productos a retornar | 4 | 1-10 |

## Respuesta

### Formato de Respuesta

La respuesta es un array de objetos JSON, donde cada objeto representa un producto más vendido:

```json
[
  {
    "name": "Nombre del Producto",
    "average_rating": 4.5,
    "price": 99.99,
    "image_url": "/images/producto.jpg"
  }
]
```

### Campos de Respuesta

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `name` | string | Nombre del producto |
| `average_rating` | decimal | Calificación promedio del producto (0.0 - 5.0) |
| `price` | decimal | Precio del producto |
| `image_url` | string (opcional) | URL de la imagen principal del producto |

## Lógica de Implementación

### Cálculo de Productos Más Vendidos

1. **Agrupación por Producto**: Se agrupan todos los `order_items` por `product_id`
2. **Suma de Cantidades**: Se suma la `quantity` de cada producto vendido
3. **Ordenamiento**: Se ordenan los productos de forma descendente por cantidad total vendida
4. **Límite**: Se limitan los resultados al número especificado (por defecto 4)
5. **Unión con Productos**: Se obtiene la información detallada de cada producto

### Consulta SQL Equivalente

```sql
SELECT 
    p.name,
    p.average_rating,
    p.price,
    pi.image_url
FROM products p
JOIN (
    SELECT 
        product_id,
        SUM(quantity) as total_sold
    FROM order_items
    GROUP BY product_id
) sales ON p.id = sales.product_id
LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = true
ORDER BY sales.total_sold DESC
LIMIT 4;
```

## Ejemplos de Uso

### Obtener los 4 productos más vendidos (por defecto)

```bash
curl -X GET "http://localhost:8000/products/top_selling"
```

### Obtener los 6 productos más vendidos

```bash
curl -X GET "http://localhost:8000/products/top_selling?limit=6"
```

### Obtener solo el producto más vendido

```bash
curl -X GET "http://localhost:8000/products/top_selling?limit=1"
```

## Códigos de Respuesta

| Código | Descripción |
|--------|-------------|
| 200 | Éxito - Lista de productos más vendidos |
| 500 | Error interno del servidor |

## Manejo de Errores

- Si no hay productos en la base de datos, se retorna una lista vacía
- Si no hay órdenes, se retorna una lista vacía
- Si ocurre un error en la base de datos, se retorna un error 500

## Consideraciones

1. **Imágenes**: Si un producto no tiene imagen principal (`is_primary = true`), se busca la primera imagen disponible
2. **Productos sin Ventas**: Los productos que no han sido vendidos no aparecerán en los resultados
3. **Rendimiento**: La consulta está optimizada con índices en las columnas relevantes
4. **Límite**: El parámetro `limit` está restringido entre 1 y 10 para evitar consultas costosas

## Archivos Modificados

- `app/schemas/product.py`: Agregado `TopSellingProductResponse`
- `app/services/product_service.py`: Agregado método `get_top_selling_products`
- `app/api/products.py`: Agregado endpoint `GET /top_selling`

## Pruebas

Para probar el endpoint, ejecuta:

```bash
python test_top_selling_products.py
```

Este script verificará:
- Conexión al backend
- Obtención de productos más vendidos
- Estructura de respuesta válida
- Diferentes límites de productos
- Campos requeridos presentes
- Tipos de datos correctos 