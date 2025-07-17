from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ProductColorBase(BaseModel):
    product_id: int
    color_id: int
    is_available: bool = True
    stock_quantity: int = 0

class ProductColorCreate(ProductColorBase):
    pass

class ProductColorUpdate(BaseModel):
    is_available: Optional[bool] = None
    stock_quantity: Optional[int] = None

class ProductColorResponse(ProductColorBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True 