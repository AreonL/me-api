const authors = [
    { id: 1, name: 'J. K. Rowling' },
    { id: 2, name: 'J. R. R. Tolkien' },
    { id: 3, name: 'Brent Weeks' }
];

const books = [
    { id: 1, name: 'Harry Potter and the Chamber of Secrets', authorId: 1 },
    { id: 2, name: 'Harry Potter and the Prisoner of Azkaban', authorId: 1 },
    { id: 3, name: 'Harry Potter and the Goblet of Fire', authorId: 1 },
    { id: 4, name: 'The Fellowship of the Ring', authorId: 2 },
    { id: 5, name: 'The Two Towers', authorId: 2 },
    { id: 6, name: 'The Return of the King', authorId: 2 },
    { id: 7, name: 'The Way of Shadows', authorId: 3 },
    { id: 8, name: 'Beyond the Shadows', authorId: 3 }
];

const users = [
    {
        _id: "1",
        email: 't',
        password: '$2a$10$.mnlop/M/Fn.',
        docs: [
            {
                _id: "1",
                name: 'TestName1',
                text: 'TestText2',
                allowed_users: []
            },
            {
                _id: "2",
                name: 'TestName1',
                text: 'TestText1',
                allowed_users: ['test']
            },
            {
                _id: "4",
                name: 'TestName4',
                text: 'TestText4',
                allowed_users: ['test']
            }
        ]
    },
    {
        _id: "2",
        email: 'test',
        password: '$2a$10$.abc/M/Fn.',
        docs: [
            {
                _id: "3",
                name: 'TestName2',
                text: 'TestText3',
                allowed_users: ['t']
            }
        ]
    }
];

module.exports = { authors, books, users };
