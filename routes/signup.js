var express = require('express');
var router = express.Router();
let { User } = require('../models/user');

router.get('/signup', (req, res) => {
    res.render('signup')
});

router.post('/signup', (req, res) => {
    let user = new User({
        username: req.body.username,
        password: req.body.password
    });
    user.save()
        .then(() => {
            res.redirect('/');
        })
        .catch((err) => {
            console.error(err);
            res.redirect('/user/signup');
        });
});

module.exports = router;

