const bodyParser = require('body-parser');
const cors = require('cors');
// const morgan = require('morgan');
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
app.use('/document', document);
app.use('/create', create);
app.use('/update', update);

const server = app.listen(port, () => console.log(`Me-api listening on port ${port}!`));

module.exports = server;
