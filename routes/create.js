const database = require('../db/database.js');
var express = require('express');
var router = express.Router();

router.post('/', (req, res) => {
    // Skickar både namn och text i samma
    // { name: "Editor", text: "Hello" }
    res.json({
        data: {
            msg: "Got a POST request"
        }
    });

    ////// FIX FETCH FOR FRONT END AND THEN IMPLIMENT IT HERE WITH BODY.NAME BODY.TEXT
    const docs = req.body;

    console.log(docs, "sending this!");
    addToCollection(docs)
        .catch(err => console.log(err));

    async function addToCollection(docs) {
        const db = await database.getDb();

        await db.collection.insertOne(docs);

        await db.client.close();
    }
});

module.exports = router;