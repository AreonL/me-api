const database = require('../db/database.js');

const fs = require("fs");
const path = require("path");
const docs = JSON.parse(fs.readFileSync(
    path.resolve(__dirname, "setup.json"),
    "utf8"
));

resetCollection(docs)
    .catch(err => console.log(err));

async function resetCollection(doc) {
    const db = await database.getDb();

    await db.collection.deleteMany();
    await db.collection.insertMany(doc);

    await db.client.close();
}