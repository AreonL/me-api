const database = require('../db/database.js');

const fs = require("fs");
const path = require("path");
const docs = JSON.parse(fs.readFileSync(
    path.resolve(__dirname, "setup.json"),
    "utf8"
));

addToCollection(docs)
    .catch(err => console.log(err));

async function addToCollection(doc) {
    const db = await database.getDb();

    await db.collection.insertOne(doc);

    await db.client.close();
}
