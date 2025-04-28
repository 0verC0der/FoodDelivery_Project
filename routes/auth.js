const express = require('express');
const router = express.Router();
const db = require('../db/connection'); // Підключення до бази даних

// Middleware для перевірки авторизації
function isAuthenticated(req, res, next) { 
    if (req.session.user) {
        next();
    } else {
        res.status(401).redirect('/login'); // Якщо не авторизований, перенаправляємо на сторінку входу
    }
}

// Логін
router.get('/login', (req, res) => {  
    if (req.session.user) {
        return res.redirect('/profile'); // Якщо вже авторизований, перенаправляємо на профіль
    } 
    res.render('login'); 
});

router.post('/login', (req, res) => {   
    const { login, password } = req.body;
    const query = 'SELECT * FROM users WHERE login = ? AND password = ?';
    db.query(query, [login, password], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: 'Помилка входу' }); // Повертаємо JSON
        }
        if (results.length > 0) {
            req.session.user = results[0];
            console.log('Сессія =', req.session.user);
            res.json({ success: true });
        } else {
            res.status(401).json({ success: false, message: 'Невірні дані' }); // Повертаємо JSON
        }
    });
});

// Перевірка авторизації
router.get('/profile', isAuthenticated, (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login'); // Якщо вже авторизований, перенаправляємо на профіль
    }
    res.render('profile', {user: req.session.user}); // Передаємо дані користувача в шаблон
});

// Вихід з акаунту
router.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error(err);
            return res.status(500).send('Помилка при виході');
        }
        res.redirect('login'); // Повертаємо на сторінку входу
    });
});

module.exports = router;
