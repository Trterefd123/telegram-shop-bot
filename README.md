# Telegram Mini App - Каталог товаров

Полнофункциональное мини-приложение для Telegram, позволяющее создавать каталоги товаров с возможностью заказа прямо в мессенджере.

## 🚀 Возможности

- **Каталог товаров** с категориями и поиском
- **Корзина покупок** с управлением количеством
- **Оформление заказов** с формой контактных данных
- **Адаптивный дизайн** для мобильных устройств
- **Интеграция с Telegram WebApp API**
- **Уведомления** о заказах в Telegram
- **Административная панель** для управления заказами

## 📱 Демо

Пример работы: [ASKOODER SHOP](https://t.me/ASKOODERSHOP_bot/SHOP)

## 🛠 Технологии

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Node.js, Express.js
- **API**: Telegram Bot API
- **Хранение**: LocalStorage (можно заменить на базу данных)

## 📋 Требования

- Node.js 14.0.0 или выше
- Telegram Bot Token
- Веб-сервер с поддержкой HTTPS (для webhook)

## 🚀 Быстрый старт

### 1. Создание Telegram бота

1. Найдите [@BotFather](https://t.me/BotFather) в Telegram
2. Отправьте команду `/newbot`
3. Следуйте инструкциям для создания бота
4. Сохраните полученный токен

### 2. Настройка Mini App

1. Отправьте команду `/newapp` боту @BotFather
2. Выберите вашего бота
3. Укажите название и описание приложения
4. Загрузите скриншот (опционально)
5. Укажите URL вашего приложения
6. Получите ссылку на Mini App

### 3. Установка и настройка

```bash
# Клонирование репозитория
git clone https://github.com/yourusername/telegram-shop-miniapp.git
cd telegram-shop-miniapp

# Установка зависимостей
npm install

# Копирование файла конфигурации
cp env.example .env

# Редактирование конфигурации
nano .env
```

### 4. Настройка переменных окружения

Отредактируйте файл `.env`:

```env
BOT_TOKEN=your_bot_token_here
WEBHOOK_URL=https://your-domain.com
ADMIN_CHAT_ID=your_admin_chat_id
PORT=3000
```

### 5. Запуск приложения

```bash
# Режим разработки
npm run dev

# Продакшн режим
npm start
```

## 📁 Структура проекта

```
telegram-shop-miniapp/
├── index.html          # Главная страница Mini App
├── styles.css          # Стили приложения
├── script.js           # Основная логика фронтенда
├── config.js           # Конфигурация приложения
├── api.js              # API функции для Telegram
├── bot.js              # Backend сервер (Node.js)
├── package.json        # Зависимости проекта
├── env.example         # Пример конфигурации
└── README.md           # Документация
```

## 🔧 Конфигурация

### Основные настройки в `config.js`:

```javascript
const CONFIG = {
    BOT_TOKEN: 'YOUR_BOT_TOKEN_HERE',
    WEBHOOK_URL: 'YOUR_WEBHOOK_URL_HERE',
    APP_NAME: 'Каталог товаров',
    FEATURES: {
        SEARCH: true,
        CATEGORIES: true,
        CART: true,
        ORDERS: true
    }
};
```

### Добавление товаров

Отредактируйте массив `products` в файле `script.js`:

```javascript
const sampleProducts = [
    {
        id: 1,
        title: 'Название товара',
        description: 'Описание товара',
        price: 1000,
        oldPrice: 1200, // опционально
        image: 'https://example.com/image.jpg',
        category: 'electronics',
        inStock: true
    }
    // ... другие товары
];
```

## 🎨 Кастомизация

### Изменение темы

Отредактируйте CSS переменные в `styles.css`:

```css
:root {
    --primary-color: #667eea;
    --secondary-color: #764ba2;
    --success-color: #28a745;
    --error-color: #dc3545;
}
```

### Добавление новых категорий

1. Добавьте категорию в `config.js`
2. Обновите массив категорий в `index.html`
3. Добавьте стили в `styles.css`

## 📱 Интеграция с Telegram

### WebApp API

Приложение использует Telegram WebApp API для:

- Получения данных пользователя
- Отправки уведомлений
- Интеграции с интерфейсом Telegram

### Основные методы:

```javascript
// Инициализация
const tg = window.Telegram.WebApp;
tg.ready();
tg.expand();

// Получение данных пользователя
const user = tg.initDataUnsafe.user;

// Отправка данных в бот
tg.sendData(JSON.stringify(data));
```

## 🗄 База данных

По умолчанию используется LocalStorage. Для продакшн использования рекомендуется подключить базу данных:

### PostgreSQL

```javascript
const { Pool } = require('pg');
const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});
```

### MongoDB

```javascript
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI);
```

## 💳 Платежи

Для интеграции платежей добавьте в `config.js`:

```javascript
PAYMENT: {
    ENABLED: true,
    METHODS: ['card', 'cash', 'yookassa'],
    CURRENCY: 'RUB'
}
```

### Поддерживаемые платежные системы:

- YooKassa (ЮKassa)
- Stripe
- PayPal
- Наличные при получении

## 🚀 Развертывание

### Heroku

1. Создайте приложение на Heroku
2. Подключите GitHub репозиторий
3. Установите переменные окружения
4. Деплойте приложение

```bash
# Установка Heroku CLI
npm install -g heroku

# Логин
heroku login

# Создание приложения
heroku create your-app-name

# Установка переменных
heroku config:set BOT_TOKEN=your_token
heroku config:set WEBHOOK_URL=https://your-app-name.herokuapp.com

# Деплой
git push heroku main
```

### VPS/Сервер

1. Установите Node.js и PM2
2. Клонируйте репозиторий
3. Установите зависимости
4. Настройте Nginx для проксирования
5. Запустите приложение

```bash
# Установка PM2
npm install -g pm2

# Запуск приложения
pm2 start bot.js --name telegram-shop

# Автозапуск
pm2 startup
pm2 save
```

### Docker

```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## 🔒 Безопасность

- Используйте HTTPS для webhook
- Валидируйте все входящие данные
- Ограничьте доступ к административным функциям
- Регулярно обновляйте зависимости

## 📊 Мониторинг

### Логирование

```javascript
const winston = require('winston');
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' })
    ]
});
```

### Метрики

- Количество заказов
- Популярные товары
- Конверсия
- Время отклика

## 🧪 Тестирование

```bash
# Установка тестовых зависимостей
npm install --save-dev jest supertest

# Запуск тестов
npm test
```

## 📈 Оптимизация

### Производительность

- Минификация CSS и JavaScript
- Оптимизация изображений
- Кэширование статических файлов
- CDN для изображений

### SEO

- Мета-теги
- Структурированные данные
- Sitemap
- Robots.txt

## 🤝 Вклад в проект

1. Форкните репозиторий
2. Создайте ветку для новой функции
3. Внесите изменения
4. Создайте Pull Request

## 📄 Лицензия

MIT License - см. файл [LICENSE](LICENSE)

## 🆘 Поддержка

- Создайте [Issue](https://github.com/yourusername/telegram-shop-miniapp/issues)
- Напишите на email: support@example.com
- Telegram: [@your_support_bot](https://t.me/your_support_bot)

## 📚 Дополнительные ресурсы

- [Telegram Bot API](https://core.telegram.org/bots/api)
- [Telegram Web Apps](https://core.telegram.org/bots/webapps)
- [Node.js Express](https://expressjs.com/)
- [Telegram Mini Apps Examples](https://github.com/telegram-mini-apps)

## 🎯 Roadmap

- [ ] Интеграция с внешними CMS
- [ ] Система отзывов
- [ ] Программа лояльности
- [ ] Многоязычность
- [ ] Аналитика и отчеты
- [ ] Мобильное приложение

---

**Создано с ❤️ для Telegram сообщества**
