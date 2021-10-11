var express = require('express');
var router = express.Router();
const auth = require('../models/auth');

router.post('/login', (req, res) => auth.login(req, res));

router.post('/register',(req, res) => auth.register(req, res));

// router.get('/',(req, res) => {
//     auth.checkToken(req, res, next);
// });

module.exports = router;
