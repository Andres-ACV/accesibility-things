from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from ..models.category import Category
from ..schemas.category import CategoryCreate, CategoryUpdate
from typing import List, Optional

class CategoryRepository:
    def __init__(self, db: Session):
        self.db = db
    
    def get_all(self) -> List[Category]:
        return self.db.query(Category).all()
    
    def get_by_id(self, category_id: int) -> Optional[Category]:
        return self.db.query(Category).filter(Category.id == category_id).first()
    
    def create(self, category_data: CategoryCreate) -> Category:
        db_category = Category(**category_data.dict())
        try:
            self.db.add(db_category)
            self.db.commit()
            self.db.refresh(db_category)
            return db_category
        except IntegrityError:
            self.db.rollback()
            raise ValueError("Category with this name already exists")
    
    def update(self, category_id: int, category_data: CategoryUpdate) -> Optional[Category]:
        db_category = self.get_by_id(category_id)
        if not db_category:
            return None
        
        update_data = category_data.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_category, field, value)
        
        try:
            self.db.commit()
            self.db.refresh(db_category)
            return db_category
        except IntegrityError:
            self.db.rollback()
            raise ValueError("Category with this name already exists")
    
    def delete(self, category_id: int) -> bool:
        db_category = self.get_by_id(category_id)
        if not db_category:
            return False
        
        self.db.delete(db_category)
        self.db.commit()
        return True 