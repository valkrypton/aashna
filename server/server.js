const express = require('express')
const app = express();
const server = require('http').createServer(app)
const cors = require('cors')
const database = require("../server/database")
const multer = require("multer");
const jwt = require("jsonwebtoken")
const io = require('socket.io')(server, {
    cors: {
        origin: '*'
    },
    pingTimeout: 1000 * 60 * 3,
    pingInterval: 1000 * 60 * 5
})

const {
    getOTP,
    verifyOTP,
    checkIfUserExists,
    registerUser,
    verifyPassword
} = require('./api/signUpAndLogInAPI')
const {getPeople, getMatchedUsers} = require("./api/getPeople");
const {leftSwipe, rightSwipe} = require("./api/swiping");
const {json} = require("express");
const {checkPassword, changePassword, changeData, deleteUser} = require("./api/account");
let db
(async () => {
    db = await database()
})()

const {retrieve_messages, log_message, get_last_message} = require("./api/messaging");
const localStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "../server/imgs/avis")
    },
    filename: function (req, file, cb) {
        cb(null, req.body.email + ".jpeg")
    }
})
const upload = multer({storage: localStorage})
app.use(express.static("imgs"))
app.use(json())
app.use(cors())

io.use(function (socket, next) {
    if (socket.handshake.query && socket.handshake.query.token) {
        jwt.verify(socket.handshake.query.token, 'secret', {}, function (err, decoded) {
            if (err) {
                console.log(err)
                return next(new Error('Authentication error'))
            }
            socket.decoded = decoded;
            next();
        });
    } else {
        next(new Error('Authentication error'));
    }
})
    .on('connection', function (socket) {
        socket.join(socket.decoded.user.user_id);

        socket.on("private_message", async ({content, to}) => {
            await log_message(socket.decoded.user.user_id, to, content, db);
            socket.to(to).emit("private_message", {
                content,
                from: socket.decoded.user.user_id,
                to,
            })
        })

        socket.on("rightSwipe", async ({swipee}) => {
            try {
                let [rows, fields] = await db.execute("SELECT * FROM user_swiped_right_on WHERE swiper = ? AND swipee = ?", [swipee, socket.decoded.user.user_id]);
                if (rows.length !== 0) {
                    swipee = Number(swipee);
                    socket.to(swipee).emit("matched");
                }
            } catch (err) {
                console.log(err);
            }
        })

    })

server.listen(3000, function () {
    console.log("server running at port 3000");
})


app.get("/getverificationcode", async (req, res) => {
    if (!await checkIfUserExists(db, req.query.id)) {
        getOTP(req, res)
        res.json({userExists: false})
    } else
        res.json({userExists: true})
})

app.get("/verifycode", (req, res) => {
    verifyOTP(req, res)
})

app.post('/registerUser', upload.single("profile_img"),
    async (req, res) => {
        if (!(await checkIfUserExists(db, req.body.email))) {
            req.file.path = 'http://localhost:3000/avis/' + req.body.email + ".jpeg"
            if (await registerUser(db, req, res)) {
                const [rows, fields] = await db.execute("SELECT * FROM user WHERE email = ?", [req.body.email]);
                const user = rows[0];
                delete user.password;
                jwt.sign({user: user}, 'secret', {expiresIn: '23h'},
                    (err, token) => {
                        if (err) {
                            console.log(err)
                            res.sendStatus(401)
                        } else {
                            res.json({token: token})
                        }
                    }
                )
            } else {
                res.sendStatus(500);
            }
        } else {
            res.status(403);
            res.json({userExists: false})
        }
    }
)

app.post('/login', upload.none(), async (req, res) => {
    if (await checkIfUserExists(db, req.body.email)) {
        let user;
        if ((user = await verifyPassword(db, req, res))) {
            jwt.sign({user: user}, 'secret', {expiresIn: '23h'},
                (err, token) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(401)
                    } else {
                        res.json({token: token, userExists: true, validPw: true})
                    }
                }
            )
        } else {
            res.json({userExists: true, validPw: false})
        }
    } else {
        res.json({userExists: false})
    }
})

app.get('/sessionCheck', async (req, res) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    jwt.verify(token, 'secret', {}, (err, decoded) => {
        if (err) {
            console.log("no sessions")
            res.sendStatus(401);
        } else
            res.send({sessionExists: true})
    })
})

app.get("/getPeople", async (req, res) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    jwt.verify(token, 'secret', {}, async (err, decoded) => {
        if (err) {
            console.log("no maidens for you");
            res.sendStatus(401);
        } else {
            let users;
            if ((users = await getPeople(decoded.user, db))) {
                res.json(users)
            } else {
                res.sendStatus(500)
            }
        }
    })

})

app.get("/matchedUsers", async (req, res) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    jwt.verify(token, 'secret', {}, async (err, decoded) => {
        if (err) {
            console.log("err at getting matched users")
            res.sendStatus(401)
        } else {
            const matchedUsers = await getMatchedUsers(decoded.user.user_id, db);
            res.send(matchedUsers)
        }
    })
})
app.get("/currentUser", async (req, res) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    jwt.verify(token, 'secret', {}, async (err, decoded) => {
        if (err) {
            console.log("err")
            res.sendStatus(401);
        } else {
            const [interests, fields] = await db.execute("SELECT interest FROM user_interests WHERE user_id = ?", [decoded.user.user_id])
            decoded.user.interests = interests;
            res.send(decoded.user)
        }
    })
})

app.post("/leftSwipe", upload.none(), async (req, res) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    console.log()
    jwt.verify(token, 'secret', {}, async (err, decoded) => {
        if (err) {
            console.log(err)
            res.sendStatus(401);
        } else {
            if (await leftSwipe(decoded.user.user_id, req.body.swipee, db)) {
                res.sendStatus(200);
            } else {
                res.sendStatus(500);
            }
        }
    })
})

app.post("/rightSwipe", upload.none(), async (req, res) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    jwt.verify(token, 'secret', {}, async (err, decoded) => {
        if (err) {
            res.sendStatus(401);
        } else {
            if (await rightSwipe(decoded.user.user_id, req.body.swipee, db)) {
                res.sendStatus(200);
            } else {
                res.sendStatus(500);
            }
        }
    })
})

app.get("/retrieve_messages", async (req, res) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    jwt.verify(token, 'secret', {}, async (err, decoded) => {
        if (err) {
            res.send(401);
        } else {
            let msgs;
            if ((msgs = await retrieve_messages(decoded.user.user_id, req.query.id, db))) {
                res.json(msgs);
            } else {
                res.sendStatus(500);
            }
        }
    })
})
app.get("/get_last_message", async (req, res) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    jwt.verify(token, 'secret', {}, async (err, decoded) => {
        if (err) {
            res.send(401);
        } else {
            let msg;
            if ((msg = (await get_last_message(decoded.user.user_id, req.query.id, db))[0])) {
                res.json(msg);
            } else {
                res.send("none")
            }
        }
    })
})

app.post('/changePassword', async (req, res) => {
    if (await checkPassword(db, req.body.oldPass, req.body.id)) {
        try {
            await changePassword(db, req)
            res.sendStatus(200)
        } catch (err) {
            console.log(err)
            res.sendStatus(500)
        }
    } else {
        res.json({wrongPassword: false})
    }
})
app.post('/changeUserData', upload.single('profile_img'),
    async (req, res) => {
        try {
            req.body.img_url = 'http://localhost:3000/avis/' + req.body.email + ".jpeg"
            await changeData(db, req)
            const [rows] = await db.execute("SELECT * FROM user WHERE email = ?", [req.body.email]);
            const user = rows[0];
            delete user.password;
            jwt.sign({user: user}, 'secret', {expiresIn: '23h'},
                (err, token) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(401)
                    } else {
                        res.json({token: token})
                    }
                }
            )
        } catch (err) {
            console.log(err)
            res.sendStatus(500)
        }
    })
app.post('/deleteAccount', async (req, res) => {
    if (await checkPassword(db, req.body.pass, req.body.id)) {
        try {
            await deleteUser(db, req.body.id)
            res.sendStatus(200)
        } catch (err) {
            console.log(err)
            res.sendStatus(500)
        }
    } else {
        res.sendStatus(401)
    }
})