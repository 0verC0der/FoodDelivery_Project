const express = require('express');
const router = express.Router();
const multer = require('multer');
const db = require('../db/connection');

// Налаштування multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

// Middleware для перевірки унікальності
const checkUser = (req, res, next) => {
    const { login, email } = req.body;
    const query = 'SELECT * FROM users WHERE email = ? OR login = ?';
    
    db.query(query, [email, login], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: 'Помилка перевірки користувача' });
        }

        if (result.length > 0) {
            const user = result[0];
            if (user.login === login) {
                return res.status(400).json({ success: false, message: 'Користувач з таким логіном вже існує' });
            }
            if (user.email === email) {
                return res.status(400).json({ success: false, message: 'Користувач з такою поштою вже існує' });
            }
        }
        next();
    });
};

// GET - Показати форму реєстрації
router.get('/register', (req, res) => {
    if (req.session.user) {
        return res.redirect('/profile');
    }
    res.render('register');
});

// POST - Реєстрація
router.post('/register', upload.single('profilePhoto'), checkUser, (req, res) => {
    const { name, surname, login, email, password } = req.body;
    const profilePhoto = req.file.filename;

    const query = 'INSERT INTO users (name, surname, login, email, password, photo) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(query, [name, surname, login, email, password, profilePhoto], (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: 'Помилка реєстрації' });
        }
        res.json({ success: true });
    });
});

module.exports = router;
