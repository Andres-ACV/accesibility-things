from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from ..config.database import Base

class ProductType(Base):
    __tablename__ = "product_types"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)
    type = Column(String, nullable=False)
    description = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now()) 