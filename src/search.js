const database = require('../db/database.js');

// Find documents for this living in...
// const criteria1 = {
//     bor: "Mumindalen"
// };
// const projection1 = {
//     namn: 1,
//     bor: 1,
//     _id: 0
// };
// const limit1 = 3;

// Find documents where namn starts with string
// const criteria2 = {
//     namn: /^Sn/
// };
// const projection2 = {
//     _id: 1,
//     namn: 1
// };
// const limit2 = 3;

const criteria2 = {};

const projection2 = {
    name: 1
};
const limit2 = 0;



// Do it within an Immediately Invoked Async Arrow Function.
// This is to enable usage of await within the function scope.
(async () => {
    // Find using .then()
    // findInCollection(criteria1, projection1, limit1)
    //     .then(res => console.log(res))
    //     .catch(err => console.log(err));

    // Find using await
    try {
        let res = await findInCollection(criteria2, projection2, limit2);

        console.log(res);
    } catch (err) {
        console.log(err);
    }
})();

async function findInCollection(criteria={}, projection={}, limit) {
    const db = await database.getDb();
    const resultSet = await db.collection.find(criteria, projection).limit(limit).toArray();

    await db.client.close();

    return resultSet;
}
