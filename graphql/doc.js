const { GraphQLObjectType, GraphQLNonNull, GraphQLInt, GraphQLString, GraphQLList } = require("graphql");
// const AuthorType = require("./author");
const Data = require('../data');
// const data = require("../models/data");

const BookType = new GraphQLObjectType({
    name: 'Book',
    description: 'This respresents a book',
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLInt) },
        name: { type: GraphQLNonNull(GraphQLString) },
        authorId: { type: GraphQLNonNull(GraphQLInt) },
        author: {
            type: AuthorType,
            resolve: (book) => {
                return Data.authors.find(author => author.id === book.authorId)
            }
        }
    })
})

const AuthorType = new GraphQLObjectType({
    name: 'Author',
    description: 'This respresents a author',
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLInt) },
        name: { type: GraphQLNonNull(GraphQLString) },
        books: {
            type: new GraphQLList(BookType),
            resolve: (author) => {
                return Data.books.filter(book => book.authorId === author.id)
            }
        }
    })
})

const UserType = new GraphQLObjectType({
    name: 'User',
    description: 'This respresents a user',
    fields: () => ({
        _id: { type: GraphQLNonNull(GraphQLString) },
        email: { type: GraphQLNonNull(GraphQLString) },
        password: { type: GraphQLNonNull(GraphQLString) },
        docs: {
            type: new GraphQLList(DocType),
            // resolve: (doc) => {
            //     Data.users.map(e => e.docs.filter((el, i) => console.log(el._id, doc.docs, i)))
            //     return Data.users.map(e => e.docs.filter((el, i) => el._id === doc.docs[i]._id))

            //     // console.log(va);
            //     return va
            // }
        }
    })
})
// e.docs.filter((el, i) => el._id === doc.docs[i]._id)
// doc.docs[i]._id
// otherDoc = otherDoc.map(e => e.docs.filter(e => e.allowed_users.includes(req.email))[0]);

const DocType = new GraphQLObjectType({
    name: 'Doc',
    description: 'This respresents a document',
    fields: () => ({
        _id: { type: GraphQLNonNull(GraphQLString) },
        name: { type: GraphQLNonNull(GraphQLString) },
        text: { type: GraphQLNonNull(GraphQLString) }
    })
})

// const AllowedType = new GraphQLObjectType({
//     name: 'Allowed',
//     description: 'This respresents a allowed user',
//     fields: () => ({
//         type: GraphQLString
//     })
// })

module.exports = { BookType, AuthorType, DocType, UserType };