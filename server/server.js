const express = require('express')
const app = express();
const cors = require('cors')
const database = require("./database");
const multer = require("multer");
const jwt = require("jsonwebtoken")

const {
    getOTP,
    verifyOTP,
    checkIfUserExists,
    registerUser,
    verifyPassword
} = require('./api/signUpAndLogInAPI')
const getPeople = require("./api/getPeople");

app.use(express.static("imgs"))

const localStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "../server/imgs/")
    },
    filename: function (req, file, cb) {
        cb(null, req.body.email + ".jpeg")
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
        req.file.path = req.body.email + ".jpeg"
        await registerUser(await database(), req, res)
        res.json({registered: true})
    })

app.post('/login', upload.none(), async (req, res) => {
    if (await checkIfUserExists(await database(), req.body.email)) {
        const user = await verifyPassword(await database(), req, res)
        if (user) {
            jwt.sign({user: user}, 'secret', {expiresIn: '23h'},
                (err, token) => {
                    if (err) {
                        console.log(err)
                    } else {
                        res.send(token)
                    }
                }
            )
        }
    }
})

app.get('/sessionCheck', async (req, res) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    jwt.verify(token, 'secret', {}, (err, decoded) => {
        if (err)
            console.log("no sessions")
        else
            res.send({sessionExists: true})
    })
})
app.get("/getPeople", async (req, res) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    jwt.verify(token, 'secret', {}, async (err, decoded) => {
        if (err)
            console.log("no maidens for you")
        else {
            const users = await getPeople(decoded.user, await database())
            res.json(users)
        }
    })

})
app.get("/currentUser", async (req, res) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    jwt.verify(token, 'secret', {}, (err, decoded) => {
        if (err)
            console.log("no current user")
        else
            res.send(decoded.user)
    })
})