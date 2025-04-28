const express = require('express');
const session = require('express-session');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/auth'); 
const mainRoutes = require('./routes/main');
const registerRoutes = require('./routes/register'); // Підключення маршруту реєстрації
const cartRoutes = require('./routes/cart'); // Підключення маршруту кошика

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use(session({
    secret: 'your-secret-key', // Замініть на ваш секретний ключ
    resave: true, // Не зберігати сесію, якщо вона не змінювалася
    saveUninitialized: false, // Не створювати порожні сесії
    name: 'authSession',
    cookie: {
        maxAge: 1000 * 60 * 60 * 2, // 2 години
        httpOnly: true, // Cookie доступні тільки на сервері
        secure: false, // Встановіть true, якщо використовуєте HTTPS
        sameSite: 'lax' // Дозволяє передавати cookie між сторінками
    }
}));
  
app.get('/', (req, res) => {
    res.render('mainPage');
});
app.use(mainRoutes);
app.use(authRoutes);
app.use(registerRoutes); 
app.use(cartRoutes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Сервер запущено на http://localhost:${PORT}`);
});