const mongo = require("mongodb").MongoClient;
const config = require('../config.json');
const collectionName = "crowd";

// mongodb+srv://texteditor:<password>@jsramverk.lvvba.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
let dsn = `mongodb+srv://${config.username}:${config.password}@jsramverk.lvvba.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;


const database = {
    getDb: async function getDb() {
        // let dsn = `mongodb://localhost:27017/mumin`;

        if (process.env.NODE_ENV === 'test') {
            dsn = "mongodb://localhost:27017/test";
        }

        const client = await mongo.connect(dsn, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        const db = await client.db();
        const collection = await db.collection(collectionName);

        return {
            db: db,
            collection: collection,
            client: client,
        };
    }
}

module.exports = database;