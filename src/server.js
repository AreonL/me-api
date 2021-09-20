const database = require('../db/database.js');
const port = process.env.PORT || 4000;

const express = require("express");
const app = express();

// Just for testing the sever
app.get("/", (req, res) => {
    res.send("Go to /document to find api");
});

// Return a JSON object with list of all documents within the collection.
app.get("/document", async (request, response) => {
    try {
        let res = await findInCollection();

        console.log(res);
        response.json(res);
    } catch (err) {
        console.log(err);
        response.json(err);
    }
});

// Startup server and liten on port
app.listen(port, () => {
    console.log(`Server is listening on ${port}`);
});

async function findInCollection(criteria={}) {
    const db = await database.getDb();
    const resultSet = await db.collection.find(criteria).toArray();

    await db.client.close();

    return resultSet;
}
