const database = require('../db/database.js');
var express = require('express');
var router = express.Router();

router.post('/', (req, res) => {
    // Skickar både namn och text i samma
    // { name: "Editor", text: "Hello" }
    const docs = req.body;

    if (!docs.name || !docs.text) {
        return res.status(401).json({
            errors: {
                status: 401,
                source: "/create",
                title: "Name and/or text not included",
                details: "Missing name and/or text in POST request"
            }
        });
    }

    addToCollection(docs);

    async function addToCollection(docs) {
        const db = await database.getDb();

        await db.collection.insertOne(docs);

        await db.client.close();

        return res.status(201).json({
            data: {
                msg: "Got a POST request"
            }
        });
    }
});

module.exports = router;
