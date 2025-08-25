const express = require('express');
const router = express.Router();
const db = require('../db/connection');


router.post('/cart/add', (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: 'Користувач не авторизований' });
    }
    const userId = req.session.user.id; // Отримуємо userId з сесії
    const { mealId, quantity } = req.body;

    const query = `
        INSERT INTO cart_items (user_id, meal_id, quantity)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity);
    `;

    db.query(query, [userId, mealId, quantity], (err, result) => {
        if (err) {
            console.error('Помилка додавання до корзини:', err);
            return res.status(500).json({ message: 'Помилка сервера' });
        }
        res.json({ message: 'Страва додана до корзини' });
    });
});

router.post('/cart/delete', (req, res) => {

    if (!req.session.user) {
        return res.status(401).json({ message: 'Користувач не авторизований' });
    }

    const userId = req.session.user.id;
    const { cartItemId } = req.body;
    console.log('cartItemId:', cartItemId);

    const query = `
        DELETE FROM cart_items
        WHERE id = ? AND user_id = ?;
    `;

    db.query(query, [cartItemId, userId], (err, result) => {
        if (err) {
            console.error('Помилка видалення з корзини:', err);
            return res.status(500).json({ message: 'Помилка сервера' });
        }
        res.json({ message: 'Товар видалено з корзини' });
    });
});

router.post('/cart/clear', (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: 'Користувач не авторизований' });
    }

    const userId = req.session.user.id;

    const query = `
        DELETE FROM cart_items
        WHERE user_id = ?;
    `;

    db.query(query, [userId], (err, result) => {
        if (err) {
            console.error('Помилка очистки корзини:', err);
            return res.status(500).json({ message: 'Помилка сервера' });
        }
        res.json({ message: 'Корзина очищена' });
    });
});

router.get('/cart', (req, res) => {
    if (!req.session.user) {
        res.redirect('/login'); // Перенаправлення на сторінку входу, якщо користувач не авторизований
    }

    const userId = req.session.user.id;
    const query = `
        SELECT 
            cart_items.id AS cartItemId,
            meals.name AS mealName,
            meals.price AS mealPrice,
            cart_items.quantity,
            meals.image_url AS mealImageUrl
        FROM 
            cart_items
        INNER JOIN 
            meals ON cart_items.meal_id = meals.meal_id
        WHERE 
            cart_items.user_id = ?;
    `;

    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Помилка отримання корзини:', err);
            return res.status(500).send('Помилка сервера');
        }
        res.render('cart', { cartItems: results , user: req.session.user });
    });
});

router.post('/cart/change', (req, res) => {
    if (!req.session.user) {
        res.redirect('/login'); // Перенаправлення на сторінку входу, якщо користувач не авторизований
    }
    const userId = req.session.user.id;
    const { cartItemId, delta } = req.body;

    const query = `
        UPDATE cart_items
        SET quantity = GREATEST(quantity + ?, 1)
        WHERE id = ? AND user_id = ?;
    `;

    db.query(query, [delta, cartItemId, userId], (err, result) => {
        if (err) {
            console.error('Помилка оновлення кількості:', err);
            return res.status(500).json({ message: 'Помилка сервера' });
        }
        res.json({ message: 'Кількість оновлено' });
    });
});


module.exports = router;
