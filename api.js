// API functions for Telegram Mini App
class TelegramShopAPI {
    constructor() {
        this.baseURL = 'https://api.telegram.org/bot';
        this.botToken = CONFIG.BOT_TOKEN;
    }

    // Send message to user
    async sendMessage(chatId, text, options = {}) {
        const url = `${this.baseURL}${this.botToken}/sendMessage`;
        const data = {
            chat_id: chatId,
            text: text,
            parse_mode: 'HTML',
            ...options
        };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            return await response.json();
        } catch (error) {
            console.error('Error sending message:', error);
            throw error;
        }
    }

    // Send order notification to admin
    async sendOrderNotification(orderData) {
        const adminChatId = 'YOUR_ADMIN_CHAT_ID'; // Replace with admin chat ID
        
        const message = `
🛒 <b>Новый заказ!</b>

👤 <b>Клиент:</b> ${orderData.customerName}
📞 <b>Телефон:</b> ${orderData.customerPhone}
📍 <b>Адрес:</b> ${orderData.customerAddress}
💳 <b>Оплата:</b> ${orderData.paymentMethod === 'card' ? 'Банковская карта' : 'Наличные при получении'}

📦 <b>Товары:</b>
${orderData.items.map(item => 
    `• ${item.title} x${item.quantity} - ${formatPrice(item.price * item.quantity)}`
).join('\n')}

💰 <b>Итого:</b> ${formatPrice(orderData.total)}
⏰ <b>Время:</b> ${new Date(orderData.timestamp).toLocaleString('ru-RU')}
        `;

        return await this.sendMessage(adminChatId, message);
    }

    // Send order confirmation to customer
    async sendOrderConfirmation(chatId, orderData) {
        const message = `
✅ <b>Заказ подтвержден!</b>

Спасибо за ваш заказ! Мы получили следующие данные:

👤 <b>Имя:</b> ${orderData.customerName}
📞 <b>Телефон:</b> ${orderData.customerPhone}
📍 <b>Адрес:</b> ${orderData.customerAddress}

📦 <b>Ваш заказ:</b>
${orderData.items.map(item => 
    `• ${item.title} x${item.quantity} - ${formatPrice(item.price * item.quantity)}`
).join('\n')}

💰 <b>К оплате:</b> ${formatPrice(orderData.total)}

Мы свяжемся с вами в ближайшее время для подтверждения заказа и уточнения деталей доставки.
        `;

        return await this.sendMessage(chatId, message);
    }

    // Get user data from Telegram
    getUserData() {
        const tg = window.Telegram.WebApp;
        return {
            id: tg.initDataUnsafe.user?.id,
            username: tg.initDataUnsafe.user?.username,
            first_name: tg.initDataUnsafe.user?.first_name,
            last_name: tg.initDataUnsafe.user?.last_name,
            language_code: tg.initDataUnsafe.user?.language_code
        };
    }

    // Validate order data
    validateOrder(orderData) {
        const errors = [];

        if (!orderData.customerName || orderData.customerName.trim().length < 2) {
            errors.push('Имя должно содержать минимум 2 символа');
        }

        if (!orderData.customerPhone || !/^[\+]?[0-9\s\-\(\)]{10,}$/.test(orderData.customerPhone)) {
            errors.push('Введите корректный номер телефона');
        }

        if (!orderData.customerAddress || orderData.customerAddress.trim().length < 10) {
            errors.push('Адрес должен содержать минимум 10 символов');
        }

        if (!orderData.paymentMethod) {
            errors.push('Выберите способ оплаты');
        }

        if (!orderData.items || orderData.items.length === 0) {
            errors.push('Корзина пуста');
        }

        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    // Save order to local storage (for demo purposes)
    saveOrder(orderData) {
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        orders.push({
            ...orderData,
            id: Date.now().toString(),
            status: 'pending'
        });
        localStorage.setItem('orders', JSON.stringify(orders));
        return orders[orders.length - 1];
    }

    // Get orders from local storage
    getOrders() {
        return JSON.parse(localStorage.getItem('orders') || '[]');
    }

    // Update order status
    updateOrderStatus(orderId, status) {
        const orders = this.getOrders();
        const order = orders.find(o => o.id === orderId);
        if (order) {
            order.status = status;
            order.updatedAt = new Date().toISOString();
            localStorage.setItem('orders', JSON.stringify(orders));
        }
        return order;
    }
}

// Create API instance
const api = new TelegramShopAPI();

// Utility function for price formatting
function formatPrice(price) {
    return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        minimumFractionDigits: 0
    }).format(price);
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { TelegramShopAPI, api };
}
