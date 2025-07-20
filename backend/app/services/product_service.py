from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from ..models.product import Product
from ..models.order_item import OrderItem
from ..models.product_image import ProductImage
from ..schemas.product import ProductCreate, ProductUpdate, ProductResponse, TopSellingProductResponse
from ..repositories.category_repository import CategoryRepository

class ProductService:
    def __init__(self, db: Session):
        self.db = db
        self.category_repo = CategoryRepository(db)
    
    def create_product(self, product_data: ProductCreate) -> ProductResponse:
        """Crear un nuevo producto"""
        # Verificar que la categoría existe
        if not self.category_repo.get_by_id(product_data.category_id):
            raise ValueError("Categoría no encontrada")
        
        # Los colores se manejan a través de la tabla ProductColor
        # No hay validación directa de color_id en el producto
        
        db_product = Product(**product_data.dict())
        self.db.add(db_product)
        self.db.commit()
        self.db.refresh(db_product)
        return ProductResponse.from_orm(db_product)
    
    def get_product(self, product_id: int) -> Optional[ProductResponse]:
        """Obtener un producto por ID"""
        product = self.db.query(Product).filter(Product.id == product_id).first()
        if product:
            return ProductResponse.from_orm(product)
        return None
    
    def get_products(self, skip: int = 0, limit: int = 100, category_id: Optional[int] = None) -> List[ProductResponse]:
        """Obtener lista de productos con filtros opcionales"""
        query = self.db.query(Product)
        
        if category_id:
            query = query.filter(Product.category_id == category_id)
        
        products = query.offset(skip).limit(limit).all()
        return [ProductResponse.from_orm(product) for product in products]
    
    def get_top_selling_products(self, limit: int = 4) -> List[TopSellingProductResponse]:
        """Obtener los productos más vendidos basado en la cantidad total vendida"""
        try:
            # Subconsulta para obtener la cantidad total vendida por producto
            subquery = self.db.query(
                OrderItem.product_id,
                func.sum(OrderItem.quantity).label('total_sold')
            ).group_by(OrderItem.product_id).subquery()
            
            # Consulta principal que une productos con sus ventas totales
            top_products = self.db.query(
                Product,
                subquery.c.total_sold
            ).join(
                subquery, Product.id == subquery.c.product_id
            ).order_by(
                desc(subquery.c.total_sold)
            ).limit(limit).all()
            
            result = []
            for product, total_sold in top_products:
                # Obtener la primera imagen del producto (o la imagen principal si existe)
                image = self.db.query(ProductImage).filter(
                    ProductImage.product_id == product.id
                ).filter(
                    ProductImage.is_primary == True
                ).first()
                
                # Si no hay imagen principal, obtener la primera imagen
                if not image:
                    image = self.db.query(ProductImage).filter(
                        ProductImage.product_id == product.id
                    ).first()
                
                # Crear el objeto de respuesta
                product_data = {
                    "name": product.name,
                    "average_rating": product.average_rating,
                    "price": product.price,
                    "image_url": image.image_url if image else None
                }
                
                result.append(TopSellingProductResponse(**product_data))
            
            return result
            
        except Exception as e:
            # En caso de error, retornar lista vacía
            print(f"Error obteniendo productos más vendidos: {e}")
            return []
    
    def update_product(self, product_id: int, product_data: ProductUpdate) -> Optional[ProductResponse]:
        """Actualizar un producto"""
        product = self.db.query(Product).filter(Product.id == product_id).first()
        if not product:
            return None
        
        # Verificar que la categoría existe si se está actualizando
        if product_data.category_id and not self.category_repo.get_by_id(product_data.category_id):
            raise ValueError("Categoría no encontrada")
        
        # Los colores se manejan a través de la tabla ProductColor
        # No hay validación directa de color_id en el producto
        
        update_data = product_data.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(product, field, value)
        
        self.db.commit()
        self.db.refresh(product)
        return ProductResponse.from_orm(product)
    
    def delete_product(self, product_id: int) -> bool:
        """Eliminar un producto"""
        product = self.db.query(Product).filter(Product.id == product_id).first()
        if not product:
            return False
        
        self.db.delete(product)
        self.db.commit()
        return True
    
    def search_products(self, search_term: str, skip: int = 0, limit: int = 100) -> List[ProductResponse]:
        """Buscar productos por nombre o descripción"""
        products = self.db.query(Product).filter(
            Product.name.ilike(f"%{search_term}%") | 
            Product.description.ilike(f"%{search_term}%")
        ).offset(skip).limit(limit).all()
        
        return [ProductResponse.from_orm(product) for product in products] 