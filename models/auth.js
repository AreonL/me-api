const database = require('../db/database');
// const config = require('../config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const saltRounds = 10;

// const payload = { email: "test@test.se" };
const secret = process.env.JWT_SECRET;

// Sendgrid | mail system
const sendGrid = require('@sendgrid/mail');
const api = require('../config/config.json');

sendGrid.setApiKey(api.API_KEY);


const auth = {
    login: async function (req, res) {
        // console.log("login");
        const email = req.body.email;
        const password = req.body.password;

        if (!email || !password) {
            return res.status(401).json({
                errors: {
                    status: 401,
                    source: "/login",
                    title: "Email or password not sent",
                    details: "Email or password missing from body"
                }
            });
        }

        const filter = {
            email: email
        };


        let db = await database.getDb();

        const user = await db.collection.findOne(filter);

        await db.client.close();
        // console.log(user);
        if (user) {
            return auth.comparePassword(
                res,
                password,
                user
            );
        }

        return res.status(401).json({
            errors: {
                status: 401,
                source: "/login",
                title: "Email or password wrong",
                details: "Email or password did not match db"
            }
        });
    },
    register: async function (req, res) {
        // console.log("register");
        const email = req.body.email;
        const password = req.body.password;

        if (!email || !password) {
            return res.status(401).json({
                errors: {
                    status: 401,
                    source: "/register",
                    title: "Email or password not sent",
                    details: "Email or password missing from body"
                }
            });
        }

        bcrypt.hash(password, saltRounds, async function(err, hash) {
            if (err) {
                return res.status(500).json({
                    errors: {
                        status: 500,
                        source: "/register",
                        title: "bcrypt error",
                        detail: "bcrypt error"
                    }
                });
            }

            let db;

            try {
                db = await database.getDb();

                let updateDoc = {
                    email: email,
                    password: hash,
                    docs: [],
                    code: []
                };

                let emailIsInDB = await db.collection.findOne({email: email});

                if (emailIsInDB) {
                    // console.log(emailIsInDB, "Returning, already exsisting");
                    return res.status(401).json({
                        errors: {
                            status: 401,
                            source: "/register",
                            title: "Email already registered",
                            detail: "Email is already registered to db"
                        }
                    });
                }

                // console.log(email, "Adding new user too db");

                await db.collection.insertOne(updateDoc);

                return res.status(201).json({
                    data: {
                        message: "Registered a new User!"
                    }
                });
            } catch (e) {
                return res.status(500).json({
                    errors: {
                        status: 500,
                        source: "/register",
                        title: "Database error",
                        detail: e.message
                    }
                });
            } finally {
                await db.client.close();
            }
        });
    },
    comparePassword: async function (res, password, user) {
        // console.log("comparePassword");
        // console.log(password, user);
        // const token = jwt.sign(payload, secret, { expiresIn: '1h'});
        bcrypt.compare(password, user.password, (err, result) => {
            if (err) {
                return res.status(500).json({
                    errors: {
                        status: 500,
                        source: "/login",
                        title: "bcrypt error",
                        detail: "bcrypt error"
                    }
                });
            }

            if (result) {
                let payload = { email: user.email };
                let jwtToken = jwt.sign(payload, secret, { expiresIn: '1h' });

                return res.json({
                    data: {
                        type: "success",
                        message: "User logged in",
                        user: payload,
                        token: jwtToken
                    }
                });
            }

            return res.status(401).json({
                errors: {
                    status: 401,
                    source: "/login",
                    title: "Password wrong",
                    detail: "Password provided was not found"
                }
            });
        });
    },
    checkToken: async function (req, res, next) {
        // console.log("checkToken");
        let token = req.headers['x-access-token'];

        if (token) {
            jwt.verify(token, secret, function(err, decoded) {
                if (err) {
                    return res.status(500).json({
                        errors: {
                            status: 500,
                            source: req.path,
                            title: "Failed authentication",
                            detail: err.message
                        }
                    });
                }


                req.email = decoded.email;

                return next();
            });
        } else {
            return res.status(401).json({
                errors: {
                    status: 401,
                    source: req.path,
                    title: "No token provided",
                    detail: "No token sent through headers"
                }
            });
        }
    },
    sendMail: async function (req, res) {
        const fromEmail = req.email;
        const toEmail = req.body.toEmail;
        const docName = req.body.docName;
        console.log("Here");
        if (!toEmail || !fromEmail || !docName) {
            return res.status(401).json({
                errors: {
                    status: 401,
                    source: "/invite",
                    title: "Email to/from or doc name not included",
                    details: "Missing Email to/from or doc name in POST request"
                }
            });
        }

        const message = {
            to: toEmail,
            from: {
                name: "Editor " + fromEmail,
                email: 'areon.lundkvist@gmail.com'
            },
            subject: 'Hello from Editor',
            text: 'Hello from Editor text from: '+ fromEmail + " and doc: " + docName,
            html: `<h1>Hello from Editor ${fromEmail}</h1>
            <p>I want to formaly invite you to edit on my awesome
            and well thought out project <b>${docName}</b></p>
            <p>
            <a href="https://www.student.bth.se/~arba20/editor/?regEmail=${toEmail}">Here</a>
             is the link to the amzing porject, pls help me out I beg you</p>
            <br>
            <i>MVH - ${fromEmail}</i>`,
        };


        if (process.env.NODE_ENV !== 'test') {
            console.log("Actually sending mail");
            sendGrid.send(message)
                .then(response => response.json())
                .then(data => console.log('Email sent...', data))
                .catch(e => {
                    return res.status(500).json({
                        errors: {
                            status: 500,
                            source: "sendgrid",
                            title: "Email not sent",
                            details: e
                        }
                    });
                });
        }

        return res.status(201).json({
            data: {
                message: "Email sent"
            }
        });
    }
};

module.exports = auth;
