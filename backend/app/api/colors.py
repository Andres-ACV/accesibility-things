from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List
from ..config.database import get_db
from ..services.color_service import ColorService
from ..schemas.color import ColorCreate, ColorUpdate, ColorResponse

router = APIRouter(prefix="/colors", tags=["colors"])

@router.post("/", response_model=ColorResponse)
def create_color(
    color: ColorCreate,
    db: Session = Depends(get_db)
):
    """Crear un nuevo color"""
    service = ColorService(db)
    return service.create_color(color)

@router.get("/", response_model=List[ColorResponse])
def get_colors(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """Obtener lista de colores"""
    service = ColorService(db)
    return service.get_colors(skip=skip, limit=limit)

@router.get("/{color_id}", response_model=ColorResponse)
def get_color(
    color_id: int,
    db: Session = Depends(get_db)
):
    """Obtener un color por ID"""
    service = ColorService(db)
    color = service.get_color(color_id)
    if not color:
        raise HTTPException(status_code=404, detail="Color no encontrado")
    return color

@router.put("/{color_id}", response_model=ColorResponse)
def update_color(
    color_id: int,
    color: ColorUpdate,
    db: Session = Depends(get_db)
):
    """Actualizar un color"""
    service = ColorService(db)
    updated_color = service.update_color(color_id, color)
    if not updated_color:
        raise HTTPException(status_code=404, detail="Color no encontrado")
    return updated_color

@router.delete("/{color_id}")
def delete_color(
    color_id: int,
    db: Session = Depends(get_db)
):
    """Eliminar un color"""
    service = ColorService(db)
    success = service.delete_color(color_id)
    if not success:
        raise HTTPException(status_code=404, detail="Color no encontrado")
    return {"message": "Color eliminado exitosamente"} 