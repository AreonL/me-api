const database = require('../db/database.js');
const ObjectId = require('mongodb').ObjectId;
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

    console.log(docs, "updating here!");

    const filter = { _id: ObjectId(docs["_id"]) };
    const updateDocument = {
        text: docs.text
    }


    console.log(filter, updateDocument, "Updating this!");
    addToCollection(filter, updateDocument)
        .catch(err => console.log(err));

    async function addToCollection(filter, updateDocument) {
        const db = await database.getDb();

        await db.collection.updateOne(filter, {$set: updateDocument});

        await db.client.close();

        // res.json(result);
    }
});

module.exports = router;