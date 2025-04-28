const express = require('express');
const router = express.Router();
const db = require('../db/connection');

router.get('/cart', (req, res) => {

    res.render('cart'); 
    // if (!req.session.user) {
    //     return res.redirect('/login'); // Якщо не авторизований, перенаправляємо на сторінку входу
    // }
    // const userId = req.session.user.id; // Отримуємо ID користувача з сесії
    // const query = 'SELECT * FROM cart WHERE user_id = ?'; // Запит до бази даних для отримання товарів у кошику
    // db.query(query, [userId], (err, results) => {
    //     if (err) {
    //         console.error(err);
    //         return res.status(500).send('Помилка при отриманні кошика');
    //     }
    //     res.render('cart', { items: results }); // Передаємо товари в шаблон
    // });
});

module.exports = router;
