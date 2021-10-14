const bodyParser = require('body-parser');
const cors = require('cors');
// const morgan = require('morgan');
const express = require('express');


const visual = true;
const { graphqlHTTP } = require('express-graphql');
const {
    GraphQLSchema, GraphQLObjectType, GraphQLString
} = require("graphql");

const RootQueryType = require("./graphql/root.js");

// const { BookType, AuthorType } = require("./graphql/doc")


const ObjectId = require('mongodb').ObjectId;
const database = require('./db/database');

const app = express();


const server = require("http").createServer(app);


// origin: "http://localhost:3000",
const io = require("socket.io")(server, {
    cors: {
        origin: "https://www.student.bth.se",
        methods: ["GET", "POST"]
    }
});

const port = process.env.PORT || 4000;

const index = require('./routes/index');
const document = require('./routes/document');
const auth = require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.use(cors());
// app.options('*', cors());

// app.disable('x-powered-by');

// const schema = new GraphQLSchema({
//     query: new GraphQLObjectType({
//         name: 'HelloWorld',
//         fields: () => ({
//             message: {
//                 type: GraphQLString,
//                 resolve: () => 'Hello World'
//             }
//         })
//     })
// })

const schema = new GraphQLSchema({
    query: RootQueryType
})

app.use('/', index);
app.use('/document', document);
app.use('/auth', auth);
app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: visual
}));

io.sockets.on('connection', (socket) => {
    console.log("a user connected");
    socket.on('create', function(room) {
        socket.join(room);
        console.log("created room", room);
    });

    let throttleTimer;

    socket.on("message", (data=false) => {
        if (!data._id) {return;}
        socket.to(data._id).emit("message", data);
    });

    socket.on("message", (data=false) => {
        if (!data._id) {return;}
        clearTimeout(throttleTimer);
        throttleTimer = setTimeout(async function() {
            const filter = { "docs._id": ObjectId(data["_id"]) };
            const updateDocument = {
                text: data.html
            };

            await addToCollection(filter, updateDocument);

            async function addToCollection(filter, updateDocument) {
                const db = await database.getDb();

                await db.collection.updateOne(filter,
                    { $set: {
                        "docs.$.text": updateDocument.text
                    }}
                );

                await db.client.close();
            }
            console.log("Sending", data.html);
            io.emit("new_text", data.html);
        }, 2000);
    });

    socket.on('leave', function(room) {
        socket.leave(room);
        console.log("left room", room);
    });

    // })
    // .then(res => res.json())
    // let res;
    // await dataHandler.updateData({body: {_id: data._id, text: data.html}}, res)
    // .then(res => console.log(res, "Here fin"))
    // router.post('/document/update', (req, res) => {
    //     console.log("here");
    // });
    // console.log(res);
    // app.post('/document/update', { headers: {'content-type' : 'application/json'}, body: data})
    // socket.on("doc", function (data) {
    //     console.log("Connected2");
    //     socket.to(data["_id"]).emit("doc", data);
    //     console.log(data);
    //     // app.post('/update', JSON.stringify(data))
    // });
    // socket.on("message", (message) => {
    //     console.log(message);
    //     // let data = { id: _id}
    //     // app.post("/update", )
    //     io.emit('message', `${socket.id} said ${message}`);
    // })
});

server.listen(port, () => console.log(`Me-api listening on port ${port}!`));

module.exports = server;
