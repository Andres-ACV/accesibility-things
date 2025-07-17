#!/usr/bin/env python3
"""
Script para probar el endpoint de roles
"""
import requests
import json

BASE_URL = "http://localhost:8000"

def test_roles_endpoint():
    """Probar el endpoint de roles"""
    try:
        print("🔄 Probando endpoint de roles...")
        
        # Probar GET /roles (roles disponibles para registro)
        response = requests.get(f"{BASE_URL}/roles")
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            roles = response.json()
            print(f"✅ Roles disponibles: {len(roles)}")
            for role in roles:
                print(f"  - ID: {role['id']}, Nombre: {role['name']}, Descripción: {role['description']}")
        else:
            print(f"❌ Error: {response.text}")
            
        # Probar GET /roles/all (todos los roles incluyendo Admin)
        print("\n🔄 Probando endpoint de todos los roles...")
        response = requests.get(f"{BASE_URL}/roles/all")
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            all_roles = response.json()
            print(f"✅ Todos los roles: {len(all_roles)}")
            for role in all_roles:
                print(f"  - ID: {role['id']}, Nombre: {role['name']}, Descripción: {role['description']}")
        else:
            print(f"❌ Error: {response.text}")
            
    except Exception as e:
        print(f"❌ Error de conexión: {e}")

if __name__ == "__main__":
    test_roles_endpoint() 