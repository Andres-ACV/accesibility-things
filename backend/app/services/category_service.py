from typing import List, Optional
from sqlalchemy.orm import Session
from ..models.category import Category
from ..schemas.category import CategoryCreate, CategoryUpdate, CategoryResponse

class CategoryService:
    def __init__(self, db: Session):
        self.db = db
    
    def create_category(self, category_data: CategoryCreate) -> CategoryResponse:
        """Crear una nueva categoría"""
        db_category = Category(**category_data.dict())
        self.db.add(db_category)
        self.db.commit()
        self.db.refresh(db_category)
        return CategoryResponse.from_orm(db_category)
    
    def get_category(self, category_id: int) -> Optional[CategoryResponse]:
        """Obtener una categoría por ID"""
        category = self.db.query(Category).filter(Category.id == category_id).first()
        if category:
            return CategoryResponse.from_orm(category)
        return None
    
    def get_categories(self, skip: int = 0, limit: int = 100) -> List[CategoryResponse]:
        """Obtener lista de categorías"""
        categories = self.db.query(Category).offset(skip).limit(limit).all()
        return [CategoryResponse.from_orm(category) for category in categories]
    
    def update_category(self, category_id: int, category_data: CategoryUpdate) -> Optional[CategoryResponse]:
        """Actualizar una categoría"""
        category = self.db.query(Category).filter(Category.id == category_id).first()
        if not category:
            return None
        
        update_data = category_data.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(category, field, value)
        
        self.db.commit()
        self.db.refresh(category)
        return CategoryResponse.from_orm(category)
    
    def delete_category(self, category_id: int) -> bool:
        """Eliminar una categoría"""
        category = self.db.query(Category).filter(Category.id == category_id).first()
        if not category:
            return False
        
        self.db.delete(category)
        self.db.commit()
        return True 