const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const express = require('express');

const app = express();
const port = process.env.PORT || 4000;

const index = require('./routes/index');
const document = require('./routes/document');
const create = require('./routes/create');
const update = require('./routes/update');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors());

app.use('/', index);
app.use('/document', document)
app.use('/create', create)
app.use('/update', update)

// app.use(express.json());

// app.use(cors());

// if (process.env.NODE_ENV !== 'test') {
//     app.use(morgan('combined'));
// }

// app.use((req, res, next) => {
//     var err = new Error("Not Found");
//     err.status = 404;
//     next(err);
// });

// app.use((err, req, res, next) => {
//     if (res.headersSent) {
//         return next(err);
//     }

//     res.status(err.status || 500).json({
//         "errors": [
//             {
//                 "status": err.status,
//                 "title":  err.message,
//                 "detail": err.message
//             }
//         ]
//     });
// });

// app.use((req, res, next) => {
//     console.log(req.method);
//     console.log(req.path);
//     next();
// });

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// app.get('/', (req, res) => {
//     const data = {
//         data: {
//             msg: 'Hello World 4'
//         }
//     };

//     res.json(data);
// });

// app.get('/hello/:msg', (req, res) => {
//     const data = {
//         data: {
//             msg: req.params.msg
//         }
//     }

//     res.json(data);
// });

app.listen(port, () => console.log(`Example API listening on port ${port}!`));