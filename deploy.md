# Руководство по развертыванию Telegram Mini App

## 🚀 Пошаговое развертывание

### Шаг 1: Подготовка

1. **Создайте Telegram бота:**
   - Перейдите к [@BotFather](https://t.me/BotFather)
   - Отправьте `/newbot`
   - Следуйте инструкциям
   - Сохраните токен бота

2. **Создайте Mini App:**
   - Отправьте `/newapp` боту @BotFather
   - Выберите вашего бота
   - Укажите название: "Каталог товаров"
   - Описание: "Интернет-магазин в Telegram"
   - URL: `https://your-domain.com` (будет настроен позже)

### Шаг 2: Настройка сервера

#### Вариант A: Heroku (рекомендуется для начинающих)

1. **Установите Heroku CLI:**
   ```bash
   # Windows
   # Скачайте с https://devcenter.heroku.com/articles/heroku-cli
   
   # macOS
   brew install heroku/brew/heroku
   
   # Linux
   curl https://cli-assets.heroku.com/install.sh | sh
   ```

2. **Войдите в Heroku:**
   ```bash
   heroku login
   ```

3. **Создайте приложение:**
   ```bash
   heroku create your-shop-bot
   ```

4. **Настройте переменные окружения:**
   ```bash
   heroku config:set BOT_TOKEN=your_bot_token_here
   heroku config:set ADMIN_CHAT_ID=your_telegram_chat_id
   heroku config:set NODE_ENV=production
   ```

5. **Деплойте приложение:**
   ```bash
   git add .
   git commit -m "Initial deployment"
   git push heroku main
   ```

6. **Получите URL приложения:**
   ```bash
   heroku apps:info
   ```

#### Вариант B: VPS/Собственный сервер

1. **Подготовьте сервер:**
   ```bash
   # Обновление системы
   sudo apt update && sudo apt upgrade -y
   
   # Установка Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Установка PM2
   sudo npm install -g pm2
   
   # Установка Nginx
   sudo apt install nginx -y
   ```

2. **Настройте Nginx:**
   ```bash
   sudo nano /etc/nginx/sites-available/telegram-shop
   ```
   
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```
   
   ```bash
   sudo ln -s /etc/nginx/sites-available/telegram-shop /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

3. **Настройте SSL (Let's Encrypt):**
   ```bash
   sudo apt install certbot python3-certbot-nginx -y
   sudo certbot --nginx -d your-domain.com
   ```

4. **Запустите приложение:**
   ```bash
   # Клонирование проекта
   git clone https://github.com/yourusername/telegram-shop-miniapp.git
   cd telegram-shop-miniapp
   
   # Установка зависимостей
   npm install --production
   
   # Создание .env файла
   nano .env
   ```
   
   ```env
   BOT_TOKEN=your_bot_token_here
   WEBHOOK_URL=https://your-domain.com
   ADMIN_CHAT_ID=your_telegram_chat_id
   PORT=3000
   NODE_ENV=production
   ```
   
   ```bash
   # Запуск с PM2
   pm2 start bot.js --name telegram-shop
   pm2 startup
   pm2 save
   ```

### Шаг 3: Настройка домена и SSL

1. **Получите домен** (если используете VPS):
   - Зарегистрируйте домен
   - Настройте A-запись на IP вашего сервера

2. **Обновите URL в BotFather:**
   - Отправьте `/myapps` боту @BotFather
   - Выберите ваше приложение
   - Обновите URL на `https://your-domain.com`

### Шаг 4: Настройка webhook

1. **Автоматически (через код):**
   Приложение автоматически настроит webhook при запуске

2. **Вручную:**
   ```bash
   curl -X POST "https://api.telegram.org/botYOUR_BOT_TOKEN/setWebhook" \
        -H "Content-Type: application/json" \
        -d '{"url": "https://your-domain.com/webhook"}'
   ```

### Шаг 5: Тестирование

1. **Проверьте работу бота:**
   - Найдите вашего бота в Telegram
   - Отправьте `/start`
   - Проверьте все команды

2. **Проверьте Mini App:**
   - Отправьте `/shop` боту
   - Нажмите на кнопку "Открыть магазин"
   - Проверьте все функции

3. **Проверьте заказы:**
   - Сделайте тестовый заказ
   - Проверьте получение уведомлений

## 🔧 Дополнительная настройка

### Настройка товаров

1. **Отредактируйте `script.js`:**
   ```javascript
   const sampleProducts = [
       {
           id: 1,
           title: 'Ваш товар',
           description: 'Описание товара',
           price: 1000,
           image: 'https://example.com/image.jpg',
           category: 'electronics',
           inStock: true
       }
       // Добавьте больше товаров
   ];
   ```

2. **Добавьте изображения:**
   - Загрузите изображения на сервер
   - Обновите URL в массиве товаров

### Настройка уведомлений

1. **Получите Chat ID администратора:**
   - Отправьте сообщение боту [@userinfobot](https://t.me/userinfobot)
   - Скопируйте ваш Chat ID

2. **Обновите конфигурацию:**
   ```bash
   heroku config:set ADMIN_CHAT_ID=your_chat_id
   # или
   # Обновите .env файл
   ```

### Настройка платежей

1. **YooKassa (ЮKassa):**
   ```javascript
   // В config.js
   PAYMENT: {
       ENABLED: true,
       METHODS: ['yookassa', 'cash'],
       YOOKASSA_SHOP_ID: 'your_shop_id',
       YOOKASSA_SECRET_KEY: 'your_secret_key'
   }
   ```

2. **Stripe:**
   ```javascript
   PAYMENT: {
       ENABLED: true,
       METHODS: ['stripe', 'cash'],
       STRIPE_PUBLIC_KEY: 'pk_test_...',
       STRIPE_SECRET_KEY: 'sk_test_...'
   }
   ```

## 📊 Мониторинг и логи

### Heroku

```bash
# Просмотр логов
heroku logs --tail

# Мониторинг ресурсов
heroku ps:scale web=1
```

### VPS/Сервер

```bash
# Просмотр логов PM2
pm2 logs telegram-shop

# Мониторинг ресурсов
pm2 monit

# Перезапуск приложения
pm2 restart telegram-shop
```

## 🔒 Безопасность

1. **Настройте файрвол:**
   ```bash
   sudo ufw allow 22
   sudo ufw allow 80
   sudo ufw allow 443
   sudo ufw enable
   ```

2. **Регулярно обновляйте систему:**
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

3. **Используйте сильные пароли и SSH ключи**

4. **Настройте резервное копирование**

## 🚨 Устранение неполадок

### Бот не отвечает

1. Проверьте токен бота
2. Проверьте webhook: `https://api.telegram.org/botYOUR_TOKEN/getWebhookInfo`
3. Проверьте логи приложения

### Mini App не открывается

1. Проверьте URL в BotFather
2. Проверьте SSL сертификат
3. Проверьте CORS настройки

### Заказы не приходят

1. Проверьте ADMIN_CHAT_ID
2. Проверьте логи приложения
3. Проверьте настройки уведомлений

## 📞 Поддержка

Если у вас возникли проблемы:

1. Проверьте логи приложения
2. Убедитесь, что все переменные окружения настроены
3. Проверьте статус сервисов Telegram
4. Создайте Issue в репозитории проекта

---

**Удачного развертывания! 🚀**
