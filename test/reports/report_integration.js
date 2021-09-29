process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const { describe, before } = require('mocha');
const server = require('../../app.js');

chai.should();

const database = require("../../db/database.js");
const collectionName = "docs";

chai.use(chaiHttp);

let _id = "";
let text = "";

describe('GET', () => {
    before(async () => {
        const db = await database.getDb();

        db.db.listCollections(
            { name: collectionName }
        )
            .next()
            .then(async function(info) {
                if (info) {
                    await db.collection.drop();
                }
            })
            .catch(function(err) {
                console.error(err);
            })
            .finally(async function() {
                await db.client.close();
            });
    });

    describe('GET /', () => {
        it("index should return 200 and some text", (done) => {
            chai.request(server)
                .get('/')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.text.should.be.an("string");
                    res.text.length.should.be.above(0);
                    // console.log(res.text);
                    // res.should

                    done();
                });
        });

        it("document should return 200 and nothing in data", (done) => {
            chai.request(server)
                .get('/document')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an("object");
                    Object.keys(res.body.data).length.should.be.equals(0);

                    done();
                });
        });
    });

    describe('POST /create', () => {
        it("should return 200 and no data", (done) => {
            chai.request(server)
                .get('/document')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an("object");
                    Object.keys(res.body.data).length.should.be.equals(0);

                    done();
                });
        });

        it("should return 201 creating data", (done) => {
            let data = {
                name: "TestName1",
                text: "TestText1"
            };

            chai.request(server)
                .post('/document/create')
                .send(data)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.data.should.be.an('object');
                    res.body.data.msg.should.be.an('string');
                    res.body.data.msg.length.should.be.above(0);

                    done();
                });
        });

        it("should return 200 and data equal too 1", (done) => {
            chai.request(server)
                .get('/document')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an("object");
                    Object.keys(res.body.data).length.should.be.equals(1);

                    done();
                });
        });

        it("should return error | missing name", (done) => {
            let data = {
                // name: "TestName1",
                text: "TestText1"
            };

            chai.request(server)
                .post('/document/create')
                .send(data)
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.be.an('object');
                    res.body.errors.status.should.be.equals(401);
                    res.body.errors.source.should.be.equals('/create');
                    res.body.errors.title.should.be.an('string');
                    res.body.errors.details.should.be.an('string');

                    done();
                });
        });

        it("should return error | missing text", (done) => {
            let data = {
                name: "TestName1",
                // text: "TestText1"
            };

            chai.request(server)
                .post('/document/create')
                .send(data)
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.be.an('object');
                    res.body.errors.status.should.be.equals(401);
                    res.body.errors.source.should.be.equals('/create');
                    res.body.errors.title.should.be.an('string');
                    res.body.errors.details.should.be.an('string');

                    done();
                });
        });

        it("should return 200 and data equal too 1", (done) => {
            chai.request(server)
                .get('/document')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an("object");
                    Object.keys(res.body.data).length.should.be.equals(1);

                    done();
                });
        });
    });

    describe('GET /document', () => {
        it("should return 200 and data equal too 1", (done) => {
            chai.request(server)
                .get('/document')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an("object");
                    Object.keys(res.body.data).length.should.be.equals(1);

                    done();
                });
        });

        it("should return 201 creating data", (done) => {
            let data = {
                name: "TestName1",
                text: "TestText1"
            };

            chai.request(server)
                .post('/document/create')
                .send(data)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.data.should.be.an('object');
                    res.body.data.msg.should.be.an('string');
                    res.body.data.msg.length.should.be.above(0);

                    done();
                });
        });

        it("should return 200 and data equal too 2", (done) => {
            chai.request(server)
                .get('/document')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an("object");
                    Object.keys(res.body.data).length.should.be.equals(2);

                    done();
                });
        });
    });

    describe('POST /update', () => {
        it("should return 200 and data equal too 2", (done) => {
            chai.request(server)
                .get('/document')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an("object");
                    Object.keys(res.body.data).length.should.be.equals(2);
                    _id = res.body.data[0]._id;
                    text = res.body.data[0].text;

                    done();
                });
        });

        it("should return 401 error | missing _id", (done) => {
            let data = {
                // _id: _id,
                text: "TestText2"
            };

            chai.request(server)
                .post('/document/update')
                .send(data)
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.be.an('object');
                    res.body.errors.status.should.be.equals(401);
                    res.body.errors.source.should.be.equals('/update');
                    res.body.errors.title.should.be.an('string');
                    res.body.errors.details.should.be.an('string');

                    done();
                });
        });

        it("should return 401 error | missing text", (done) => {
            let data = {
                _id: _id,
                // text: "TestText2"
            };

            chai.request(server)
                .post('/document/update')
                .send(data)
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.be.an('object');
                    res.body.errors.status.should.be.equals(401);
                    res.body.errors.source.should.be.equals('/update');
                    res.body.errors.title.should.be.an('string');
                    res.body.errors.details.should.be.an('string');

                    done();
                });
        });

        it("should return 201 updating data", (done) => {
            let data = {
                _id: _id,
                text: "TestText2"
            };

            chai.request(server)
                .post('/document/update')
                .send(data)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.an('object');
                    res.body.data.msg.should.be.an('string');

                    done();
                });
        });

        it("should return 200 and compare new vs old data", (done) => {
            chai.request(server)
                .get('/document')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an("object");
                    Object.keys(res.body.data).length.should.be.equals(2);
                    res.body.data[0]._id.should.be.equals(_id);
                    res.body.data[0].text.should.not.be.equals(text);

                    done();
                });
        });
    });
});
