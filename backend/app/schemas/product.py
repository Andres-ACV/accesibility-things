from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from decimal import Decimal
from .color import ColorResponse

class ProductBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: Decimal
    category_id: int
    seller_id: int

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[Decimal] = None
    category_id: Optional[int] = None
    is_active: Optional[bool] = None

class ProductResponse(ProductBase):
    id: int
    average_rating: Decimal
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class ProductWithColors(ProductResponse):
    available_colors: List[ColorResponse] = []

# Resolver referencias circulares
ProductWithColors.model_rebuild() 