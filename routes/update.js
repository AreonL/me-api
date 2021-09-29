const database = require('../db/database.js');
const ObjectId = require('mongodb').ObjectId;
var express = require('express');
var router = express.Router();

router.post('/', (req, res) => {
    console.log(req.body, "here");
    const docs = req.body;
    if (!docs.text || !docs._id) {
        return res.status(401).json({
            errors: {
                status: 401,
                source: "/update",
                title: "Text or id not sent",
                details: "Text or id missing from body"
            }
        });
    }

    const filter = { _id: ObjectId(docs["_id"]) };
    const updateDocument = {
        text: docs.text
    };

    // addToCollection(filter, updateDocument);
    return res.status(201).json({
        data: {
            msg: "Got a POST request"
        }
    });

    async function addToCollection(filter, updateDocument) {
        const db = await database.getDb();

        await db.collection.updateOne(filter, {$set: updateDocument});

        await db.client.close();

        return res.status(201).json({
            data: {
                msg: "Got a POST request"
            }
        });
    }
});

module.exports = router;
