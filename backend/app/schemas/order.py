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

# Resolver referencias circulares
from .order_item import OrderItemResponse, OrderItemCreate
OrderWithItems.model_rebuild()
OrderCreate.model_rebuild() 