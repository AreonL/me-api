var express = require('express');
var router = express.Router();
const data = require('../models/data');

router.get('/', async function(req, res) {
    await data.getAllData(req, res);
});

router.post('/create', (req, res) => {
    await data.createNewData(req, res);
});

router.post('/update', (req, res) => {
    await data.updateData(req, res);
});

module.exports = router;
