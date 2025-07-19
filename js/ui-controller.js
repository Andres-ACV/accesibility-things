/* ==========================================================================
   Accessibility Things - Controlador de Interfaz de Usuario
   Conecta el DataManager con la interfaz HTML
   ========================================================================== */

class UIController {
    constructor() {
        this.dataManager = null;
        this.currentPage = this.getCurrentPage();
        this.init();
    }

    async init() {
        // Esperar a que el DataManager esté listo
        await this.waitForDataManager();
        
        // Inicializar según la página actual
        this.initializePage();
        
        // Configurar eventos globales
        this.setupGlobalEvents();
        
        console.log('UIController inicializado para:', this.currentPage);
    }

    async waitForDataManager() {
        // Esperar hasta que el DataManager esté disponible
        console.log('UIController: Esperando DataManager...');
        let attempts = 0;
        while (!window.dataManager && attempts < 50) {
            await new Promise(resolve => setTimeout(resolve, 100));
            attempts++;
        }
        
        if (window.dataManager) {
            console.log('UIController: DataManager encontrado');
            this.dataManager = window.dataManager;
            // Esperar a que los datos estén cargados
            await this.waitForData();
        } else {
            console.error('DataManager no disponible después de 5 segundos');
        }
    }

    async waitForData() {
        console.log('UIController: Esperando datos de productos...');
        let attempts = 0;
        while (this.dataManager.productos.length === 0 && attempts < 50) {
            await new Promise(resolve => setTimeout(resolve, 200));
            attempts++;
            if (attempts % 10 === 0) {
                console.log(`UIController: Intento ${attempts}, productos: ${this.dataManager.productos.length}`);
            }
        }
        console.log(`UIController: Datos cargados. Productos disponibles: ${this.dataManager.productos.length}`);
    }

    getCurrentPage() {
        const path = window.location.pathname;
        if (path.includes('catalogo')) return 'catalogo';
        if (path.includes('carrito')) return 'carrito';
        if (path.includes('perfil')) return 'perfil';
        return 'index';
    }

    initializePage() {
        switch (this.currentPage) {
            case 'index':
                this.initializeHomePage();
                break;
            case 'catalogo':
                this.initializeCatalogPage();
                break;
            case 'carrito':
                this.initializeCartPage();
                break;
            case 'perfil':
                this.initializeProfilePage();
                break;
        }
    }

    // === PÁGINA PRINCIPAL ===
    initializeHomePage() {
        this.displayFeaturedProducts();
        this.setupQuickSearch();
    }

    displayFeaturedProducts() {
        const featuredContainer = document.getElementById('featured-products');
        if (!featuredContainer) return;

        // Mostrar productos destacados (primeros 4)
        const featuredProducts = this.dataManager.getProductos().slice(0, 4);
        featuredContainer.innerHTML = this.renderProductGrid(featuredProducts);
    }

    setupQuickSearch() {
        const searchInput = document.getElementById('quick-search');
        if (!searchInput) return;

        searchInput.addEventListener('input', this.debounce((e) => {
            const query = e.target.value;
            if (query.length >= 2) {
                this.performQuickSearch(query);
            }
        }, 300));
    }

    performQuickSearch(query) {
        const results = this.dataManager.searchProductos(query);
        this.showSearchResults(results.slice(0, 5)); // Máximo 5 resultados rápidos
    }

    showSearchResults(results) {
        const resultsContainer = document.getElementById('search-results');
        if (!resultsContainer) return;

        if (results.length === 0) {
            resultsContainer.innerHTML = '<p>No se encontraron productos</p>';
            return;
        }

        resultsContainer.innerHTML = results.map(product => `
            <div class="search-result-item">
                <img src="${product.imagen_principal}" alt="${product.alt_text_principal}" loading="lazy">
                <div>
                    <h4>${product.nombre}</h4>
                    <p>${this.formatPrice(product.precio)}</p>
                    <button onclick="uiController.addToCartQuick('${product.id}')" class="btn btn-sm">
                        Agregar al carrito
                    </button>
                </div>
            </div>
        `).join('');
    }

    // === PÁGINA DEL CATÁLOGO ===
    initializeCatalogPage() {
        this.displayAllProducts();
        this.setupFilters();
        this.setupSearch();
        this.setupSorting();
        this.setupPagination();
    }

    setupPagination() {
        const paginationLinks = document.querySelectorAll('.pagination-link');
        
        paginationLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault(); // Evitar que vaya hacia arriba
                
                // Si es un enlace deshabilitado, no hacer nada
                if (link.classList.contains('disabled')) {
                    return;
                }
                
                // Obtener el número de página o acción
                const pageText = link.textContent.trim();
                let targetPage = 1;
                
                if (pageText === '‹') {
                    // Página anterior
                    const currentActive = document.querySelector('.pagination-link.active');
                    const currentPage = parseInt(currentActive.textContent);
                    targetPage = Math.max(1, currentPage - 1);
                } else if (pageText === '›') {
                    // Página siguiente
                    const currentActive = document.querySelector('.pagination-link.active');
                    const currentPage = parseInt(currentActive.textContent);
                    targetPage = Math.min(3, currentPage + 1); // Máximo 3 páginas por ahora
                } else if (!isNaN(parseInt(pageText))) {
                    // Número de página específico
                    targetPage = parseInt(pageText);
                }
                
                this.goToPage(targetPage);
            });
        });
    }

    goToPage(pageNumber) {
        // Actualizar los enlaces de paginación
        const paginationLinks = document.querySelectorAll('.pagination-link');
        
        paginationLinks.forEach(link => {
            link.classList.remove('active');
            link.removeAttribute('aria-current');
            
            // Rehabilitar enlaces de anterior/siguiente
            if (link.textContent.trim() === '‹') {
                if (pageNumber > 1) {
                    link.classList.remove('disabled');
                } else {
                    link.classList.add('disabled');
                }
            } else if (link.textContent.trim() === '›') {
                if (pageNumber < 3) {
                    link.classList.remove('disabled');
                } else {
                    link.classList.add('disabled');
                }
            }
        });
        
        // Marcar la página actual como activa
        const currentPageLink = document.querySelector(`.pagination-link[aria-label="Página ${pageNumber}"]`);
        if (currentPageLink) {
            currentPageLink.classList.add('active');
            currentPageLink.setAttribute('aria-current', 'page');
        }
        
        // Simular carga de productos para esa página
        this.loadProductsForPage(pageNumber);
        
        // Scroll suave hacia los productos
        const productGrid = document.getElementById('product-grid');
        if (productGrid) {
            productGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        
        this.showNotification(`Cargando página ${pageNumber}`, 'info');
    }

    loadProductsForPage(pageNumber) {
        // Por ahora solo mostramos un mensaje
        // En una implementación real, aquí se cargarían los productos paginados
        console.log(`Cargando productos de la página ${pageNumber}`);
        
        // Actualizar contador de resultados si existe
        const resultsCount = document.getElementById('results-count');
        if (resultsCount) {
            const totalProducts = this.dataManager.getAllProducts().length;
            const productsPerPage = Math.ceil(totalProducts / 3);
            const startProduct = (pageNumber - 1) * productsPerPage + 1;
            const endProduct = Math.min(pageNumber * productsPerPage, totalProducts);
            
            resultsCount.textContent = `Mostrando ${startProduct}-${endProduct} de ${totalProducts} productos (Página ${pageNumber})`;
        }
    }

    displayAllProducts() {
        console.log('UIController: displayAllProducts() iniciando...');
        const productsContainer = document.getElementById('products-grid');
        if (!productsContainer) {
            console.error('UIController: products-grid no encontrado');
            return;
        }

        if (!this.dataManager) {
            console.error('UIController: dataManager no disponible');
            return;
        }

        const products = this.dataManager.getProductos();
        console.log(`UIController: Obtenidos ${products.length} productos`);
        
        if (products.length === 0) {
            console.warn('UIController: No hay productos para mostrar');
            productsContainer.innerHTML = '<p class="no-products">No se encontraron productos. Verifica que los datos se hayan cargado correctamente.</p>';
            return;
        }

        console.log('UIController: Renderizando productos...');
        productsContainer.innerHTML = this.renderProductGrid(products);
        this.updateProductCount(products.length);
        console.log('UIController: Productos renderizados exitosamente');
    }

    setupFilters() {
        // Filtro por categoría
        const categoryFilter = document.getElementById('categoria');
        if (categoryFilter) {
            this.populateCategoryFilter(categoryFilter);
            categoryFilter.addEventListener('change', () => this.applyFilters());
        }

        // Filtro por precio
        const priceMin = document.getElementById('precio-min');
        const priceMax = document.getElementById('precio-max');
        if (priceMin && priceMax) {
            priceMin.addEventListener('change', () => this.applyFilters());
            priceMax.addEventListener('change', () => this.applyFilters());
        }

        // Filtro por tipo de accesibilidad
        const accessibilityFilter = document.getElementById('accessibility-filter');
        if (accessibilityFilter) {
            accessibilityFilter.addEventListener('change', () => this.applyFilters());
        }
    }

    populateCategoryFilter(select) {
        const categorias = this.dataManager.getCategorias();
        select.innerHTML = '<option value="">Todas las categorías</option>';
        
        categorias.forEach(categoria => {
            select.innerHTML += `<option value="${categoria.id}">${categoria.nombre}</option>`;
        });
    }

    setupSearch() {
        const searchInput = document.getElementById('product-search');
        if (!searchInput) return;

        searchInput.addEventListener('input', this.debounce(() => {
            this.applyFilters();
        }, 300));
    }

    setupSorting() {
        const sortSelect = document.getElementById('sort-products');
        if (!sortSelect) return;

        sortSelect.addEventListener('change', () => this.applyFilters());
    }

    applyFilters() {
        const filters = this.getFilterValues();
        const results = this.dataManager.advancedSearch(filters);
        
        const productsContainer = document.getElementById('products-grid');
        if (productsContainer) {
            productsContainer.innerHTML = this.renderProductGrid(results);
            this.updateProductCount(results.length);
        }
    }

    getFilterValues() {
        return {
            query: document.getElementById('search-input')?.value || '',
            categoria: document.getElementById('categoria')?.value || '',
            precioMin: parseInt(document.getElementById('precio-min')?.value) || 0,
            precioMax: parseInt(document.getElementById('precio-max')?.value) || 999999,
            tipoAccesibilidad: document.getElementById('accessibility-filter')?.value || '',
            ordenar: document.getElementById('sort-select')?.value || ''
        };
    }

    updateProductCount(count) {
        const countElement = document.getElementById('results-count');
        if (countElement) {
            countElement.textContent = `Mostrando ${count} productos`;
            countElement.setAttribute('aria-live', 'polite');
        }
    }

    // === PÁGINA DEL CARRITO ===
    initializeCartPage() {
        this.displayCart();
        this.setupCartEvents();
    }

    displayCart() {
        const cartContainer = document.getElementById('cart-items-body'); // Cambiar a cart-items-body para la tabla
        const cartEmpty = document.getElementById('cart-empty');
        const cartContent = document.getElementById('cart-content');
        
        if (!cartContainer) return;

        const cart = this.dataManager.getCart();
        
        if (cart.length === 0) {
            if (cartEmpty) cartEmpty.style.display = 'block';
            if (cartContent) cartContent.style.display = 'none';
            this.updateOrderSummary(0, 0);
            return;
        }

        if (cartEmpty) cartEmpty.style.display = 'none';
        if (cartContent) cartContent.style.display = 'block';
        
        cartContainer.innerHTML = cart.map(item => this.renderCartItem(item)).join('');
        
        // Actualizar el resumen del pedido usando los elementos específicos del HTML
        const total = this.dataManager.getCartTotal();
        const itemCount = this.dataManager.getCartItemCount();
        this.updateOrderSummary(total, itemCount);
    }

    updateOrderSummary(total, itemCount) {
        // Actualizar elementos específicos del resumen en el HTML
        const subtotalElement = document.getElementById('subtotal-amount');
        const shippingElement = document.getElementById('shipping-amount');
        const taxElement = document.getElementById('tax-amount');
        const totalElement = document.getElementById('total-amount');
        
        if (subtotalElement) {
            subtotalElement.textContent = this.formatPrice(total);
        }
        
        if (shippingElement) {
            const hasEnvioGratis = total > 50000; // Envío gratis por encima de ₡50,000
            shippingElement.textContent = hasEnvioGratis ? 'Gratis' : this.formatPrice(3500);
        }
        
        if (taxElement) {
            const tax = total * 0.13; // 13% IVA en Costa Rica
            taxElement.textContent = this.formatPrice(tax);
        }
        
        if (totalElement) {
            const tax = total * 0.13;
            const shipping = total > 50000 ? 0 : 3500;
            const finalTotal = total + tax + shipping;
            totalElement.textContent = this.formatPrice(finalTotal);
        }
    }

    renderCartItem(item) {
        const producto = this.dataManager.getProductoById(item.productId);
        if (!producto) return '';

        return `
            <tr class="cart-item" data-product-id="${item.productId}">
                <td class="cart-item-product">
                    <div class="product-info">
                        <img src="${producto.imagen_principal}" alt="${producto.alt_text_principal}" class="cart-item-image">
                        <div class="product-details">
                            <h4 class="product-name">${producto.nombre}</h4>
                            <p class="product-category">${producto.categoria}</p>
                        </div>
                    </div>
                </td>
                <td class="cart-item-price">
                    ${this.formatPrice(producto.precio)}
                </td>
                <td class="cart-item-quantity">
                    <div class="quantity-controls">
                        <button onclick="uiController.updateCartQuantity('${item.productId}', ${item.quantity - 1})" 
                                class="quantity-btn quantity-decrease" 
                                aria-label="Disminuir cantidad de ${producto.nombre}"
                                ${item.quantity <= 1 ? 'disabled' : ''}>
                            <span aria-hidden="true">−</span>
                        </button>
                        <label for="quantity-${item.productId}" class="sr-only">Cantidad de ${producto.nombre}</label>
                        <input type="number" 
                               id="quantity-${item.productId}" 
                               value="${item.quantity}" 
                               onchange="uiController.updateCartQuantity('${item.productId}', this.value)"
                               min="1" max="99" 
                               class="quantity-input"
                               aria-describedby="quantity-help-${item.productId}">
                        <button onclick="uiController.updateCartQuantity('${item.productId}', ${item.quantity + 1})" 
                                class="quantity-btn quantity-increase" 
                                aria-label="Aumentar cantidad de ${producto.nombre}">
                            <span aria-hidden="true">+</span>
                        </button>
                    </div>
                    <div id="quantity-help-${item.productId}" class="sr-only">Cantidad actual: ${item.quantity}</div>
                </td>
                <td class="cart-item-subtotal">
                    <strong>${this.formatPrice(producto.precio * item.quantity)}</strong>
                </td>
                <td class="cart-item-actions">
                    <button onclick="uiController.removeFromCart('${item.productId}')" 
                            class="remove-item-btn" 
                            aria-label="Eliminar ${producto.nombre} del carrito"
                            title="Eliminar producto">
                        <span aria-hidden="true">🗑️</span>
                    </button>
                </td>
            </tr>
        `;
    }

    renderCartSummary() {
        const total = this.dataManager.getCartTotal();
        const itemCount = this.dataManager.getCartItemCount();

        return `
            <div class="cart-summary">
                <h3>Resumen del pedido</h3>
                <div class="summary-line">
                    <span>Subtotal (${itemCount} productos):</span>
                    <span>${this.formatPrice(total)}</span>
                </div>
                <div class="summary-line">
                    <span>Envío:</span>
                    <span>Gratis</span>
                </div>
                <div class="summary-line total-line">
                    <strong>Total: ${this.formatPrice(total)}</strong>
                </div>
                <button onclick="uiController.proceedToCheckout()" class="btn btn-primary btn-large">
                    Proceder al checkout
                </button>
            </div>
        `;
    }

    setupCartEvents() {
        // Botón "Proceder al pago"
        const proceedButton = document.getElementById('proceed-checkout');
        if (proceedButton) {
            proceedButton.addEventListener('click', () => {
                this.proceedToCheckout();
            });
        }

        // Botón "Vaciar carrito"
        const clearCartButton = document.getElementById('clear-cart');
        if (clearCartButton) {
            clearCartButton.addEventListener('click', () => {
                if (confirm('¿Estás seguro de que quieres vaciar tu carrito?')) {
                    this.dataManager.clearCart();
                    this.displayCart();
                    this.updateCartBadge();
                    this.showNotification('Carrito vaciado', 'success');
                }
            });
        }

        // Botón "Continuar comprando"
        const continueShoppingButton = document.getElementById('continue-shopping');
        if (continueShoppingButton) {
            continueShoppingButton.addEventListener('click', () => {
                window.location.href = 'catalogo.html';
            });
        }

        // Formulario de código de descuento
        const discountForm = document.querySelector('.discount-form');
        if (discountForm) {
            discountForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const code = document.getElementById('discount-code').value.trim();
                this.applyDiscountCode(code);
            });
        }

        // Selector de provincia para cantones
        this.setupProvinciaCanton();

        // Formulario de checkout
        this.setupCheckoutForm();
    }

    setupProvinciaCanton() {
        const provinciaSelect = document.getElementById('provincia');
        const cantonSelect = document.getElementById('canton');

        if (!provinciaSelect || !cantonSelect) return;

        // Datos de provincias y cantones de Costa Rica
        const cantonesPorProvincia = {
            'san-jose': [
                'San José', 'Escazú', 'Desamparados', 'Puriscal', 'Tarrazú', 
                'Aserrí', 'Mora', 'Goicoechea', 'Santa Ana', 'Alajuelita', 
                'Vásquez de Coronado', 'Acosta', 'Tibás', 'Moravia', 
                'Montes de Oca', 'Turrubares', 'Dota', 'Curridabat', 
                'Pérez Zeledón', 'León Cortés Castro'
            ],
            'alajuela': [
                'Alajuela', 'San Ramón', 'Grecia', 'San Mateo', 'Atenas', 
                'Naranjo', 'Palmares', 'Poás', 'Orotina', 'San Carlos', 
                'Zarcero', 'Valverde Vega', 'Upala', 'Los Chiles', 
                'Guatuso', 'Río Cuarto'
            ],
            'cartago': [
                'Cartago', 'Paraíso', 'La Unión', 'Jiménez', 'Turrialba', 
                'Alvarado', 'Oreamuno', 'El Guarco'
            ],
            'heredia': [
                'Heredia', 'Barva', 'Santo Domingo', 'Santa Bárbara', 
                'San Rafael', 'San Isidro', 'Belén', 'Flores', 'San Pablo', 
                'Sarapiquí'
            ],
            'guanacaste': [
                'Liberia', 'Nicoya', 'Santa Cruz', 'Bagaces', 'Carrillo', 
                'Cañas', 'Abangares', 'Tilarán', 'Nandayure', 'La Cruz', 
                'Hojancha'
            ],
            'puntarenas': [
                'Puntarenas', 'Esparza', 'Buenos Aires', 'Montes de Oro', 
                'Osa', 'Quepos', 'Golfito', 'Coto Brus', 'Parrita', 
                'Corredores', 'Garabito', 'Monte Verde'
            ],
            'limon': [
                'Limón', 'Pococí', 'Siquirres', 'Talamanca', 'Matina', 
                'Guácimo'
            ]
        };

        provinciaSelect.addEventListener('change', (e) => {
            const provinciaSeleccionada = e.target.value;
            
            // Limpiar el selector de cantón
            cantonSelect.innerHTML = '<option value="">Selecciona un cantón</option>';
            
            if (provinciaSeleccionada && cantonesPorProvincia[provinciaSeleccionada]) {
                const cantones = cantonesPorProvincia[provinciaSeleccionada];
                
                cantones.forEach(canton => {
                    const option = document.createElement('option');
                    option.value = canton.toLowerCase().replace(/\s+/g, '-');
                    option.textContent = canton;
                    cantonSelect.appendChild(option);
                });
                
                cantonSelect.disabled = false;
                
                // Actualizar el texto de ayuda
                const cantonHelp = document.getElementById('canton-help');
                if (cantonHelp) {
                    cantonHelp.textContent = `Selecciona el cantón en ${provinciaSelect.options[provinciaSelect.selectedIndex].text}`;
                }
            } else {
                cantonSelect.disabled = true;
                const cantonHelp = document.getElementById('canton-help');
                if (cantonHelp) {
                    cantonHelp.textContent = 'Primero selecciona una provincia';
                }
            }
        });

        // Inicializar el estado del selector de cantón
        cantonSelect.disabled = true;
    }

    setupCheckoutForm() {
        const checkoutForm = document.querySelector('#checkout-form form');
        const backToCartButton = document.getElementById('back-to-cart');

        // Botón "Volver al carrito"
        if (backToCartButton) {
            backToCartButton.addEventListener('click', () => {
                const checkoutSection = document.getElementById('checkout-form');
                if (checkoutSection) {
                    checkoutSection.style.display = 'none';
                    this.updateCheckoutProgress(1);
                    
                    // Scroll suave al carrito
                    const cartSection = document.getElementById('cart-items');
                    if (cartSection) {
                        cartSection.scrollIntoView({ behavior: 'smooth' });
                    }
                }
            });
        }

        // Envío del formulario de checkout
        if (checkoutForm) {
            checkoutForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.processCheckoutForm(e.target);
            });
        }
    }

    processCheckoutForm(form) {
        // Validar que todos los campos requeridos estén llenos
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;
        let firstErrorField = null;

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                this.showFieldError(field, 'Este campo es obligatorio');
                if (!firstErrorField) {
                    firstErrorField = field;
                }
            } else {
                this.clearFieldError(field);
            }
        });

        // Validaciones específicas
        const email = form.querySelector('#email-checkout');
        if (email && email.value) {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(email.value)) {
                isValid = false;
                this.showFieldError(email, 'Ingresa un correo electrónico válido');
                if (!firstErrorField) firstErrorField = email;
            }
        }

        const telefono = form.querySelector('#telefono');
        if (telefono && telefono.value) {
            const telefonoPattern = /^[0-9-+\s()]{8,15}$/;
            if (!telefonoPattern.test(telefono.value)) {
                isValid = false;
                this.showFieldError(telefono, 'Ingresa un número de teléfono válido');
                if (!firstErrorField) firstErrorField = telefono;
            }
        }

        if (!isValid) {
            this.showNotification('Por favor completa todos los campos obligatorios correctamente', 'error');
            if (firstErrorField) {
                firstErrorField.focus();
            }
            return;
        }

        // Si todo está válido, procesar el formulario
        this.submitCheckoutForm(form);
    }

    showFieldError(field, message) {
        const errorId = field.id + '-error';
        let errorElement = document.getElementById(errorId);
        
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
        
        field.setAttribute('aria-invalid', 'true');
        field.classList.add('error');
    }

    clearFieldError(field) {
        const errorId = field.id + '-error';
        let errorElement = document.getElementById(errorId);
        
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.style.display = 'none';
        }
        
        field.setAttribute('aria-invalid', 'false');
        field.classList.remove('error');
    }

    submitCheckoutForm(form) {
        const formData = new FormData(form);
        const orderData = {
            customerInfo: {
                nombre: formData.get('nombre_completo'),
                email: formData.get('email'),
                telefono: formData.get('telefono')
            },
            shippingAddress: {
                provincia: formData.get('provincia'),
                canton: formData.get('canton'),
                direccion: formData.get('direccion'),
                instrucciones: formData.get('instrucciones_entrega')
            },
            shippingOption: formData.get('tipo_entrega'),
            cart: this.dataManager.getCart(),
            total: this.calculateFinalTotal()
        };

        // Simular procesamiento del pedido
        this.showNotification('Procesando tu pedido...', 'info');
        
        // Actualizar progreso a paso 3 (pago)
        this.updateCheckoutProgress(3);
        
        setTimeout(() => {
            // Simular éxito del pedido
            const orderNumber = 'AT' + Date.now().toString().slice(-6);
            
            // Agregar número de pedido y datos adicionales para guardar
            const completeOrderData = {
                ...orderData,
                orderNumber: orderNumber,
                subtotal: this.dataManager.getCartTotal(),
                tax: this.dataManager.getCartTotal() * 0.13,
                shipping: this.dataManager.getCartTotal() > 50000 ? 0 : 3500
            };
            
            // Guardar pedido en el sistema
            this.dataManager.saveOrder(completeOrderData);
            
            this.showOrderConfirmation(completeOrderData, orderNumber);
            
            // Limpiar carrito después del pedido exitoso
            this.dataManager.clearCart();
            this.updateCartBadge();
            
        }, 2000);
    }

    calculateFinalTotal() {
        const cartTotal = this.dataManager.getCartTotal();
        const tax = cartTotal * 0.13;
        const shipping = cartTotal > 50000 ? 0 : 3500;
        return cartTotal + tax + shipping;
    }

    showOrderConfirmation(orderData, orderNumber) {
        // Actualizar progreso a paso 4 (confirmación)
        this.updateCheckoutProgress(4);
        
        const checkoutForm = document.getElementById('checkout-form');
        if (checkoutForm) {
            checkoutForm.innerHTML = `
                <div class="order-confirmation">
                    <div class="confirmation-header">
                        <h3>¡Pedido Confirmado!</h3>
                        <div class="order-number">
                            <strong>Número de pedido: ${orderNumber}</strong>
                        </div>
                    </div>
                    
                    <div class="confirmation-details">
                        <div class="confirmation-section">
                            <h4>Información de entrega</h4>
                            <p><strong>Nombre:</strong> ${orderData.customerInfo.nombre}</p>
                            <p><strong>Email:</strong> ${orderData.customerInfo.email}</p>
                            <p><strong>Teléfono:</strong> ${orderData.customerInfo.telefono}</p>
                            <p><strong>Dirección:</strong> ${orderData.shippingAddress.direccion}</p>
                            <p><strong>Ubicación:</strong> ${orderData.shippingAddress.canton}, ${orderData.shippingAddress.provincia}</p>
                        </div>
                        
                        <div class="confirmation-section">
                            <h4>Resumen del pedido</h4>
                            <p><strong>Total:</strong> ${this.formatPrice(orderData.total)}</p>
                            <p><strong>Productos:</strong> ${orderData.cart.length} artículos</p>
                        </div>
                        
                        <div class="confirmation-section">
                            <h4>Próximos pasos</h4>
                            <ul>
                                <li>Recibirás un email de confirmación en ${orderData.customerInfo.email}</li>
                                <li>Te contactaremos al ${orderData.customerInfo.telefono} para coordinar la entrega</li>
                                <li>El tiempo de entrega depende de la opción seleccionada</li>
                            </ul>
                        </div>
                    </div>
                    
                    <div class="confirmation-actions">
                        <button type="button" class="btn btn-primary" onclick="window.location.href='catalogo.html'">
                            Seguir comprando
                        </button>
                        <button type="button" class="btn btn-secondary" onclick="uiController.showUserOrders()">
                            Ver mis pedidos
                        </button>
                    </div>
                </div>
            `;
            
            this.showNotification('¡Pedido realizado exitosamente!', 'success');
        }
    }

    proceedToCheckout() {
        const cart = this.dataManager.getCart();
        
        if (cart.length === 0) {
            this.showNotification('Tu carrito está vacío', 'warning');
            return;
        }

        // Mostrar el formulario de checkout
        const checkoutForm = document.getElementById('checkout-form');
        if (checkoutForm) {
            checkoutForm.style.display = 'block';
            checkoutForm.scrollIntoView({ behavior: 'smooth' });
            
            // Actualizar el progreso del proceso
            this.updateCheckoutProgress(2);
        } else {
            // Si no hay formulario en la página, redirigir a una página de checkout
            this.showNotification('Redirigiendo al proceso de pago...', 'info');
            // Por ahora mostrar un mensaje de éxito como placeholder
            setTimeout(() => {
                this.showNotification('¡Funcionalidad de pago en desarrollo!', 'success');
            }, 1000);
        }
    }

    updateCheckoutProgress(step) {
        const progressSteps = document.querySelectorAll('.progress-steps .step');
        progressSteps.forEach((stepElement, index) => {
            const stepNumber = index + 1;
            if (stepNumber <= step) {
                stepElement.classList.add('active');
                if (stepNumber === step) {
                    stepElement.setAttribute('aria-current', 'step');
                } else {
                    stepElement.removeAttribute('aria-current');
                }
            } else {
                stepElement.classList.remove('active');
                stepElement.removeAttribute('aria-current');
            }
        });
    }

    applyDiscountCode(code) {
        // Lista de códigos de descuento válidos (simulado)
        const validCodes = {
            'ACCESIBLE10': 0.10,
            'BIENVENIDO': 0.05,
            'ESTUDIANTE': 0.15,
            'PRIMERA': 0.20
        };

        const discountInput = document.getElementById('discount-code');
        const helpText = document.getElementById('discount-help');

        if (validCodes[code.toUpperCase()]) {
            const discount = validCodes[code.toUpperCase()];
            this.showNotification(`¡Código aplicado! Descuento del ${(discount * 100).toFixed(0)}%`, 'success');
            
            // Actualizar la interfaz para mostrar el descuento aplicado
            if (helpText) {
                helpText.textContent = `Descuento aplicado: ${(discount * 100).toFixed(0)}%`;
                helpText.style.color = '#38a169';
            }
            if (discountInput) {
                discountInput.disabled = true;
            }

            // Aquí se podría implementar la lógica para aplicar el descuento real
            // Por ahora solo mostramos el mensaje
        } else {
            this.showNotification('Código de descuento no válido', 'error');
            if (helpText) {
                helpText.textContent = 'Código no válido. Intenta con otro.';
                helpText.style.color = '#c53030';
            }
        }
    }

    // === PÁGINA DE PERFIL ===
    initializeProfilePage() {
        this.displayUserInfo();
        this.setupAuthForms();
        
        // Inicializar gestión de productos para vendedores
        this.setupProductManagement();
        
        // Configurar tabs del perfil
        this.setupProfileTabs();
    }

    setupAuthForms() {
        console.log('🔧 Configurando formularios de autenticación...');
        const loginForm = document.querySelector('#login-form form');
        const registerForm = document.querySelector('#register-form form');
        
        console.log('📋 Formulario login encontrado:', !!loginForm);
        console.log('📋 Formulario registro encontrado:', !!registerForm);

        // Formulario de inicio de sesión
        if (loginForm) {
            console.log('✅ Configurando event listener para login');
            loginForm.addEventListener('submit', (e) => {
                console.log('🚀 Login form submitted! Interceptando...');
                e.preventDefault();
                this.processLogin(e.target);
            });
        } else {
            console.log('❌ No se encontró el formulario de login');
        }

        // Formulario de registro
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.processRegister(e.target);
            });
        }
    }

    processLogin(form) {
        const formData = new FormData(form);
        const email = formData.get('email')?.trim();
        const password = formData.get('password')?.trim();
        const rememberMe = formData.get('remember_me') === 'on';

        // Validaciones básicas
        if (!email || !password) {
            this.showNotification('Por favor completa todos los campos', 'error');
            return;
        }

        // Validar formato de email
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            this.showNotification('Ingresa un correo electrónico válido', 'error');
            return;
        }

        // Intentar iniciar sesión
        this.showNotification('Iniciando sesión...', 'info');
        
        setTimeout(() => {
            const loginResult = this.dataManager.loginUser(email, password, rememberMe);
            
            if (loginResult.success) {
                this.showNotification(`¡Bienvenido ${loginResult.user.datos_personales?.nombre || 'Usuario'}!`, 'success');
                this.displayUserInfo();
                this.showProfileSection();
            } else {
                this.showNotification(loginResult.message, 'error');
            }
        }, 1000);
    }

    processRegister(form) {
        const formData = new FormData(form);
        
        const userData = {
            nombre: formData.get('nombre')?.trim(),
            apellido: formData.get('apellido')?.trim(),
            email: formData.get('email')?.trim(),
            password: formData.get('password'),
            passwordConfirm: formData.get('password_confirm'),
            userType: formData.get('user_type'),
            termsAccepted: formData.get('terms_conditions') === 'on',
            privacyAccepted: formData.get('privacy_policy') === 'on'
        };

        // Validaciones
        const validationResult = this.validateRegistrationData(userData);
        if (!validationResult.isValid) {
            this.showNotification(validationResult.message, 'error');
            return;
        }

        // Procesar registro
        this.showNotification('Creando cuenta...', 'info');
        
        setTimeout(() => {
            const registerResult = this.dataManager.registerUser(userData);
            
            if (registerResult.success) {
                this.showNotification('¡Cuenta creada exitosamente! Ya puedes iniciar sesión.', 'success');
                
                // Limpiar formulario
                form.reset();
                
                // Cambiar al formulario de login
                this.focusLoginForm();
            } else {
                this.showNotification(registerResult.message, 'error');
            }
        }, 1500);
    }

    validateRegistrationData(userData) {
        // Validar campos obligatorios
        if (!userData.nombre || !userData.apellido || !userData.email || !userData.password) {
            return { isValid: false, message: 'Todos los campos son obligatorios' };
        }

        // Validar email
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(userData.email)) {
            return { isValid: false, message: 'Ingresa un correo electrónico válido' };
        }

        // Validar contraseña
        if (userData.password.length < 6) {
            return { isValid: false, message: 'La contraseña debe tener al menos 6 caracteres' };
        }

        // Validar confirmación de contraseña
        if (userData.password !== userData.passwordConfirm) {
            return { isValid: false, message: 'Las contraseñas no coinciden' };
        }

        // Validar tipo de usuario
        if (!userData.userType || !['buyer', 'seller'].includes(userData.userType)) {
            return { isValid: false, message: 'Selecciona un tipo de usuario válido' };
        }

        // Validar términos y condiciones
        if (!userData.termsAccepted) {
            return { isValid: false, message: 'Debes aceptar los términos y condiciones' };
        }

        // Validar política de privacidad
        if (!userData.privacyAccepted) {
            return { isValid: false, message: 'Debes aceptar la política de privacidad' };
        }

        return { isValid: true };
    }

    showProfileSection() {
        const authSection = document.getElementById('auth-section');
        const profileSection = document.getElementById('profile-section');

        if (authSection) authSection.style.display = 'none';
        if (profileSection) profileSection.style.display = 'block';
    }

    showAuthSection() {
        const authSection = document.getElementById('auth-section');
        const profileSection = document.getElementById('profile-section');

        if (authSection) authSection.style.display = 'block';
        if (profileSection) profileSection.style.display = 'none';
    }

    focusLoginForm() {
        const emailInput = document.querySelector('#login-form input[name="email"]');
        if (emailInput) {
            emailInput.focus();
        }
    }

    displayUserInfo() {
        const user = this.dataManager.currentUser;
        const userInfoContainer = document.getElementById('user-info');
        
        if (!userInfoContainer) return;

        if (user) {
            // Mostrar información del usuario
            userInfoContainer.innerHTML = this.renderUserProfile(user);
            
            // Mostrar sección de perfil y ocultar autenticación
            this.showProfileSection();
            
            // Configurar gestión de productos si es vendedor
            this.setupProductManagement();
        } else {
            // Mostrar formularios de autenticación
            userInfoContainer.innerHTML = this.renderAuthForms();
            
            // Mostrar sección de autenticación y ocultar perfil
            this.showAuthSection();
        }
    }

    renderUserProfile(user) {
        return `
            <div class="user-profile">
                <h2>Bienvenido, ${user.datos_personales.nombre}</h2>
                <div class="profile-info">
                    <p><strong>Email:</strong> ${user.email}</p>
                    <p><strong>Tipo:</strong> ${user.tipo}</p>
                    <p><strong>Teléfono:</strong> ${user.datos_personales.telefono}</p>
                </div>
                <button onclick="uiController.logout()" class="btn btn-secondary">Cerrar sesión</button>
            </div>
        `;
    }

    renderAuthForms() {
        return `
            <div class="auth-forms">
                <div class="auth-tabs">
                    <button onclick="uiController.showLoginForm()" class="tab-btn active" id="login-tab">Iniciar sesión</button>
                    <button onclick="uiController.showRegisterForm()" class="tab-btn" id="register-tab">Registrarse</button>
                </div>
                <div id="auth-form-container">
                    ${this.renderLoginForm()}
                </div>
            </div>
        `;
    }

    renderLoginForm() {
        return `
            <form id="login-form" onsubmit="uiController.handleLogin(event)">
                <h3>Iniciar sesión</h3>
                <div class="form-group">
                    <label for="login-email">Email:</label>
                    <input type="email" id="login-email" required>
                </div>
                <div class="form-group">
                    <label for="login-password">Contraseña:</label>
                    <input type="password" id="login-password" required>
                </div>
                <button type="submit" class="btn btn-primary">Iniciar sesión</button>
                <div class="demo-credentials">
                    <p><strong>Credenciales de prueba:</strong></p>
                    <p>Email: maria.rodriguez@email.com | Contraseña: password123</p>
                </div>
            </form>
        `;
    }

    setupAuthForms() {
        // Los formularios se configuran dinámicamente cuando se renderizan
    }

    // === EVENTOS DE INTERACCIÓN ===

    addToCartQuick(productId) {
        try {
            this.dataManager.addToCart(productId, 1);
            this.showNotification('Producto agregado al carrito - Redirigiendo...', 'success');
            
            // Redireccionar al carrito después de un breve delay
            setTimeout(() => {
                window.location.href = 'carrito.html';
            }, 1000);
            
        } catch (error) {
            this.showNotification('Error al agregar producto', 'error');
            console.error(error);
        }
    }

    updateCartQuantity(productId, quantity) {
        const qty = parseInt(quantity);
        if (qty < 1) return;

        this.dataManager.updateCartQuantity(productId, qty);
        this.displayCart(); // Recargar vista del carrito
    }

    removeFromCart(productId) {
        this.dataManager.removeFromCart(productId);
        this.displayCart();
        this.showNotification('Producto eliminado del carrito', 'info');
    }

    handleLogin(event) {
        event.preventDefault();
        
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        
        const user = this.dataManager.authenticateUser(email, password);
        
        if (user) {
            this.showNotification('Inicio de sesión exitoso', 'success');
            this.displayUserInfo();
        } else {
            this.showNotification('Credenciales incorrectas', 'error');
        }
    }

    logout() {
        this.dataManager.logout();
        this.showNotification('Sesión cerrada', 'info');
        this.displayUserInfo();
    }

    showLoginForm() {
        document.getElementById('auth-form-container').innerHTML = this.renderLoginForm();
        this.updateTabState('login-tab');
    }

    showRegisterForm() {
        // Implementar formulario de registro
        this.showNotification('Función de registro en desarrollo', 'info');
    }

    updateTabState(activeTabId) {
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.getElementById(activeTabId).classList.add('active');
    }

    // === UTILIDADES ===

    renderProductGrid(products) {
        if (!products || products.length === 0) {
            return '<p class="no-products">No se encontraron productos</p>';
        }

        return products.map(product => `
            <div class="product-card" data-categoria="${product.categoria}">
                <img src="${product.imagen_principal}" alt="${product.alt_text_principal}" class="product-image" loading="lazy">
                <div class="product-info">
                    <h3 class="product-title">${product.nombre}</h3>
                    <p class="product-category">${product.categoria}</p>
                    <p class="product-price">${this.formatPrice(product.precio)}</p>
                    <button onclick="uiController.addToCartQuick('${product.id}')" class="btn btn-primary">
                        Agregar al carrito
                    </button>
                </div>
            </div>
        `).join('');
    }

    formatPrice(price) {
        return new Intl.NumberFormat('es-CR', {
            style: 'currency',
            currency: 'CRC',
            minimumFractionDigits: 0
        }).format(price);
    }

    showNotification(message, type = 'info') {
        // Crear notificación accesible
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.setAttribute('role', 'alert');
        notification.setAttribute('aria-live', 'polite');

        document.body.appendChild(notification);

        // Auto-eliminar después de 3 segundos
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 3000);
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    setupGlobalEvents() {
        // Actualizar contador del carrito al cargar la página
        if (this.dataManager) {
            this.dataManager.updateCartCounter();
        }
    }
    
    // =====================================================
    // GESTIÓN DE PRODUCTOS PARA VENDEDORES - UI
    // =====================================================
    
    /**
     * Inicializar la gestión de productos para vendedores
     */
    initSellerProductManagement() {
        // Solo para usuarios vendedores
        if (!this.dataManager.currentUser || this.dataManager.currentUser.tipo !== 'vendedor') {
            return;
        }
        
        // Event listeners para gestión de productos
        this.setupProductFormListeners();
        this.setupSellerProductsDisplay();
        
        // Cargar productos del vendedor
        this.loadSellerProducts();
    }
    
    /**
     * Configurar event listeners para el formulario de productos
     */
    setupProductFormListeners() {
        // Botón para mostrar formulario de agregar producto
        const addProductBtn = document.getElementById('add-product-btn');
        if (addProductBtn) {
            addProductBtn.addEventListener('click', () => {
                this.showProductForm();
            });
        }
        
        // Botón para cancelar formulario
        const cancelBtn = document.getElementById('cancel-product-btn');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                this.hideProductForm();
            });
        }
        
        // Submit del formulario de productos
        const productForm = document.querySelector('#product-form form');
        if (productForm) {
            productForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleProductFormSubmit(e);
            });
        }
        
        // Validación en tiempo real
        this.setupProductFormValidation();
    }
    
    /**
     * Mostrar formulario de agregar/editar producto
     */
    showProductForm(productData = null) {
        const productForm = document.getElementById('product-form');
        const formTitle = document.getElementById('product-form-title');
        
        if (!productForm || !formTitle) return;
        
        // Mostrar formulario
        productForm.style.display = 'block';
        productForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        // Actualizar título según si es edición o creación
        if (productData) {
            formTitle.textContent = 'Editar Producto';
            this.populateProductForm(productData);
        } else {
            formTitle.textContent = 'Agregar Nuevo Producto';
            this.clearProductForm();
        }
        
        // Focus en el primer campo
        const firstField = productForm.querySelector('input, select, textarea');
        if (firstField) {
            firstField.focus();
        }
        
        // Anunciar para lectores de pantalla
        if (window.announceToScreenReader) {
            const action = productData ? 'Editando' : 'Agregando nuevo';
            window.announceToScreenReader(`${action} producto. Formulario cargado`);
        }
    }
    
    /**
     * Ocultar formulario de productos
     */
    hideProductForm() {
        const productForm = document.getElementById('product-form');
        if (productForm) {
            productForm.style.display = 'none';
            this.clearProductForm();
            this.clearFormErrors();
        }
    }
    
    /**
     * Poblar formulario con datos de producto existente
     */
    populateProductForm(productData) {
        const form = document.querySelector('#product-form form');
        if (!form) return;
        
        // Poblar campos
        const fields = {
            'product-name': productData.nombre,
            'product-description': productData.descripcion,
            'product-price': productData.precio,
            'product-category': productData.categoria,
            'product-alt-text': productData.altText
        };
        
        Object.entries(fields).forEach(([fieldId, value]) => {
            const field = document.getElementById(fieldId);
            if (field && value !== undefined) {
                field.value = value;
            }
        });
        
        // Guardar ID del producto para edición
        form.dataset.editingProductId = productData.id;
    }
    
    /**
     * Limpiar formulario de productos
     */
    clearProductForm() {
        const form = document.querySelector('#product-form form');
        if (!form) return;
        
        form.reset();
        delete form.dataset.editingProductId;
        this.clearFormErrors();
    }
    
    /**
     * Manejar envío del formulario de productos
     */
    async handleProductFormSubmit(event) {
        event.preventDefault();
        const form = event.target;
        
        // Obtener datos del formulario
        const formData = new FormData(form);
        const productData = {
            name: formData.get('name'),
            description: formData.get('description'),
            price: formData.get('price'),
            category: formData.get('category'),
            altText: formData.get('alt_text')
        };
        
        // Validar datos
        const validation = this.dataManager.validateProductData(productData);
        if (!validation.isValid) {
            this.showValidationErrors(validation.errors);
            return;
        }
        
        // Determinar si es edición o creación
        const isEditing = form.dataset.editingProductId;
        let result;
        
        if (isEditing) {
            result = this.dataManager.updateProduct(form.dataset.editingProductId, productData);
        } else {
            result = this.dataManager.createProduct(productData);
        }
        
        // Manejar resultado
        if (result.success) {
            this.showNotification(result.message, 'success');
            this.hideProductForm();
            this.loadSellerProducts(); // Recargar lista
        } else {
            this.showNotification(`Error: ${result.error}`, 'error');
        }
    }
    
    /**
     * Mostrar errores de validación en el formulario
     */
    showValidationErrors(errors) {
        this.clearFormErrors();
        
        errors.forEach(error => {
            // Determinar qué campo está relacionado con el error
            let fieldId = '';
            if (error.includes('nombre')) fieldId = 'product-name';
            else if (error.includes('descripción')) fieldId = 'product-description';
            else if (error.includes('precio')) fieldId = 'product-price';
            else if (error.includes('categoría')) fieldId = 'product-category';
            else if (error.includes('texto alternativo')) fieldId = 'product-alt-text';
            
            if (fieldId) {
                const errorContainer = document.getElementById(`${fieldId}-error`);
                const field = document.getElementById(fieldId);
                
                if (errorContainer) {
                    errorContainer.textContent = error;
                    errorContainer.style.display = 'block';
                }
                
                if (field) {
                    field.setAttribute('aria-invalid', 'true');
                    field.classList.add('error');
                }
            }
        });
        
        // Anunciar errores para lectores de pantalla
        if (window.announceToScreenReader) {
            window.announceToScreenReader(`Se encontraron ${errors.length} errores en el formulario`);
        }
    }
    
    /**
     * Limpiar errores del formulario
     */
    clearFormErrors() {
        const errorContainers = document.querySelectorAll('#product-form .error-message');
        const errorFields = document.querySelectorAll('#product-form .error');
        
        errorContainers.forEach(container => {
            container.textContent = '';
            container.style.display = 'none';
        });
        
        errorFields.forEach(field => {
            field.setAttribute('aria-invalid', 'false');
            field.classList.remove('error');
        });
    }
    
    /**
     * Configurar validación en tiempo real del formulario
     */
    setupProductFormValidation() {
        const formFields = [
            'product-name',
            'product-description', 
            'product-price',
            'product-category',
            'product-alt-text'
        ];
        
        formFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                field.addEventListener('blur', () => {
                    this.validateSingleField(fieldId);
                });
            }
        });
    }
    
    /**
     * Validar un campo individual
     */
    validateSingleField(fieldId) {
        const field = document.getElementById(fieldId);
        const errorContainer = document.getElementById(`${fieldId}-error`);
        
        if (!field || !errorContainer) return;
        
        let error = '';
        const value = field.value.trim();
        
        switch (fieldId) {
            case 'product-name':
                if (value.length < 3) error = 'El nombre debe tener al menos 3 caracteres';
                break;
            case 'product-description':
                if (value.length < 10) error = 'La descripción debe tener al menos 10 caracteres';
                break;
            case 'product-price':
                if (!value || parseFloat(value) <= 0) error = 'El precio debe ser mayor a 0';
                break;
            case 'product-category':
                if (!value) error = 'Debe seleccionar una categoría';
                break;
            case 'product-alt-text':
                if (value.length < 5) error = 'El texto alternativo debe tener al menos 5 caracteres';
                break;
        }
        
        if (error) {
            errorContainer.textContent = error;
            errorContainer.style.display = 'block';
            field.setAttribute('aria-invalid', 'true');
            field.classList.add('error');
        } else {
            errorContainer.textContent = '';
            errorContainer.style.display = 'none';
            field.setAttribute('aria-invalid', 'false');
            field.classList.remove('error');
        }
    }
    
    /**
     * Cargar y mostrar productos del vendedor
     */
    loadSellerProducts() {
        const sellerProducts = this.dataManager.getSellerProducts();
        this.renderSellerProducts(sellerProducts);
    }
    
    /**
     * Renderizar lista de productos del vendedor
     */
    renderSellerProducts(products) {
        const container = document.getElementById('seller-products-list');
        if (!container) return;
        
        if (products.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <p>No tienes productos registrados aún.</p>
                    <p>Agrega tu primer producto para empezar a vender.</p>
                </div>
            `;
            return;
        }
        
        const productsHTML = products.map(product => `
            <div class="seller-product-card" data-product-id="${product.id}" data-categoria="${product.categoria}">
                <div class="product-image">
                    <img src="${product.imagen}" 
                         alt="${product.altText}" 
                         loading="lazy">
                </div>
                <div class="product-info">
                    <h5>${this.escapeHtml(product.nombre)}</h5>
                    <p class="product-category">${this.getCategoryDisplayName(product.categoria)}</p>
                    <p class="product-price">${this.formatPrice(product.precio)}</p>
                    <p class="product-description">${this.escapeHtml(product.descripcion.substring(0, 100))}${product.descripcion.length > 100 ? '...' : ''}</p>
                    <div class="product-meta">
                        <span class="product-date">Creado: ${this.formatDate(product.fechaCreacion)}</span>
                        ${product.fechaModificacion ? `<span class="product-modified">Modificado: ${this.formatDate(product.fechaModificacion)}</span>` : ''}
                    </div>
                </div>
                <div class="product-actions">
                    <button type="button" 
                            class="btn btn-sm btn-secondary" 
                            onclick="uiController.editProduct('${product.id}')"
                            aria-label="Editar producto ${product.nombre}">
                        <span aria-hidden="true">✏️</span>
                        Editar
                    </button>
                    <button type="button" 
                            class="btn btn-sm btn-danger" 
                            onclick="uiController.deleteProduct('${product.id}')"
                            aria-label="Eliminar producto ${product.nombre}">
                        <span aria-hidden="true">🗑️</span>
                        Eliminar
                    </button>
                </div>
            </div>
        `).join('');
        
        container.innerHTML = productsHTML;
        
        // Anunciar para lectores de pantalla
        if (window.announceToScreenReader) {
            window.announceToScreenReader(`Se mostraron ${products.length} productos`);
        }
    }
    
    /**
     * Editar un producto específico
     */
    editProduct(productId) {
        const product = this.dataManager.getProductById(productId);
        if (product) {
            this.showProductForm(product);
        } else {
            this.showNotification('Producto no encontrado', 'error');
        }
    }
    
    /**
     * Eliminar un producto específico
     */
    deleteProduct(productId) {
        const product = this.dataManager.getProductById(productId);
        if (!product) {
            this.showNotification('Producto no encontrado', 'error');
            return;
        }
        
        // Confirmación accesible
        const confirmMessage = `¿Estás seguro de que deseas eliminar el producto "${product.nombre}"? Esta acción no se puede deshacer.`;
        
        if (confirm(confirmMessage)) {
            const result = this.dataManager.deleteProduct(productId);
            
            if (result.success) {
                this.showNotification(result.message, 'success');
                this.loadSellerProducts(); // Recargar lista
            } else {
                this.showNotification(`Error: ${result.error}`, 'error');
            }
        }
    }
    
    /**
     * Configurar display para productos del vendedor
     */
    setupSellerProductsDisplay() {
        // Mostrar/ocultar elementos según tipo de usuario
        const sellerElements = document.querySelectorAll('.seller-only');
        const currentUser = this.dataManager.currentUser;
        const isSellerUser = currentUser?.tipo === 'vendedor' || currentUser?.userType === 'seller';
        
        sellerElements.forEach(element => {
            element.style.display = isSellerUser ? 'block' : 'none';
        });
        
        // También actualizar tabs si existen
        const sellerTabs = document.querySelectorAll('.seller-tab');
        sellerTabs.forEach(tab => {
            tab.style.display = isSellerUser ? 'inline-block' : 'none';
        });
        
        console.log('Usuario actual:', currentUser);
        console.log('Es vendedor:', isSellerUser);
        console.log('Elementos seller-only encontrados:', sellerElements.length);
    }

    // === DEBUGGING FUNCTIONS ===
    
    /**
     * Función de debugging para verificar estado de la base de datos
     */
    debugDatabase() {
        console.log('🔍 === DEBUG DATABASE ===');
        console.log('📊 Total productos:', this.dataManager.productos.length);
        console.log('👥 Total usuarios:', this.dataManager.usuarios.length);
        console.log('🛒 Items en carrito:', this.dataManager.cart.length);
        console.log('👤 Usuario actual:', this.dataManager.currentUser ? this.dataManager.currentUser.email : 'Ninguno');
        
        console.log('\n📧 Usuarios disponibles para login:');
        this.dataManager.usuarios.forEach((user, index) => {
            console.log(`${index + 1}. ${user.email} (${user.tipo}) - Password: ${user.password}`);
        });
        
        console.log('\n🧪 Para probar login, usar:');
        console.log('- Comprador: maria.rodriguez@email.com / password123');
        console.log('- Vendedor: vendedor@test.com / vendedor123');
        
        return {
            productos: this.dataManager.productos.length,
            usuarios: this.dataManager.usuarios.length,
            carrito: this.dataManager.cart.length,
            currentUser: this.dataManager.currentUser?.email || 'Ninguno'
        };
    }

    /**
     * Función helper para testear login desde consola
     */
    testLogin(email, password) {
        console.log(`🧪 Testing login: ${email} / ${password}`);
        const result = this.dataManager.loginUser(email, password);
        console.log('🧪 Resultado:', result);
        
        if (result.success) {
            this.displayUserInfo();
            this.showNotification('Login de prueba exitoso!', 'success');
        } else {
            this.showNotification('Login de prueba falló: ' + result.message, 'error');
        }
        
        return result;
    }
    
    /**
     * Obtener nombre display de categoría
     */
    getCategoryDisplayName(category) {
        const categoryNames = {
            'movilidad': 'Movilidad',
            'visual': 'Discapacidad Visual',
            'auditiva': 'Discapacidad Auditiva', 
            'cognitiva': 'Discapacidad Cognitiva',
            'embarazo': 'Embarazo y Maternidad'
        };
        return categoryNames[category] || category;
    }
    
    /**
     * Formatear fecha para display
     */
    formatDate(dateString) {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('es-CR', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch (error) {
            return 'Fecha inválida';
        }
    }
    
    /**
     * Escapar HTML para prevenir XSS
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    setupProductManagement() {
        // Solo configurar si el usuario es vendedor
        const currentUser = this.dataManager.currentUser;
        if (!currentUser || (currentUser.tipo !== 'vendedor' && currentUser.userType !== 'seller')) {
            console.log('Usuario no es vendedor, saltando configuración de productos');
            return;
        }

        console.log('Configurando gestión de productos para vendedor');
        
        // Configurar formulario de productos
        this.setupProductFormListeners();
        
        // Configurar display de productos del vendedor
        this.setupSellerProductsDisplay();
        
        // Cargar productos del vendedor
        this.loadSellerProducts();
    }

    setupProfileTabs() {
        const tabButtons = document.querySelectorAll('.profile-tab');
        const tabPanels = document.querySelectorAll('.profile-panel');
        
        tabButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const tabId = e.target.id;
                const panelId = e.target.getAttribute('aria-controls');
                
                // Remover active de todos los tabs
                tabButtons.forEach(tab => {
                    tab.setAttribute('aria-selected', 'false');
                    tab.classList.remove('active');
                });
                
                // Ocultar todos los panels
                tabPanels.forEach(panel => {
                    panel.style.display = 'none';
                });
                
                // Activar tab actual
                e.target.setAttribute('aria-selected', 'true');
                e.target.classList.add('active');
                
                // Mostrar panel correspondiente
                const targetPanel = document.getElementById(panelId);
                if (targetPanel) {
                    targetPanel.style.display = 'block';
                }
                
                // Si es el tab de productos, cargar productos del vendedor
                if (panelId === 'panel-products') {
                    this.loadSellerProducts();
                }
                
                // Si es el tab de pedidos, cargar historial de pedidos
                if (panelId === 'panel-orders') {
                    this.loadUserOrdersInTab();
                }
            });
        });
        
        // Activar primer tab por defecto
        if (tabButtons.length > 0) {
            tabButtons[0].click();
        }
    }

    // === HISTORIAL DE PEDIDOS ===
    
    showUserOrders() {
        console.log('📦 Mostrando historial de pedidos...');
        
        // Verificar que hay usuario logueado
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
        if (!currentUser) {
            this.showNotification('Debes iniciar sesión para ver tus pedidos', 'error');
            return;
        }

        // Obtener pedidos del usuario
        const userOrders = this.dataManager.getUserOrders(currentUser.email);
        
        // Crear el HTML del historial
        const ordersHtml = this.renderOrderHistory(userOrders);
        
        // Mostrar en un modal o reemplazar el contenido principal
        this.showOrderHistoryModal(ordersHtml);
    }

    loadUserOrdersInTab() {
        console.log('📦 Cargando historial de pedidos en tab...');
        
        // Verificar que hay usuario logueado
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
        if (!currentUser) {
            const ordersContainer = document.getElementById('orders-list');
            if (ordersContainer) {
                ordersContainer.innerHTML = `
                    <div class="empty-state">
                        <p>Debes iniciar sesión para ver tus pedidos.</p>
                    </div>
                `;
            }
            return;
        }

        // Obtener pedidos del usuario
        const userOrders = this.dataManager.getUserOrders(currentUser.email);
        
        // Crear el HTML del historial (sin el wrapper modal)
        const ordersHtml = this.renderOrderHistoryForTab(userOrders);
        
        // Mostrar en el container del tab
        const ordersContainer = document.getElementById('orders-list');
        if (ordersContainer) {
            ordersContainer.innerHTML = ordersHtml;
        }
    }

    renderOrderHistoryForTab(orders) {
        if (orders.length === 0) {
            return `
                <div class="empty-state">
                    <p>No tienes pedidos aún.</p>
                    <p>Cuando realices tu primer pedido, aparecerá aquí.</p>
                    <a href="catalogo.html" class="btn btn-primary">
                        <span aria-hidden="true">🛍️</span>
                        Explorar Productos
                    </a>
                </div>
            `;
        }

        const ordersListHtml = orders.map(order => {
            const orderDate = new Date(order.date);
            const formattedDate = orderDate.toLocaleDateString('es-CR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });

            const statusColors = {
                'pendiente': '#f39c12',
                'procesando': '#3498db',
                'enviado': '#9b59b6',
                'entregado': '#27ae60'
            };

            const statusLabels = {
                'pendiente': 'Pendiente',
                'procesando': 'Procesando',
                'enviado': 'Enviado',
                'entregado': 'Entregado'
            };

            return `
                <div class="order-item" role="article" aria-labelledby="order-${order.orderNumber}">
                    <div class="order-header">
                        <h4 id="order-${order.orderNumber}">Pedido #${order.orderNumber}</h4>
                        <span class="order-status" style="background-color: ${statusColors[order.status]}; color: white; padding: 4px 8px; border-radius: 4px; font-size: 0.9em;">
                            ${statusLabels[order.status]}
                        </span>
                    </div>
                    
                    <div class="order-details">
                        <p><strong>Fecha:</strong> ${formattedDate}</p>
                        <p><strong>Total:</strong> ${this.formatPrice(order.total)}</p>
                        <p><strong>Productos:</strong> ${order.cart.length} artículo${order.cart.length > 1 ? 's' : ''}</p>
                        
                        <div class="order-address">
                            <p><strong>Dirección de envío:</strong></p>
                            <p>${order.shippingAddress.direccion}</p>
                            <p>${order.shippingAddress.canton}, ${order.shippingAddress.provincia}</p>
                        </div>
                    </div>
                    
                    <div class="order-actions">
                        <button type="button" class="btn btn-secondary" onclick="uiController.showOrderDetails('${order.orderNumber}')">
                            Ver Detalles
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        return ordersListHtml;
    }

    renderOrderHistory(orders) {
        if (orders.length === 0) {
            return `
                <div class="no-orders">
                    <h3>No tienes pedidos aún</h3>
                    <p>Cuando realices tu primer pedido, aparecerá aquí.</p>
                    <a href="catalogo.html" class="btn btn-primary">
                        <span aria-hidden="true">🛍️</span>
                        Explorar Productos
                    </a>
                </div>
            `;
        }

        const ordersListHtml = orders.map(order => {
            const orderDate = new Date(order.date);
            const formattedDate = orderDate.toLocaleDateString('es-CR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });

            const statusColors = {
                'pendiente': '#f39c12',
                'procesando': '#3498db',
                'enviado': '#9b59b6',
                'entregado': '#27ae60'
            };

            const statusLabels = {
                'pendiente': 'Pendiente',
                'procesando': 'Procesando',
                'enviado': 'Enviado',
                'entregado': 'Entregado'
            };

            return `
                <div class="order-item" role="article" aria-labelledby="order-${order.orderNumber}">
                    <div class="order-header">
                        <h4 id="order-${order.orderNumber}">Pedido #${order.orderNumber}</h4>
                        <span class="order-status" style="background-color: ${statusColors[order.status]}; color: white; padding: 4px 8px; border-radius: 4px; font-size: 0.9em;">
                            ${statusLabels[order.status]}
                        </span>
                    </div>
                    
                    <div class="order-details">
                        <p><strong>Fecha:</strong> ${formattedDate}</p>
                        <p><strong>Total:</strong> ${this.formatPrice(order.total)}</p>
                        <p><strong>Productos:</strong> ${order.cart.length} artículo${order.cart.length > 1 ? 's' : ''}</p>
                        
                        <div class="order-address">
                            <p><strong>Dirección de envío:</strong></p>
                            <p>${order.shippingAddress.direccion}</p>
                            <p>${order.shippingAddress.canton}, ${order.shippingAddress.provincia}</p>
                        </div>
                    </div>
                    
                    <div class="order-actions">
                        <button type="button" class="btn btn-secondary" onclick="uiController.showOrderDetails('${order.orderNumber}')">
                            Ver Detalles
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        return `
            <div class="orders-history">
                <div class="orders-header">
                    <h3>Mis Pedidos</h3>
                    <p>Historial completo de tus compras</p>
                </div>
                
                <div class="orders-list" role="list">
                    ${ordersListHtml}
                </div>
            </div>
        `;
    }

    showOrderHistoryModal(ordersHtml) {
        // Cerrar cualquier modal existente
        this.closeOrderModals();
        
        // Crear modal para el historial
        const modal = document.createElement('div');
        modal.className = 'modal order-history-modal';
        modal.style.display = 'flex';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Mis Pedidos</h3>
                    <button type="button" class="close-modal-btn" aria-label="Cerrar historial de pedidos">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    ${ordersHtml}
                </div>
            </div>
        `;
        
        // Agregar estilos CSS si no existen
        this.addOrderHistoryStyles();
        
        // Configurar eventos de cierre
        const closeBtn = modal.querySelector('.close-modal-btn');
        closeBtn.addEventListener('click', () => this.closeOrderModals());
        
        // Cerrar al hacer clic en el overlay
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeOrderModals();
            }
        });
        
        // Cerrar con tecla ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeOrderModals();
            }
        });
        
        // Agregar modal al body
        document.body.appendChild(modal);
        
        // Hacer accesible
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-labelledby', 'orders-title');
        modal.setAttribute('aria-modal', 'true');
        modal.setAttribute('tabindex', '-1');
        
        // Enfocar el modal
        modal.focus();
        
        console.log('📦 Modal de historial de pedidos mostrado');
    }

    closeOrderModals() {
        const existingModals = document.querySelectorAll('.order-history-modal');
        existingModals.forEach(modal => {
            modal.remove();
        });
        console.log('📦 Modales de pedidos cerrados');
    }

    showOrderDetails(orderNumber) {
        console.log('📋 Mostrando detalles del pedido:', orderNumber);
        
        const order = this.dataManager.getOrderById(orderNumber);
        if (!order) {
            this.showNotification('Pedido no encontrado', 'error');
            return;
        }

        const orderDate = new Date(order.date);
        const formattedDate = orderDate.toLocaleDateString('es-CR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        const productsHtml = order.cart.map(item => `
            <div class="order-product-item">
                <div class="product-info">
                    <h5>${item.nombre}</h5>
                    <p>Cantidad: ${item.quantity}</p>
                    <p>Precio unitario: ${this.formatPrice(item.precio)}</p>
                    <p><strong>Subtotal: ${this.formatPrice(item.precio * item.quantity)}</strong></p>
                </div>
            </div>
        `).join('');

        const detailsHtml = `
            <div class="order-details-full">
                <div class="order-details-header">
                    <h3>Detalles del Pedido #${order.orderNumber}</h3>
                    <p class="order-date">${formattedDate}</p>
                </div>
                
                <div class="order-info-sections">
                    <section class="order-section">
                        <h4>Información del Cliente</h4>
                        <p><strong>Nombre:</strong> ${order.customerInfo.nombre}</p>
                        <p><strong>Email:</strong> ${order.customerInfo.email}</p>
                        <p><strong>Teléfono:</strong> ${order.customerInfo.telefono}</p>
                    </section>
                    
                    <section class="order-section">
                        <h4>Dirección de Envío</h4>
                        <p>${order.shippingAddress.direccion}</p>
                        <p>${order.shippingAddress.canton}, ${order.shippingAddress.provincia}</p>
                    </section>
                    
                    <section class="order-section">
                        <h4>Productos</h4>
                        <div class="order-products-list">
                            ${productsHtml}
                        </div>
                    </section>
                    
                    <section class="order-section">
                        <h4>Resumen de Costos</h4>
                        <div class="cost-summary">
                            <p>Subtotal: ${this.formatPrice(order.subtotal)}</p>
                            <p>Envío: ${this.formatPrice(order.shipping)}</p>
                            <p>IVA (13%): ${this.formatPrice(order.tax)}</p>
                            <p class="total-cost"><strong>Total: ${this.formatPrice(order.total)}</strong></p>
                        </div>
                    </section>
                </div>
            </div>
        `;

        this.showOrderHistoryModal(detailsHtml);
    }

    addOrderHistoryStyles() {
        const styleId = 'order-history-styles';
        if (document.getElementById(styleId)) return;

        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            .order-history-modal .modal-content {
                max-width: 800px;
                max-height: 90vh;
                overflow-y: auto;
            }
            
            .orders-history {
                padding: 20px 0;
            }
            
            .orders-header {
                margin-bottom: 20px;
                text-align: center;
            }
            
            .orders-header h3 {
                color: var(--color-primario, #2c3e50);
                margin-bottom: 5px;
            }
            
            .order-item {
                border: 1px solid #ddd;
                border-radius: 8px;
                padding: 20px;
                margin-bottom: 15px;
                background-color: #f9f9f9;
            }
            
            .order-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 15px;
                flex-wrap: wrap;
            }
            
            .order-header h4 {
                margin: 0;
                color: var(--color-primario, #2c3e50);
            }
            
            .order-details {
                margin-bottom: 15px;
            }
            
            .order-details p {
                margin: 5px 0;
            }
            
            .order-address {
                background-color: #fff;
                padding: 10px;
                border-radius: 4px;
                margin-top: 10px;
            }
            
            .order-actions {
                text-align: right;
            }
            
            .no-orders {
                text-align: center;
                padding: 40px 20px;
            }
            
            .no-orders h3 {
                color: var(--color-primario, #2c3e50);
                margin-bottom: 10px;
            }
            
            .order-details-full {
                padding: 20px 0;
            }
            
            .order-details-header {
                text-align: center;
                margin-bottom: 30px;
                border-bottom: 1px solid #ddd;
                padding-bottom: 15px;
            }
            
            .order-section {
                margin-bottom: 25px;
                padding: 15px;
                background-color: #f9f9f9;
                border-radius: 6px;
            }
            
            .order-section h4 {
                color: var(--color-primario, #2c3e50);
                margin-bottom: 10px;
                border-bottom: 1px solid #ddd;
                padding-bottom: 5px;
            }
            
            .order-product-item {
                background-color: #fff;
                padding: 10px;
                border-radius: 4px;
                margin-bottom: 10px;
            }
            
            .cost-summary {
                background-color: #fff;
                padding: 15px;
                border-radius: 4px;
            }
            
            .total-cost {
                border-top: 1px solid #ddd;
                padding-top: 10px;
                margin-top: 10px;
                font-size: 1.1em;
            }
            
            @media (max-width: 768px) {
                .order-header {
                    flex-direction: column;
                    align-items: flex-start;
                }
                
                .order-header h4 {
                    margin-bottom: 5px;
                }
                
                .order-actions {
                    text-align: left;
                }
            }
        `;
        
        document.head.appendChild(style);
    }
}

// Crear instancia global cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.uiController = new UIController();
});

// Exportar para uso en módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UIController;
} 