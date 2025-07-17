#!/usr/bin/env python3
"""
Script para poblar la base de datos con los roles iniciales: Admin, Comprador, Vendedor
"""
from app.config.database import SessionLocal
from app.repositories.role_repository import RoleRepository
from app.schemas.role import RoleCreate

ROLES = [
    {"name": "Admin", "description": "Administrador del sistema"},
    {"name": "Comprador", "description": "Usuario que puede comprar productos"},
    {"name": "Vendedor", "description": "Usuario que puede vender productos"},
]

def main():
    db = SessionLocal()
    repo = RoleRepository(db)
    for role in ROLES:
        try:
            repo.create(RoleCreate(**role))
            print(f"✅ Rol '{role['name']}' creado correctamente.")
        except Exception as e:
            print(f"⚠️  No se pudo crear el rol '{role['name']}': {e}")
    db.close()

if __name__ == "__main__":
    main() 