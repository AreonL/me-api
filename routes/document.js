var express = require('express');
var router = express.Router();
const data = require('../models/data');

router.get('/', async function(req, res) {
    return data.getAllData(req, res);
});

router.post('/create', (req, res) => {
    return data.createNewData(req, res);
});

router.post('/update', (req, res) => {
    return data.updateData(req, res);
});

module.exports = router;
