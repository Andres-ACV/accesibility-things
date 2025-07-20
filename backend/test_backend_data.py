#!/usr/bin/env python3
"""
Script para verificar que el backend tenga datos de categorías y productos
"""

import requests
import json

def test_backend_data():
    """Verificar datos del backend"""
    base_url = "http://localhost:8000"
    
    print("🧪 Verificando datos del backend...")
    
    # Probar health check
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
    
    # Probar categorías
    print("\n📂 Probando endpoint de categorías...")
    try:
        categories_response = requests.get(f"{base_url}/categories", timeout=10)
        print(f"📡 Status Code: {categories_response.status_code}")
        
        if categories_response.status_code == 200:
            categories = categories_response.json()
            print(f"✅ Categorías obtenidas: {len(categories)}")
            
            if categories:
                print("\n📂 Categorías disponibles:")
                for i, category in enumerate(categories, 1):
                    print(f"  {i}. {category.get('name', 'N/A')}")
                    print(f"     - ID: {category.get('id', 'N/A')}")
                    print(f"     - Descripción: {category.get('description', 'Sin descripción')}")
                    print()
            else:
                print("ℹ️ No hay categorías disponibles")
        else:
            print(f"❌ Error en categorías: {categories_response.text}")
    except Exception as e:
        print(f"❌ Error probando categorías: {e}")
    
    # Probar productos
    print("\n📦 Probando endpoint de productos...")
    try:
        products_response = requests.get(f"{base_url}/products", timeout=10)
        print(f"📡 Status Code: {products_response.status_code}")
        
        if products_response.status_code == 200:
            products = products_response.json()
            print(f"✅ Productos obtenidos: {len(products)}")
            
            if products:
                print("\n📦 Productos disponibles:")
                for i, product in enumerate(products[:5], 1):  # Solo mostrar los primeros 5
                    print(f"  {i}. {product.get('name', 'N/A')}")
                    print(f"     - ID: {product.get('id', 'N/A')}")
                    print(f"     - Precio: {product.get('price', 'N/A')}")
                    print(f"     - Rating: {product.get('average_rating', 'N/A')}")
                    print()
                if len(products) > 5:
                    print(f"  ... y {len(products) - 5} productos más")
            else:
                print("ℹ️ No hay productos disponibles")
        else:
            print(f"❌ Error en productos: {products_response.text}")
    except Exception as e:
        print(f"❌ Error probando productos: {e}")
    
    # Probar productos más vendidos
    print("\n🏆 Probando endpoint de productos más vendidos...")
    try:
        top_selling_response = requests.get(f"{base_url}/products/top_selling", timeout=10)
        print(f"📡 Status Code: {top_selling_response.status_code}")
        
        if top_selling_response.status_code == 200:
            top_products = top_selling_response.json()
            print(f"✅ Productos más vendidos obtenidos: {len(top_products)}")
            
            if top_products:
                print("\n🏆 Productos más vendidos:")
                for i, product in enumerate(top_products, 1):
                    print(f"  {i}. {product.get('name', 'N/A')}")
                    print(f"     - Rating: {product.get('average_rating', 'N/A')}")
                    print(f"     - Precio: {product.get('price', 'N/A')}")
                    print(f"     - Imagen: {product.get('image_url', 'Sin imagen')}")
                    print()
            else:
                print("ℹ️ No hay productos más vendidos (puede ser porque no hay órdenes)")
        else:
            print(f"❌ Error en productos más vendidos: {top_selling_response.text}")
    except Exception as e:
        print(f"❌ Error probando productos más vendidos: {e}")

if __name__ == "__main__":
    test_backend_data() 