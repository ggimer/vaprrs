const functions = require("../functions/functions");
const db = require("../functions/database");
const bcrypt = require('bcryptjs');
const express = require("express");
const router = express.Router();
module.exports = router;


//login 
router.get('/signup', async (req, res) => {
    let password = generatePwd();
    res.render('signup', { "suggestedPassword": password });
});

router.post('/signup', async (req, res) => {
    let user = req.body.username;
    let userPassword = req.body.pwd;

    let sql = `SELECT t14.username
              FROM t14_users t14
              WHERE username = ?;
              `;
    let data = await db.executeSQL(sql, [user]);

    if (data.length > 0) {  //checks if record found
        res.render('signup', { "error": "Username already taken! Please try another." });
    }
    else {
        let hash = bcrypt.hashSync(userPassword, 10);
        sql = `INSERT INTO t14_users (username, password, isAdmin)
        VALUES (?, ?, 'false')`;
        data = await db.executeSQL(sql, [user, hash]);
        res.redirect('/login');
    }
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', async (req, res) => {
    let username = req.body.username;
    let userPassword = req.body.pwd;
    let passwordHash = "";

    let sql = `SELECT * FROM t14_users WHERE username = ?`;
    let data = await db.executeSQL(sql, [username]);
    if (data.length > 0) {  //checks if record found
        passwordHash = data[0].password;
    }
    const matchPassword = await bcrypt.compare(userPassword, passwordHash);

    if (matchPassword) {
        req.session.userId = data[0].userId;
        res.redirect('/');
    } else {
        res.render('login', { "error": "Invalid Credentials!" });
    }
});

function generatePwd() {
    let password = "";
    let length = 20;
    let chars = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
        'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
        1, 2, 3, 4, 5, 6, 7, 8, 9, 0, '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+', '-', '='];

    for (i = 0; i < length; i++) {
        let randomIndex = Math.floor(Math.random() * chars.length)
        password += chars[randomIndex];
    }
    return password;
}