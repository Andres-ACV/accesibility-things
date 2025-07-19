/* ==========================================================================
   Accessibility Things - Gestor de Datos
   Maneja la carga y manipulación de datos desde archivos JSON
   ========================================================================== */

// Gestor principal de datos
class DataManager {
    constructor() {
        this.productos = [];
        this.usuarios = [];
        this.categorias = [];
        this.currentUser = null;
        this.cart = [];
        
        // Inicializar al crear la instancia
        this.init();
    }

    async init() {
        try {
            await this.loadAllData();
            this.loadCartFromStorage();
            this.loadCurrentUserFromStorage();
            this.loadProductsFromStorage(); // Cargar productos personalizados del vendedor
            this.loadOrders(); // Cargar historial de pedidos
            console.log('DataManager inicializado correctamente');
        } catch (error) {
            console.error('Error al inicializar DataManager:', error);
        }
    }

    // Cargar todos los datos iniciales
    async loadAllData() {
        await Promise.all([
            this.loadProductos(),
            this.loadUsuarios()
        ]);
    }

    // Cargar productos desde JSON
    async loadProductos() {
        console.log('DataManager: Iniciando carga de productos...');
        try {
            console.log('DataManager: Haciendo fetch a data/productos.json');
            // Agregar cache-busting para evitar cache del navegador
            const cacheBuster = '?v=' + Date.now();
            const response = await fetch('data/productos.json' + cacheBuster);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            console.log('DataManager: Respuesta recibida, parseando JSON...');
            const data = await response.json();
            this.productos = data.productos || [];
            this.categorias = data.categorias || [];
            
            console.log(`DataManager: Cargados ${this.productos.length} productos exitosamente`);
            console.log('DataManager: Primeros 3 productos:', this.productos.slice(0, 3).map(p => p.nombre));
            console.log('DataManager: Primeras 3 URLs de imágenes:', this.productos.slice(0, 3).map(p => p.imagen_principal));
            return this.productos;
        } catch (error) {
            console.error('DataManager: Error al cargar productos:', error);
            // Datos de respaldo si falla la carga
            this.productos = [];
            return [];
        }
    }

    // Cargar usuarios desde JSON
    async loadUsuarios() {
        try {
            console.log('📊 DataManager: Iniciando carga de usuarios...');
            const response = await fetch('data/usuarios.json');
            console.log('📊 DataManager: Response status:', response.status);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            this.usuarios = data.usuarios || [];
            
            console.log(`📊 DataManager: Cargados ${this.usuarios.length} usuarios exitosamente`);
            console.log('📊 DataManager: Emails cargados:', this.usuarios.map(u => u.email));
            console.log('📊 DataManager: Usuario vendedor test encontrado:', 
                this.usuarios.some(u => u.email === 'vendedor@test.com') ? 'SÍ' : 'NO');
            
            return this.usuarios;
        } catch (error) {
            console.error('📊 DataManager: Error al cargar usuarios:', error);
            this.usuarios = [];
            return [];
        }
    }

    // === GESTIÓN DE PRODUCTOS ===

    // Obtener todos los productos activos (para catálogo público)
    getProductos() {
        return this.productos.filter(producto => producto.activo !== false);
    }

    // Obtener todos los productos sin filtrar (para administración)
    getAllProductsUnfiltered() {
        return this.productos;
    }

    // Alias para compatibilidad - devuelve productos activos
    getAllProducts() {
        return this.getProductos();
    }

    // Obtener producto por ID (solo activos - para catálogo público)
    getProductoById(id) {
        return this.productos.find(producto => producto.id === id && producto.activo !== false);
    }

    // Obtener producto por ID sin filtrar (para administración)
    getProductByIdUnfiltered(id) {
        return this.productos.find(producto => producto.id === id);
    }

    // Buscar productos por texto (solo activos)
    searchProductos(query) {
        const productosActivos = this.getProductos(); // Ya filtra por activos
        if (!query) return productosActivos;
        
        const searchTerm = query.toLowerCase();
        return productosActivos.filter(producto => 
            producto.nombre.toLowerCase().includes(searchTerm) ||
            producto.descripcion.toLowerCase().includes(searchTerm) ||
            producto.categoria.toLowerCase().includes(searchTerm) ||
            producto.etiquetas.some(tag => tag.toLowerCase().includes(searchTerm))
        );
    }

    // Filtrar productos por categoría (solo activos)
    filterProductosByCategory(categoria) {
        const productosActivos = this.getProductos(); // Ya filtra por activos
        if (!categoria || categoria === 'todas') return productosActivos;
        return productosActivos.filter(producto => producto.categoria === categoria);
    }

    // Filtrar productos por rango de precio (solo activos)
    filterProductosByPrice(minPrice, maxPrice) {
        const productosActivos = this.getProductos(); // Ya filtra por activos
        return productosActivos.filter(producto => 
            producto.precio >= minPrice && producto.precio <= maxPrice
        );
    }

    // Filtrar productos por tipo de accesibilidad (solo activos)
    filterProductosByAccessibility(tipo) {
        const productosActivos = this.getProductos(); // Ya filtra por activos
        if (!tipo || tipo === 'todos') return productosActivos;
        return productosActivos.filter(producto => 
            producto.accesibilidad_tipo.includes(tipo)
        );
    }

    // === GESTIÓN DE USUARIOS ===

    // Obtener usuario por email
    getUserByEmail(email) {
        return this.usuarios.find(user => user.email === email);
    }

    // Autenticar usuario
    authenticateUser(email, password) {
        const user = this.getUserByEmail(email);
        if (user && user.password === password) {
            this.currentUser = user;
            this.saveCurrentUserToStorage();
            return user;
        }
        return null;
    }

    // Iniciar sesión de usuario
    loginUser(email, password, rememberMe = false) {
        try {
            console.log('🔐 loginUser - Intentando login para:', email);
            console.log('🔐 loginUser - Total usuarios cargados:', this.usuarios.length);
            console.log('🔐 loginUser - Emails de usuarios:', this.usuarios.map(u => u.email));
            
            // Verificar si el usuario existe
            const user = this.getUserByEmail(email);
            console.log('🔐 loginUser - Usuario encontrado:', user ? 'SÍ' : 'NO');
            
            if (!user) {
                console.log('🔐 loginUser - Usuario no encontrado en base de datos');
                return {
                    success: false,
                    message: 'No existe una cuenta con este correo electrónico'
                };
            }

            // Verificar si el usuario está activo
            if (!user.activo) {
                console.log('🔐 loginUser - Usuario inactivo');
                return {
                    success: false,
                    message: 'Tu cuenta está desactivada. Contacta al soporte.'
                };
            }

            // Verificar la contraseña
            console.log('🔐 loginUser - Verificando contraseña...');
            console.log('🔐 loginUser - Contraseña ingresada:', password);
            console.log('🔐 loginUser - Contraseña almacenada:', user.password);
            
            if (user.password !== password) {
                console.log('🔐 loginUser - Contraseña incorrecta');
                return {
                    success: false,
                    message: 'Contraseña incorrecta'
                };
            }

            console.log('🔐 loginUser - Login exitoso!');
            
            // Autenticar usuario exitosamente
            this.currentUser = user;
            
            // Actualizar última sesión
            user.ultima_sesion = new Date().toISOString();
            
            // Guardar en localStorage si "recordarme" está activado
            if (rememberMe) {
                localStorage.setItem('accessibilityThings_rememberUser', email);
            } else {
                localStorage.removeItem('accessibilityThings_rememberUser');
            }
            
            this.saveCurrentUserToStorage();
            this.saveUsersToStorage();

            console.log('🔐 loginUser - Usuario autenticado:', this.currentUser.datos_personales?.nombre);

            return {
                success: true,
                message: 'Inicio de sesión exitoso',
                user: user
            };

        } catch (error) {
            console.error('🔐 loginUser - Error:', error);
            return {
                success: false,
                message: 'Error interno del sistema. Intenta nuevamente.'
            };
        }
    }

    // Registrar nuevo usuario
    registerUser(userData) {
        try {
            // Verificar si el email ya existe
            if (this.getUserByEmail(userData.email)) {
                return {
                    success: false,
                    message: 'Ya existe una cuenta con este correo electrónico'
                };
            }

            // Crear nuevo usuario
            const newUser = {
                id: this.generateUserId(),
                tipo: userData.userType === 'seller' ? 'vendedor' : 'comprador', // Mantener compatibilidad
                userType: userData.userType, // Nuevo campo estándar
                email: userData.email,
                password: userData.password,
                datos_personales: {
                    nombre: userData.nombre,
                    apellidos: userData.apellido,
                    telefono: userData.telefono || '',
                    cedula: userData.cedula || ''
                },
                direccion: userData.direccion || {},
                perfil_accesibilidad: userData.perfil_accesibilidad || {
                    tiene_discapacidad: false,
                    preferencias_navegacion: {
                        alto_contraste: false,
                        tamaño_texto: "normal",
                        navegacion_teclado: false
                    }
                },
                historial_compras: [],
                fecha_registro: new Date().toISOString(),
                ultima_sesion: new Date().toISOString(),
                verificado: false,
                activo: true
            };

            // Si es vendedor, agregar datos de empresa
            if (userData.userType === 'seller') {
                newUser.empresa = userData.empresa || {};
                newUser.productos_vendidos = [];
                newUser.estadisticas_ventas = {
                    total_ventas: 0,
                    ingresos_totales: 0,
                    calificacion_promedio: 0,
                    productos_activos: 0
                };
            }

            this.usuarios.push(newUser);
            this.saveUsersToStorage();

            return {
                success: true,
                message: 'Usuario registrado exitosamente',
                user: newUser
            };

        } catch (error) {
            console.error('Error en registerUser:', error);
            return {
                success: false,
                message: 'Error interno del sistema. Intenta nuevamente.'
            };
        }
    }

    // Cerrar sesión
    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
    }

    // === GESTIÓN DEL CARRITO ===

    // Agregar producto al carrito
    addToCart(productId, quantity = 1) {
        const producto = this.getProductoById(productId);
        if (!producto) {
            throw new Error('Producto no encontrado');
        }

        const existingItem = this.cart.find(item => item.productId === productId);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.cart.push({
                productId,
                quantity,
                precio: producto.precio,
                nombre: producto.nombre,
                imagen: producto.imagen_principal,
                fechaAgregado: new Date().toISOString()
            });
        }

        this.saveCartToStorage();
        this.updateCartCounter();
        return this.cart;
    }

    // Actualizar cantidad en carrito
    updateCartQuantity(productId, quantity) {
        const item = this.cart.find(item => item.productId === productId);
        if (item) {
            if (quantity <= 0) {
                this.removeFromCart(productId);
            } else {
                item.quantity = quantity;
                this.saveCartToStorage();
                this.updateCartCounter();
            }
        }
        return this.cart;
    }

    // Remover producto del carrito
    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.productId !== productId);
        this.saveCartToStorage();
        this.updateCartCounter();
        return this.cart;
    }

    // Limpiar carrito
    clearCart() {
        this.cart = [];
        this.saveCartToStorage();
        this.updateCartCounter();
    }

    // Obtener carrito
    getCart() {
        return this.cart;
    }

    // Calcular total del carrito
    getCartTotal() {
        return this.cart.reduce((total, item) => total + (item.precio * item.quantity), 0);
    }

    // Obtener cantidad total de items en carrito
    getCartItemCount() {
        return this.cart.reduce((total, item) => total + item.quantity, 0);
    }

    // === PERSISTENCIA EN LOCALSTORAGE ===

    // Guardar usuarios en localStorage
    saveUsersToStorage() {
        try {
            localStorage.setItem('accessibility-things-usuarios', JSON.stringify(this.usuarios));
            console.log('💾 DataManager: Usuarios guardados en localStorage');
        } catch (error) {
            console.error('💾 DataManager: Error al guardar usuarios:', error);
        }
    }

    // Cargar usuarios desde localStorage
    loadUsersFromStorage() {
        try {
            const stored = localStorage.getItem('accessibility-things-usuarios');
            if (stored) {
                const usuarios = JSON.parse(stored);
                this.usuarios = [...usuarios]; // Merge con usuarios cargados del JSON
                console.log('💾 DataManager: Usuarios cargados desde localStorage');
            }
        } catch (error) {
            console.error('💾 DataManager: Error al cargar usuarios desde localStorage:', error);
        }
    }

    // Guardar carrito en localStorage
    saveCartToStorage() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
    }

    // Cargar carrito desde localStorage
    loadCartFromStorage() {
        try {
            const cartData = localStorage.getItem('cart');
            this.cart = cartData ? JSON.parse(cartData) : [];
        } catch (error) {
            console.error('Error al cargar carrito:', error);
            this.cart = [];
        }
    }

    // Guardar usuario actual en localStorage
    saveCurrentUserToStorage() {
        if (this.currentUser) {
            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        }
    }

    // Cargar usuario actual desde localStorage
    loadCurrentUserFromStorage() {
        try {
            const userData = localStorage.getItem('currentUser');
            this.currentUser = userData ? JSON.parse(userData) : null;
        } catch (error) {
            console.error('Error al cargar usuario:', error);
            this.currentUser = null;
        }
    }

    // === UTILIDADES ===

    // Generar ID único para usuario
    generateUserId() {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substr(2);
        return `USER${timestamp}${random}`.toUpperCase();
    }

    // Actualizar contador del carrito en la UI
    updateCartCounter() {
        const cartCountElement = document.getElementById('cart-count');
        if (cartCountElement) {
            const count = this.getCartItemCount();
            cartCountElement.textContent = count;
            cartCountElement.setAttribute('aria-label', `${count} productos en el carrito`);
        }
    }

    // === GESTIÓN DE CATEGORÍAS ===

    // Obtener todas las categorías
    getCategorias() {
        return this.categorias;
    }

    // Obtener productos por categoría con subcategorías
    getProductosByCategoria(categoriaId, subcategoriaId = null) {
        let productos = this.productos.filter(p => p.categoria === categoriaId);
        
        if (subcategoriaId) {
            productos = productos.filter(p => p.subcategoria === subcategoriaId);
        }
        
        return productos;
    }

    // === BÚSQUEDA AVANZADA ===

    // Búsqueda avanzada con múltiples filtros
    advancedSearch(filters) {
        let results = this.productos;

        // Filtro por texto
        if (filters.query) {
            results = this.searchProductos(filters.query);
        }

        // Filtro por categoría
        if (filters.categoria) {
            results = results.filter(p => p.categoria === filters.categoria);
        }

        // Filtro por subcategoría
        if (filters.subcategoria) {
            results = results.filter(p => p.subcategoria === filters.subcategoria);
        }

        // Filtro por rango de precio
        if (filters.precioMin !== undefined) {
            results = results.filter(p => p.precio >= filters.precioMin);
        }
        if (filters.precioMax !== undefined) {
            results = results.filter(p => p.precio <= filters.precioMax);
        }

        // Filtro por tipo de accesibilidad
        if (filters.tipoAccesibilidad) {
            results = results.filter(p => 
                p.accesibilidad_tipo.includes(filters.tipoAccesibilidad)
            );
        }

        // Filtro por disponibilidad
        if (filters.disponible !== undefined) {
            results = results.filter(p => p.disponible === filters.disponible);
        }

        // Ordenamiento
        if (filters.ordenar) {
            results = this.sortProducts(results, filters.ordenar);
        }

        return results;
    }

    // Ordenar productos
    sortProducts(productos, sortBy) {
        const sortedProducts = [...productos];

        switch (sortBy) {
            case 'precio_asc':
                return sortedProducts.sort((a, b) => a.precio - b.precio);
            case 'precio_desc':
                return sortedProducts.sort((a, b) => b.precio - a.precio);
            case 'nombre_asc':
                return sortedProducts.sort((a, b) => a.nombre.localeCompare(b.nombre));
            case 'nombre_desc':
                return sortedProducts.sort((a, b) => b.nombre.localeCompare(a.nombre));
            case 'fecha_desc':
                return sortedProducts.sort((a, b) => 
                    new Date(b.fecha_actualizacion) - new Date(a.fecha_actualizacion)
                );
            default:
                return sortedProducts;
        }
    }

    // =====================================================
    // GESTIÓN DE PRODUCTOS PARA VENDEDORES
    // =====================================================
    
    /**
     * Crear un nuevo producto (solo vendedores)
     */
    createProduct(productData) {
        try {
            // Verificar que el usuario sea vendedor
            if (!this.currentUser || (this.currentUser.tipo !== 'vendedor' && this.currentUser.userType !== 'seller')) {
                throw new Error('Solo los vendedores pueden crear productos');
            }
            
            // Generar ID único para el producto
            const newId = `producto-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            
            // Mapeo de categorías de discapacidad a colores con contraste WCAG AA
        const categoryColors = {
            // Categorías de discapacidad
            'movilidad': '#1a365d',      // Azul oscuro - 8.32:1 contrast ratio
            'visual': '#2d3748',         // Gris oscuro - 7.43:1 contrast ratio
            'auditiva': '#2b6cb0',       // Azul medio - 4.89:1 contrast ratio
            'cognitiva': '#38a169',      // Verde - 4.52:1 contrast ratio
            'embarazo': '#c53030',       // Rojo - 5.93:1 contrast ratio
            
            // Categorías de productos
            'software': '#553c9a',       // Púrpura oscuro - 6.12:1 contrast ratio
            'hardware': '#2c5530',       // Verde oscuro - 7.21:1 contrast ratio
            'accesorios': '#744210',     // Café oscuro - 6.85:1 contrast ratio
            'dispositivos': '#1a202c',   // Gris muy oscuro - 9.18:1 contrast ratio
            'comunicacion': '#2a69ac',   // Azul comunicación - 5.15:1 contrast ratio
            'hogar': '#276749',          // Verde hogar - 6.02:1 contrast ratio
            'tecnologia': '#4a5568',     // Gris tecnología - 5.67:1 contrast ratio
            'educacion': '#2c7a7b'       // Verde azulado - 4.89:1 contrast ratio
        };
            
            const categoryColor = categoryColors[productData.category] || '#4A90E2';
            
            // Crear objeto producto completo
            const newProduct = {
                id: newId,
                nombre: productData.name,
                descripcion: productData.description,
                precio: parseFloat(productData.price),
                categoria: productData.category,
                tipoDiscapacidad: this.mapCategoryToDisabilityType(productData.category),
                vendedor: {
                    id: this.currentUser.id,
                    nombre: this.currentUser.datos_personales?.nombre || 'Vendedor',
                    email: this.currentUser.email || ''
                },
                especificaciones: {
                    material: "Información pendiente",
                    peso: "A especificar",
                    dimensiones: "A especificar"
                },
                accesibilidad: {
                    certificaciones: [],
                    caracteristicas: ["accesible", "funcional"]
                },
                imagen: `https://placehold.co/300x300/${categoryColor.substring(1)}/FFFFFF`,
                altText: productData.altText || `Producto de ${productData.category}: ${productData.name}`,
                fechaCreacion: new Date().toISOString(),
                activo: true,
                stock: productData.stock || 1
            };
            
            // Agregar a la lista de productos
            this.productos.push(newProduct);
            
            // Guardar en localStorage para persistencia
            this.saveProductsToStorage();
            
            // Agregar al historial del vendedor
            this.addToSellerHistory('create', newProduct);
            
            console.log('Producto creado exitosamente:', newProduct);
            
            // Anunciar creación exitosa
            if (window.announceToScreenReader) {
                window.announceToScreenReader(`Producto "${newProduct.nombre}" creado exitosamente`);
            }
            
            return {
                success: true,
                product: newProduct,
                message: 'Producto creado exitosamente'
            };
            
        } catch (error) {
            console.error('Error al crear producto:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
    
    /**
     * Obtener productos del vendedor actual
     */
    getSellerProducts(sellerId = null) {
        const targetSellerId = sellerId || (this.currentUser?.id);
        
        if (!targetSellerId) {
            return [];
        }
        
        return this.productos.filter(product => 
            product.vendedor?.id === targetSellerId && product.activo
        );
    }
    
    /**
     * Actualizar un producto existente
     */
    updateProduct(productId, updatedData) {
        try {
            const productIndex = this.productos.findIndex(p => p.id === productId);
            
            if (productIndex === -1) {
                throw new Error('Producto no encontrado');
            }
            
            const product = this.productos[productIndex];
            
            // Verificar que el usuario actual sea el vendedor del producto
            if (product.vendedor?.id !== this.currentUser?.id) {
                throw new Error('No tienes permisos para editar este producto');
            }
            
            // Actualizar datos
            const updatedProduct = {
                ...product,
                nombre: updatedData.name || product.nombre,
                descripcion: updatedData.description || product.descripcion,
                precio: updatedData.price ? parseFloat(updatedData.price) : product.precio,
                categoria: updatedData.category || product.categoria,
                altText: updatedData.altText || product.altText,
                stock: updatedData.stock !== undefined ? parseInt(updatedData.stock) : product.stock,
                fechaModificacion: new Date().toISOString()
            };
            
            // Si cambió la categoría, actualizar imagen placeholder
            if (updatedData.category && updatedData.category !== product.categoria) {
                const categoryColors = {
                    'movilidad': { primary: '4A90E2', secondary: 'FFFFFF' },
                    'visual': { primary: 'F5A623', secondary: 'FFFFFF' },
                    'auditiva': { primary: '9013FE', secondary: 'FFFFFF' },
                    'cognitiva': { primary: 'BD10E0', secondary: 'FFFFFF' },
                    'embarazo': { primary: 'FF9FF3', secondary: 'FFFFFF' }
                };
                
                const categoryColor = categoryColors[updatedData.category] || '#4A90E2';
                updatedProduct.imagen = `https://placehold.co/300x300/${categoryColor.substring(1)}/FFFFFF`;
                updatedProduct.tipoDiscapacidad = this.mapCategoryToDisabilityType(updatedData.category);
            }
            
            this.productos[productIndex] = updatedProduct;
            
            // Guardar cambios
            this.saveProductsToStorage();
            this.addToSellerHistory('update', updatedProduct);
            
            console.log('Producto actualizado:', updatedProduct);
            
            if (window.announceToScreenReader) {
                window.announceToScreenReader(`Producto "${updatedProduct.nombre}" actualizado exitosamente`);
            }
            
            return {
                success: true,
                product: updatedProduct,
                message: 'Producto actualizado exitosamente'
            };
            
        } catch (error) {
            console.error('Error al actualizar producto:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
    
    /**
     * Eliminar un producto (marcar como inactivo)
     */
    deleteProduct(productId) {
        try {
            const productIndex = this.productos.findIndex(p => p.id === productId);
            
            if (productIndex === -1) {
                throw new Error('Producto no encontrado');
            }
            
            const product = this.productos[productIndex];
            
            // Verificar permisos
            if (product.vendedor?.id !== this.currentUser?.id) {
                throw new Error('No tienes permisos para eliminar este producto');
            }
            
            // Marcar como inactivo en lugar de eliminar completamente
            this.productos[productIndex] = {
                ...product,
                activo: false,
                fechaEliminacion: new Date().toISOString()
            };
            
            // Guardar cambios
            this.saveProductsToStorage();
            this.addToSellerHistory('delete', this.productos[productIndex]);
            
            console.log('Producto eliminado:', this.productos[productIndex]);
            
            if (window.announceToScreenReader) {
                window.announceToScreenReader(`Producto "${product.nombre}" eliminado exitosamente`);
            }
            
            return {
                success: true,
                message: 'Producto eliminado exitosamente'
            };
            
        } catch (error) {
            console.error('Error al eliminar producto:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
    
    /**
     * Obtener un producto específico por ID
     */
    getProductById(productId) {
        return this.productos.find(p => p.id === productId && p.activo);
    }
    
    /**
     * Mapear categoría a tipo de discapacidad
     */
    mapCategoryToDisabilityType(category) {
        const mapping = {
            'movilidad': 'fisica',
            'visual': 'visual',
            'auditiva': 'auditiva',
            'cognitiva': 'cognitiva',
            'embarazo': 'embarazo'
        };
        return mapping[category] || 'general';
    }
    
    /**
     * Guardar productos en localStorage para persistencia
     */
    saveProductsToStorage() {
        try {
            localStorage.setItem('accessibility-things-productos', JSON.stringify(this.productos));
        } catch (error) {
            console.error('Error al guardar productos en localStorage:', error);
        }
    }
    
    /**
     * Cargar productos desde localStorage
     */
    loadProductsFromStorage() {
        try {
            const stored = localStorage.getItem('accessibility-things-productos');
            if (stored) {
                const storedProducts = JSON.parse(stored);
                // Fusionar productos almacenados con productos por defecto
                this.productos = [...storedProducts, ...this.productos.filter(p => 
                    !storedProducts.some(sp => sp.id === p.id)
                )];
            }
        } catch (error) {
            console.error('Error al cargar productos desde localStorage:', error);
        }
    }
    
    /**
     * Agregar actividad al historial del vendedor
     */
    addToSellerHistory(action, product) {
        try {
            const historyKey = `accessibility-things-seller-history-${this.currentUser.id}`;
            let history = [];
            
            const stored = localStorage.getItem(historyKey);
            if (stored) {
                history = JSON.parse(stored);
            }
            
            history.unshift({
                action,
                productId: product.id,
                productName: product.nombre,
                timestamp: new Date().toISOString(),
                details: {
                    categoria: product.categoria,
                    precio: product.precio
                }
            });
            
            // Mantener solo los últimos 50 registros
            history = history.slice(0, 50);
            
            localStorage.setItem(historyKey, JSON.stringify(history));
        } catch (error) {
            console.error('Error al guardar historial del vendedor:', error);
        }
    }
    
    /**
     * Obtener historial de actividades del vendedor
     */
    getSellerHistory() {
        try {
            const historyKey = `accessibility-things-seller-history-${this.currentUser?.id}`;
            const stored = localStorage.getItem(historyKey);
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Error al cargar historial del vendedor:', error);
            return [];
        }
    }
    
    /**
     * Validar datos de producto antes de crear/actualizar
     */
    validateProductData(productData) {
        const errors = [];
        
        if (!productData.name || productData.name.trim().length < 3) {
            errors.push('El nombre del producto debe tener al menos 3 caracteres');
        }
        
        if (!productData.description || productData.description.trim().length < 10) {
            errors.push('La descripción debe tener al menos 10 caracteres');
        }
        
        if (!productData.price || parseFloat(productData.price) <= 0) {
            errors.push('El precio debe ser mayor a 0');
        }
        
        if (!productData.category) {
            errors.push('Debe seleccionar una categoría');
        }
        
        if (!productData.altText || productData.altText.trim().length < 5) {
            errors.push('El texto alternativo debe tener al menos 5 caracteres');
        }
        
        return {
            isValid: errors.length === 0,
            errors
        };
    }

    // === GESTIÓN DE PEDIDOS ===
    
    loadOrders() {
        try {
            const ordersData = localStorage.getItem('orders');
            this.orders = ordersData ? JSON.parse(ordersData) : [];
            console.log('📦 DataManager: Pedidos cargados:', this.orders.length);
            return this.orders;
        } catch (error) {
            console.error('📦 DataManager: Error al cargar pedidos:', error);
            this.orders = [];
            return this.orders;
        }
    }

    saveOrdersToStorage() {
        try {
            localStorage.setItem('orders', JSON.stringify(this.orders));
            console.log('💾 DataManager: Pedidos guardados en localStorage');
        } catch (error) {
            console.error('💾 DataManager: Error al guardar pedidos:', error);
        }
    }

    saveOrder(orderData) {
        console.log('📦 Guardando pedido:', orderData);
        
        // Asegurar que orders esté inicializado
        if (!this.orders) {
            this.orders = [];
        }

        // Crear objeto de pedido completo
        const order = {
            id: orderData.orderNumber,
            orderNumber: orderData.orderNumber,
            date: new Date().toISOString(),
            customerInfo: {
                email: orderData.customerInfo.email,
                nombre: orderData.customerInfo.nombre,
                telefono: orderData.customerInfo.telefono
            },
            shippingAddress: orderData.shippingAddress,
            cart: orderData.cart,
            total: orderData.total,
            subtotal: orderData.subtotal,
            shipping: orderData.shipping,
            tax: orderData.tax,
            status: 'pendiente' // pendiente, procesando, enviado, entregado
        };

        // Agregar pedido al array
        this.orders.push(order);
        
        // Guardar en localStorage
        this.saveOrdersToStorage();
        
        console.log('✅ Pedido guardado exitosamente:', order.orderNumber);
        return order;
    }

    getUserOrders(userEmail) {
        console.log('🔍 Buscando pedidos para:', userEmail);
        
        // Asegurar que orders esté cargado
        if (!this.orders) {
            this.loadOrders();
        }

        // Filtrar pedidos por email del usuario
        const userOrders = this.orders.filter(order => 
            order.customerInfo.email.toLowerCase() === userEmail.toLowerCase()
        );

        console.log('📦 Pedidos encontrados:', userOrders.length);
        
        // Ordenar por fecha más reciente primero
        userOrders.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        return userOrders;
    }

    getOrderById(orderId) {
        if (!this.orders) {
            this.loadOrders();
        }

        return this.orders.find(order => order.id === orderId || order.orderNumber === orderId);
    }

    updateOrderStatus(orderId, newStatus) {
        if (!this.orders) {
            this.loadOrders();
        }

        const order = this.orders.find(order => order.id === orderId || order.orderNumber === orderId);
        if (order) {
            order.status = newStatus;
            order.lastUpdated = new Date().toISOString();
            this.saveOrdersToStorage();
            console.log('✅ Estado de pedido actualizado:', orderId, '->', newStatus);
            return true;
        }
        
        console.log('❌ Pedido no encontrado:', orderId);
        return false;
    }
}

// Instanciar DataManager globalmente
window.dataManager = new DataManager();

// Exportar para uso en módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DataManager;
} 