from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from ..models.product import Product
from ..models.order_item import OrderItem
from ..models.product_image import ProductImage
from ..schemas.product import ProductCreate, ProductUpdate, ProductResponse, TopSellingProductResponse, ProductDetailResponse
from ..schemas.category import CategoryResponse
from ..schemas.product_color import ProductColorResponse
from ..schemas.product_image import ProductImageResponse
from ..models.product_color import ProductColor
from ..models.color import Color
from ..models.product_image import ProductImage
from ..repositories.category_repository import CategoryRepository
from ..repositories.color_repository import ColorRepository

class ProductService:
    def __init__(self, db: Session):
        self.db = db
        self.category_repo = CategoryRepository(db)
    
    def create_product(self, product_data: ProductCreate) -> ProductResponse:
        """Crear un nuevo producto"""
        # Verificar que la categoría existe
        if not self.category_repo.get_by_id(product_data.category_id):
            raise ValueError("Categoría no encontrada")
        
        # Los colores se manejan a través de la tabla ProductColor
        # No hay validación directa de color_id en el producto
        
        db_product = Product(**product_data.dict())
        self.db.add(db_product)
        self.db.commit()
        self.db.refresh(db_product)
        return ProductResponse.from_orm(db_product)
    
    def get_product(self, product_id: int) -> Optional[ProductResponse]:
        """Obtener un producto por ID"""
        product = self.db.query(Product).filter(Product.id == product_id).first()
        if product:
            return ProductResponse.from_orm(product)
        return None
    
    def get_products(
        self,
        page: int = 1,
        limit: int = 4,
        category_id: Optional[int] = None,
        sort_by: str = "id",
        sort_order: str = "asc",
        category_name: Optional[str] = None,
        min_price: Optional[float] = None,
        max_price: Optional[float] = None,
        min_avg_rating: Optional[float] = None,
        color_id: Optional[int] = None,
        color_name: Optional[str] = None,
        search: Optional[str] = None
    ) -> dict:
        """Obtener lista de productos paginada y ordenada, con total de productos y filtros avanzados"""
        query = self.db.query(Product)

        # --- Filtro por búsqueda de nombre (aproximación, insensible a mayúsculas/minúsculas) ---
        if search:
            search_term = search.strip()
            if search_term:
                query = query.filter(Product.name.ilike(f"%{search_term}%"))

        # --- Filtro por categoría (id o nombre) ---
        if category_id:
            query = query.filter(Product.category_id == category_id)
        elif category_name:
            category = self.category_repo.get_by_name(category_name)
            if not category:
                return {"total_products": 0, "page": page, "limit": limit, "products": []}
            query = query.filter(Product.category_id == category.id)

        # --- Filtro por rango de precio ---
        if min_price is not None:
            query = query.filter(Product.price >= min_price)
        if max_price is not None:
            query = query.filter(Product.price <= max_price)

        # --- Filtro por calificación promedio ---
        if min_avg_rating is not None:
            query = query.filter(Product.average_rating >= min_avg_rating)

        # --- Filtro por color (id o nombre) ---
        if color_id or color_name:
            color_repo = ColorRepository(self.db)
            if color_id:
                color = color_repo.get_by_id(color_id)
            else:
                color = color_repo.get_by_name(color_name)
            if not color:
                return {"total_products": 0, "page": page, "limit": limit, "products": []}
            # Join con ProductColor para filtrar productos disponibles en ese color
            from ..models.product_color import ProductColor
            query = query.join(ProductColor, Product.id == ProductColor.product_id)
            query = query.filter(ProductColor.color_id == color.id, ProductColor.is_available == True)

        # Total antes de paginar
        total_products = query.distinct().count()

        # Ordenamiento seguro
        allowed_sort_fields = {"id", "name", "price", "average_rating", "created_at", "updated_at"}
        if sort_by not in allowed_sort_fields:
            sort_by = "id"
        sort_column = getattr(Product, sort_by)
        if sort_order == "desc":
            sort_column = sort_column.desc()
        else:
            sort_column = sort_column.asc()
        query = query.order_by(sort_column)

        # Paginación
        offset = (page - 1) * limit
        products = query.offset(offset).limit(limit).all()
        result = []
        for product in products:
            # Obtener la imagen principal (is_primary=True) o la primera imagen
            image = self.db.query(ProductImage).filter(
                ProductImage.product_id == product.id,
                ProductImage.is_primary == True
            ).first()
            if not image:
                image = self.db.query(ProductImage).filter(
                    ProductImage.product_id == product.id
                ).first()
            image_url = image.image_url if image else None
            # Construir la respuesta incluyendo image_url
            product_data = ProductResponse.from_orm(product).dict()
            product_data["image_url"] = image_url
            result.append(ProductResponse(**product_data))
        return {
            "total_products": total_products,
            "page": page,
            "limit": limit,
            "products": result
        }
    
    def get_top_selling_products(self, limit: int = 4) -> List[TopSellingProductResponse]:
        """Obtener los productos más vendidos basado en la cantidad total vendida"""
        try:
            # Subconsulta para obtener la cantidad total vendida por producto
            subquery = self.db.query(
                OrderItem.product_id,
                func.sum(OrderItem.quantity).label('total_sold')
            ).group_by(OrderItem.product_id).subquery()
            
            # Consulta principal que une productos con sus ventas totales
            top_products = self.db.query(
                Product,
                subquery.c.total_sold
            ).join(
                subquery, Product.id == subquery.c.product_id
            ).order_by(
                desc(subquery.c.total_sold)
            ).limit(limit).all()
            
            result = []
            for product, total_sold in top_products:
                # Obtener la primera imagen del producto (o la imagen principal si existe)
                image = self.db.query(ProductImage).filter(
                    ProductImage.product_id == product.id
                ).filter(
                    ProductImage.is_primary == True
                ).first()
                
                # Si no hay imagen principal, obtener la primera imagen
                if not image:
                    image = self.db.query(ProductImage).filter(
                        ProductImage.product_id == product.id
                    ).first()
                
                # Crear el objeto de respuesta
                product_data = {
                    "name": product.name,
                    "average_rating": product.average_rating,
                    "price": product.price,
                    "image_url": image.image_url if image else None
                }
                
                result.append(TopSellingProductResponse(**product_data))
            
            return result
            
        except Exception as e:
            # En caso de error, retornar lista vacía
            print(f"Error obteniendo productos más vendidos: {e}")
            return []
    
    def update_product(self, product_id: int, product_data: ProductUpdate) -> Optional[ProductResponse]:
        """Actualizar un producto"""
        product = self.db.query(Product).filter(Product.id == product_id).first()
        if not product:
            return None
        
        # Verificar que la categoría existe si se está actualizando
        if product_data.category_id and not self.category_repo.get_by_id(product_data.category_id):
            raise ValueError("Categoría no encontrada")
        
        # Los colores se manejan a través de la tabla ProductColor
        # No hay validación directa de color_id en el producto
        
        update_data = product_data.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(product, field, value)
        
        self.db.commit()
        self.db.refresh(product)
        return ProductResponse.from_orm(product)
    
    def delete_product(self, product_id: int) -> bool:
        """Eliminar un producto"""
        product = self.db.query(Product).filter(Product.id == product_id).first()
        if not product:
            return False
        
        self.db.delete(product)
        self.db.commit()
        return True
    
    def search_products(self, search_term: str, skip: int = 0, limit: int = 100) -> List[ProductResponse]:
        """Buscar productos por nombre o descripción"""
        products = self.db.query(Product).filter(
            Product.name.ilike(f"%{search_term}%") | 
            Product.description.ilike(f"%{search_term}%")
        ).offset(skip).limit(limit).all()
        
        return [ProductResponse.from_orm(product) for product in products] 

    def get_product_detail(self, product_id: int) -> Optional[dict]:
        """Obtener todos los detalles de un producto, incluyendo categoría, colores e imágenes"""
        product = self.db.query(Product).filter(Product.id == product_id).first()
        if not product:
            return None
        # Obtener categoría
        category = product.category
        category_data = CategoryResponse.from_orm(category)
        # Obtener colores disponibles (join ProductColor + Color)
        product_colors = (
            self.db.query(ProductColor)
            .filter(ProductColor.product_id == product_id)
            .all()
        )
        colors = []
        for pc in product_colors:
            color = self.db.query(Color).filter(Color.id == pc.color_id).first()
            color_data = {
                "id": pc.id,
                "product_id": pc.product_id,
                "color_id": pc.color_id,
                "is_available": pc.is_available,
                "stock_quantity": pc.stock_quantity,
                "created_at": pc.created_at,
                "updated_at": pc.updated_at,
                # Detalles del color:
                "name": color.name if color else None,
                "hex_code": color.hex_code if color else None,
                "description": color.description if color else None,
            }
            # Usar ProductColorResponse, pero extender con detalles de color
            colors.append(color_data)
        # Obtener imágenes
        images = (
            self.db.query(ProductImage)
            .filter(ProductImage.product_id == product_id)
            .all()
        )
        images_data = [ProductImageResponse.from_orm(img) for img in images]
        # Construir respuesta
        detail = {
            "id": product.id,
            "name": product.name,
            "description": product.description,
            "price": product.price,
            "average_rating": product.average_rating,
            "is_active": product.is_active,
            "created_at": product.created_at,
            "updated_at": product.updated_at,
            "category": category_data,
            "colors": colors,
            "images": images_data
        }
        return detail 