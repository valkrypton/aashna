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
    if(checkIfUserExistsAPI(database,req,res)){
        getOTP(req,res)
        res.json({userExists:true})
    }
    else
        res.json({userExists:true})
})

app.get("/verifycode", (req, res) => {
    console.log("verofying code");
    verifyOTP(req, res)
})

