var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    const data = "View data with /document or /document/create to post";

    res.send(data);
});

module.exports = router;
