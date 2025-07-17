from typing import List, Optional
from sqlalchemy.orm import Session
from ..models.order import Order
from ..models.order_item import OrderItem
from ..schemas.order import OrderCreate, OrderUpdate, OrderResponse
from ..schemas.order_item import OrderItemCreate

class OrderService:
    def __init__(self, db: Session):
        self.db = db
    
    def create_order(self, order_data: OrderCreate) -> OrderResponse:
        """Crear una nueva orden"""
        # Crear la orden
        order_dict = order_data.dict(exclude={'items'})
        db_order = Order(**order_dict)
        self.db.add(db_order)
        self.db.commit()
        self.db.refresh(db_order)
        
        # Crear los items de la orden
        for item_data in order_data.items:
            item_dict = item_data.dict()
            item_dict['order_id'] = db_order.id
            # Calcular subtotal
            item_dict['subtotal'] = item_data.quantity * item_data.unit_price
            db_item = OrderItem(**item_dict)
            self.db.add(db_item)
        
        self.db.commit()
        self.db.refresh(db_order)
        return OrderResponse.from_orm(db_order)
    
    def get_order(self, order_id: int) -> Optional[OrderResponse]:
        """Obtener una orden por ID"""
        order = self.db.query(Order).filter(Order.id == order_id).first()
        if order:
            return OrderResponse.from_orm(order)
        return None
    
    def get_orders(self, skip: int = 0, limit: int = 100, user_id: Optional[int] = None) -> List[OrderResponse]:
        """Obtener lista de órdenes con filtros opcionales"""
        query = self.db.query(Order)
        
        if user_id:
            query = query.filter(Order.user_id == user_id)
        
        orders = query.offset(skip).limit(limit).all()
        return [OrderResponse.from_orm(order) for order in orders]
    
    def update_order(self, order_id: int, order_data: OrderUpdate) -> Optional[OrderResponse]:
        """Actualizar una orden"""
        order = self.db.query(Order).filter(Order.id == order_id).first()
        if not order:
            return None
        
        update_data = order_data.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(order, field, value)
        
        self.db.commit()
        self.db.refresh(order)
        return OrderResponse.from_orm(order)
    
    def delete_order(self, order_id: int) -> bool:
        """Eliminar una orden"""
        order = self.db.query(Order).filter(Order.id == order_id).first()
        if not order:
            return False
        
        # Eliminar items de la orden primero
        self.db.query(OrderItem).filter(OrderItem.order_id == order_id).delete()
        
        self.db.delete(order)
        self.db.commit()
        return True
    
    def get_user_orders(self, user_id: int, skip: int = 0, limit: int = 100) -> List[OrderResponse]:
        """Obtener órdenes de un usuario específico"""
        orders = self.db.query(Order).filter(
            Order.user_id == user_id
        ).offset(skip).limit(limit).all()
        
        return [OrderResponse.from_orm(order) for order in orders] 