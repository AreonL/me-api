var express = require('express');
var router = express.Router();
const auth = require('../models/auth');

router.post('/login', (req, res) => auth.login(req, res));

router.post('/register', (req, res) => auth.register(req, res));

router.post('/invite',
    (req, res, next) => auth.checkToken(req, res, next),
    (req, res) => auth.sendMail(req, res)
);

module.exports = router;
