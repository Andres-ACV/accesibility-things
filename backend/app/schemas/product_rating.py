from pydantic import BaseModel, Field
from typing import Optional

class ProductRatingRequest(BaseModel):
    """Schema para la solicitud de valoración de un producto"""
    order_item_id: int = Field(..., description="ID del ítem específico dentro de la tabla order_items que se está valorando")
    rating_score: int = Field(..., ge=1, le=5, description="La puntuación de la valoración (1 a 5)")

class ProductRatingResponse(BaseModel):
    """Schema para la respuesta de valoración de un producto"""
    message: str
    product_id: int
    order_item_id: int
    rating_score: int
    new_average_rating: float
    new_rating_count: int
