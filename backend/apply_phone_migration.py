#!/usr/bin/env python3
"""
Script para aplicar la migración del campo phone
"""

import subprocess
import sys
import os

def run_command(command, description):
    """Ejecutar un comando y mostrar el resultado"""
    print(f"\n🔧 {description}...")
    print(f"Comando: {command}")
    
    try:
        result = subprocess.run(command, shell=True, capture_output=True, text=True, cwd="backend")
        print(f"Exit Code: {result.returncode}")
        
        if result.stdout:
            print("Output:")
            print(result.stdout)
        
        if result.stderr:
            print("Error:")
            print(result.stderr)
        
        if result.returncode == 0:
            print("✅ Comando ejecutado exitosamente")
            return True
        else:
            print("❌ Error ejecutando comando")
            return False
            
    except Exception as e:
        print(f"❌ Error inesperado: {e}")
        return False

def main():
    """Función principal"""
    print("🚀 Aplicando migración del campo phone...")
    print("=" * 50)
    
    # Verificar que estamos en el directorio correcto
    if not os.path.exists("alembic.ini"):
        print("❌ No se encontró alembic.ini. Asegúrate de estar en el directorio backend.")
        return False
    
    # Aplicar la migración
    success = run_command("alembic upgrade head", "Aplicando migración")
    
    if success:
        print("\n✅ Migración aplicada exitosamente!")
        print("El campo 'phone' ha sido agregado a la tabla 'users'")
        print("\n📋 Resumen de cambios:")
        print("- Campo 'phone' agregado al modelo User")
        print("- Campo 'phone' agregado a los esquemas UserBase y UserUpdate")
        print("- Campo 'phone' incluido en la creación y actualización de usuarios")
        print("- Campo 'phone' incluido en la respuesta del perfil")
        print("- Migración de base de datos aplicada")
        
        print("\n🧪 Para probar los cambios, ejecuta:")
        print("python test_phone_field.py")
        
        return True
    else:
        print("\n❌ Error aplicando la migración")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1) 