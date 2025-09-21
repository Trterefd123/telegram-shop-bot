// Telegram WebApp initialization
const tg = window.Telegram.WebApp;

// Initialize the app
tg.ready();
tg.expand();

// App state
let products = [];
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let currentCategory = 'all';
let searchQuery = '';

// DOM elements
const productsGrid = document.getElementById('productsGrid');
const searchContainer = document.getElementById('searchContainer');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const searchClose = document.getElementById('searchClose');
const cartBtn = document.getElementById('cartBtn');
const cartCount = document.getElementById('cartCount');
const cartModal = document.getElementById('cartModal');
const cartClose = document.getElementById('cartClose');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const checkoutBtn = document.getElementById('checkoutBtn');
const productModal = document.getElementById('productModal');
const modalClose = document.getElementById('modalClose');
const orderModal = document.getElementById('orderModal');
const orderClose = document.getElementById('orderClose');
const orderForm = document.getElementById('orderForm');

// Sample products data
const sampleProducts = [
    {
        id: 1,
        title: 'iPhone 15 Pro',
        description: 'Новейший смартфон с титановым корпусом',
        price: 89990,
        oldPrice: 99990,
        image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300&h=200&fit=crop',
        category: 'electronics',
        inStock: true
    },
    {
        id: 2,
        title: 'MacBook Air M2',
        description: 'Ультратонкий ноутбук с чипом M2',
        price: 119990,
        oldPrice: 139990,
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&h=200&fit=crop',
        category: 'electronics',
        inStock: true
    },
    {
        id: 3,
        title: 'Nike Air Max 270',
        description: 'Удобные кроссовки с максимальной амортизацией',
        price: 12990,
        oldPrice: 15990,
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=200&fit=crop',
        category: 'sports',
        inStock: true
    }
];

// Initialize app
function init() {
    products = sampleProducts;
    updateCartCount();
    renderProducts();
    setupEventListeners();
}

// Setup event listeners
function setupEventListeners() {
    // Search functionality
    searchBtn.addEventListener('click', toggleSearch);
    searchClose.addEventListener('click', toggleSearch);
    searchInput.addEventListener('input', handleSearch);

    // Cart functionality
    cartBtn.addEventListener('click', openCart);
    cartClose.addEventListener('click', closeCart);
    checkoutBtn.addEventListener('click', openOrderForm);

    // Product modal
    modalClose.addEventListener('click', closeProductModal);
    orderClose.addEventListener('click', closeOrderModal);

    // Category buttons
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelector('.category-btn.active').classList.remove('active');
            e.target.classList.add('active');
            currentCategory = e.target.dataset.category;
            renderProducts();
        });
    });

    // Order form
    orderForm.addEventListener('submit', handleOrderSubmit);

    // Close modals on backdrop click
    [productModal, cartModal, orderModal].forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal);
            }
        });
    });
}

// Search functionality
function toggleSearch() {
    searchContainer.style.display = searchContainer.style.display === 'none' ? 'flex' : 'none';
    if (searchContainer.style.display === 'flex') {
        searchInput.focus();
    }
}

function handleSearch(e) {
    searchQuery = e.target.value.toLowerCase();
    renderProducts();
}

// Product rendering
function renderProducts() {
    let filteredProducts = products;

    // Filter by category
    if (currentCategory !== 'all') {
        filteredProducts = filteredProducts.filter(product => product.category === currentCategory);
    }

    // Filter by search query
    if (searchQuery) {
        filteredProducts = filteredProducts.filter(product => 
            product.title.toLowerCase().includes(searchQuery) ||
            product.description.toLowerCase().includes(searchQuery)
        );
    }

    // Render products
    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = `
            <div class="empty-state">
                <div>🔍</div>
                <h3>Товары не найдены</h3>
                <p>Попробуйте изменить поисковый запрос или выбрать другую категорию</p>
            </div>
        `;
        return;
    }

    productsGrid.innerHTML = filteredProducts.map(product => `
        <div class="product-card" onclick="openProductModal(${product.id})">
            <img src="${product.image}" alt="${product.title}" class="product-image">
            <div class="product-info">
                <h3 class="product-title">${product.title}</h3>
                <div class="price-section">
                    <span class="product-price">${formatPrice(product.price)}</span>
                    ${product.oldPrice ? `<span class="product-old-price">${formatPrice(product.oldPrice)}</span>` : ''}
                </div>
            </div>
        </div>
    `).join('');
}

// Product modal
function openProductModal(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    document.getElementById('modalTitle').textContent = product.title;
    document.getElementById('modalImage').src = product.image;
    document.getElementById('modalImage').alt = product.title;
    document.getElementById('modalDescription').textContent = product.description;
    document.getElementById('modalPrice').textContent = formatPrice(product.price);
    
    const oldPriceEl = document.getElementById('modalOldPrice');
    if (product.oldPrice) {
        oldPriceEl.textContent = formatPrice(product.oldPrice);
        oldPriceEl.style.display = 'inline';
    } else {
        oldPriceEl.style.display = 'none';
    }

    // Reset quantity
    document.getElementById('quantity').textContent = '1';

    // Update add to cart button
    const addToCartBtn = document.getElementById('addToCartBtn');
    addToCartBtn.onclick = () => addToCart(product.id, parseInt(document.getElementById('quantity').textContent));
    addToCartBtn.textContent = 'Добавить в корзину';

    // Quantity controls
    document.getElementById('quantityMinus').onclick = () => {
        const quantity = parseInt(document.getElementById('quantity').textContent);
        if (quantity > 1) {
            document.getElementById('quantity').textContent = quantity - 1;
        }
    };

    document.getElementById('quantityPlus').onclick = () => {
        const quantity = parseInt(document.getElementById('quantity').textContent);
        document.getElementById('quantity').textContent = quantity + 1;
    };

    productModal.classList.add('show');
}

function closeProductModal() {
    productModal.classList.remove('show');
}

// Cart functionality
function addToCart(productId, quantity = 1) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            ...product,
            quantity: quantity
        });
    }

    saveCart();
    updateCartCount();
    closeProductModal();
    
    // Show success message
    showSuccessMessage('Товар добавлен в корзину!');
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartCount();
    renderCart();
}

function updateCartQuantity(productId, quantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        if (quantity <= 0) {
            removeFromCart(productId);
        } else {
            item.quantity = quantity;
            saveCart();
            updateCartCount();
            renderCart();
        }
    }
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
}

function openCart() {
    renderCart();
    cartModal.classList.add('show');
}

function closeCart() {
    cartModal.classList.remove('show');
}

function renderCart() {
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-state">
                <div>🛒</div>
                <h3>Корзина пуста</h3>
                <p>Добавьте товары для оформления заказа</p>
            </div>
        `;
        cartTotal.textContent = '0 ₽';
        checkoutBtn.style.display = 'none';
        return;
    }

    checkoutBtn.style.display = 'block';
    
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.title}" class="cart-item-image">
            <div class="cart-item-info">
                <div class="cart-item-title">${item.title}</div>
                <div class="cart-item-price">${formatPrice(item.price)}</div>
            </div>
            <div class="cart-item-controls">
                <button onclick="updateCartQuantity(${item.id}, ${item.quantity - 1})">-</button>
                <span class="cart-item-quantity">${item.quantity}</span>
                <button onclick="updateCartQuantity(${item.id}, ${item.quantity + 1})">+</button>
                <button class="remove-item" onclick="removeFromCart(${item.id})">✕</button>
            </div>
        </div>
    `).join('');

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = formatPrice(total);
}

// Order functionality
function openOrderForm() {
    closeCart();
    orderModal.classList.add('show');
}

function closeOrderModal() {
    orderModal.classList.remove('show');
}

function handleOrderSubmit(e) {
    e.preventDefault();
    
    const orderData = {
        customerName: document.getElementById('customerName').value,
        customerPhone: document.getElementById('customerPhone').value,
        customerAddress: document.getElementById('customerAddress').value,
        paymentMethod: document.getElementById('paymentMethod').value,
        items: cart,
        total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        timestamp: new Date().toISOString()
    };

    // Send order to Telegram bot (in real implementation)
    console.log('Order data:', orderData);
    
    // Show success message
    showSuccessMessage('Заказ успешно оформлен! Мы свяжемся с вами в ближайшее время.');
    
    // Clear cart and close modal
    cart = [];
    saveCart();
    updateCartCount();
    closeOrderModal();
    
    // Reset form
    orderForm.reset();
}

// Utility functions
function formatPrice(price) {
    return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        minimumFractionDigits: 0
    }).format(price);
}

function showSuccessMessage(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    
    document.querySelector('.main-content').insertBefore(successDiv, productsGrid);
    
    setTimeout(() => {
        successDiv.remove();
    }, 3000);
}

function closeModal(modal) {
    modal.classList.remove('show');
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);

