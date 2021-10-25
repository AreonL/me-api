const database = require('../db/database');
const ObjectId = require('mongodb').ObjectId;


async function sortDataOneUser(argEmail) {
    // console.log(argEmail, "in database");
    const db = await database.getDb();

    let selfDoc = await db.collection.find({email: argEmail}).toArray();

    selfDoc = selfDoc[0]["code"];

    await db.client.close();

    return selfDoc;
}

async function createOne(email, name, code) {
    const db = await database.getDb();

    const id = new ObjectId();

    await db.collection.updateOne(
        { email: email },
        { $push: {
            code: {
                _id: id,
                name: name,
                code: code
            }
        }}
    );

    await db.client.close();

    return id;
}

async function updateOne(id, code) {
    const db = await database.getDb();

    const filter = { "code._id": ObjectId(id) };

    await db.collection.updateOne(filter,
        { $set: {
            "code.$.code": code
        }}
    );

    await db.client.close();
}

const code = {
    getAllData: async function (req, res) {
        let result = await sortDataOneUser(req.email);

        // console.log(result);

        const data = {
            data: result
        };

        return res.status(200).json(data);
    },
    createCode: async function (req, res) {
        // console.log("Creating data");
        const email = req.email;
        const name = req.body.name;
        const code = req.body.code;

        if (!name || !code) {
            return res.status(401).json({
                errors: {
                    status: 401,
                    source: "/code",
                    title: "Code or name not included",
                    details: "Missing code or name in POST request"
                }
            });
        }

        let id = await createOne(email, name, code);

        const data = {
            data: {
                id: id,
                message: "Code created"
            }
        };

        return res.status(201).json(data);
    },
    updateCode: async function (req, res) {
        // console.log("Updating data");
        const id = req.body.id;
        const code = req.body.code;

        if (!id || !code) {
            return res.status(401).json({
                errors: {
                    status: 401,
                    source: "/code",
                    title: "Code or id not included",
                    details: "Missing code or id in POST request"
                }
            });
        }

        await updateOne(id, code);

        const data = {
            data: {
                message: "Code updated"
            }
        }

        return res.status(201).json(data);
    }
};

module.exports = code;
