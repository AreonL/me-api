var express = require('express');
var router = express.Router();

const data = require('../models/data');
const auth = require('../models/auth');
const pdf = require('../models/pdf');

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

router.post('/allow',
    (req, res, next) => auth.checkToken(req, res, next),
    (req, res) => data.allowUser(req, res)
);

router.post('/comment',
    (req, res, next) => auth.checkToken(req, res, next),
    (req, res) => data.addComment(req, res)
);

router.delete('/comment',
    (req, res, next) => auth.checkToken(req, res, next),
    (req, res) => data.deleteComment(req, res)
);

router.post('/pdf',
    (req, res, next) => auth.checkToken(req, res, next),
    (req, res) => pdf.createPDF(req, res),
);

module.exports = router;
