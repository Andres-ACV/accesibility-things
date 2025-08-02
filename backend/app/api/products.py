from fastapi import APIRouter, Depends, HTTPException, Query, Body
from sqlalchemy.orm import Session
from typing import List, Optional
from ..config.database import get_db
from ..services.product_service import ProductService
from ..schemas.product import ProductCreate, ProductUpdate, ProductResponse, TopSellingProductResponse, ProductListPaginatedResponse, ProductDetailResponse
from ..schemas.product_rating import ProductRatingRequest, ProductRatingResponse

router = APIRouter(prefix="/products", tags=["products"])

@router.post("/", response_model=ProductResponse)
def create_product(
    product: ProductCreate,
    db: Session = Depends(get_db)
):
    """Crear un nuevo producto"""
    try:
        service = ProductService(db)
        return service.create_product(product)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/", response_model=ProductListPaginatedResponse)
def get_products(
    page: int = Query(1, ge=1, description="Número de página actual"),
    limit: int = Query(4, ge=1, le=100, description="Cantidad de productos por página"),
    category_id: Optional[int] = Query(None, description="Filtrar por categoría (ID)"),
    category: Optional[str] = Query(None, description="Filtrar por categoría (nombre)"),
    min_price: Optional[float] = Query(None, description="Precio mínimo"),
    max_price: Optional[float] = Query(None, description="Precio máximo"),
    min_avg_rating: Optional[float] = Query(None, description="Calificación promedio mínima"),
    color_id: Optional[int] = Query(None, description="Filtrar por color (ID)"),
    color: Optional[str] = Query(None, description="Filtrar por color (nombre)"),
    search: Optional[str] = Query(None, description="Buscar por nombre de producto (aproximado, insensible a mayúsculas/minúsculas)"),
    sort_by: str = Query("id", description="Campo por el cual ordenar (id, name, price, average_rating, created_at, updated_at)"),
    sort_order: str = Query("asc", description="asc o desc"),
    db: Session = Depends(get_db)
):
    """Obtener lista de productos paginada, ordenada y filtrada"""
    service = ProductService(db)
    return service.get_products(
        page=page,
        limit=limit,
        category_id=category_id,
        category_name=category,
        min_price=min_price,
        max_price=max_price,
        min_avg_rating=min_avg_rating,
        color_id=color_id,
        color_name=color,
        search=search,
        sort_by=sort_by,
        sort_order=sort_order
    )

@router.get("/top_selling", response_model=List[TopSellingProductResponse])
def get_top_selling_products(
    limit: int = Query(4, ge=1, le=10),
    db: Session = Depends(get_db)
):
    """Obtener los productos más vendidos"""
    try:
        service = ProductService(db)
        products = service.get_top_selling_products(limit=limit)
        return products
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error obteniendo productos más vendidos")

@router.get("/search", response_model=List[ProductResponse])
def search_products(
    q: str = Query(..., min_length=1),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """Buscar productos por nombre o descripción"""
    service = ProductService(db)
    return service.search_products(search_term=q, skip=skip, limit=limit)

@router.get("/{product_id}", response_model=ProductResponse)
def get_product(
    product_id: int,
    db: Session = Depends(get_db)
):
    """Obtener un producto por ID"""
    service = ProductService(db)
    product = service.get_product(product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return product

@router.put("/{product_id}", response_model=ProductResponse)
def update_product(
    product_id: int,
    product: ProductUpdate,
    db: Session = Depends(get_db)
):
    """Actualizar un producto"""
    try:
        service = ProductService(db)
        updated_product = service.update_product(product_id, product)
        if not updated_product:
            raise HTTPException(status_code=404, detail="Producto no encontrado")
        return updated_product
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/{product_id}")
def delete_product(
    product_id: int,
    db: Session = Depends(get_db)
):
    """Eliminar un producto"""
    service = ProductService(db)
    success = service.delete_product(product_id)
    if not success:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return {"message": "Producto eliminado exitosamente"}

@router.post("/{product_id}/rate", response_model=ProductRatingResponse)
def rate_product(
    product_id: int,
    rating_request: ProductRatingRequest,
    db: Session = Depends(get_db)
):
    """
    Valorar un producto específico basado en un order_item.
    Actualiza customer_rating en order_items y recalcula average_rating y rating_count del producto.
    """
    try:
        service = ProductService(db)
        result = service.rate_product(
            product_id=product_id,
            order_item_id=rating_request.order_item_id,
            rating_score=rating_request.rating_score
        )
        return ProductRatingResponse(**result)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error interno del servidor al procesar la valoración")

@router.get("/{product_id}/ratings-debug")
def debug_product_ratings(
    product_id: int,
    db: Session = Depends(get_db)
):
    """Endpoint de debug para verificar las valoraciones de un producto"""
    from ..models.order_item import OrderItem
    from sqlalchemy import text
    
    try:
        # Obtener el producto
        service = ProductService(db)
        product = service.get_product(product_id)
        if not product:
            raise HTTPException(status_code=404, detail="Producto no encontrado")
        
        # Obtener todos los order_items para este producto
        order_items = db.query(OrderItem).filter(OrderItem.product_id == product_id).all()
        
        # Obtener solo las valoraciones válidas
        valid_ratings = [item.customer_rating for item in order_items if item.customer_rating is not None]
        
        # Consulta SQL directa
        rating_query = text("""
            SELECT customer_rating 
            FROM order_items 
            WHERE product_id = :product_id 
            AND customer_rating IS NOT NULL
        """)
        
        sql_ratings = db.execute(rating_query, {"product_id": product_id}).fetchall()
        sql_ratings_values = [row[0] for row in sql_ratings]
        
        return {
            "product_id": product_id,
            "product_name": product.name,
            "current_average_rating": float(product.average_rating) if product.average_rating else 0,
            "current_rating_count": product.rating_count,
            "order_items_count": len(order_items),
            "order_items_with_ratings": len(valid_ratings),
            "ratings_from_orm": valid_ratings,
            "ratings_from_sql": sql_ratings_values,
            "calculated_average": sum(valid_ratings) / len(valid_ratings) if valid_ratings else 0,
            "calculated_count": len(valid_ratings)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

@router.post("/{product_id}/recalculate-ratings")
def recalculate_product_ratings(
    product_id: int,
    db: Session = Depends(get_db)
):
    """Forzar recálculo de valoraciones para un producto (útil para debugging)"""
    try:
        service = ProductService(db)
        result = service.recalculate_product_ratings(product_id)
        return result
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error recalculando valoraciones: {str(e)}")

@router.get("/detail/{product_id}", response_model=ProductDetailResponse)
def get_product_detail(
    product_id: int,
    db: Session = Depends(get_db)
):
    """Obtener todos los detalles de un producto, incluyendo colores e imágenes"""
    service = ProductService(db)
    detail = service.get_product_detail(product_id)
    if not detail:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return detail 