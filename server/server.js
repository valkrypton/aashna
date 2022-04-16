const express = require('express')
const app = express();
const cors = require('cors')
const {json} = require("express");
const database = require("./database");
const {checkIfUserExistsAPI} = require("./api/checkIfUserExistsAPI");
const {getOTP, verifyOTP} = require('./api/OtpAPI')
app.use(cors())
app.use(json())


app.listen(3000, function () {
    console.log("server running at port 3000");
})


app.get("/getverificationcode", (req, res) => {
    console.log("getting code");
    getOTP(req, res)
})

app.get("/verifycode", (req, res) => {
    console.log("verofying code");
    verifyOTP(req, res)
})

app.get("/checkuser", (req, res) => {
    checkIfUserExistsAPI(database, req, res)
})
