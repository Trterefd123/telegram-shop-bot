// Telegram Bot implementation (Node.js)
const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Bot configuration
const BOT_TOKEN = process.env.BOT_TOKEN || 'YOUR_BOT_TOKEN_HERE';
const WEBHOOK_URL = process.env.WEBHOOK_URL || 'YOUR_WEBHOOK_URL_HERE';
const ADMIN_CHAT_ID = process.env.ADMIN_CHAT_ID || 'YOUR_ADMIN_CHAT_ID';

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Bot API URL
const BOT_API_URL = `https://api.telegram.org/bot${BOT_TOKEN}`;

// Sample products database (in real app, use a proper database)
const products = [
    {
        id: 1,
        title: 'iPhone 15 Pro',
        description: 'Новейший смартфон с титановым корпусом и чипом A17 Pro',
        price: 89990,
        oldPrice: 99990,
        image: 'https://via.placeholder.com/300x200/667eea/ffffff?text=iPhone+15+Pro',
        category: 'electronics',
        inStock: true
    },
    {
        id: 2,
        title: 'MacBook Air M2',
        description: 'Ультратонкий ноутбук с чипом M2 и дисплеем Liquid Retina',
        price: 119990,
        oldPrice: 139990,
        image: 'https://via.placeholder.com/300x200/764ba2/ffffff?text=MacBook+Air+M2',
        category: 'electronics',
        inStock: true
    },
    {
        id: 3,
        title: 'Nike Air Max 270',
        description: 'Удобные кроссовки с максимальной амортизацией',
        price: 12990,
        oldPrice: 15990,
        image: 'https://via.placeholder.com/300x200/ff6b6b/ffffff?text=Nike+Air+Max',
        category: 'sports',
        inStock: true
    },
    {
        id: 4,
        title: 'Джинсы Levi\'s 501',
        description: 'Классические прямые джинсы из денима премиум качества',
        price: 5990,
        oldPrice: 7990,
        image: 'https://via.placeholder.com/300x200/4ecdc4/ffffff?text=Levi\'s+501',
        category: 'clothing',
        inStock: true
    },
    {
        id: 5,
        title: 'Кофемашина De\'Longhi',
        description: 'Автоматическая кофемашина для приготовления эспрессо и капучино',
        price: 45990,
        oldPrice: 52990,
        image: 'https://via.placeholder.com/300x200/45b7d1/ffffff?text=Coffee+Machine',
        category: 'home',
        inStock: true
    }
];

// Orders storage (in real app, use a proper database)
let orders = [];

// Send message to Telegram
async function sendMessage(chatId, text, options = {}) {
    try {
        const response = await axios.post(`${BOT_API_URL}/sendMessage`, {
            chat_id: chatId,
            text: text,
            parse_mode: 'HTML',
            ...options
        });
        return response.data;
    } catch (error) {
        console.error('Error sending message:', error);
        throw error;
    }
}

// Send message with inline keyboard
async function sendMessageWithKeyboard(chatId, text, keyboard) {
    return await sendMessage(chatId, text, {
        reply_markup: {
            inline_keyboard: keyboard
        }
    });
}

// Handle incoming webhook
app.post('/webhook', async (req, res) => {
    try {
        const update = req.body;
        
        if (update.message) {
            await handleMessage(update.message);
        } else if (update.callback_query) {
            await handleCallbackQuery(update.callback_query);
        }
        
        res.status(200).send('OK');
    } catch (error) {
        console.error('Webhook error:', error);
        res.status(500).send('Error');
    }
});

// Handle text messages
async function handleMessage(message) {
    const chatId = message.chat.id;
    const text = message.text;

    if (text === '/start') {
        await sendWelcomeMessage(chatId);
    } else if (text === '/shop') {
        await sendShopMessage(chatId);
    } else if (text === '/orders') {
        await sendOrdersMessage(chatId);
    } else if (text === '/help') {
        await sendHelpMessage(chatId);
    } else {
        await sendMessage(chatId, 'Используйте команды для навигации по боту.');
    }
}

// Handle callback queries
async function handleCallbackQuery(callbackQuery) {
    const chatId = callbackQuery.message.chat.id;
    const data = callbackQuery.data;

    if (data === 'open_shop') {
        await sendShopMessage(chatId);
    } else if (data.startsWith('product_')) {
        const productId = parseInt(data.split('_')[1]);
        await sendProductDetails(chatId, productId);
    } else if (data.startsWith('category_')) {
        const category = data.split('_')[1];
        await sendProductsByCategory(chatId, category);
    } else if (data === 'view_orders') {
        await sendOrdersMessage(chatId);
    }
}

// Send welcome message
async function sendWelcomeMessage(chatId) {
    const message = `
🛍️ <b>Добро пожаловать в наш магазин!</b>

Здесь вы можете:
• Просматривать каталог товаров
• Добавлять товары в корзину
• Оформлять заказы
• Отслеживать статус заказов

Используйте кнопки ниже для навигации:
    `;

    const keyboard = [
        [{ text: '🛒 Открыть магазин', callback_data: 'open_shop' }],
        [{ text: '📦 Мои заказы', callback_data: 'view_orders' }],
        [{ text: '❓ Помощь', callback_data: 'help' }]
    ];

    await sendMessageWithKeyboard(chatId, message, keyboard);
}

// Send shop message
async function sendShopMessage(chatId) {
    const message = `
🛍️ <b>Каталог товаров</b>

Выберите категорию для просмотра товаров:
    `;

    const keyboard = [
        [{ text: '📱 Электроника', callback_data: 'category_electronics' }],
        [{ text: '👕 Одежда', callback_data: 'category_clothing' }],
        [{ text: '🏠 Дом', callback_data: 'category_home' }],
        [{ text: '⚽ Спорт', callback_data: 'category_sports' }],
        [{ text: '🔄 Все товары', callback_data: 'category_all' }]
    ];

    await sendMessageWithKeyboard(chatId, message, keyboard);
}

// Send products by category
async function sendProductsByCategory(chatId, category) {
    let filteredProducts = products;
    
    if (category !== 'all') {
        filteredProducts = products.filter(p => p.category === category);
    }

    if (filteredProducts.length === 0) {
        await sendMessage(chatId, 'Товары в данной категории не найдены.');
        return;
    }

    const message = `📦 <b>Товары в категории "${getCategoryName(category)}"</b>\n\n`;
    
    const keyboard = filteredProducts.slice(0, 5).map(product => [
        { 
            text: `${product.title} - ${formatPrice(product.price)}`, 
            callback_data: `product_${product.id}` 
        }
    ]);

    if (filteredProducts.length > 5) {
        keyboard.push([{ text: '📱 Открыть полный каталог', url: `${WEBHOOK_URL}/shop` }]);
    }

    await sendMessageWithKeyboard(chatId, message, keyboard);
}

// Send product details
async function sendProductDetails(chatId, productId) {
    const product = products.find(p => p.id === productId);
    if (!product) {
        await sendMessage(chatId, 'Товар не найден.');
        return;
    }

    const message = `
📦 <b>${product.title}</b>

${product.description}

💰 <b>Цена:</b> ${formatPrice(product.price)}
${product.oldPrice ? `💸 <b>Старая цена:</b> ${formatPrice(product.oldPrice)}` : ''}
📂 <b>Категория:</b> ${getCategoryName(product.category)}
${product.inStock ? '✅ В наличии' : '❌ Нет в наличии'}

Для покупки перейдите в наш магазин:
    `;

    const keyboard = [
        [{ text: '🛒 Открыть магазин', url: `${WEBHOOK_URL}/shop` }],
        [{ text: '🔙 Назад к каталогу', callback_data: 'open_shop' }]
    ];

    await sendMessageWithKeyboard(chatId, message, keyboard);
}

// Send orders message
async function sendOrdersMessage(chatId) {
    const userOrders = orders.filter(order => order.customerPhone === 'user_phone'); // In real app, use user ID
    
    if (userOrders.length === 0) {
        await sendMessage(chatId, 'У вас пока нет заказов.');
        return;
    }

    let message = '📦 <b>Ваши заказы:</b>\n\n';
    
    userOrders.forEach((order, index) => {
        message += `${index + 1}. Заказ #${order.id}\n`;
        message += `   Статус: ${getOrderStatusText(order.status)}\n`;
        message += `   Сумма: ${formatPrice(order.total)}\n`;
        message += `   Дата: ${new Date(order.timestamp).toLocaleDateString('ru-RU')}\n\n`;
    });

    const keyboard = [
        [{ text: '🛒 Сделать новый заказ', callback_data: 'open_shop' }]
    ];

    await sendMessageWithKeyboard(chatId, message, keyboard);
}

// Send help message
async function sendHelpMessage(chatId) {
    const message = `
❓ <b>Помощь</b>

<b>Команды бота:</b>
/start - Начать работу с ботом
/shop - Открыть магазин
/orders - Посмотреть заказы
/help - Показать эту справку

<b>Как сделать заказ:</b>
1. Откройте магазин командой /shop
2. Выберите товары и добавьте их в корзину
3. Оформите заказ с указанием ваших данных
4. Дождитесь подтверждения от менеджера

<b>Поддержка:</b>
Если у вас есть вопросы, обратитесь к администратору.
    `;

    const keyboard = [
        [{ text: '🛒 Открыть магазин', callback_data: 'open_shop' }]
    ];

    await sendMessageWithKeyboard(chatId, message, keyboard);
}

// API endpoint for orders
app.post('/api/orders', async (req, res) => {
    try {
        const orderData = req.body;
        
        // Validate order data
        if (!orderData.customerName || !orderData.customerPhone || !orderData.items) {
            return res.status(400).json({ error: 'Invalid order data' });
        }

        // Add order
        const order = {
            id: Date.now().toString(),
            ...orderData,
            status: 'pending',
            timestamp: new Date().toISOString()
        };
        
        orders.push(order);

        // Send notification to admin
        await sendOrderNotification(order);

        // Send confirmation to customer
        await sendOrderConfirmation(order.customerPhone, order);

        res.json({ success: true, orderId: order.id });
    } catch (error) {
        console.error('Order error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Send order notification to admin
async function sendOrderNotification(order) {
    const message = `
🛒 <b>Новый заказ!</b>

👤 <b>Клиент:</b> ${order.customerName}
📞 <b>Телефон:</b> ${order.customerPhone}
📍 <b>Адрес:</b> ${order.customerAddress}
💳 <b>Оплата:</b> ${order.paymentMethod === 'card' ? 'Банковская карта' : 'Наличные при получении'}

📦 <b>Товары:</b>
${order.items.map(item => 
    `• ${item.title} x${item.quantity} - ${formatPrice(item.price * item.quantity)}`
).join('\n')}

💰 <b>Итого:</b> ${formatPrice(order.total)}
⏰ <b>Время:</b> ${new Date(order.timestamp).toLocaleString('ru-RU')}
    `;

    await sendMessage(ADMIN_CHAT_ID, message);
}

// Send order confirmation to customer
async function sendOrderConfirmation(phone, order) {
    // In real app, you would need to map phone to chat ID
    // For demo purposes, we'll just log it
    console.log('Order confirmation for phone:', phone);
}

// Utility functions
function formatPrice(price) {
    return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        minimumFractionDigits: 0
    }).format(price);
}

function getCategoryName(category) {
    const categories = {
        'electronics': 'Электроника',
        'clothing': 'Одежда',
        'home': 'Дом',
        'sports': 'Спорт',
        'all': 'Все товары'
    };
    return categories[category] || category;
}

function getOrderStatusText(status) {
    const statuses = {
        'pending': 'Ожидает подтверждения',
        'confirmed': 'Подтвержден',
        'processing': 'В обработке',
        'shipped': 'Отправлен',
        'delivered': 'Доставлен',
        'cancelled': 'Отменен'
    };
    return statuses[status] || status;
}

// Set webhook
async function setWebhook() {
    try {
        const response = await axios.post(`${BOT_API_URL}/setWebhook`, {
            url: WEBHOOK_URL + '/webhook'
        });
        console.log('Webhook set:', response.data);
    } catch (error) {
        console.error('Error setting webhook:', error);
    }
}

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    setWebhook();
});

module.exports = app;
