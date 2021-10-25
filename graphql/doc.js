const {
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLInt,
    GraphQLString,
    GraphQLList
} = require("graphql");
// const AuthorType = require("./author");
const { delayed } = require('../data');
// const data = require("../models/data");

const DelayType = new GraphQLObjectType({
    name: 'delay',
    description: 'This respresents a API delay',
    fields: () => ({
        ActivityId: { type: GraphQLNonNull(GraphQLString) },
        AdvertisedTimeAtLocation: { type: GraphQLNonNull(GraphQLString) },
        EstimatedTimeAtLocation: { type: GraphQLNonNull(GraphQLString) },
        FromLocation: { type: new GraphQLList(LocationType) },
        ToLocation: { type: new GraphQLList(LocationType) },
        Time: {
            type: new GraphQLList(TimeType),
            resolve: (delay) => {
                return delayed.filter(delays => delays.ActivityId === delay.ActivityId);
            }
        }
    })
});

const LocationType = new GraphQLObjectType({
    name: 'LocationName',
    description: 'This respresents a LocationName',
    fields: () => ({
        LocationName: { type: GraphQLNonNull(GraphQLString) },
    })
});

// const LocationsType = new GraphQLObjectType({
//     name: 'LocationsName',
//     description: 'This respresents a LocationName',
//     LocationName: { type: GraphQLNonNull(GraphQLString) },
// });

const TimeType = new GraphQLObjectType({
    name: 'time',
    description: 'This respresents a name',
    fields: () => ({
        AdvertisedTimeAtLocation: { type: GraphQLNonNull(GraphQLString) },
        ToLocation: { type: new GraphQLList(LocationType) }
    })
});

// const AuthorType = new GraphQLObjectType({
//     name: 'Author',
//     description: 'This respresents a author',
//     fields: () => ({
//         id: { type: GraphQLNonNull(GraphQLInt) },
//         name: { type: GraphQLNonNull(GraphQLString) },
//         books: {
//             type: new GraphQLList(BookType),
//             resolve: (author) => {
//                 return Data.books.filter(book => book.authorId === author.id);
//             }
//         }
//     })
// });

// const UserType = new GraphQLObjectType({
//     name: 'User',
//     description: 'This respresents a user',
//     fields: () => ({
//         _id: { type: GraphQLNonNull(GraphQLString) },
//         email: { type: GraphQLNonNull(GraphQLString) },
//         password: { type: GraphQLNonNull(GraphQLString) },
//         docs: {
//             type: new GraphQLList(DocType),
//             // resolve: (doc) => {
//             //     Data.users.map(e => e.docs.filter((el, i) => console.log(el._id, doc.docs, i)))
//             //     return Data.users.map(e => e.docs.filter((el, i) => el._id === doc.docs[i]._id))

//             //     // console.log(va);
//             //     return va
//             // }
//         }
//     })
// });
// e.docs.filter((el, i) => el._id === doc.docs[i]._id)
// doc.docs[i]._id
// otherDoc = otherDoc.map(e => e.docs.filter(e => e.allowed_users.includes(req.email))[0]);

const DocType = new GraphQLObjectType({
    name: 'Doc',
    description: 'This respresents a document',
    fields: () => ({
        _id: { type: GraphQLNonNull(GraphQLString) },
        name: { type: GraphQLNonNull(GraphQLString) },
        text: { type: GraphQLNonNull(GraphQLString) },
        comments: { type: GraphQLList(CommentsType) }
    })
});

const CommentsType = new GraphQLObjectType({
    name: 'comments',
    description: 'This respresents a comment',
    fields: () => ({
        _id: { type: GraphQLNonNull(GraphQLString) },
        text: { type: new GraphQLNonNull(GraphQLString) }
    })
});

// const AllowedType = new GraphQLObjectType({
//     name: 'Allowed',
//     description: 'This respresents a allowed user',
//     fields: () => ({
//         type: GraphQLString
//     })
// })

module.exports = {
    DelayType,
    // AuthorType,
    DocType,
    // UserType
};
