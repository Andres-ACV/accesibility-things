from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from ..models.color import Color
from ..schemas.color import ColorCreate, ColorUpdate
from typing import List, Optional

class ColorRepository:
    def __init__(self, db: Session):
        self.db = db
    
    def get_all(self) -> List[Color]:
        return self.db.query(Color).all()
    
    def get_by_id(self, color_id: int) -> Optional[Color]:
        return self.db.query(Color).filter(Color.id == color_id).first()
    
    def create(self, color_data: ColorCreate) -> Color:
        db_color = Color(**color_data.dict())
        try:
            self.db.add(db_color)
            self.db.commit()
            self.db.refresh(db_color)
            return db_color
        except IntegrityError:
            self.db.rollback()
            raise ValueError("Color with this name already exists")
    
    def update(self, color_id: int, color_data: ColorUpdate) -> Optional[Color]:
        db_color = self.get_by_id(color_id)
        if not db_color:
            return None
        
        update_data = color_data.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_color, field, value)
        
        try:
            self.db.commit()
            self.db.refresh(db_color)
            return db_color
        except IntegrityError:
            self.db.rollback()
            raise ValueError("Color with this name already exists")
    
    def delete(self, color_id: int) -> bool:
        db_color = self.get_by_id(color_id)
        if not db_color:
            return False
        
        self.db.delete(db_color)
        self.db.commit()
        return True 