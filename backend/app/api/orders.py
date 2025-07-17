from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from ..config.database import get_db
from ..services.order_service import OrderService
from ..schemas.order import OrderCreate, OrderUpdate, OrderResponse

router = APIRouter(prefix="/orders", tags=["orders"])

@router.post("/", response_model=OrderResponse)
def create_order(
    order: OrderCreate,
    db: Session = Depends(get_db)
):
    """Crear una nueva orden"""
    service = OrderService(db)
    return service.create_order(order)

@router.get("/", response_model=List[OrderResponse])
def get_orders(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    user_id: Optional[int] = Query(None),
    db: Session = Depends(get_db)
):
    """Obtener lista de órdenes"""
    service = OrderService(db)
    return service.get_orders(skip=skip, limit=limit, user_id=user_id)

@router.get("/user/{user_id}", response_model=List[OrderResponse])
def get_user_orders(
    user_id: int,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """Obtener órdenes de un usuario específico"""
    service = OrderService(db)
    return service.get_user_orders(user_id=user_id, skip=skip, limit=limit)

@router.get("/{order_id}", response_model=OrderResponse)
def get_order(
    order_id: int,
    db: Session = Depends(get_db)
):
    """Obtener una orden por ID"""
    service = OrderService(db)
    order = service.get_order(order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Orden no encontrada")
    return order

@router.put("/{order_id}", response_model=OrderResponse)
def update_order(
    order_id: int,
    order: OrderUpdate,
    db: Session = Depends(get_db)
):
    """Actualizar una orden"""
    service = OrderService(db)
    updated_order = service.update_order(order_id, order)
    if not updated_order:
        raise HTTPException(status_code=404, detail="Orden no encontrada")
    return updated_order

@router.delete("/{order_id}")
def delete_order(
    order_id: int,
    db: Session = Depends(get_db)
):
    """Eliminar una orden"""
    service = OrderService(db)
    success = service.delete_order(order_id)
    if not success:
        raise HTTPException(status_code=404, detail="Orden no encontrada")
    return {"message": "Orden eliminada exitosamente"} 