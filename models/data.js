const database = require('../db/database');
const ObjectId = require('mongodb').ObjectId;

const data = {
    getAllData: async function (req, res) {
        const db = await database.getDb();

        // console.log(req.email, "getAllData");

        // let selfDoc = await db.collection.find({email: req.email}).toArray()

        let selfDoc = await db.collection.find({email: req.email}).toArray();
        let otherDoc = await db.collection.find({ "docs.allowed_users": req.email }).toArray();

        // console.log(selfDoc[0]["docs"], otherDoc);
        selfDoc = selfDoc[0]["docs"];
        otherDoc = otherDoc.map(e => e.docs.filter(e => e.allowed_users.includes(req.email))[0]);
        // console.log(selfDoc, otherDoc);
        const theDocs = selfDoc.concat(otherDoc);
        // console.log(theDocs);
        const data = {
            data: theDocs
        };

        // console.log(data, "Hejsan");

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

        // console.log("This is the text to save", docs.text, docs._id);
        const filter = { "docs._id": ObjectId(docs["_id"]) };
        const updateDocument = {
            text: docs.text
        };

        updateOneInCollection(filter, updateDocument);

        async function updateOneInCollection(filter, updateDocument) {
            const db = await database.getDb();

            await db.collection.updateOne(filter,
                { $set: {
                    "docs.$.text": updateDocument.text
                }}
            );

            await db.client.close();

            return res.status(201).json({
                data: {
                    msg: "Got a POST request"
                }
            });
        }
    },
    createNewData: async function (req, res) {
        // console.log(req.email);
        const docs = {
            name: req.body.name,
            text: req.body.text,
            email: req.email
        };

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

        // console.log(docs, "Här är docs data");

        addToCollection(docs);

        async function addToCollection(element) {
            const db = await database.getDb();
            // console.log("Hejsan inne i addtocollection");
            const id = new ObjectId();

            await db.collection.updateOne(
                { email: element.email },
                { $push: {
                    docs: {
                        _id: id,
                        name: element.name,
                        text: element.text,
                        allowed_users: []
                    }
                }}
            );

            // await db.collection.insertOne(docs);

            await db.client.close();

            return res.status(201).json({
                data: {
                    id: id,
                    msg: "Got a POST request"
                }
            });
        }
    },
    allowUser: async function (req, res) {
        console.log("ALLOWUSER NOW");
        // const email = req.email
        const user = req.body;

        console.log(user, "Here for AllowUser");

        if (!user.addEmail || !user.docId) {
            return res.status(401).json({
                errors: {
                    status: 401,
                    source: "/allow",
                    title: "Allow user or user not included",
                    details: "Missing email for user or adding user in POST request"
                }
            });
        }

        let sendData = {
            addEmail: user.addEmail,
            _id: user.docId
        };

        addToAllowed(sendData);


        async function addToAllowed(data) {
            const db = await database.getDb();

            console.log(ObjectId(data["_id"]));

            let selfDoc = await db.collection.findOne({ "docs._id": ObjectId(data["_id"])});
            let activeDoc = await selfDoc["docs"]
                .filter(e => String(e._id) == ObjectId(data["_id"]))
                .filter(e => e.allowed_users.includes(data["addEmail"]));

            if (activeDoc.length) {
                console.log(activeDoc[0]["allowed_users"], "Already in here");
                return res.status(401).json({
                    errors: {
                        status: 401,
                        source: "/allow",
                        title: "Allowed user already",
                        details: "User already allowed to edit"
                    }
                });
            }

            ////////
            await db.collection.updateOne(
                { "docs._id": ObjectId(data["_id"]) },
                { $push: {
                    "docs.$.allowed_users": data.addEmail
                }}
            );
            /////////

            // console.log(selfDoc, "This is now array");

            // await db.collection.findOne({email: email})
            //     .updateData({ docs: { allowed_users: user.addEmail } });

            await db.client.close();
        }
    }
};

module.exports = data;
