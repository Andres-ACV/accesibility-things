from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from ..config.database import get_db
from ..services.order_service import OrderService
from ..schemas.order import OrderCreate, OrderUpdate, OrderResponse
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from ..services.access_service import AccessService
from ..repositories.access_repository import AccessRepository
from ..models import Product, ProductColor, Order, OrderItem, OrderStatus
from ..schemas.order import OrderCartRequest, OrderResponse, OrderDetailResponse
from sqlalchemy.exc import SQLAlchemyError
from decimal import Decimal
import traceback

router = APIRouter(prefix="/orders", tags=["orders"])

security = HTTPBearer()

def get_access_service(db: Session = Depends(get_db)) -> AccessService:
    repository = AccessRepository(db)
    return AccessService(repository)

@router.post("/", response_model=OrderResponse, status_code=201)
def create_order(
    order_req: OrderCartRequest,
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
    service: AccessService = Depends(get_access_service)
):
    """Crear una nueva orden de compra (con validación de stock y usuario autenticado)"""
    try:
        # 1. Autenticación y obtención del usuario
        try:
            user = service.get_current_user(credentials.credentials)
        except Exception as e:
            raise HTTPException(status_code=401, detail="No autenticado o token inválido")
        user_id = user.id

        # 2. Validación y verificación de stock/precio
        cart_items = order_req.cart_items
        if not cart_items or not isinstance(cart_items, list):
            raise HTTPException(status_code=400, detail="El carrito no puede estar vacío")

        order_items = []
        total = Decimal("0.00")
        product_color_updates = []  # Para actualizar stock luego

        for item in cart_items:
            # Validar existencia de producto
            product = db.query(Product).filter(Product.id == item.productId).first()
            if not product:
                raise HTTPException(status_code=400, detail=f"Producto con id {item.productId} no existe")
            # Validar existencia de color para ese producto
            prod_color = db.query(ProductColor).filter(
                ProductColor.product_id == item.productId,
                ProductColor.color_id == item.colorId
            ).first()
            if not prod_color:
                raise HTTPException(status_code=400, detail=f"Color con id {item.colorId} no disponible para el producto {item.productId}")
            # Validar stock
            if prod_color.stock_quantity < item.quantity:
                raise HTTPException(
                    status_code=409,
                    detail=f"Stock insuficiente para producto {product.name} (color {prod_color.color_id}). Disponible: {prod_color.stock_quantity}, solicitado: {item.quantity}"
                )
            # Precio actual
            unit_price = product.price
            subtotal = unit_price * item.quantity
            total += subtotal
            order_items.append({
                "product_id": item.productId,
                "color_id": item.colorId,
                "quantity": item.quantity,
                "unit_price": unit_price,
                "subtotal": subtotal
            })
            product_color_updates.append((prod_color, item.quantity))

        # 3. Transacción de base de datos
        try:
            # Crear la orden
            db_order = Order(
                user_id=user_id,
                description=order_req.description,
                total=total,
                status=OrderStatus.COMPLETED,
            )
            db.add(db_order)
            db.flush()  # Para obtener el id de la orden

            # Crear los ítems de la orden
            for item in order_items:
                db_item = OrderItem(
                    order_id=db_order.id,
                    product_id=item["product_id"],
                    color_id=item["color_id"],
                    quantity=item["quantity"],
                    unit_price=item["unit_price"],
                    subtotal=item["subtotal"]
                )
                db.add(db_item)

            # Actualizar stock
            for prod_color, qty in product_color_updates:
                prod_color.stock_quantity -= qty
                if prod_color.stock_quantity < 0:
                    raise HTTPException(status_code=409, detail=f"Stock negativo detectado para producto {prod_color.product_id} color {prod_color.color_id}")
                db.add(prod_color)

            db.commit()
            db.refresh(db_order)
        except HTTPException:
            db.rollback()
            raise
        except SQLAlchemyError as e:
            db.rollback()
            # Eliminar logs temporales de depuración
            raise HTTPException(status_code=500, detail="Error de base de datos al crear la orden")

        # 4. Respuesta
        return OrderResponse.from_orm(db_order)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error inesperado: {str(e)}")

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

@router.get("/detail/{order_id}", response_model=OrderDetailResponse)
def get_order_detail(
    order_id: int,
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
    service: AccessService = Depends(get_access_service)
):
    """Obtener todos los detalles de una orden, incluyendo ítems, producto y color. Requiere autenticación."""
    try:
        # Autenticación
        try:
            user = service.get_current_user(credentials.credentials)
        except Exception:
            raise HTTPException(status_code=401, detail="No autenticado o token inválido")
        # Obtener detalle de la orden
        order_service = OrderService(db)
        order_detail = order_service.get_order_detail(order_id)
        if not order_detail:
            raise HTTPException(status_code=404, detail="Orden no encontrada")
        # Solo el dueño de la orden o un admin puede ver el detalle
        if order_detail.user_id != user.id:
            # Si el usuario no es admin, denegar acceso
            if not (hasattr(user, "role") and user.role and user.role.name.lower() == "admin"):
                raise HTTPException(status_code=403, detail="No tiene permiso para ver esta orden")
        return order_detail
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error inesperado: {str(e)}") 