const express = require('express');
const router = express.Router();
const db = require('../db/connection'); // використовуємо підключення з одного місця
                                     
router.get('/dishes', (req, res) => {
    const maxPrice = parseFloat(req.query.maxPrice) || Infinity;
    const query = 'SELECT * FROM meals WHERE price <= ?';

    db.query(query, [maxPrice], (err, results) => {
        if (err) {
            console.error('Помилка виконання запиту:', err);
            return res.status(500).send('Помилка сервера');
        }
        res.json(results);
    });
});

module.exports = router;
