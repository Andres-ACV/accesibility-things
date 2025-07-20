#!/usr/bin/env python3
"""
Test script for /auth/profile endpoint to verify it includes role_name
"""

import requests
import json
import sys
from typing import Dict, Any

# Configuration
BASE_URL = "http://localhost:8000"
LOGIN_ENDPOINT = f"{BASE_URL}/auth/login"
PROFILE_ENDPOINT = f"{BASE_URL}/auth/profile"

def test_backend_connection() -> bool:
    """Test if backend is running"""
    try:
        response = requests.get(f"{BASE_URL}/docs")
        return response.status_code == 200
    except requests.exceptions.ConnectionError:
        print("❌ Error: No se pudo conectar al backend")
        print("   Asegúrate de que el servidor esté ejecutándose en http://localhost:8000")
        return False

def login_user(email: str, password: str) -> str:
    """Login user and return access token"""
    login_data = {
        "email": email,
        "password": password
    }
    
    try:
        response = requests.post(LOGIN_ENDPOINT, json=login_data)
        
        if response.status_code == 200:
            token_data = response.json()
            return token_data.get("access_token")
        else:
            print(f"❌ Error en login: {response.status_code}")
            print(f"   Respuesta: {response.text}")
            return None
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Error de conexión: {e}")
        return None

def get_user_profile(token: str) -> Dict[str, Any]:
    """Get user profile with role information"""
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    try:
        response = requests.get(PROFILE_ENDPOINT, headers=headers)
        
        if response.status_code == 200:
            return response.json()
        else:
            print(f"❌ Error obteniendo perfil: {response.status_code}")
            print(f"   Respuesta: {response.text}")
            return None
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Error de conexión: {e}")
        return None

def analyze_profile_response(profile_data: Dict[str, Any]) -> bool:
    """Analyze profile response and check for role_name field"""
    print("\n📋 Análisis de la respuesta del perfil:")
    print("=" * 50)
    
    # Check if role_name field exists
    has_role_name = "role_name" in profile_data
    role_id = profile_data.get("role_id")
    role_name = profile_data.get("role_name")
    
    print(f"✅ Campo 'role_name' presente: {has_role_name}")
    print(f"📊 role_id: {role_id}")
    print(f"📊 role_name: {role_name}")
    
    # Check if role_name matches expected values
    role_mapping = {
        1: "Comprador",
        2: "Vendedor",
        3: "Administrador"
    }
    
    expected_role_name = role_mapping.get(role_id, "Desconocido")
    role_name_correct = role_name == expected_role_name
    
    print(f"✅ Nombre de rol correcto: {role_name_correct}")
    print(f"   Esperado: {expected_role_name}")
    print(f"   Obtenido: {role_name}")
    
    # Show complete response structure
    print(f"\n📄 Estructura completa de la respuesta:")
    print(json.dumps(profile_data, indent=2, default=str))
    
    return has_role_name and role_name_correct

def test_profile_endpoint():
    """Main test function"""
    print("🧪 Prueba del Endpoint /auth/profile")
    print("=" * 50)
    
    # Test backend connection
    print("1. Verificando conexión con el backend...")
    if not test_backend_connection():
        return False
    print("✅ Backend conectado correctamente")
    
    # Test credentials (you may need to adjust these)
    test_credentials = [
        {"email": "test@example.com", "password": "password123", "description": "Usuario de prueba"},
        {"email": "admin@example.com", "password": "admin123", "description": "Administrador"},
        {"email": "seller@example.com", "password": "seller123", "description": "Vendedor"}
    ]
    
    success_count = 0
    total_tests = len(test_credentials)
    
    for i, creds in enumerate(test_credentials, 1):
        print(f"\n{i}. Probando con {creds['description']}...")
        print(f"   Email: {creds['email']}")
        
        # Login
        token = login_user(creds['email'], creds['password'])
        if not token:
            print(f"   ❌ Falló el login para {creds['email']}")
            continue
        
        print(f"   ✅ Login exitoso")
        
        # Get profile
        profile_data = get_user_profile(token)
        if not profile_data:
            print(f"   ❌ Falló obtener perfil para {creds['email']}")
            continue
        
        print(f"   ✅ Perfil obtenido exitosamente")
        
        # Analyze response
        if analyze_profile_response(profile_data):
            success_count += 1
            print(f"   ✅ Prueba exitosa para {creds['email']}")
        else:
            print(f"   ❌ Prueba falló para {creds['email']}")
    
    # Summary
    print(f"\n📊 Resumen de Pruebas:")
    print("=" * 50)
    print(f"✅ Pruebas exitosas: {success_count}/{total_tests}")
    print(f"❌ Pruebas fallidas: {total_tests - success_count}/{total_tests}")
    
    if success_count == total_tests:
        print("\n🎉 ¡Todas las pruebas pasaron!")
        print("   El endpoint /auth/profile ahora incluye correctamente el campo 'role_name'")
        return True
    else:
        print(f"\n⚠️  {total_tests - success_count} prueba(s) falló(aron)")
        print("   Revisa los errores anteriores para más detalles")
        return False

def test_specific_user():
    """Test with a specific user (interactive)"""
    print("\n🔧 Prueba Interactiva")
    print("=" * 30)
    
    email = input("Ingresa el email del usuario: ").strip()
    password = input("Ingresa la contraseña: ").strip()
    
    if not email or not password:
        print("❌ Email y contraseña son requeridos")
        return False
    
    print(f"\nProbando con usuario: {email}")
    
    # Login
    token = login_user(email, password)
    if not token:
        return False
    
    # Get profile
    profile_data = get_user_profile(token)
    if not profile_data:
        return False
    
    # Analyze response
    return analyze_profile_response(profile_data)

if __name__ == "__main__":
    print("🚀 Iniciando pruebas del endpoint /auth/profile")
    
    if len(sys.argv) > 1 and sys.argv[1] == "--interactive":
        test_specific_user()
    else:
        test_profile_endpoint()
    
    print("\n✨ Pruebas completadas") 