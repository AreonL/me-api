var express = require('express');
var router = express.Router();
const data = require('../models/data');

router.get('/', async function(req, res) {
    data.getAllData(req, res);
});

router.post('/create', (req, res) => {
    data.createNewData(req, res);
});

router.post('/update', (req, res) => {
    data.updateData(req, res);
});

module.exports = router;
