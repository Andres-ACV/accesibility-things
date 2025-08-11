#!/usr/bin/env python3
"""
Servidor HTTP simple para servir el frontend de Accessibility Things
Ejecutar desde la raíz del proyecto: python start-frontend.py
"""

import http.server
import socketserver
import os
import sys
from urllib.parse import urlparse, parse_qs

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    """Handler personalizado para manejar rutas SPA"""
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory="frontend", **kwargs)
    
    def end_headers(self):
        # Agregar headers CORS para desarrollo
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        # Headers de seguridad básicos
        self.send_header('X-Content-Type-Options', 'nosniff')
        self.send_header('X-Frame-Options', 'DENY')
        super().end_headers()
    
    def do_OPTIONS(self):
        """Manejar requests OPTIONS para CORS"""
        self.send_response(200)
        self.end_headers()
    
    def log_message(self, format, *args):
        """Log personalizado con colores"""
        message = format % args
        print(f"🌐 [{self.address_string()}] {message}")

def main():
    # Configuración del servidor
    PORT = 9000
    HOST = 'localhost'
    
    # Verificar que el directorio frontend existe
    if not os.path.exists('frontend'):
        print("❌ Error: No se encontró el directorio 'frontend'")
        print("   Asegúrate de ejecutar este script desde la raíz del proyecto")
        sys.exit(1)
    
    try:
        # Crear el servidor
        with socketserver.TCPServer((HOST, PORT), CustomHTTPRequestHandler) as httpd:
            print("🚀 Accessibility Things - Servidor Frontend")
            print("=" * 50)
            print(f"📍 Servidor ejecutándose en: http://{HOST}:{PORT}")
            print(f"📁 Sirviendo archivos desde: {os.path.abspath('frontend')}")
            print("=" * 50)
            print("📄 Páginas disponibles:")
            print(f"   • Inicio: http://{HOST}:{PORT}/")
            print(f"   • Catálogo: http://{HOST}:{PORT}/catalogo.html")
            print(f"   • Carrito: http://{HOST}:{PORT}/carrito.html")
            print(f"   • Perfil: http://{HOST}:{PORT}/profile.html")
            print(f"   • Login: http://{HOST}:{PORT}/login.html")
            print("=" * 50)
            print("⚡ Backend API debe estar en: http://localhost:8000")
            print("🛑 Presiona Ctrl+C para detener el servidor")
            print("=" * 50)
            
            # Servir indefinidamente
            httpd.serve_forever()
            
    except KeyboardInterrupt:
        print("\n🛑 Servidor detenido por el usuario")
    except OSError as e:
        if e.errno == 10048:  # Puerto en uso
            print(f"❌ Error: El puerto {PORT} ya está en uso")
            print("   Prueba con otro puerto o cierra la aplicación que lo está usando")
        else:
            print(f"❌ Error del sistema: {e}")
    except Exception as e:
        print(f"❌ Error inesperado: {e}")

if __name__ == "__main__":
    main()
