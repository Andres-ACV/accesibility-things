from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from decimal import Decimal

class OrderItemBase(BaseModel):
    order_id: int
    product_id: int
    color_id: int
    quantity: int
    unit_price: Decimal

class OrderItemCreate(BaseModel):
    product_id: int
    color_id: int
    quantity: int
    unit_price: Decimal

class OrderItemUpdate(BaseModel):
    quantity: Optional[int] = None
    unit_price: Optional[Decimal] = None
    customer_rating: Optional[int] = None

class OrderItemResponse(OrderItemBase):
    id: int
    subtotal: Decimal
    customer_rating: Optional[int] = None
    created_at: datetime

    class Config:
        from_attributes = True 