from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List
from ..config.database import get_db
from ..services.role_service import RoleService
from ..schemas.role import RoleResponse

router = APIRouter(prefix="/roles", tags=["roles"])

@router.get("/", response_model=List[RoleResponse])
def get_available_roles(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """Obtener roles disponibles para registro (excluye Admin)"""
    service = RoleService(db)
    roles = service.get_available_roles()
    # Aplicar paginación
    return roles[skip:skip + limit]

@router.get("/all", response_model=List[RoleResponse])
def get_all_roles(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """Obtener todos los roles (incluye Admin) - Solo para administradores"""
    service = RoleService(db)
    roles = service.get_all_roles()
    # Aplicar paginación
    return roles[skip:skip + limit]

@router.get("/{role_id}", response_model=RoleResponse)
def get_role(
    role_id: int,
    db: Session = Depends(get_db)
):
    """Obtener un rol específico por ID"""
    service = RoleService(db)
    role = service.get_role_by_id(role_id)
    if not role:
        raise HTTPException(status_code=404, detail="Rol no encontrado")
    return role 