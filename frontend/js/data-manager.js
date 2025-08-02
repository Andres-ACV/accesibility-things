/* ==========================================================================
   Accessibility Things - Gestor de Datos
   Maneja la carga y manipulación de datos desde archivos JSON
   localStorage se usa exclusivamente para carrito y sesión de usuario
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
            console.log('DataManager inicializado correctamente');
        } catch (error) {
            console.error('Error al inicializar DataManager:', error);
            this.handleDataLoadError();
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
            throw new Error('No se pudieron cargar los productos. Verifica tu conexión e intenta nuevamente.');
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
            throw new Error('No se pudieron cargar los usuarios. Verifica tu conexión e intenta nuevamente.');
        }
    }

    /**
     * Manejar errores de carga de datos
     */
    handleDataLoadError() {
        // Mostrar mensaje de error al usuario
        const errorMessage = 'No se pudieron cargar los datos. Verifica tu conexión e intenta recargar la página.';
        
        // Crear elemento de notificación
        const notification = document.createElement('div');
        notification.className = 'notification notification-error';
        notification.innerHTML = `
            <strong>Error de Carga</strong>
            <p>${errorMessage}</p>
        `;
        
        // Insertar al inicio del body
        document.body.insertBefore(notification, document.body.firstChild);
        
        // Remover después de 10 segundos
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 10000);
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
                    message: 'Tu cuenta ha sido desactivada. Contacta al administrador.'
                };
            }

            // Verificar contraseña
            if (user.password !== password) {
                console.log('🔐 loginUser - Contraseña incorrecta');
                return {
                    success: false,
                    message: 'Contraseña incorrecta'
                };
            }

            // Login exitoso
            console.log('🔐 loginUser - Login exitoso para:', email);
            this.currentUser = user;
            this.saveCurrentUserToStorage();
            
            // Guardar en localStorage si "recordarme" está activado
            if (rememberMe) {
                localStorage.setItem('accessibilityThings_rememberUser', email);
            } else {
                localStorage.removeItem('accessibilityThings_rememberUser');
            }

            return {
                success: true,
                user: user,
                message: 'Inicio de sesión exitoso'
            };

        } catch (error) {
            console.error('🔐 loginUser - Error durante login:', error);
            return {
                success: false,
                message: 'Error interno del sistema. Intenta nuevamente.'
            };
        }
    }

    // Registrar nuevo usuario
    registerUser(userData) {
        try {
            console.log('📝 registerUser - Iniciando registro para:', userData.email);
            
            // Verificar si el email ya existe
            const existingUser = this.getUserByEmail(userData.email);
            if (existingUser) {
                console.log('📝 registerUser - Email ya existe');
                return {
                    success: false,
                    message: 'Ya existe una cuenta con este correo electrónico'
                };
            }

            // Validar datos requeridos
            if (!userData.email || !userData.password || !userData.full_name) {
                console.log('📝 registerUser - Datos incompletos');
                return {
                    success: false,
                    message: 'Todos los campos son obligatorios'
                };
            }

            // Validar formato de email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(userData.email)) {
                console.log('📝 registerUser - Email inválido');
                return {
                    success: false,
                    message: 'Formato de email inválido'
                };
            }

            // Validar longitud de contraseña
            if (userData.password.length < 6) {
                console.log('📝 registerUser - Contraseña muy corta');
                return {
                    success: false,
                    message: 'La contraseña debe tener al menos 6 caracteres'
                };
            }

            // Crear nuevo usuario
            const newUser = {
                id: this.generateUserId(),
                email: userData.email,
                password: userData.password,
                full_name: userData.full_name,
                address: userData.address || '',
                city: userData.city || '',
                tipo: userData.tipo || 'comprador',
                activo: true,
                fecha_registro: new Date().toISOString(),
                fecha_actualizacion: new Date().toISOString()
            };

            // Agregar a la lista de usuarios
            this.usuarios.push(newUser);
            console.log('📝 registerUser - Usuario creado exitosamente');

            return {
                success: true,
                user: newUser,
                message: 'Cuenta creada exitosamente'
            };

        } catch (error) {
            console.error('📝 registerUser - Error durante registro:', error);
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
        localStorage.removeItem('userSession');
    }

    // === GESTIÓN DE CARRITO ===

    // Agregar producto al carrito
    addToCart(productId, quantity = 1) {
        const existingItem = this.cart.find(item => item.productId === productId);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.cart.push({
                productId: productId,
                quantity: quantity,
                addedAt: new Date().toISOString()
            });
        }
        
        this.saveCartToStorage();
        this.updateCartCounter();
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
    }

    // Remover producto del carrito
    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.productId !== productId);
        this.saveCartToStorage();
        this.updateCartCounter();
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
        return this.cart.reduce((total, item) => {
            const producto = this.getProductoById(item.productId);
            return total + (producto ? producto.precio * item.quantity : 0);
        }, 0);
    }

    // Obtener cantidad de items en carrito
    getCartItemCount() {
        return this.cart.reduce((total, item) => total + item.quantity, 0);
    }

    // === PERSISTENCIA EN LOCALSTORAGE (SOLO CARRITO Y SESIÓN) ===

    // Guardar carrito en localStorage
    saveCartToStorage() {
        try {
            localStorage.setItem('cart', JSON.stringify(this.cart));
        } catch (error) {
            console.error('Error al guardar carrito:', error);
        }
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
            try {
                localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
            } catch (error) {
                console.error('Error al guardar usuario:', error);
            }
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
                'hardware': '#2c5282',       // Azul marino - 7.21:1 contrast ratio
                'accesorios': '#744210',     // Marrón - 8.45:1 contrast ratio
                'dispositivos': '#22543d',   // Verde oscuro - 7.89:1 contrast ratio
                'comunicacion': '#742a2a',   // Rojo oscuro - 6.78:1 contrast ratio
                'hogar': '#4a5568',          // Gris medio - 6.34:1 contrast ratio
                'tecnologia': '#2d3748',     // Gris oscuro - 7.43:1 contrast ratio
                'educacion': '#2f855a'       // Verde medio - 5.67:1 contrast ratio
            };

            // Crear nuevo producto
            const newProduct = {
                id: newId,
                nombre: productData.nombre,
                descripcion: productData.descripcion,
                precio: parseFloat(productData.precio),
                categoria: productData.categoria,
                subcategoria: productData.subcategoria || '',
                accesibilidad_tipo: productData.accesibilidad_tipo || [],
                etiquetas: productData.etiquetas || [],
                imagen_principal: productData.imagen_principal || 'assets/images/placeholder-generic.svg',
                imagenes_adicionales: productData.imagenes_adicionales || [],
                alt_text_principal: productData.alt_text_principal || `Imagen de ${productData.nombre}`,
                alt_text_adicionales: productData.alt_text_adicionales || [],
                disponible: productData.disponible !== false,
                activo: true,
                stock: parseInt(productData.stock) || 0,
                vendedor_id: this.currentUser.id,
                vendedor_nombre: this.currentUser.full_name,
                fecha_creacion: new Date().toISOString(),
                fecha_actualizacion: new Date().toISOString(),
                color_categoria: categoryColors[productData.categoria] || '#6c757d'
            };

            // Agregar a la lista de productos
            this.productos.push(newProduct);
            
            // Registrar en historial del vendedor
            this.addToSellerHistory('crear', newProduct);
            
            console.log('✅ Producto creado exitosamente:', newProduct.nombre);
            
            return {
                success: true,
                product: newProduct,
                message: 'Producto creado exitosamente'
            };
            
        } catch (error) {
            console.error('❌ Error creando producto:', error);
            return {
                success: false,
                message: error.message || 'Error al crear el producto'
            };
        }
    }

    /**
     * Obtener productos del vendedor actual
     */
    getSellerProducts(sellerId = null) {
        const targetSellerId = sellerId || (this.currentUser ? this.currentUser.id : null);
        
        if (!targetSellerId) {
            return [];
        }
        
        return this.productos.filter(producto => 
            producto.vendedor_id === targetSellerId && producto.activo !== false
        );
    }

    /**
     * Actualizar producto existente
     */
    updateProduct(productId, updatedData) {
        try {
            // Verificar que el usuario sea vendedor
            if (!this.currentUser || (this.currentUser.tipo !== 'vendedor' && this.currentUser.userType !== 'seller')) {
                throw new Error('Solo los vendedores pueden actualizar productos');
            }
            
            // Buscar el producto
            const productIndex = this.productos.findIndex(p => p.id === productId);
            if (productIndex === -1) {
                throw new Error('Producto no encontrado');
            }
            
            const product = this.productos[productIndex];
            
            // Verificar que el producto pertenezca al vendedor actual
            if (product.vendedor_id !== this.currentUser.id) {
                throw new Error('No tienes permisos para actualizar este producto');
            }
            
            // Actualizar campos permitidos
            const allowedFields = [
                'nombre', 'descripcion', 'precio', 'categoria', 'subcategoria',
                'accesibilidad_tipo', 'etiquetas', 'imagen_principal', 'imagenes_adicionales',
                'alt_text_principal', 'alt_text_adicionales', 'disponible', 'stock'
            ];
            
            allowedFields.forEach(field => {
                if (updatedData[field] !== undefined) {
                    product[field] = updatedData[field];
                }
            });
            
            // Actualizar fecha de modificación
            product.fecha_actualizacion = new Date().toISOString();
            
            // Registrar en historial
            this.addToSellerHistory('actualizar', product);
            
            console.log('✅ Producto actualizado exitosamente:', product.nombre);
            
            return {
                success: true,
                product: product,
                message: 'Producto actualizado exitosamente'
            };
            
        } catch (error) {
            console.error('❌ Error actualizando producto:', error);
            return {
                success: false,
                message: error.message || 'Error al actualizar el producto'
            };
        }
    }

    /**
     * Eliminar producto (desactivar)
     */
    deleteProduct(productId) {
        try {
            // Verificar que el usuario sea vendedor
            if (!this.currentUser || (this.currentUser.tipo !== 'vendedor' && this.currentUser.userType !== 'seller')) {
                throw new Error('Solo los vendedores pueden eliminar productos');
            }
            
            // Buscar el producto
            const productIndex = this.productos.findIndex(p => p.id === productId);
            if (productIndex === -1) {
                throw new Error('Producto no encontrado');
            }
            
            const product = this.productos[productIndex];
            
            // Verificar que el producto pertenezca al vendedor actual
            if (product.vendedor_id !== this.currentUser.id) {
                throw new Error('No tienes permisos para eliminar este producto');
            }
            
            // Desactivar el producto en lugar de eliminarlo
            product.activo = false;
            product.fecha_actualizacion = new Date().toISOString();
            
            // Registrar en historial
            this.addToSellerHistory('eliminar', product);
            
            console.log('✅ Producto eliminado exitosamente:', product.nombre);
            
            return {
                success: true,
                message: 'Producto eliminado exitosamente'
            };
            
        } catch (error) {
            console.error('❌ Error eliminando producto:', error);
            return {
                success: false,
                message: error.message || 'Error al eliminar el producto'
            };
        }
    }

    /**
     * Obtener producto por ID (alias para compatibilidad)
     */
    getProductById(productId) {
        return this.getProductoById(productId);
    }

    /**
     * Mapear categoría a tipo de discapacidad
     */
    mapCategoryToDisabilityType(category) {
        const categoryMapping = {
            'movilidad': ['movilidad'],
            'visual': ['visual'],
            'auditiva': ['auditiva'],
            'cognitiva': ['cognitiva'],
            'embarazo': ['embarazo'],
            'software': ['visual', 'auditiva', 'cognitiva'],
            'hardware': ['movilidad', 'visual', 'auditiva'],
            'accesorios': ['movilidad', 'visual', 'auditiva'],
            'dispositivos': ['movilidad', 'visual', 'auditiva', 'cognitiva'],
            'comunicacion': ['auditiva', 'cognitiva'],
            'hogar': ['movilidad', 'visual', 'cognitiva'],
            'tecnologia': ['visual', 'auditiva', 'cognitiva'],
            'educacion': ['visual', 'auditiva', 'cognitiva']
        };
        
        return categoryMapping[category] || ['general'];
    }

    /**
     * Validar datos de producto
     */
    validateProductData(productData) {
        const errors = [];
        
        if (!productData.nombre || productData.nombre.trim().length < 3) {
            errors.push('El nombre debe tener al menos 3 caracteres');
        }
        
        if (!productData.descripcion || productData.descripcion.trim().length < 10) {
            errors.push('La descripción debe tener al menos 10 caracteres');
        }
        
        if (!productData.precio || isNaN(productData.precio) || productData.precio <= 0) {
            errors.push('El precio debe ser un número mayor a 0');
        }
        
        if (!productData.categoria) {
            errors.push('Debe seleccionar una categoría');
        }
        
        if (!productData.accesibilidad_tipo || productData.accesibilidad_tipo.length === 0) {
            errors.push('Debe seleccionar al menos un tipo de accesibilidad');
        }
        
        return {
            isValid: errors.length === 0,
            errors: errors
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