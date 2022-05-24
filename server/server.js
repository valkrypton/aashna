const express = require('express')
const app = express();
const server = require('http').createServer(app)
const cors = require('cors')
const database = require("../server/database")
const multer = require("multer");
const jwt = require("jsonwebtoken")
const io = require('socket.io')(server,{
    cors:{
        origin:'*'
    },
    pingTimeout:1000*60*3,
    pingInterval:1000*60*5
})

const {
    getOTP,
    verifyOTP,
    checkIfUserExists,
    registerUser,
    verifyPassword
} = require('./api/signUpAndLogInAPI')
const getPeople = require("./api/getPeople");
const {leftSwipe, rightSwipe} = require("./api/swiping");
const {json} = require("express");
let db
(async () => {
    db = await database()
})()

const localStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "../server/imgs/")
    },
    filename: function (req, file, cb) {
        cb(null, req.body.email + ".jpeg")
    }
})
const upload = multer({storage: localStorage})
const connectedUsers = new Map()
app.use(express.static("imgs"))
app.use(json())
app.use(cors())

io.use(function(socket, next){
    if (socket.handshake.query && socket.handshake.query.token){
        jwt.verify(socket.handshake.query.token, 'secret',{}, function(err, decoded) {
            if (err){
                console.log(err)
                return next(new Error('Authentication error'))
            }
            socket.decoded = decoded;
            next();
        });
    }
    else {
        next(new Error('Authentication error'));
    }
})
    .on('connection', function(socket) {
        console.log('user connected')
        // Connection now authenticated to receive further events
        socket.join(socket.decoded.user.user_id);

        socket.on("private_message", ({content, to}) => {
            socket.to(to).to(socket.decoded.user.user_id).emit("private message", {
                content,
                from: socket.decoded.user.user_id,
                to,
            })
        })
    });

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
        if (await checkIfUserExists(db, req.body.email)) {
            req.file.path = req.body.email + ".jpeg"
            if (await registerUser(db, req, res)) {
                res.json({registered: true})
            } else {
                res.sendStatus(500);
            }
        } else
            res.json({userExists: false})
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
            const [rows, fields] = await db.execute('select swipee from user_swiped_right_on where swiper = ?' +
                ' and swipee in (select swiper from user_swiped_right_on where swipee = ?)',
                [decoded.user.user_id, decoded.user.user_id])
            const matchedUsers = []
            for (let i = 0; i < rows.length; ++i) {
                const [users] = await db.execute('select * from user where user_id = ?', [rows[i].swipee])
                delete users[0].password
                matchedUsers.push(users[0])
            }
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

