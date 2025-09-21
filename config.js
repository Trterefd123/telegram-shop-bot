// Configuration for Telegram Mini App
const CONFIG = {
    // Telegram Bot Configuration
    BOT_TOKEN: 'YOUR_BOT_TOKEN_HERE', // Replace with your actual bot token
    WEBHOOK_URL: 'YOUR_WEBHOOK_URL_HERE', // Replace with your webhook URL
    
    // App Configuration
    APP_NAME: 'Каталог товаров',
    APP_VERSION: '1.0.0',
    
    // API Configuration
    API_BASE_URL: 'https://api.telegram.org/bot',
    
    // Product Configuration
    PRODUCTS_PER_PAGE: 20,
    MAX_CART_ITEMS: 50,
    
    // UI Configuration
    THEME: {
        PRIMARY_COLOR: '#667eea',
        SECONDARY_COLOR: '#764ba2',
        SUCCESS_COLOR: '#28a745',
        ERROR_COLOR: '#dc3545',
        WARNING_COLOR: '#ffc107'
    },
    
    // Features
    FEATURES: {
        SEARCH: true,
        CATEGORIES: true,
        CART: true,
        ORDERS: true,
        FAVORITES: false,
        REVIEWS: false,
        NOTIFICATIONS: true
    },
    
    // Payment Configuration
    PAYMENT: {
        ENABLED: true,
        METHODS: ['card', 'cash'],
        CURRENCY: 'RUB'
    },
    
    // Storage Configuration
    STORAGE: {
        CART_KEY: 'telegram_shop_cart',
        USER_PREFERENCES_KEY: 'telegram_shop_preferences',
        FAVORITES_KEY: 'telegram_shop_favorites'
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
