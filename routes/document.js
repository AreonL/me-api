var express = require('express');
var router = express.Router();

const data = require('../models/data');
const auth = require('../models/auth');

router.get('/',
    (req, res, next) => auth.checkToken(req, res, next),
    (req, res) => data.getAllData(req, res)
);

router.post('/create',
    (req, res, next) => auth.checkToken(req, res, next),
    (req, res) => data.createNewData(req, res)
);

router.post('/update',
    (req, res, next) => auth.checkToken(req, res, next),
    (req, res) => data.updateData(req, res)
);

// router.post('/create', (req, res) => {
//     return data.createNewData(req, res);
// });

// router.post('/update', (req, res) => {
//     return data.updateData(req, res);
// });

router.post('/allow',
    (req, res, next) => auth.checkToken(req, res, next),
    (req, res) => data.allowUser(req, res)
);

module.exports = router;
