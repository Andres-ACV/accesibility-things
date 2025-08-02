from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from decimal import Decimal
from .color import ColorResponse
from .category import CategoryResponse
from .product_color import ProductColorResponse, ProductColorWithNameResponse
from .product_image import ProductImageResponse

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
    rating_count: int
    is_active: bool
    image_url: Optional[str] = None  # Nuevo campo para la URL de la imagen principal
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class TopSellingProductResponse(BaseModel):
    id: int  # Nuevo campo para el id del producto
    name: str
    average_rating: Decimal
    rating_count: int
    price: Decimal
    image_url: Optional[str] = None

    class Config:
        from_attributes = True

class ProductWithColors(ProductResponse):
    available_colors: List[ColorResponse] = []

# Resolver referencias circulares
ProductWithColors.model_rebuild()

class ProductListPaginatedResponse(BaseModel):
    total_products: int
    page: int
    limit: int
    products: List[ProductResponse] 

class ProductDetailResponse(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    price: Decimal
    average_rating: Decimal
    rating_count: int
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None
    category: CategoryResponse
    colors: List[ProductColorWithNameResponse]
    images: List[ProductImageResponse]

    class Config:
        from_attributes = True 