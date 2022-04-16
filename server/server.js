const express = require('express')
const app = express();
const nodemailer = require("nodemailer");
const {map} = require("core-js/internals/array-iteration");

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'azankadri42@gmail.com',
        pass: process.env.EMAIL_PW
    }
});

let mailOptions = {
    from: 'azankadri42@gmail.com',
    to: '',
    subject: 'Here is your verification code for Aashna',
    text: ''
};

app.listen(3000, function (){
    console.log("server running at port 3000");
})

const verificationCodeMap = new Map();


app.get("/getverificationcode", (req, res) => {
    console.log("getting code");
    let code = ""
    for(let i = 0; i < 5; ++i){
        code += Math.floor(Math.random()*10);
    }

    verificationCodeMap.set(req.query.id, code);
    mailOptions.to = req.query.id;
    mailOptions.text = code;
    transporter.sendMail(mailOptions, function (error, info){

    })
    res.send("");
})

app.get("/verifycode", (req, res) => {
    console.log("verofying code");
    if(verificationCodeMap.get(req.query.id) === req.query.code){
        console.log("AAAAAAAAAAAAAAAAAaaa")
        verificationCodeMap.delete(req.query.id);
        res.send("ok");
        //do something here
    }
    else{
        res.send("ng");
    }
})
