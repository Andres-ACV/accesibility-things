#!/usr/bin/env python3
"""
Script para poblar la base de datos con datos iniciales: roles, users y categories
"""
from app.config.database import SessionLocal
from app.models.role import Role
from app.models.user import User
from app.models.category import Category
from datetime import datetime

# Datos iniciales
ROLES = [
    {"id": 1, "name": "Admin", "description": "Administrador del sistema"},
    {"id": 3, "name": "Vendedor", "description": "Para vender productos y gestionar inventario"},
    {"id": 2, "name": "Comprador", "description": "Para comprar productos de accesibilidad"},
]

USERS = [
    {
        "id": 1,
        "email": "danny@gmail.com",
        "city": "Heredia",
        "hashed_password": "$2b$12$FJN7N5jnGOpD8IzhIcD6b.pbuIvAhmyHGLqmeb/RNvGGKgKktIIDO",
        "full_name": "Danny Valerio",
        "role_id": 2,
        "is_active": True,
        "is_verified": False,
        "created_at": datetime(2025, 7, 18, 23, 48, 14, 949000),
        "updated_at": datetime(2025, 7, 19, 0, 41, 23, 217000),
        "address": "San isidro",
        "phone": "+50687429308"
    },
    {
        "id": 2,
        "email": "jun@gmail.com",
        "city": "Heredia",
        "hashed_password": "$2b$12$Yi6r6ieMni.Z3TtEWocHe.I2O8uiRr3itYGWFfIOgI9wVvZqXe85C",
        "full_name": "Juan Pepe",
        "role_id": 3,
        "is_active": True,
        "is_verified": False,
        "created_at": datetime(2025, 7, 19, 14, 43, 46, 199000),
        "updated_at": None,
        "address": "Heredia",
        "phone": "+506 8888-8888"
    },
]

CATEGORIES = [
    {"name": "Movilidad", "description": "Sillas de ruedas, bastones, andadores y más"},
    {"name": "Discapacidad Auditiva", "description": "Audífonos, amplificadores, alertas visuales"},
    {"name": "Discapacidad visual", "description": "Bastones, lupas, productos táctiles"},
    {"name": "Hogar accesible", "description": "Agarraderas, rampas y demás"},
]

def seed_roles(db):
    for role in ROLES:
        exists = db.query(Role).filter_by(id=role["id"]).first()
        if not exists:
            db_role = Role(**role)
            db.add(db_role)
            print(f"✅ Rol '{role['name']}' creado correctamente.")
        else:
            print(f"ℹ️  Rol '{role['name']}' ya existe.")
    db.commit()

def seed_users(db):
    for user in USERS:
        exists = db.query(User).filter_by(id=user["id"]).first()
        if not exists:
            db_user = User(**user)
            db.add(db_user)
            print(f"✅ Usuario '{user['email']}' creado correctamente.")
        else:
            print(f"ℹ️  Usuario '{user['email']}' ya existe.")
    db.commit()

def seed_categories(db):
    for cat in CATEGORIES:
        exists = db.query(Category).filter_by(name=cat["name"]).first()
        if not exists:
            db_cat = Category(**cat)
            db.add(db_cat)
            print(f"✅ Categoría '{cat['name']}' creada correctamente.")
        else:
            print(f"ℹ️  Categoría '{cat['name']}' ya existe.")
    db.commit()

# ===================== NUEVO: Seed de colors, products, product_colors, product_images =====================
from app.models.color import Color
from app.models.product import Product
from app.models.product_color import ProductColor
from app.models.product_image import ProductImage
from app.models.order import Order, OrderStatus
from app.models.order_item import OrderItem

# Colores a insertar
SEED_COLORS = [
    {"id": 1, "name": "Negra", "hex_code": "#000000", "description": "Color negro estándar"},
    {"id": 2, "name": "Roja", "hex_code": "#FF0000", "description": "Color rojo vibrante"},
    {"id": 3, "name": "Verde", "hex_code": "#00FF00", "description": "Color verde brillante"},
    {"id": 4, "name": "Azul", "hex_code": "#0000FF", "description": "Color azul primario"},
    {"id": 5, "name": "Café", "hex_code": "#6F4E37", "description": "Color café oscuro"},
    {"id": 6, "name": "Gris", "hex_code": "#808080", "description": "Color gris neutro"},
]

# Productos y relaciones
SEED_PRODUCTS = [
    {
        "id": 1,
        "name": "Silla de Ruedas Estándar",
        "description": "Silla de ruedas cómoda y duradera para movilidad diaria.",
        "price": 250.00,
        "category_name": "Movilidad",
        "average_rating": 0.0,
        "is_active": True,
        "colors": ["Negra", "Roja", "Verde"],
        "images": [
            {"image_url": "images/Silla_negra.jpg", "is_primary": True},
            {"image_url": "images/Silla_roja.jpg", "is_primary": False},
            {"image_url": "images/Silla_verde.jpg", "is_primary": False},
        ]
    },
    {
        "id": 2,
        "name": "Bastón Plegable Ajustable",
        "description": "Bastón ligero y plegable, ideal para apoyo y estabilidad.",
        "price": 45.00,
        "category_name": "Discapacidad visual",
        "average_rating": 0.0,
        "is_active": True,
        "colors": ["Negra", "Verde"],
        "images": [
            {"image_url": "images/baston_negro.webp", "is_primary": True},
            {"image_url": "images/baston_negro2.webp", "is_primary": False},
            {"image_url": "images/baston_verde.webp", "is_primary": False},
        ]
    },
    {
        "id": 3,
        "name": "Audífonos Digitales Premium",
        "description": "Audífonos de alta fidelidad para mejorar la audición.",
        "price": 300.00,
        "category_name": "Discapacidad Auditiva",
        "average_rating": 0.0,
        "is_active": True,
        "colors": ["Azul", "Café"],
        "images": [
            {"image_url": "images/auditiva_azul.jpg", "is_primary": True},
            {"image_url": "images/auditiva_cafe.jpg", "is_primary": False},
        ]
    },
    {
        "id": 4,
        "name": "Agarradera de Seguridad para Baño",
        "description": "Barra de apoyo robusta para mayor seguridad en el baño.",
        "price": 30.00,
        "category_name": "Hogar accesible",
        "average_rating": 0.0,
        "is_active": True,
        "colors": ["Gris"],
        "images": [
            {"image_url": "images/agrarradera_gris.jpg", "is_primary": True},
            {"image_url": "images/agrarradera_gris2.jpg", "is_primary": False},
        ]
    },
]

# Helper para obtener o crear color
def get_or_create_color(db, color_data):
    # Verificar si el color ya existe por ID
    color = db.query(Color).filter_by(id=color_data["id"]).first()
    if color:
        print(f"ℹ️  Color '{color_data['name']}' ya existe.")
        return color
    
    # Verificar si existe por nombre
    existing_color = db.query(Color).filter_by(name=color_data["name"]).first()
    if existing_color:
        print(f"ℹ️  Color '{color_data['name']}' ya existe con diferente ID.")
        return existing_color
    
    # Crear nuevo color con el ID especificado
    color = Color(**color_data)
    db.add(color)
    db.commit()
    db.refresh(color)
    print(f"✅ Color '{color_data['name']}' creado con ID {color_data['id']}.")
    return color

# Helper para obtener o crear categoría
def get_or_create_category(db, name, description=None):
    category = db.query(Category).filter_by(name=name).first()
    if category:
        return category
    category = Category(name=name, description=description)
    db.add(category)
    db.commit()
    db.refresh(category)
    print(f"✅ Categoría '{name}' creada.")
    return category

# Seed de colores
def seed_colors(db):
    for color_data in SEED_COLORS:
        get_or_create_color(db, color_data)
    db.commit()

# Seed de productos y relaciones
def seed_products_and_relations(db):
    for prod in SEED_PRODUCTS:
        # Obtener categoría (crear si no existe para 'Hogar accesible')
        category = db.query(Category).filter_by(name=prod["category_name"]).first()
        if not category:
            print(f"⚠️  Categoría '{prod['category_name']}' no existe. Creando...")
            category = get_or_create_category(db, prod["category_name"], description="Categoría agregada automáticamente por el seeder.")
        
        # Verificar si el producto ya existe por ID
        existing_product = db.query(Product).filter_by(id=prod["id"]).first()
        if existing_product:
            print(f"ℹ️  Producto '{prod['name']}' ya existe con ID {prod['id']}. Saltando...")
            continue
        
        # Verificar si existe por nombre
        existing_product_by_name = db.query(Product).filter_by(name=prod["name"]).first()
        if existing_product_by_name:
            print(f"ℹ️  Producto '{prod['name']}' ya existe con diferente ID. Saltando...")
            continue
        
        # Definir rating_count y average_rating según el producto
        if prod["id"] == 1:
            rating_count = 1
            average_rating = 4.0
        else:
            rating_count = 0
            average_rating = 0.0
        # Crear producto con el ID especificado
        product = Product(
            id=prod["id"],
            name=prod["name"],
            description=prod["description"],
            price=prod["price"],
            category_id=category.id,
            seller_id=2,  # Juan Pepe (ID: 2) es el vendedor
            average_rating=average_rating,
            rating_count=rating_count,
            is_active=prod["is_active"]
        )
        db.add(product)
        db.commit()
        db.refresh(product)
        print(f"✅ Producto '{prod['name']}' creado con ID {prod['id']}.")
        
        # Colores disponibles para el producto
        for color_name in prod["colors"]:
            color = db.query(Color).filter_by(name=color_name).first()
            if not color:
                print(f"❌ Error: Color '{color_name}' no encontrado para el producto '{prod['name']}'")
                continue
            prod_color = ProductColor(
                product_id=product.id,
                color_id=color.id,
                is_available=True,
                stock_quantity=100
            )
            db.add(prod_color)
        db.commit()
        
        # Imágenes del producto
        for img in prod["images"]:
            prod_img = ProductImage(
                product_id=product.id,
                image_url=img["image_url"],
                is_primary=img["is_primary"]
            )
            db.add(prod_img)
        db.commit()

# ===================== NUEVO: Seed de orders y order_items =====================

# Datos de la orden de prueba
SEED_ORDER = {
    "id": 1,
    "user_id": 1,  # Danny Valerio (Comprador)
    "description": "Orden de prueba para silla de ruedas estándar.",
    "total": 250.00,
    "status": OrderStatus.COMPLETED,
    "order_date": datetime.now(),
    "created_at": datetime.now(),
    "updated_at": datetime.now()
}

# Datos del ítem de la orden
SEED_ORDER_ITEM = {
    "order_id": 1,
    "product_id": 1,  # Silla de Ruedas Estándar
    "color_id": 1,    # Color Negra
    "quantity": 1,
    "unit_price": 250.00,
    "subtotal": 250.00,
    "created_at": datetime.now()
}

# Helper para obtener o crear orden
def get_or_create_order(db, order_data):
    # Verificar si la orden ya existe por ID
    order = db.query(Order).filter_by(id=order_data["id"]).first()
    if order:
        print(f"ℹ️  Orden con ID {order_data['id']} ya existe.")
        return order
    
    # Verificar si el usuario existe
    user = db.query(User).filter_by(id=order_data["user_id"]).first()
    if not user:
        print(f"❌ Error: Usuario con ID {order_data['user_id']} no encontrado.")
        return None
    
    # Crear nueva orden con el ID especificado
    order = Order(**order_data)
    db.add(order)
    db.commit()
    db.refresh(order)
    print(f"✅ Orden creada con ID {order_data['id']} para usuario {user.full_name}.")
    return order

# Helper para obtener o crear ítem de orden
def get_or_create_order_item(db, item_data):
    # Verificar si el ítem ya existe por order_id y product_id
    existing_item = db.query(OrderItem).filter_by(
        order_id=item_data["order_id"],
        product_id=item_data["product_id"],
        color_id=item_data["color_id"]
    ).first()
    
    if existing_item:
        print(f"ℹ️  Ítem de orden ya existe para orden {item_data['order_id']}, producto {item_data['product_id']}, color {item_data['color_id']}.")
        return existing_item
    
    # Verificar que la orden existe
    order = db.query(Order).filter_by(id=item_data["order_id"]).first()
    if not order:
        print(f"❌ Error: Orden con ID {item_data['order_id']} no encontrada.")
        return None
    
    # Verificar que el producto existe
    product = db.query(Product).filter_by(id=item_data["product_id"]).first()
    if not product:
        print(f"❌ Error: Producto con ID {item_data['product_id']} no encontrado.")
        return None
    
    # Verificar que el color existe
    color = db.query(Color).filter_by(id=item_data["color_id"]).first()
    if not color:
        print(f"❌ Error: Color con ID {item_data['color_id']} no encontrado.")
        return None
    
    # Crear nuevo ítem de orden
    order_item = OrderItem(**item_data)
    db.add(order_item)
    db.commit()
    db.refresh(order_item)
    print(f"✅ Ítem de orden creado: {product.name} - {color.name} x{item_data['quantity']} = ${item_data['subtotal']}")
    return order_item

# Seed de órdenes y ítems
def seed_orders_and_items(db):
    print("\n=== Poblando órdenes y ítems de orden ===")
    
    # Crear la orden
    order = get_or_create_order(db, SEED_ORDER)
    if not order:
        print("❌ No se pudo crear la orden. Saltando creación de ítems.")
        return
    
    # Crear el ítem de la orden
    order_item = get_or_create_order_item(db, SEED_ORDER_ITEM)
    if not order_item:
        print("❌ No se pudo crear el ítem de la orden.")
        return
    
    print("✅ Orden y ítem de orden creados exitosamente.")

# Llamar a los seeders desde main

def main():
    db = SessionLocal()
    try:
        seed_roles(db)
        seed_users(db)
        seed_categories(db)
        seed_colors(db)  # Nuevo: poblar colores
        seed_products_and_relations(db)  # Nuevo: poblar productos y relaciones
        seed_orders_and_items(db)  # Nuevo: poblar órdenes y ítems
    except Exception as e:
        db.rollback()
        print(f"❌ Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    main() 