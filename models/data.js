const database = require('../db/database');
const ObjectId = require('mongodb').ObjectId;

async function sortDataOneUser(argEmail) {
    if (!argEmail) {
        return JSON.stringify({
            errors: {
                status: 401,
                source: "/graphql",
                title: "Email not included",
                details: "Email missing from body"
            }
        });
    }

    const db = await database.getDb();

    let selfDoc = await db.collection.find({email: argEmail}).toArray();
    let otherDoc = await db.collection.find({ "docs.allowed_users": argEmail }).toArray();

    selfDoc = selfDoc[0]["docs"];
    otherDoc = otherDoc.map(e => e.docs.filter(e => e.allowed_users.includes(argEmail))[0]);

    const theDocs = selfDoc.concat(otherDoc);

    await db.client.close();

    return theDocs;
}



const data = {
    getAllGQL: async function (argEmail) {
        let result = await sortDataOneUser(argEmail);

        return result;
    },
    getAllData: async function (req, res) {
        let result = await sortDataOneUser(req.email);

        const data = {
            data: result
        };

        return res.status(200).json(data);
    },
    updateData: async function (req, res) {
        const docs = req.body;


        if (!docs.text || !docs._id) {
            return res.status(401).json({
                errors: {
                    status: 401,
                    source: "/update",
                    title: "Text or id not included",
                    details: "Text or id missing from body"
                }
            });
        }

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
                    message: "Document updated"
                }
            });
        }
    },
    createNewData: async function (req, res) {
        let docs = {
            name: req.body.name,
            text: req.body.text,
            email: req.email
        };

        if (!docs.name || !docs.text || !req.body.comments) {
            return res.status(401).json({
                errors: {
                    status: 401,
                    source: "/create",
                    title: "Name, text or comment not included",
                    details: "Missing name, text or comment in POST request"
                }
            });
        }

        let comments = req.body.comments;

        if (comments.length > 0) {
            comments.map(e => e["_id"] = ObjectId(e._id));
        }

        docs["comments"] = comments;

        addToCollection(docs);

        async function addToCollection(element) {
            const db = await database.getDb();
            const id = new ObjectId();

            await db.collection.updateOne(
                { email: element.email },
                { $push: {
                    docs: {
                        _id: id,
                        name: element.name,
                        text: element.text,
                        allowed_users: [],
                        comments: element.comments
                    }
                }}
            );

            await db.client.close();

            return res.status(201).json({
                data: {
                    id: id,
                    message: "Document created"
                }
            });
        }
    },
    allowUser: async function (req, res) {
        const user = req.body;

        if (!user.addEmail || !user.docId) {
            return res.status(401).json({
                errors: {
                    status: 401,
                    source: "/allow",
                    title: "Allow user or id not included",
                    details: "Missing email for user or id in POST request"
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


            let selfDoc = await db.collection.findOne({ "docs._id": ObjectId(data["_id"])});
            let activeDoc = await selfDoc["docs"]
                .filter(e => String(e._id) == ObjectId(data["_id"]))
                .filter(e => e.allowed_users.includes(data["addEmail"]));


            if (activeDoc.length) {
                await db.client.close();
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

            await db.client.close();

            return res.status(201).json({
                data: {
                    message: "Allowed user to document"
                }
            });
        }
    },
    addComment: async function (req, res) {
        const user = req.body;

        if (!user.comment || !user.docId || !Number.isInteger(user.position)) {
            return res.status(401).json({
                errors: {
                    status: 401,
                    source: "/comment",
                    title: "Comment, id or position not included",
                    details: "Missing comment, id or position in POST request"
                }
            });
        }

        let sendData = {
            comment: user.comment,
            _id: user.docId,
            position: user.position
        };

        addCommentToDB(sendData);


        async function addCommentToDB(data) {
            const db = await database.getDb();

            const commentId = new ObjectId();

            ////////
            await db.collection.updateOne(
                { "docs._id": ObjectId(data["_id"]) },
                { $push: {
                    "docs.$.comments": {
                        $each: [{
                            text: data.comment,
                            _id: commentId,
                        }],
                        $position: data.position
                    }
                }}
            );
            /////////

            await db.client.close();

            return res.status(201).json({
                data: {
                    message: "Comment created",
                    id: commentId
                }
            });
        }
    },
    deleteComment: async function (req, res) {
        const user = req.body;

        if (!user._id || !user.commentID) {
            return res.status(401).json({
                errors: {
                    status: 401,
                    source: "/comment",
                    title: "Id not included",
                    details: "Missing id in POST request"
                }
            });
        }

        let sendData = {
            _id: user._id,
            commentID: user.commentID
        };

        deleteCommentFromDB(sendData);


        async function deleteCommentFromDB(data) {
            const db = await database.getDb();

            await db.collection.updateOne(
                { "docs._id": ObjectId(data["_id"]) },
                { $pull:
                    { "docs.$.comments":
                        { "_id": ObjectId(data["commentID"]) }
                    }
                }
            );

            await db.client.close();

            return res.status(201).json({
                data: {
                    message: "Comment deleted"
                }
            });
        }
    }
};

module.exports = data;
