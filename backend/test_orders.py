#!/usr/bin/env python3
"""
Script de prueba específico para verificar que las órdenes funcionen correctamente
"""

import requests
import json
from typing import Dict, Any

BASE_URL = "http://localhost:8000"

def test_order_creation():
    """Probar la creación de órdenes con items"""
    try:
        print("🔄 Probando creación de órdenes...")
        
        # 1. Crear una categoría
        category_data = {"name": "Test Category", "description": "Test"}
        response = requests.post(f"{BASE_URL}/categories", json=category_data)
        if response.status_code != 200:
            print(f"❌ Error creando categoría: {response.status_code}")
            return False
        category_id = response.json().get('id')
        print(f"✅ Categoría creada con ID: {category_id}")
        
        # 2. Crear un producto
        product_data = {
            "name": "Producto Test",
            "description": "Descripción del producto de prueba",
            "price": "29.99",
            "category_id": category_id,
            "seller_id": 1
        }
        response = requests.post(f"{BASE_URL}/products", json=product_data)
        if response.status_code != 200:
            print(f"❌ Error creando producto: {response.status_code}")
            return False
        product_id = response.json().get('id')
        print(f"✅ Producto creado con ID: {product_id}")
        
        # 3. Crear un color
        color_data = {
            "name": "Rojo",
            "hex_code": "#FF0000",
            "description": "Color rojo brillante"
        }
        response = requests.post(f"{BASE_URL}/colors", json=color_data)
        if response.status_code != 200:
            print(f"❌ Error creando color: {response.status_code}")
            return False
        color_id = response.json().get('id')
        print(f"✅ Color creado con ID: {color_id}")
        
        # 4. Crear una orden con items
        order_data = {
            "user_id": 1,
            "description": "Orden de prueba",
            "total": "59.98",
            "items": [
                {
                    "product_id": product_id,
                    "color_id": color_id,
                    "quantity": 2,
                    "unit_price": "29.99"
                }
            ]
        }
        response = requests.post(f"{BASE_URL}/orders", json=order_data)
        print(f"✅ POST /orders: {response.status_code}")
        
        if response.status_code == 200:
            order = response.json()
            order_id = order.get('id')
            print(f"   Created order ID: {order_id}")
            print(f"   Order data: {json.dumps(order, indent=2)}")
            
            # 5. Obtener la orden creada
            response = requests.get(f"{BASE_URL}/orders/{order_id}")
            print(f"✅ GET /orders/{order_id}: {response.status_code}")
            
            if response.status_code == 200:
                order_details = response.json()
                print(f"   Order details: {json.dumps(order_details, indent=2)}")
            
            # 6. Obtener órdenes del usuario
            response = requests.get(f"{BASE_URL}/orders/user/1")
            print(f"✅ GET /orders/user/1: {response.status_code}")
            
            # 7. Actualizar la orden
            update_data = {"description": "Orden actualizada"}
            response = requests.put(f"{BASE_URL}/orders/{order_id}", json=update_data)
            print(f"✅ PUT /orders/{order_id}: {response.status_code}")
            
            # 8. Eliminar la orden
            response = requests.delete(f"{BASE_URL}/orders/{order_id}")
            print(f"✅ DELETE /orders/{order_id}: {response.status_code}")
            
            # Limpiar datos de prueba
            requests.delete(f"{BASE_URL}/products/{product_id}")
            requests.delete(f"{BASE_URL}/colors/{color_id}")
            requests.delete(f"{BASE_URL}/categories/{category_id}")
            
            return True
        else:
            print(f"❌ Error creando orden: {response.status_code}")
            print(f"   Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Error en test_order_creation: {e}")
        return False

def test_order_endpoints():
    """Probar endpoints básicos de órdenes"""
    try:
        print("🔄 Probando endpoints básicos de órdenes...")
        
        # GET /orders
        response = requests.get(f"{BASE_URL}/orders")
        print(f"✅ GET /orders: {response.status_code}")
        
        # GET /orders con parámetros
        response = requests.get(f"{BASE_URL}/orders?skip=0&limit=10")
        print(f"✅ GET /orders?skip=0&limit=10: {response.status_code}")
        
        # GET /orders con filtro de usuario
        response = requests.get(f"{BASE_URL}/orders?user_id=1")
        print(f"✅ GET /orders?user_id=1: {response.status_code}")
        
        return True
    except Exception as e:
        print(f"❌ Error en test_order_endpoints: {e}")
        return False

def main():
    """Ejecutar todas las pruebas de órdenes"""
    print("🚀 Iniciando pruebas específicas de órdenes...")
    print("=" * 60)
    
    tests = [
        ("Order Endpoints", test_order_endpoints),
        ("Order Creation", test_order_creation),
    ]
    
    passed = 0
    total = len(tests)
    
    for test_name, test_func in tests:
        print(f"\n📋 Probando: {test_name}")
        print("-" * 40)
        if test_func():
            passed += 1
            print(f"✅ {test_name}: PASÓ")
        else:
            print(f"❌ {test_name}: FALLÓ")
    
    print("\n" + "=" * 60)
    print(f"📊 Resultados: {passed}/{total} pruebas pasaron")
    
    if passed == total:
        print("🎉 ¡Todas las pruebas de órdenes pasaron!")
    else:
        print("⚠️  Algunas pruebas de órdenes fallaron.")

if __name__ == "__main__":
    main() 