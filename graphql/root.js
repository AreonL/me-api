const { GraphQLObjectType, GraphQLInt, GraphQLList, GraphQLString } = require("graphql");
// const AuthorType = require('./author.js')
const { BookType, AuthorType, DocType, UserType } = require('./doc.js')
// const Data = require('../data')
const data = require('../models/data')



const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Root query',
    fields: () => ({
        docs: {
            type: new GraphQLList(DocType),
            description: 'List of all docs',
            args: {
                email: { type: GraphQLString }
            },
            resolve: async function(parents, args) {
                // console.log(args);
                return await data.getAllGQL(args.email);
            }
        }
        // book: {
        //     type: BookType,
        //     description: 'A single book',
        //     args: {
        //         id: { type: GraphQLInt }
        //     },
        //     resolve: (parent, args) => Data.books.find(book => book.id === args.id)
        // },
        // books: {
        //     type: new GraphQLList(BookType),
        //     description: 'List of all books',
        //     resolve: () => Data.books
        // },
        // author: {
        //     type: AuthorType,
        //     description: 'A single author',
        //     args: {
        //         id: { type: GraphQLInt }
        //     },
        //     resolve: (parent, args) => Data.authors.find(author => author.id === args.id)
        // },
        // authors: {
        //     type: new GraphQLList(AuthorType),
        //     description: 'List of all authors',
        //     resolve: () => Data.authors
        // },
    })
})

module.exports = RootQueryType;