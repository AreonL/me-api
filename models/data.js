const database = require('../db/database');
const ObjectId = require('mongodb').ObjectId;

const data = {
    getAllData: async function (req, res) {
        const db = await database.getDb();

        const data = {
            data: await db.collection.find({}).toArray()
        };

        await db.client.close();

        return res.status(200).json(data);
    },
    updateData: async function (req, res) {
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

        updateOneInCollection(filter, updateDocument);

        async function updateOneInCollection(filter, updateDocument) {
            const db = await database.getDb();

            await db.collection.updateOne(filter, {$set: updateDocument});

            await db.client.close();

            return res.status(201).json({
                data: {
                    msg: "Got a POST request"
                }
            });
        }
    },
    createNewData: async function (req, res) {
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
    }
};

module.exports = data;
