from typing import List, Optional
from sqlalchemy.orm import Session
from ..models.order import Order
from ..models.order_item import OrderItem
from ..schemas.order import OrderCreate, OrderUpdate, OrderResponse
from ..schemas.order_item import OrderItemCreate
from ..models.product import Product
from ..models.color import Color
from ..models.product_image import ProductImage
from ..schemas.order import OrderDetailResponse, OrderDetailItemResponse

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

    def get_order_detail(self, order_id: int) -> Optional[OrderDetailResponse]:
        """Obtener todos los detalles de una orden, incluyendo ítems, producto y color"""
        order = self.db.query(Order).filter(Order.id == order_id).first()
        if not order:
            return None
        items = []
        for item in order.items:
            # Obtener producto
            product = self.db.query(Product).filter(Product.id == item.product_id).first()
            # Obtener imagen principal
            image = self.db.query(ProductImage).filter(
                ProductImage.product_id == product.id,
                ProductImage.is_primary == True
            ).first()
            if not image:
                image = self.db.query(ProductImage).filter(ProductImage.product_id == product.id).first()
            image_url = image.image_url if image else None
            # Obtener color
            color = self.db.query(Color).filter(Color.id == item.color_id).first()
            # Construir info
            product_info = {
                "name": product.name if product else None,
                "description": product.description if product else None,
                "image_url": image_url,
                "average_rating": float(product.average_rating) if product else None,
                "rating_count": product.rating_count if product else None
            }
            color_info = {
                "name": color.name if color else None,
                "hex_code": color.hex_code if color else None
            }
            items.append(OrderDetailItemResponse(
                order_item_id=item.id,
                product_id=item.product_id,
                color_id=item.color_id,
                quantity=item.quantity,
                unit_price=float(item.unit_price),
                subtotal=float(item.subtotal),
                customer_rating=item.customer_rating,  # Incluir la valoración del cliente
                product_info=product_info,
                color_info=color_info
            ))
        return OrderDetailResponse(
            id=order.id,
            user_id=order.user_id,
            description=order.description,
            total=float(order.total),
            status=order.status,
            order_date=order.order_date,
            created_at=order.created_at,
            updated_at=order.updated_at,
            items=items
        ) 