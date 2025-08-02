from typing import List, Optional
from sqlalchemy.orm import Session
from ..models.color import Color
from ..schemas.color import ColorCreate, ColorUpdate, ColorResponse

class ColorService:
    def __init__(self, db: Session):
        self.db = db
    
    def create_color(self, color_data: ColorCreate) -> ColorResponse:
        """Crear un nuevo color"""
        db_color = Color(**color_data.dict())
        self.db.add(db_color)
        self.db.commit()
        self.db.refresh(db_color)
        return ColorResponse.from_orm(db_color)
    
    def get_color(self, color_id: int) -> Optional[ColorResponse]:
        """Obtener un color por ID"""
        color = self.db.query(Color).filter(Color.id == color_id).first()
        if color:
            return ColorResponse.from_orm(color)
        return None
    
    def get_colors(self, skip: int = 0, limit: int = 100) -> List[ColorResponse]:
        """Obtener lista de colores"""
        colors = self.db.query(Color).offset(skip).limit(limit).all()
        return [ColorResponse.from_orm(color) for color in colors]
    
    def update_color(self, color_id: int, color_data: ColorUpdate) -> Optional[ColorResponse]:
        """Actualizar un color"""
        color = self.db.query(Color).filter(Color.id == color_id).first()
        if not color:
            return None
        
        update_data = color_data.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(color, field, value)
        
        self.db.commit()
        self.db.refresh(color)
        return ColorResponse.from_orm(color)
    
    def delete_color(self, color_id: int) -> bool:
        """Eliminar un color"""
        color = self.db.query(Color).filter(Color.id == color_id).first()
        if not color:
            return False
        
        self.db.delete(color)
        self.db.commit()
        return True 