const {
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLString,
    GraphQLList
} = require("graphql");
const { delayed } = require('../data');

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

module.exports = {
    DelayType,
    DocType,
};
