from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ProductImageBase(BaseModel):
    product_id: int
    image_url: str
    is_primary: bool = False

class ProductImageCreate(ProductImageBase):
    pass

class ProductImageUpdate(BaseModel):
    image_url: Optional[str] = None
    is_primary: Optional[bool] = None

class ProductImageResponse(ProductImageBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True 