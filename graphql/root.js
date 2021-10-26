const { GraphQLObjectType, GraphQLList, GraphQLString } = require("graphql");
const { DocType, DelayType } = require('./doc.js');
const Data = require('../data');
const data = require('../models/data');

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
                return await data.getAllGQL(args.email);
            }
        },
        delays: {
            type: new GraphQLList(DelayType),
            description: 'List of all delayed',
            resolve: () => Data.delayed
        }
    })
});

module.exports = RootQueryType;
