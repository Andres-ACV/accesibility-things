from sqlalchemy.orm import Session
from typing import List, Optional
from ..repositories.role_repository import RoleRepository
from ..schemas.role import RoleResponse

class RoleService:
    def __init__(self, db: Session):
        self.repository = RoleRepository(db)
    
    def get_available_roles(self) -> List[RoleResponse]:
        """Obtener roles disponibles para registro (excluye Admin)"""
        all_roles = self.repository.get_all()
        # Filtrar para excluir el rol Admin y convertir a RoleResponse
        available_roles = [
            RoleResponse.from_orm(role) 
            for role in all_roles 
            if role.name.lower() != "admin"
        ]
        return available_roles
    
    def get_all_roles(self) -> List[RoleResponse]:
        """Obtener todos los roles (incluye Admin)"""
        all_roles = self.repository.get_all()
        return [RoleResponse.from_orm(role) for role in all_roles]
    
    def get_role_by_id(self, role_id: int) -> Optional[RoleResponse]:
        """Obtener un rol por ID"""
        role = self.repository.get_by_id(role_id)
        if role:
            return RoleResponse.from_orm(role)
        return None 