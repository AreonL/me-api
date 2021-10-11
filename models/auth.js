const database = require('../db/database');
const config = require('../config/config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const saltRounds = 10;

// const payload = { email: "test@test.se" };
const secret = config.JWT_SECRET;



// db.docs.find({"docs.allowed_users": 'test@test.se' }).pretty()

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

        let db;

        try {
            db = await database.getDb();

            const user = await db.collection.findOne(filter);

            // console.log(user);
            if (user) {
                return auth.comparePassword(
                    res,
                    password,
                    user
                );
            }



            return res.status(201).json({
                data: {
                    msg: "Got a POST request"
                }
            });
        } catch (e) {
            return res.status(401).json({
                errors: {
                    status: 401,
                    source: "/login",
                    title: "Email wrong",
                    details: "Email provided was not found"
                }
            });
        } finally {
            await db.client.close();
        }
    },
    register: async function (req, res) {
        console.log("register");
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
                    docs: []
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
};

module.exports = auth;
