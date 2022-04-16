const express = require('express')
const app = express();
const cors = require('cors')
const {json} = require("express");
const database = require("./database");
const {getOTP, verifyOTP, checkIfUserExists} = require('./api/signUpAPI')
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
    console.log("verofying code");
    verifyOTP(req, res)
})

