process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const { describe, before, after } = require('mocha');
const server = require('../app.js');
// const fs = require("fs");
// const path = require("path");
// // const docs = JSON.parse(fs.readFileSync(
// //     path.resolve(__dirname, "../src/setup3.json"),
// //     "utf8"
// // ));

chai.should();

const database = require("../db/database.js");
const collectionName = "docs";

chai.use(chaiHttp);

let id = '';
let name = 'TestName';
let text = '<p>TestText</p>';
// let allowed_users = [];
let allowedUsers = [];
let token = '';
let comments = [];

let addEmail = 'test2@test.test';
const email = 'test@test.test';
const password = 'test';

//Comments
let comment = "TestComment";
let position = 0;
let commentID = '';

// Code route
let codeCode = 'console.log("Hello World!");';
let codeName = 'Hello World!';
let codeId = '';


describe('Routes', () => {
    before(async function() {
        const db = await database.getDb();

        await db.db.listCollections(
            { name: collectionName }
        )
            .next()
            .then(async function(info) {
                if (info) {
                    console.log("dropped db");
                    await db.collection.drop();
                }
                // await db.collection.insertMany(docs);
            })
            .catch(function(err) {
                console.error(err);
            })
            .finally(async function() {
                await db.client.close();
            });
    });
    after(async function() {
        await server.close();
    });
    // it("return token", (done) => {
    //     chai.request(server)
    //         .post('/auth/login')
    //         .send({email: 't', password: 't'})
    //         .end((err, res) => {
    //             // console.log(res.body.data.token);
    //             token = res.body.data.token;
    //             res.should.have.status(200);
    //             // res.text.should.be.an("string");
    //             // res.body.data.token.length.should.be.above(0);
    //             // console.log(res.text);
    //             // res.should

    //             done();
    //         });
    // });
    // beforeEach(function(done) {
    //     done();
    // });

    // beforeEach((done) => {
    //     chai.request(server)
    //         .post('/auth/login')
    //         .send({email: 't', password: 't'})
    //         .end((err, res) => {
    //             console.log(res.body.data.token);
    //             token = res.body.data.token;
    //             // res.should.have.status(200);
    //             // res.text.should.be.an("string");
    //             res.body.data.token.length.should.be.above(0);
    //             // console.log(res.text);
    //             // res.should

    //             done();
    //         });
    // })

    describe('Index /', () => {
        it("index should return 200 and some text", (done) => {
            chai.request(server)
                .get('/')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.text.should.be.an("string");
                    res.text.length.should.be.above(0);

                    done();
                });
        });
    });
    describe('Auth /', () => {
        describe('Register', () => {
            it("should return 401 not registered", (done) => {
                chai.request(server)
                    .post('/auth/login')
                    .send({email: email, password: password})
                    .end((err, res) => {
                        res.should.have.status(401);
                        res.text.should.be.an("string");
                        res.text.length.should.be.above(0);
                        let error = JSON.parse(res.text);

                        error.should.be.an('object');
                        Object.keys(error)[0].should.be.equal("errors");
                        Object.keys(error.errors).length.should.be.equal(4);
                        error = error.errors.title;
                        error.should.be.include('Email');
                        error.should.be.include('password');

                        done();
                    });
            });
            it("should return 401 | missing email", (done) => {
                chai.request(server)
                    .post('/auth/register')
                    .send({email: '', password: password})
                    .end((err, res) => {
                        res.should.have.status(401);
                        res.text.should.be.an("string");
                        res.text.length.should.be.above(0);
                        let error = JSON.parse(res.text);

                        error.should.be.an('object');
                        Object.keys(error)[0].should.be.equal("errors");
                        Object.keys(error.errors).length.should.be.equal(4);
                        error.errors.title.should.include('Email');

                        done();
                    });
            });
            it("should return 401 | missing password", (done) => {
                chai.request(server)
                    .post('/auth/register')
                    .send({email: email, password: ''})
                    .end((err, res) => {
                        res.should.have.status(401);
                        res.text.should.be.an("string");
                        res.text.length.should.be.above(0);
                        let error = JSON.parse(res.text);

                        error.should.be.an('object');
                        Object.keys(error)[0].should.be.equal("errors");
                        Object.keys(error.errors).length.should.be.equal(4);
                        error.errors.title.should.include('Email');

                        done();
                    });
            });
            it("should return 201 | registered user", (done) => {
                chai.request(server)
                    .post('/auth/register')
                    .send({email: email, password: password})
                    .end((err, res) => {
                        res.should.have.status(201);
                        let data = res.body.data;

                        data.should.be.an("object");
                        data.message.should.be.an("string");
                        data.message.length.should.be.above(0);
                        data.message.should.include("Registered");

                        done();
                    });
            });
            it("should return 401 | user already registered", (done) => {
                chai.request(server)
                    .post('/auth/register')
                    .send({email: email, password: password})
                    .end((err, res) => {
                        res.should.have.status(401);
                        res.text.should.be.an("string");
                        res.text.length.should.be.above(0);
                        let error = JSON.parse(res.text);

                        error.should.be.an('object');
                        Object.keys(error)[0].should.be.equal("errors");
                        Object.keys(error.errors).length.should.be.equal(4);
                        error.errors.title.should.equals('Email already registered');

                        done();
                    });
            });
        });
        describe('Login', () => {
            it("should return 401 | missing email", (done) => {
                chai.request(server)
                    .post('/auth/login')
                    .send({email: '', password: password})
                    .end((err, res) => {
                        res.should.have.status(401);
                        res.text.should.be.an("string");
                        res.text.length.should.be.above(0);
                        let error = JSON.parse(res.text);

                        error.should.be.an('object');
                        Object.keys(error)[0].should.be.equal("errors");
                        Object.keys(error.errors).length.should.be.equal(4);
                        error.errors.title.should.include('Email');

                        done();
                    });
            });
            it("should return 401 | missing password", (done) => {
                chai.request(server)
                    .post('/auth/login')
                    .send({email: email, password: ''})
                    .end((err, res) => {
                        res.should.have.status(401);
                        res.text.should.be.an("string");
                        res.text.length.should.be.above(0);
                        let error = JSON.parse(res.text);

                        error.should.be.an('object');
                        Object.keys(error)[0].should.be.equal("errors");
                        Object.keys(error.errors).length.should.be.equal(4);
                        error.errors.title.should.include('password');

                        done();
                    });
            });
            it("should return 401 | wrong email", (done) => {
                chai.request(server)
                    .post('/auth/login')
                    .send({email: "wrongEmail", password: password})
                    .end((err, res) => {
                        res.should.have.status(401);
                        res.text.should.be.an("string");
                        res.text.length.should.be.above(0);
                        let error = JSON.parse(res.text);

                        error.should.be.an('object');
                        Object.keys(error)[0].should.be.equal("errors");
                        Object.keys(error.errors).length.should.be.equal(4);
                        error.errors.title.should.include('Email');

                        done();
                    });
            });
            it("should return 401 | wrong password", (done) => {
                chai.request(server)
                    .post('/auth/login')
                    .send({email: email, password: "wrongPassword"})
                    .end((err, res) => {
                        res.should.have.status(401);
                        res.text.should.be.an("string");
                        res.text.length.should.be.above(0);
                        let error = JSON.parse(res.text);

                        error.should.be.an('object');
                        Object.keys(error)[0].should.be.equal("errors");
                        Object.keys(error.errors).length.should.be.equal(4);
                        error.errors.title.should.include('Password');

                        done();
                    });
            });
            it("should return 201 and token", (done) => {
                chai.request(server)
                    .post('/auth/login')
                    .send({email: email, password: password})
                    .end((err, res) => {
                        res.should.have.status(200);
                        let data = res.body.data;

                        data.type.should.be.equal("success");
                        data.user.email.should.be.equal(email);
                        data.message.should.be.equal("User logged in");
                        data.token.length.should.be.above(0);
                        // Added token to global
                        token = res.body.data.token;

                        done();
                    });
            });
        });
        describe('Invite', () => {
            it("should return 401 | missing JWT token", (done) => {
                chai.request(server)
                    .post('/auth/invite')
                    .end((err, res) => {
                        res.should.have.status(401);
                        res.text.should.be.an("string");
                        res.text.length.should.be.above(0);
                        let error = JSON.parse(res.text);

                        error.should.be.an('object');
                        Object.keys(error)[0].should.be.equal("errors");
                        Object.keys(error.errors).length.should.be.equal(4);
                        error.errors.title.should.be.equal('No token provided');

                        done();
                    });
            });
            it("should return 401 | missing toEmail", (done) => {
                chai.request(server)
                    .post('/auth/invite')
                    .set("x-access-token", token)
                    .send({
                        toEmail: '',
                        docName: name
                    })
                    .end((err, res) => {
                        res.should.have.status(401);
                        let errors = res.body.errors;

                        errors.should.be.an("object");
                        errors.title.should.be.an("string");
                        errors.title.length.should.be.above(0);
                        errors.title.should.include("not included");

                        done();
                    });
            });
            it("should return 401 | missing name", (done) => {
                chai.request(server)
                    .post('/auth/invite')
                    .set("x-access-token", token)
                    .send({
                        toEmail: addEmail,
                        docName: ''
                    })
                    .end((err, res) => {
                        res.should.have.status(401);
                        let errors = res.body.errors;

                        errors.should.be.an("object");
                        errors.title.should.be.an("string");
                        errors.title.length.should.be.above(0);
                        errors.title.should.include("not included");

                        done();
                    });
            });
            it("should return 201 | sent invite", (done) => {
                chai.request(server)
                    .post('/auth/invite')
                    .set("x-access-token", token)
                    .send({
                        toEmail: addEmail,
                        docName: name,
                    })
                    .end((err, res) => {
                        res.should.have.status(201);
                        let data = res.body.data;

                        data.should.be.an("object");
                        data.message.should.be.an("string");
                        data.message.length.should.be.above(0);
                        data.message.should.equals("Email sent");

                        done();
                    });
            });
        });
    });
    describe('Document /', () => {
        describe('JWT', () => {
            it("should return 401 | missing JWT token", (done) => {
                chai.request(server)
                    .get('/document')
                    .end((err, res) => {
                        res.should.have.status(401);
                        res.text.should.be.an("string");
                        res.text.length.should.be.above(0);
                        let error = JSON.parse(res.text);

                        error.should.be.an('object');
                        Object.keys(error)[0].should.be.equal("errors");
                        Object.keys(error.errors).length.should.be.equal(4);
                        error.errors.title.should.be.equal('No token provided');

                        done();
                    });
            });
            it("should return 401 | no JWT token", (done) => {
                chai.request(server)
                    .get('/document')
                    .set("x-access-token", '')
                    .end((err, res) => {
                        res.should.have.status(401);
                        res.text.should.be.an("string");
                        res.text.length.should.be.above(0);
                        let error = JSON.parse(res.text);

                        error.should.be.an('object');
                        Object.keys(error)[0].should.be.equal("errors");
                        Object.keys(error.errors).length.should.be.equal(4);
                        error.errors.title.should.be.equal('No token provided');

                        done();
                    });
            });
            it("should return 500 | wrong JWT token", (done) => {
                chai.request(server)
                    .get('/document')
                    .set("x-access-token", 'abc')
                    .end((err, res) => {
                        res.should.have.status(500);
                        res.text.should.be.an("string");
                        res.text.length.should.be.above(0);
                        let error = JSON.parse(res.text);

                        error.should.be.an('object');
                        Object.keys(error)[0].should.be.equal("errors");
                        Object.keys(error.errors).length.should.be.equal(4);
                        error.errors.title.should.be.equal('Failed authentication');

                        done();
                    });
            });
        });
        describe('Index', () => {
            it("should return 200 and nothing in data", (done) => {
                chai.request(server)
                    .get('/document')
                    .set("x-access-token", token)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.an("object");
                        Object.keys(res.body.data).length.should.be.equals(0);

                        done();
                    });
            });
        });
        describe('Create', () => {
            it("should return 401 | no JWT", (done) => {
                chai.request(server)
                    .post('/document/create')
                    .send({
                        name: name,
                        text: text,
                    })
                    .end((err, res) => {
                        res.should.have.status(401);
                        let errors = res.body.errors;

                        errors.should.be.an("object");
                        errors.title.should.be.an("string");
                        errors.title.length.should.be.above(0);
                        errors.title.should.equals("No token provided");

                        done();
                    });
            });
            it("should return 401 | missing name", (done) => {
                chai.request(server)
                    .post('/document/create')
                    .set("x-access-token", token)
                    .send({
                        name: '',
                        text: text,
                        comments: comments
                    })
                    .end((err, res) => {
                        res.should.have.status(401);
                        let errors = res.body.errors;

                        errors.should.be.an("object");
                        errors.title.should.be.an("string");
                        errors.title.length.should.be.above(0);
                        errors.title.should.include("not included");

                        done();
                    });
            });
            it("should return 401 | missing text", (done) => {
                chai.request(server)
                    .post('/document/create')
                    .set("x-access-token", token)
                    .send({
                        name: name,
                        text: '',
                        comments: comments
                    })
                    .end((err, res) => {
                        res.should.have.status(401);
                        let errors = res.body.errors;

                        errors.should.be.an("object");
                        errors.title.should.be.an("string");
                        errors.title.length.should.be.above(0);
                        errors.title.should.include("not included");

                        done();
                    });
            });
            it("should return 401 | missing comments", (done) => {
                chai.request(server)
                    .post('/document/create')
                    .set("x-access-token", token)
                    .send({
                        name: name,
                        text: text,
                        comments: '',
                    })
                    .end((err, res) => {
                        res.should.have.status(401);
                        let errors = res.body.errors;

                        errors.should.be.an("object");
                        errors.title.should.be.an("string");
                        errors.title.length.should.be.above(0);
                        errors.title.should.include("not included");

                        done();
                    });
            });
            it("should return 201 | created doc", (done) => {
                chai.request(server)
                    .post('/document/create')
                    .set("x-access-token", token)
                    .send({
                        name: name,
                        text: text,
                        comments: comments
                    })
                    .end((err, res) => {
                        res.should.have.status(201);
                        let data = res.body.data;

                        data.should.be.an("object");
                        data.id.should.be.an("string");
                        data.id.length.should.be.above(0);
                        data.message.should.be.an("string");
                        data.message.length.should.be.above(0);
                        data.message.should.equals("Document created");

                        done();
                    });
            });
            it("should return 200 and one doc", (done) => {
                chai.request(server)
                    .get('/document')
                    .set("x-access-token", token)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.an("object");
                        Object.keys(res.body.data).length.should.be.above(0);
                        let doc = res.body.data[0];

                        doc._id.length.should.be.above(0);
                        doc.name.length.should.be.above(0);
                        doc.name.should.be.equal(name);
                        doc.text.length.should.be.above(0);
                        doc.text.should.be.equal(text);
                        doc.comments.length.should.be.equals(0);
                        doc.allowed_users.length.should.be.equal(0);
                        doc.allowed_users.should.be.eql(allowedUsers);

                        // Set id
                        id = doc._id;

                        done();
                    });
            });
        });
        describe('Update', () => {
            it("should return 401 | no JWT", (done) => {
                chai.request(server)
                    .post('/document/update')
                    .send({
                        _id: id,
                        text: text,
                    })
                    .end((err, res) => {
                        res.should.have.status(401);
                        let errors = res.body.errors;

                        errors.should.be.an("object");
                        errors.title.should.be.an("string");
                        errors.title.length.should.be.above(0);
                        errors.title.should.equals("No token provided");

                        done();
                    });
            });
            it("should return 401 | missing _id", (done) => {
                chai.request(server)
                    .post('/document/update')
                    .set("x-access-token", token)
                    .send({
                        _id: '',
                        text: text,
                    })
                    .end((err, res) => {
                        res.should.have.status(401);
                        let errors = res.body.errors;

                        errors.should.be.an("object");
                        errors.title.should.be.an("string");
                        errors.title.length.should.be.above(0);
                        errors.title.should.include("not included");

                        done();
                    });
            });
            it("should return 401 | missing text", (done) => {
                chai.request(server)
                    .post('/document/update')
                    .set("x-access-token", token)
                    .send({
                        _id: id,
                        text: '',
                    })
                    .end((err, res) => {
                        res.should.have.status(401);
                        let errors = res.body.errors;

                        errors.should.be.an("object");
                        errors.title.should.be.an("string");
                        errors.title.length.should.be.above(0);
                        errors.title.should.include("not included");

                        done();
                    });
            });
            it("should return 201 | updated doc", (done) => {
                text = "<p>TestNewText</p>";
                chai.request(server)
                    .post('/document/update')
                    .set("x-access-token", token)
                    .send({
                        _id: id,
                        text: text,
                    })
                    .end((err, res) => {
                        res.should.have.status(201);
                        let data = res.body.data;

                        data.should.be.an("object");
                        data.message.should.be.an("string");
                        data.message.length.should.be.above(0);
                        data.message.should.equals("Document updated");

                        done();
                    });
            });
            it("should return 200 and one doc", (done) => {
                chai.request(server)
                    .get('/document')
                    .set("x-access-token", token)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.an("object");
                        Object.keys(res.body.data).length.should.be.above(0);
                        let doc = res.body.data[0];

                        doc._id.length.should.be.above(0);
                        doc.name.length.should.be.above(0);
                        doc.name.should.be.equal(name);
                        doc.text.length.should.be.above(0);
                        doc.text.should.be.equal(text);
                        doc.comments.length.should.be.equals(0);
                        doc.allowed_users.length.should.be.equal(0);
                        doc.allowed_users.should.be.eql(allowedUsers);

                        done();
                    });
            });
        });
        describe('Allow', () => {
            it("should return 401 | no JWT", (done) => {
                chai.request(server)
                    .post('/document/allow')
                    .send({
                        _id: id,
                        text: text,
                    })
                    .end((err, res) => {
                        res.should.have.status(401);
                        let errors = res.body.errors;

                        errors.should.be.an("object");
                        errors.title.should.be.an("string");
                        errors.title.length.should.be.above(0);
                        errors.title.should.equals("No token provided");

                        done();
                    });
            });
            it("should return 401 | missing docId", (done) => {
                chai.request(server)
                    .post('/document/allow')
                    .set("x-access-token", token)
                    .send({
                        docId: '',
                        addEmail: addEmail,
                    })
                    .end((err, res) => {
                        res.should.have.status(401);
                        let errors = res.body.errors;

                        errors.should.be.an("object");
                        errors.title.should.be.an("string");
                        errors.title.length.should.be.above(0);
                        errors.title.should.include("not included");

                        done();
                    });
            });
            it("should return 401 | missing addEmail", (done) => {
                chai.request(server)
                    .post('/document/allow')
                    .set("x-access-token", token)
                    .send({
                        docId: id,
                        addEmail: '',
                    })
                    .end((err, res) => {
                        res.should.have.status(401);
                        let errors = res.body.errors;

                        errors.should.be.an("object");
                        errors.title.should.be.an("string");
                        errors.title.length.should.be.above(0);
                        errors.title.should.include("not included");

                        done();
                    });
            });
            it("should return 201 | allowed email", (done) => {
                chai.request(server)
                    .post('/document/allow')
                    .set("x-access-token", token)
                    .send({
                        docId: id,
                        addEmail: addEmail,
                    })
                    .end((err, res) => {
                        res.should.have.status(201);
                        let data = res.body.data;

                        data.should.be.an("object");
                        data.message.should.be.an("string");
                        data.message.length.should.be.above(0);
                        data.message.should.equals("Allowed user to document");

                        // Add to allowed_users
                        allowedUsers.push(addEmail);

                        done();
                    });
            });
            it("should return 200 | doc contain 1 allowed", (done) => {
                chai.request(server)
                    .get('/document')
                    .set("x-access-token", token)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.an("object");
                        Object.keys(res.body.data).length.should.be.above(0);
                        let doc = res.body.data[0];

                        doc._id.length.should.be.above(0);
                        doc.name.length.should.be.above(0);
                        doc.name.should.be.equal(name);
                        doc.text.length.should.be.above(0);
                        doc.text.should.be.equal(text);
                        doc.allowed_users.length.should.be.equal(1);
                        doc.allowed_users.should.be.eql(allowedUsers);

                        done();
                    });
            });
            it("should return 401 | email already allowed", (done) => {
                chai.request(server)
                    .post('/document/allow')
                    .set("x-access-token", token)
                    .send({
                        docId: id,
                        addEmail: addEmail,
                    })
                    .end((err, res) => {
                        res.should.have.status(401);
                        let errors = res.body.errors;

                        errors.should.be.an("object");
                        errors.title.should.be.an("string");
                        errors.title.length.should.be.above(0);
                        errors.title.should.equal("Allowed user already");

                        done();
                    });
            });
            it("should return 200 | doc contain 1 allowed", (done) => {
                chai.request(server)
                    .get('/document')
                    .set("x-access-token", token)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.an("object");
                        Object.keys(res.body.data).length.should.be.above(0);
                        let doc = res.body.data[0];

                        doc._id.length.should.be.above(0);
                        doc.name.length.should.be.above(0);
                        doc.name.should.be.equal(name);
                        doc.text.length.should.be.above(0);
                        doc.text.should.be.equal(text);
                        doc.allowed_users.length.should.be.equal(1);
                        doc.allowed_users.should.be.eql(allowedUsers);

                        done();
                    });
            });
        });
        describe('Pdf', () => {
            it("should return 401 | no JWT", (done) => {
                chai.request(server)
                    .post('/document/pdf')
                    .send({
                        text: text,
                    })
                    .end((err, res) => {
                        res.should.have.status(401);
                        let errors = res.body.errors;

                        errors.should.be.an("object");
                        errors.title.should.be.an("string");
                        errors.title.length.should.be.above(0);
                        errors.title.should.equals("No token provided");

                        done();
                    });
            });
            it("should return 401 | missing text", (done) => {
                chai.request(server)
                    .post('/document/pdf')
                    .send({
                        text: '',
                    })
                    .set('x-access-token', token)
                    .end((err, res) => {
                        res.should.have.status(401);
                        let errors = res.body.errors;

                        errors.should.be.an("object");
                        errors.title.should.be.an("string");
                        errors.title.length.should.be.above(0);
                        errors.title.should.equals("Text not sent");

                        done();
                    });
            });
            it("should return 200 | pdf created", (done) => {
                chai.request(server)
                    .post('/document/pdf')
                    .set("x-access-token", token)
                    .send({
                        text: text,
                    })
                    .end((err, res) => {
                        // Can't check blob for some reason..
                        res.should.have.status(200);
                        res.body.should.be.an("object");

                        done();
                    });
            });
        });
        describe('post/Comment', () => {
            it("should return 401 | no JWT", (done) => {
                chai.request(server)
                    .post('/document/comment')
                    .send({
                        comment: comment,
                        docId: id,
                        position: position
                    })
                    .end((err, res) => {
                        res.should.have.status(401);
                        let errors = res.body.errors;

                        errors.should.be.an("object");
                        errors.title.should.be.an("string");
                        errors.title.length.should.be.above(0);
                        errors.title.should.equals("No token provided");

                        done();
                    });
            });
            it("should return 401 | missing comment", (done) => {
                chai.request(server)
                    .post('/document/comment')
                    .set("x-access-token", token)
                    .send({
                        comment: '',
                        docId: id,
                        position: position
                    })
                    .end((err, res) => {
                        res.should.have.status(401);
                        let errors = res.body.errors;

                        errors.should.be.an("object");
                        errors.title.should.be.an("string");
                        errors.title.length.should.be.above(0);
                        errors.title.should.include("not included");

                        done();
                    });
            });
            it("should return 401 | missing id", (done) => {
                chai.request(server)
                    .post('/document/comment')
                    .set("x-access-token", token)
                    .send({
                        comment: comment,
                        docId: '',
                        position: position
                    })
                    .end((err, res) => {
                        res.should.have.status(401);
                        let errors = res.body.errors;

                        errors.should.be.an("object");
                        errors.title.should.be.an("string");
                        errors.title.length.should.be.above(0);
                        errors.title.should.include("not included");

                        done();
                    });
            });
            it("should return 401 | missing position", (done) => {
                chai.request(server)
                    .post('/document/comment')
                    .set("x-access-token", token)
                    .send({
                        comment: comment,
                        docId: id,
                        position: ''
                    })
                    .end((err, res) => {
                        res.should.have.status(401);
                        let errors = res.body.errors;

                        errors.should.be.an("object");
                        errors.title.should.be.an("string");
                        errors.title.length.should.be.above(0);
                        errors.title.should.include("not included");

                        done();
                    });
            });
            it("should return 201 | created comment", (done) => {
                chai.request(server)
                    .post('/document/comment')
                    .set("x-access-token", token)
                    .send({
                        comment: comment,
                        docId: id,
                        position: position
                    })
                    .end((err, res) => {
                        res.should.have.status(201);
                        let data = res.body.data;

                        data.should.be.an("object");
                        data.id.should.be.an("string");
                        data.id.length.should.be.above(0);
                        data.message.should.be.an("string");
                        data.message.length.should.be.above(0);
                        data.message.should.equals("Comment created");

                        done();
                    });
            });
            it("should return 200 and one comment", (done) => {
                chai.request(server)
                    .get('/document')
                    .set("x-access-token", token)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.an("object");
                        Object.keys(res.body.data).length.should.be.above(0);
                        let doc = res.body.data[0];

                        doc._id.length.should.be.above(0);
                        doc.name.length.should.be.above(0);
                        doc.name.should.be.equal(name);
                        doc.text.length.should.be.above(0);
                        doc.text.should.be.equal(text);
                        doc.allowed_users.length.should.be.above(0);
                        doc.allowed_users.should.be.eql(allowedUsers);
                        doc.comments.length.should.be.equal(1);

                        doc.comments[0].should.contain({text: comment});
                        // Set commentID
                        commentID = doc.comments[0]._id;

                        done();
                    });
            });
        });
        describe('delete/Comment', () => {
            it("should return 401 | no JWT", (done) => {
                chai.request(server)
                    .delete('/document/comment')
                    .send({
                        _id: id,
                        commentID: commentID
                    })
                    .end((err, res) => {
                        res.should.have.status(401);
                        let errors = res.body.errors;

                        errors.should.be.an("object");
                        errors.title.should.be.an("string");
                        errors.title.length.should.be.above(0);
                        errors.title.should.equals("No token provided");

                        done();
                    });
            });
            it("should return 401 | missing commentID", (done) => {
                chai.request(server)
                    .delete('/document/comment')
                    .set("x-access-token", token)
                    .send({
                        _id: id,
                        commentID: ''
                    })
                    .end((err, res) => {
                        res.should.have.status(401);
                        let errors = res.body.errors;

                        errors.should.be.an("object");
                        errors.title.should.be.an("string");
                        errors.title.length.should.be.above(0);
                        errors.title.should.include("not included");

                        done();
                    });
            });
            it("should return 401 | missing doc id", (done) => {
                chai.request(server)
                    .delete('/document/comment')
                    .set("x-access-token", token)
                    .send({
                        _id: '',
                        commentID: commentID
                    })
                    .end((err, res) => {
                        res.should.have.status(401);
                        let errors = res.body.errors;

                        errors.should.be.an("object");
                        errors.title.should.be.an("string");
                        errors.title.length.should.be.above(0);
                        errors.title.should.include("not included");

                        done();
                    });
            });
            it("should return 201 | delete comment", (done) => {
                chai.request(server)
                    .delete('/document/comment')
                    .set("x-access-token", token)
                    .send({
                        _id: id,
                        commentID: commentID
                    })
                    .end((err, res) => {
                        res.should.have.status(201);
                        let data = res.body.data;

                        data.should.be.an("object");
                        data.message.should.be.an("string");
                        data.message.length.should.be.above(0);
                        data.message.should.equals("Comment deleted");

                        done();
                    });
            });
            it("should return 200 and zero comments", (done) => {
                chai.request(server)
                    .get('/document')
                    .set("x-access-token", token)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.an("object");
                        Object.keys(res.body.data).length.should.be.above(0);
                        let doc = res.body.data[0];

                        doc._id.length.should.be.above(0);
                        doc.name.length.should.be.above(0);
                        doc.name.should.be.equal(name);
                        doc.text.length.should.be.above(0);
                        doc.text.should.be.equal(text);
                        doc.allowed_users.length.should.be.above(0);
                        doc.allowed_users.should.be.eql(allowedUsers);
                        doc.comments.length.should.be.equal(0);

                        done();
                    });
            });
        });
    });
    describe('Code /', () => {
        describe('Get', () => {
            it("should return 401 | missing JWT token", (done) => {
                chai.request(server)
                    .get('/code')
                    .end((err, res) => {
                        res.should.have.status(401);
                        res.text.should.be.an("string");
                        res.text.length.should.be.above(0);
                        let error = JSON.parse(res.text);

                        error.should.be.an('object');
                        Object.keys(error)[0].should.be.equal("errors");
                        Object.keys(error.errors).length.should.be.equal(4);
                        error.errors.title.should.be.equal('No token provided');

                        done();
                    });
            });
            it("should return 401 | no JWT token", (done) => {
                chai.request(server)
                    .get('/code')
                    .set("x-access-token", '')
                    .end((err, res) => {
                        res.should.have.status(401);
                        res.text.should.be.an("string");
                        res.text.length.should.be.above(0);
                        let error = JSON.parse(res.text);

                        error.should.be.an('object');
                        Object.keys(error)[0].should.be.equal("errors");
                        Object.keys(error.errors).length.should.be.equal(4);
                        error.errors.title.should.be.equal('No token provided');

                        done();
                    });
            });
            it("should return 500 | wrong JWT token", (done) => {
                chai.request(server)
                    .get('/code')
                    .set("x-access-token", 'abc')
                    .end((err, res) => {
                        res.should.have.status(500);
                        res.text.should.be.an("string");
                        res.text.length.should.be.above(0);
                        let error = JSON.parse(res.text);

                        error.should.be.an('object');
                        Object.keys(error)[0].should.be.equal("errors");
                        Object.keys(error.errors).length.should.be.equal(4);
                        error.errors.title.should.be.equal('Failed authentication');

                        done();
                    });
            });
            it("should return 200 | contain 0 code", (done) => {
                chai.request(server)
                    .get('/code')
                    .set("x-access-token", token)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.an("object");
                        Object.keys(res.body.data).length.should.be.equals(0);

                        done();
                    });
            });
        });
        describe('Post', () => {
            it("should return 401 | no JWT", (done) => {
                chai.request(server)
                    .post('/code')
                    .send({
                        name: codeName,
                        code: codeCode,
                    })
                    .end((err, res) => {
                        res.should.have.status(401);
                        let errors = res.body.errors;

                        errors.should.be.an("object");
                        errors.title.should.be.an("string");
                        errors.title.length.should.be.above(0);
                        errors.title.should.equals("No token provided");

                        done();
                    });
            });
            it("should return 401 | missing name", (done) => {
                chai.request(server)
                    .post('/code')
                    .set("x-access-token", token)
                    .send({
                        name: '',
                        code: codeCode,
                    })
                    .end((err, res) => {
                        res.should.have.status(401);
                        let errors = res.body.errors;

                        errors.should.be.an("object");
                        errors.title.should.be.an("string");
                        errors.title.length.should.be.above(0);
                        errors.title.should.include("not included");

                        done();
                    });
            });
            it("should return 401 | missing code", (done) => {
                chai.request(server)
                    .post('/code')
                    .set("x-access-token", token)
                    .send({
                        name: codeName,
                        code: '',
                    })
                    .end((err, res) => {
                        res.should.have.status(401);
                        let errors = res.body.errors;

                        errors.should.be.an("object");
                        errors.title.should.be.an("string");
                        errors.title.length.should.be.above(0);
                        errors.title.should.include("not included");

                        done();
                    });
            });
            it("should return 201 | created code", (done) => {
                chai.request(server)
                    .post('/code')
                    .set("x-access-token", token)
                    .send({
                        name: codeName,
                        code: codeCode,
                    })
                    .end((err, res) => {
                        res.should.have.status(201);
                        let data = res.body.data;

                        data.should.be.an("object");
                        data.id.should.be.an("string");
                        data.id.length.should.be.above(0);
                        data.message.should.be.an("string");
                        data.message.length.should.be.above(0);
                        data.message.should.equals("Code created");

                        // Add code id
                        codeId = data.id;

                        done();
                    });
            });
            it("should return 200 | contain 1 code", (done) => {
                chai.request(server)
                    .get('/code')
                    .set("x-access-token", token)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.an("object");
                        Object.keys(res.body.data).length.should.be.above(0);
                        let code = res.body.data[0];

                        code._id.length.should.be.above(0);
                        code.name.length.should.be.above(0);
                        code.name.should.be.equal(codeName);
                        code.code.length.should.be.above(0);
                        code.code.should.be.equal(codeCode);

                        done();
                    });
            });
        });
        describe('Put', () => {
            it("should return 401 | no JWT", (done) => {
                chai.request(server)
                    .put('/code')
                    .send({
                        id: codeId,
                        code: codeCode,
                    })
                    .end((err, res) => {
                        res.should.have.status(401);
                        let errors = res.body.errors;

                        errors.should.be.an("object");
                        errors.title.should.be.an("string");
                        errors.title.length.should.be.above(0);
                        errors.title.should.equals("No token provided");

                        done();
                    });
            });
            it("should return 401 | missing id", (done) => {
                chai.request(server)
                    .put('/code')
                    .set("x-access-token", token)
                    .send({
                        id: '',
                        code: codeCode,
                    })
                    .end((err, res) => {
                        res.should.have.status(401);
                        let errors = res.body.errors;

                        errors.should.be.an("object");
                        errors.title.should.be.an("string");
                        errors.title.length.should.be.above(0);
                        errors.title.should.include("not included");

                        done();
                    });
            });
            it("should return 401 | missing code", (done) => {
                chai.request(server)
                    .put('/code')
                    .set("x-access-token", token)
                    .send({
                        id: codeId,
                        code: '',
                    })
                    .end((err, res) => {
                        res.should.have.status(401);
                        let errors = res.body.errors;

                        errors.should.be.an("object");
                        errors.title.should.be.an("string");
                        errors.title.length.should.be.above(0);
                        errors.title.should.include("not included");

                        done();
                    });
            });
            it("should return 201 | update code", (done) => {
                chai.request(server)
                    .put('/code')
                    .set("x-access-token", token)
                    .send({
                        id: codeId,
                        code: codeCode,
                    })
                    .end((err, res) => {
                        res.should.have.status(201);
                        let data = res.body.data;

                        data.should.be.an("object");
                        data.message.should.be.an("string");
                        data.message.length.should.be.above(0);
                        data.message.should.equals("Code updated");

                        done();
                    });
            });
            it("should return 200 | contain 1 code", (done) => {
                chai.request(server)
                    .get('/code')
                    .set("x-access-token", token)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.an("object");
                        Object.keys(res.body.data).length.should.be.above(0);
                        let code = res.body.data[0];

                        code._id.length.should.be.above(0);
                        code.name.length.should.be.above(0);
                        code.name.should.be.equal(codeName);
                        code.code.length.should.be.above(0);
                        code.code.should.be.equal(codeCode);

                        done();
                    });
            });
        });
    });
    describe('GraphQL /', () => {
        describe('Data', () => {
            it('should return 200 error | no email no data', (done) => {
                chai.request(server)
                    .post('/graphql')
                    .send({ query: '{ docs (email: "") { name text _id } }' })
                    .end((err, res) => {
                        res.should.have.status(200);
                        let errors = res.body.errors[0];
                        let data = res.body.data;

                        errors.should.be.an("object");
                        Object.keys(errors).length.should.be.above(0);
                        errors.message.should.be.an("string");
                        errors.message.length.should.be.above(0);
                        errors.message.should.include("did not find one");

                        data.should.be.an("object");
                        Object.keys(data).length.should.be.equal(1);

                        done();
                    });
            });
            it('should return 200 | get data', (done) => {
                chai.request(server)
                    .post('/graphql')
                    .send({ query: '{ docs (email: "' + email + '") { name text _id } }' })
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.an("object");
                        Object.keys(res.body.data).length.should.be.above(0);
                        let doc = res.body.data.docs[0];

                        doc._id.length.should.be.above(0);
                        doc.name.length.should.be.above(0);
                        doc.name.should.be.equal(name);
                        doc.text.length.should.be.above(0);
                        doc.text.should.be.equal(text);

                        done();
                    });
            });
        });
    });
});
