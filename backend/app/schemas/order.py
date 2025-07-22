from pydantic import BaseModel
from typing import Optional, List, ForwardRef
from datetime import datetime
from decimal import Decimal
from enum import Enum

class OrderStatus(str, Enum):
    PENDING = "pending"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class OrderBase(BaseModel):
    user_id: int
    description: Optional[str] = None
    total: Decimal

class OrderCreate(OrderBase):
    items: List['OrderItemCreate'] = []

class OrderUpdate(BaseModel):
    description: Optional[str] = None
    status: Optional[OrderStatus] = None
    total: Optional[Decimal] = None

class OrderResponse(OrderBase):
    id: int
    total: Decimal
    status: OrderStatus
    order_date: datetime
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class OrderWithItems(OrderResponse):
    items: List['OrderItemResponse'] = []

class OrderCartItem(BaseModel):
    productId: int
    colorId: int
    quantity: int

class OrderCartRequest(BaseModel):
    cart_items: List[OrderCartItem]
    description: Optional[str] = None

# Resolver referencias circulares
from .order_item import OrderItemResponse, OrderItemCreate
OrderWithItems.model_rebuild()
OrderCreate.model_rebuild()

class OrderDetailItemResponse(BaseModel):
    order_item_id: int
    product_id: int
    color_id: int
    quantity: int
    unit_price: Decimal
    subtotal: Decimal
    product_info: dict  # name, description, image_url, average_rating, rating_count
    color_info: dict    # name, hex_code

class OrderDetailResponse(BaseModel):
    id: int
    user_id: int
    description: Optional[str] = None
    total: Decimal
    status: OrderStatus
    order_date: datetime
    created_at: datetime
    updated_at: Optional[datetime] = None
    items: List[OrderDetailItemResponse]

    class Config:
        from_attributes = True 