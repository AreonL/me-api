var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    const data = "View data with /document or /create to post";

    res.send(data);
});

module.exports = router;