from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from ..models.role import Role
from ..schemas.role import RoleCreate, RoleUpdate
from typing import List, Optional

class RoleRepository:
    def __init__(self, db: Session):
        self.db = db
    
    def get_all(self) -> List[Role]:
        return self.db.query(Role).all()
    
    def get_by_id(self, role_id: int) -> Optional[Role]:
        return self.db.query(Role).filter(Role.id == role_id).first()
    
    def create(self, role_data: RoleCreate) -> Role:
        db_role = Role(**role_data.dict())
        try:
            self.db.add(db_role)
            self.db.commit()
            self.db.refresh(db_role)
            return db_role
        except IntegrityError:
            self.db.rollback()
            raise ValueError("Role with this name already exists")
    
    def update(self, role_id: int, role_data: RoleUpdate) -> Optional[Role]:
        db_role = self.get_by_id(role_id)
        if not db_role:
            return None
        
        update_data = role_data.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_role, field, value)
        
        try:
            self.db.commit()
            self.db.refresh(db_role)
            return db_role
        except IntegrityError:
            self.db.rollback()
            raise ValueError("Role with this name already exists")
    
    def delete(self, role_id: int) -> bool:
        db_role = self.get_by_id(role_id)
        if not db_role:
            return False
        
        self.db.delete(db_role)
        self.db.commit()
        return True 