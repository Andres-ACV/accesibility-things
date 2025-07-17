from typing import List, Optional
from sqlalchemy.orm import Session
from ..models.product import Product
from ..schemas.product import ProductCreate, ProductUpdate, ProductResponse
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