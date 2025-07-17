#!/usr/bin/env python3
"""
Script de prueba para verificar que la API funcione correctamente
"""

import requests
import json
from typing import Dict, Any

BASE_URL = "http://localhost:8000"

def test_health_check():
    """Probar el endpoint de salud"""
    try:
        response = requests.get(f"{BASE_URL}/health")
        print(f"✅ Health check: {response.status_code}")
        if response.status_code == 200:
            print(f"   Response: {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Health check failed: {e}")
        return False

def test_root_endpoint():
    """Probar el endpoint raíz"""
    try:
        response = requests.get(f"{BASE_URL}/")
        print(f"✅ Root endpoint: {response.status_code}")
        if response.status_code == 200:
            print(f"   Response: {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Root endpoint failed: {e}")
        return False

def test_categories_endpoints():
    """Probar endpoints de categorías"""
    try:
        # GET /categories
        response = requests.get(f"{BASE_URL}/categories")
        print(f"✅ GET /categories: {response.status_code}")
        
        # POST /categories
        category_data = {
            "name": "Electrónicos",
            "description": "Productos electrónicos y tecnología"
        }
        response = requests.post(f"{BASE_URL}/categories", json=category_data)
        print(f"✅ POST /categories: {response.status_code}")
        
        if response.status_code == 200:
            category = response.json()
            category_id = category.get('id')
            print(f"   Created category ID: {category_id}")
            
            # GET /categories/{id}
            response = requests.get(f"{BASE_URL}/categories/{category_id}")
            print(f"✅ GET /categories/{category_id}: {response.status_code}")
            
            # PUT /categories/{id}
            update_data = {"name": "Tecnología"}
            response = requests.put(f"{BASE_URL}/categories/{category_id}", json=update_data)
            print(f"✅ PUT /categories/{category_id}: {response.status_code}")
            
            # DELETE /categories/{id}
            response = requests.delete(f"{BASE_URL}/categories/{category_id}")
            print(f"✅ DELETE /categories/{category_id}: {response.status_code}")
        
        return True
    except Exception as e:
        print(f"❌ Categories endpoints failed: {e}")
        return False

def test_colors_endpoints():
    """Probar endpoints de colores"""
    try:
        # GET /colors
        response = requests.get(f"{BASE_URL}/colors")
        print(f"✅ GET /colors: {response.status_code}")
        
        # POST /colors
        color_data = {
            "name": "Rojo",
            "hex_code": "#FF0000",
            "description": "Color rojo brillante"
        }
        response = requests.post(f"{BASE_URL}/colors", json=color_data)
        print(f"✅ POST /colors: {response.status_code}")
        
        if response.status_code == 200:
            color = response.json()
            color_id = color.get('id')
            print(f"   Created color ID: {color_id}")
            
            # GET /colors/{id}
            response = requests.get(f"{BASE_URL}/colors/{color_id}")
            print(f"✅ GET /colors/{color_id}: {response.status_code}")
            
            # PUT /colors/{id}
            update_data = {"name": "Rojo Oscuro", "hex_code": "#8B0000"}
            response = requests.put(f"{BASE_URL}/colors/{color_id}", json=update_data)
            print(f"✅ PUT /colors/{color_id}: {response.status_code}")
            
            # DELETE /colors/{id}
            response = requests.delete(f"{BASE_URL}/colors/{color_id}")
            print(f"✅ DELETE /colors/{color_id}: {response.status_code}")
        
        return True
    except Exception as e:
        print(f"❌ Colors endpoints failed: {e}")
        return False

def test_products_endpoints():
    """Probar endpoints de productos"""
    try:
        # Primero crear una categoría para el producto
        category_data = {"name": "Test Category", "description": "Test"}
        response = requests.post(f"{BASE_URL}/categories", json=category_data)
        if response.status_code != 200:
            print("❌ Could not create test category")
            return False
        
        category_id = response.json().get('id')
        
        # GET /products
        response = requests.get(f"{BASE_URL}/products")
        print(f"✅ GET /products: {response.status_code}")
        
        # POST /products
        product_data = {
            "name": "Producto Test",
            "description": "Descripción del producto de prueba",
            "price": "29.99",
            "category_id": category_id,
            "seller_id": 1
        }
        response = requests.post(f"{BASE_URL}/products", json=product_data)
        print(f"✅ POST /products: {response.status_code}")
        
        if response.status_code == 200:
            product = response.json()
            product_id = product.get('id')
            print(f"   Created product ID: {product_id}")
            
            # GET /products/{id}
            response = requests.get(f"{BASE_URL}/products/{product_id}")
            print(f"✅ GET /products/{product_id}: {response.status_code}")
            
            # GET /products/search
            response = requests.get(f"{BASE_URL}/products/search?q=test")
            print(f"✅ GET /products/search: {response.status_code}")
            
            # PUT /products/{id}
            update_data = {"name": "Producto Actualizado", "price": "39.99"}
            response = requests.put(f"{BASE_URL}/products/{product_id}", json=update_data)
            print(f"✅ PUT /products/{product_id}: {response.status_code}")
            
            # DELETE /products/{id}
            response = requests.delete(f"{BASE_URL}/products/{product_id}")
            print(f"✅ DELETE /products/{product_id}: {response.status_code}")
        
        # Limpiar categoría de prueba
        requests.delete(f"{BASE_URL}/categories/{category_id}")
        
        return True
    except Exception as e:
        print(f"❌ Products endpoints failed: {e}")
        return False

def main():
    """Ejecutar todas las pruebas"""
    print("🚀 Iniciando pruebas de la API...")
    print("=" * 50)
    
    tests = [
        ("Health Check", test_health_check),
        ("Root Endpoint", test_root_endpoint),
        ("Categories Endpoints", test_categories_endpoints),
        ("Colors Endpoints", test_colors_endpoints),
        ("Products Endpoints", test_products_endpoints),
    ]
    
    passed = 0
    total = len(tests)
    
    for test_name, test_func in tests:
        print(f"\n📋 Probando: {test_name}")
        print("-" * 30)
        if test_func():
            passed += 1
            print(f"✅ {test_name}: PASÓ")
        else:
            print(f"❌ {test_name}: FALLÓ")
    
    print("\n" + "=" * 50)
    print(f"📊 Resultados: {passed}/{total} pruebas pasaron")
    
    if passed == total:
        print("🎉 ¡Todas las pruebas pasaron! La API está funcionando correctamente.")
    else:
        print("⚠️  Algunas pruebas fallaron. Revisa los errores arriba.")

if __name__ == "__main__":
    main() 