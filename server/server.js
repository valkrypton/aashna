const express = require('express')
const app = express();
const cors = require('cors')
const {json} = require("express");
const database = require("./database");
const {getOTP, verifyOTP, checkIfUserExists, registerUser, verifyPassword} = require('./api/signUpAndLogInAPI')

app.use(cors())
app.use(json())

app.listen(3000, function () {
    console.log("server running at port 3000");
})

app.get("/getverificationcode", async (req, res) => {
    if (!await checkIfUserExists(await database(), req, res)) {
        getOTP(req, res)
        res.json({userExists: false})
    } else
        res.json({userExists: true})
})

app.get("/verifycode", (req, res) => {
    verifyOTP(req, res)
})

app.post('/registerUser', async (req, res) => {
    await registerUser(await database(), req, res)
})

app.post('/login', async (req, res) => {
    if (await checkIfUserExists(await database(), req, res)) {

        const user = await verifyPassword(await database(), req, res)
        if (user)
            res.json({userExists: true, passwordVerified: true, userData: user})
        else
            res.json({userExists: true, passwordVerified: false, userData: null})
    } else {
        res.json({userExists: false, passwordVerified: false, userData: null})
    }

})
