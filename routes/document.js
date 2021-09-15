var express = require('express');
var router = express.Router();
const database = require('../db/database');

router.get('/', async function(req, res, next) {
    const db = await database.getDb();

    const data = {
        data: await db.collection.find({}).toArray()
    };
    await db.client.close();

    res.json(data);
});

module.exports = router;