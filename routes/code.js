var express = require('express');
var router = express.Router();

const code = require('../models/code');
const auth = require('../models/auth');

router.get('/',
    (req, res, next) => auth.checkToken(req, res, next),
    (req, res) => code.getAllData(req, res)
);

router.post('/',
    (req, res, next) => auth.checkToken(req, res, next),
    (req, res) => code.createCode(req, res)
);

router.put('/',
    (req, res, next) => auth.checkToken(req, res, next),
    (req, res) => code.updateCode(req, res)
);

module.exports = router;
