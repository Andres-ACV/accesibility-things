#!/usr/bin/env python3
"""
Script de prueba para verificar la funcionalidad del campo phone
"""

import requests
import json
from typing import Dict, Any

# Configuración
BASE_URL = "http://localhost:8000"
TEST_EMAIL = "test_phone@example.com"
TEST_PASSWORD = "TestPassword123"

def test_register_with_phone():
    """Prueba el registro de usuario con campo phone"""
    print("🔍 Probando registro con campo phone...")
    
    register_data = {
        "email": TEST_EMAIL,
        "password": TEST_PASSWORD,
        "full_name": "Usuario Test Phone",
        "phone": "+506 8888-8888",
        "address": "Dirección de prueba",
        "city": "San José",
        "role_id": 2  # Comprador
    }
    
    try:
        response = requests.post(f"{BASE_URL}/auth/register", json=register_data)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 201:
            data = response.json()
            print("✅ Registro exitoso!")
            print(f"Usuario creado: {data['user']['full_name']}")
            print(f"Phone: {data['user']['phone']}")
            print(f"Token: {data['access_token'][:20]}...")
            return data['access_token']
        else:
            print(f"❌ Error en registro: {response.text}")
            return None
            
    except requests.exceptions.ConnectionError:
        print("❌ No se pudo conectar al servidor. Asegúrate de que esté ejecutándose.")
        return None
    except Exception as e:
        print(f"❌ Error inesperado: {e}")
        return None

def test_get_profile(token: str):
    """Prueba obtener el perfil del usuario"""
    print("\n🔍 Probando obtención de perfil...")
    
    headers = {"Authorization": f"Bearer {token}"}
    
    try:
        response = requests.get(f"{BASE_URL}/auth/profile", headers=headers)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Perfil obtenido exitosamente!")
            print(f"Email: {data['email']}")
            print(f"Full Name: {data['full_name']}")
            print(f"Phone: {data['phone']}")
            print(f"Address: {data['address']}")
            print(f"City: {data['city']}")
            print(f"Role: {data['role_name']}")
            return True
        else:
            print(f"❌ Error obteniendo perfil: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Error inesperado: {e}")
        return False

def test_update_profile_phone(token: str):
    """Prueba actualizar el campo phone del perfil"""
    print("\n🔍 Probando actualización de phone...")
    
    headers = {"Authorization": f"Bearer {token}"}
    update_data = {
        "phone": "+506 9999-9999",
        "address": "Nueva dirección actualizada"
    }
    
    try:
        response = requests.put(f"{BASE_URL}/auth/profile", json=update_data, headers=headers)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Perfil actualizado exitosamente!")
            print(f"Phone actualizado: {data['phone']}")
            print(f"Address actualizado: {data['address']}")
            return True
        else:
            print(f"❌ Error actualizando perfil: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Error inesperado: {e}")
        return False

def test_register_without_phone():
    """Prueba el registro sin campo phone (debe ser opcional)"""
    print("\n🔍 Probando registro sin campo phone...")
    
    register_data = {
        "email": "test_no_phone@example.com",
        "password": TEST_PASSWORD,
        "full_name": "Usuario Sin Phone",
        "address": "Dirección sin phone",
        "city": "Heredia",
        "role_id": 2  # Comprador
    }
    
    try:
        response = requests.post(f"{BASE_URL}/auth/register", json=register_data)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 201:
            data = response.json()
            print("✅ Registro sin phone exitoso!")
            print(f"Usuario creado: {data['user']['full_name']}")
            print(f"Phone: {data['user']['phone']} (debe ser None)")
            return data['access_token']
        else:
            print(f"❌ Error en registro sin phone: {response.text}")
            return None
            
    except Exception as e:
        print(f"❌ Error inesperado: {e}")
        return None

def main():
    """Función principal de pruebas"""
    print("🚀 Iniciando pruebas del campo phone...")
    print("=" * 50)
    
    # Prueba 1: Registro con phone
    token1 = test_register_with_phone()
    if token1:
        test_get_profile(token1)
        test_update_profile_phone(token1)
    
    # Prueba 2: Registro sin phone
    token2 = test_register_without_phone()
    if token2:
        test_get_profile(token2)
    
    print("\n" + "=" * 50)
    print("🏁 Pruebas completadas!")

if __name__ == "__main__":
    main() 