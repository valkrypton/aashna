const express = require('express')
const app = express();
const cors = require('cors')
const database = require("../server/database")
const multer = require("multer");
const jwt = require("jsonwebtoken")
var bodyParser = require('body-parser')

const {
    getOTP,
    verifyOTP,
    checkIfUserExists,
    registerUser,
    verifyPassword
} = require('./api/signUpAndLogInAPI')

const getPeople = require("./api/getPeople");

const {leftSwipe, rightSwipe} = require("./api/swiping");

let db
(async () => {
    db = await database()
})()

app.use(express.static("imgs"))
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

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
    console.log("server running at port 30wapdcfeipa");
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

app.post('/registerUser', upload.single("profile_img"), async (req, res) => {
        req.file.path = req.body.email + ".jpeg"
        await registerUser(db, req, res)
        res.json({registered: true})
    }
)

app.post('/login', upload.none(), async (req, res) => {
    if (await checkIfUserExists(db, req.body.email)) {
        const user = await verifyPassword(db, req, res)
        if (user) {
            jwt.sign({user: user}, 'secret', {expiresIn: '23h'},
                (err, token) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(500)
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
        if (err) {
            console.log("no sessions")
            res.sendStatus(500);
        }
        else
            res.send({sessionExists: true})
    })
})

app.get("/getPeople", async (req, res) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    jwt.verify(token, 'secret', {}, async (err, decoded) => {
        if (err) {
            console.log("no maidens for you");
            res.sendStatus(500);
        }
        else {
            const users = await getPeople(decoded.user, db)
            res.json(users)
        }
    })

})

app.get("/currentUser", async (req, res) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    jwt.verify(token, 'secret', {}, async (err, decoded) => {
        if (err){
            console.log("err")
            res.sendStatus(500);
        }

        else {
            const [interests, fields] = await db.execute("SELECT interest FROM user_interests WHERE user_id = ?", [decoded.user.user_id])
            decoded.user.interests = interests;
            res.send(decoded.user)
        }
    })
})

app.post("/leftSwipe", async (req, res) => {
    const swiper = req.body.swiper;
    const swipee = req.body.swipee;
    if(await leftSwipe(swiper, swipee, db)){
        res.sendStatus(200);
    }
    else{
        res.sendStatus(500);
    }
})

app.post("/rightSwipe", async (req, res) => {
    console.log(req.body)
    const swiper = req.body.swiper;
    const swipee = req.body.swipee;


    if(await rightSwipe(swiper, swipee, db)){
        res.sendStatus(200);
    }
    else{
        res.sendStatus(500);
    }
})
