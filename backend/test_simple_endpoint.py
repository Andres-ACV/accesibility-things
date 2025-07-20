#!/usr/bin/env python3
"""
Script simple para probar el endpoint de productos más vendidos
"""

import requests
import json

def test_endpoint():
    """Probar el endpoint de productos más vendidos"""
    base_url = "http://localhost:8000"
    
    print("🧪 Probando endpoint de productos más vendidos...")
    
    # Probar health check primero
    try:
        health_response = requests.get(f"{base_url}/health", timeout=5)
        if health_response.status_code == 200:
            print("✅ Backend está funcionando")
        else:
            print(f"❌ Backend no responde correctamente: {health_response.status_code}")
            return
    except Exception as e:
        print(f"❌ No se puede conectar al backend: {e}")
        return
    
    # Probar endpoint de productos más vendidos
    try:
        response = requests.get(f"{base_url}/products/top_selling", timeout=10)
        
        print(f"📡 Status Code: {response.status_code}")
        
        if response.status_code == 200:
            products = response.json()
            print(f"✅ Productos obtenidos: {len(products)}")
            
            if products:
                print("\n📦 Productos más vendidos:")
                for i, product in enumerate(products, 1):
                    print(f"  {i}. {product.get('name', 'N/A')}")
                    print(f"     - Rating: {product.get('average_rating', 'N/A')}")
                    print(f"     - Precio: {product.get('price', 'N/A')}")
                    print(f"     - Imagen: {product.get('image_url', 'Sin imagen')}")
                    print()
            else:
                print("ℹ️ No hay productos más vendidos (array vacío)")
        else:
            print(f"❌ Error en la respuesta: {response.text}")
            
    except Exception as e:
        print(f"❌ Error probando endpoint: {e}")

if __name__ == "__main__":
    test_endpoint() 