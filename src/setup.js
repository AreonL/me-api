const database = require('../db/database.js');

const fs = require("fs");
const path = require("path");
const ObjectId = require('mongodb').ObjectId;
const docs = JSON.parse(fs.readFileSync(
    path.resolve(__dirname, "setup3.json"),
    "utf8"
));

docs[0].docs[0]._id = new ObjectId();

resetCollection(docs)
    .catch(err => console.log(err));

async function resetCollection(doc) {
    const db = await database.getDb();

    await db.collection.deleteMany();
    await db.collection.insertMany(doc);

    console.log(doc);

    await db.client.close();
}
