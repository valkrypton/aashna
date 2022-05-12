const express = require('express')
const app = express();
const cors = require('cors')
const database = require("./database");
const multer = require("multer");
const session = require("express-session")
const cookieParser = require("cookie-parser")

app.use(session({
    secret: 'ayooo',
    saveUninitialized: true,
    cookie: {maxAge: 1000 * 60 * 60 * 24},
    resave: false
}))

const userSessions = new Map()

app.use(cookieParser())

const {
    getOTP,
    verifyOTP,
    checkIfUserExists,
    registerUser,
    verifyPassword
} = require('./api/signUpAndLogInAPI')
const bodyParser = require("body-parser");
const {response} = require("express");

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

const localStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "../server/imgs/")
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname + '-' + req.body.email + ".jpeg")
    }
})
const upload = multer({storage: localStorage})
app.use(cors())

app.listen(3000, function () {
    console.log("server running at port 3000");
})

app.get("/getverificationcode", async (req, res) => {
    if (!await checkIfUserExists(await database(), req.query.id)) {
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
        await registerUser(await database(), req, res)
        res.json({registered: true})
    })

app.post('/login', async (req, res) => {
    if (await checkIfUserExists(await database(), req.body.email)) {
        const user = await verifyPassword(await database(), req, res)
        if (user) {
            userSessions.set(user.user_id, user)
            req.session.uid = user.user_id;
        }
    }
    console.log(req.session)
    res.send('ok')
})

app.get('/sessionCheck', async (req, res) => {
    res.send(req.session.uid);
})