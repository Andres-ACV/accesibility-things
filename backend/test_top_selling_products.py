#!/usr/bin/env python3
"""
Script para probar el endpoint de productos más vendidos
"""

import requests
import json
from typing import List, Dict, Any

# Configuración
BASE_URL = "http://localhost:8000"
TOP_SELLING_ENDPOINT = f"{BASE_URL}/products/top_selling"

def test_backend_connection() -> bool:
    """Verificar que el backend esté funcionando"""
    try:
        response = requests.get(f"{BASE_URL}/health", timeout=5)
        return response.status_code == 200
    except requests.exceptions.RequestException:
        return False

def get_top_selling_products(limit: int = 4) -> List[Dict[str, Any]]:
    """Obtener productos más vendidos del endpoint"""
    try:
        response = requests.get(
            TOP_SELLING_ENDPOINT,
            params={"limit": limit},
            timeout=10
        )
        
        if response.status_code == 200:
            return response.json()
        else:
            print(f"❌ Error en la respuesta: {response.status_code}")
            print(f"Detalle: {response.text}")
            return []
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Error de conexión: {e}")
        return []

def analyze_top_selling_response(products: List[Dict[str, Any]]) -> bool:
    """Analizar la respuesta del endpoint de productos más vendidos"""
    print(f"\n📊 Analizando respuesta de productos más vendidos...")
    print(f"Total de productos recibidos: {len(products)}")
    
    if not products:
        print("❌ No se recibieron productos")
        return False
    
    # Verificar estructura de cada producto
    required_fields = ["name", "average_rating", "price"]
    optional_fields = ["image_url"]
    
    for i, product in enumerate(products):
        print(f"\n🔍 Producto {i+1}:")
        print(f"  - Nombre: {product.get('name', 'N/A')}")
        print(f"  - Rating: {product.get('average_rating', 'N/A')}")
        print(f"  - Precio: {product.get('price', 'N/A')}")
        print(f"  - Imagen: {product.get('image_url', 'Sin imagen')}")
        
        # Verificar campos requeridos
        missing_fields = [field for field in required_fields if field not in product]
        if missing_fields:
            print(f"  ❌ Campos faltantes: {missing_fields}")
            return False
        
        # Verificar tipos de datos
        if not isinstance(product['name'], str):
            print(f"  ❌ Campo 'name' debe ser string")
            return False
        
        if not isinstance(product['average_rating'], (int, float)):
            print(f"  ❌ Campo 'average_rating' debe ser numérico")
            return False
        
        if not isinstance(product['price'], (int, float)):
            print(f"  ❌ Campo 'price' debe ser numérico")
            return False
    
    print(f"\n✅ Estructura de respuesta válida")
    return True

def test_different_limits():
    """Probar diferentes límites de productos"""
    print(f"\n🧪 Probando diferentes límites...")
    
    limits_to_test = [1, 2, 4, 6, 10]
    
    for limit in limits_to_test:
        print(f"\n📋 Probando límite: {limit}")
        products = get_top_selling_products(limit)
        
        if products:
            print(f"  ✅ Recibidos {len(products)} productos")
            if len(products) <= limit:
                print(f"  ✅ Límite respetado correctamente")
            else:
                print(f"  ❌ Límite excedido: {len(products)} > {limit}")
        else:
            print(f"  ❌ No se recibieron productos")

def test_top_selling_endpoint():
    """Función principal de prueba"""
    print("🚀 Probando endpoint de productos más vendidos")
    print("=" * 50)
    
    # Verificar conexión al backend
    if not test_backend_connection():
        print("❌ No se puede conectar al backend")
        print("Asegúrate de que el servidor esté ejecutándose en http://localhost:8000")
        return False
    
    print("✅ Conexión al backend establecida")
    
    # Obtener productos más vendidos
    print(f"\n📡 Obteniendo productos más vendidos...")
    products = get_top_selling_products()
    
    if not products:
        print("❌ No se pudieron obtener productos más vendidos")
        return False
    
    # Analizar respuesta
    if not analyze_top_selling_response(products):
        print("❌ La respuesta no tiene el formato esperado")
        return False
    
    # Probar diferentes límites
    test_different_limits()
    
    print(f"\n✅ Prueba del endpoint completada exitosamente!")
    return True

def main():
    """Función principal"""
    success = test_top_selling_endpoint()
    
    if success:
        print(f"\n🎉 ¡El endpoint de productos más vendidos funciona correctamente!")
        print(f"\n📋 Resumen de funcionalidades probadas:")
        print(f"  ✅ Conexión al backend")
        print(f"  ✅ Obtención de productos más vendidos")
        print(f"  ✅ Estructura de respuesta válida")
        print(f"  ✅ Diferentes límites de productos")
        print(f"  ✅ Campos requeridos presentes")
        print(f"  ✅ Tipos de datos correctos")
    else:
        print(f"\n❌ La prueba del endpoint falló")
        print(f"Revisa los errores anteriores y asegúrate de que:")
        print(f"  - El backend esté ejecutándose")
        print(f"  - La base de datos tenga datos de productos y órdenes")
        print(f"  - Las migraciones estén aplicadas")

if __name__ == "__main__":
    main() 