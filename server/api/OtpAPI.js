const nodemailer = require("nodemailer");
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
const verificationCodeMap = new Map();

const getOTP = (req, res) => {
    const code = Math.floor((Math.random() * 100000))
    verificationCodeMap.set(req.query.id, code)
    mailOptions.to = req.query.id
    mailOptions.text = code
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error.message)
            res.status(400)
        } else {
            res.status(200)
        }
    })
}
const verifyOTP = (req, res) => {
    if (verificationCodeMap.get(req.query.id) === req.query.code) {
        console.log("AAAAAAAAAAAAAAAAAaaa")
        verificationCodeMap.delete(req.query.id);
        res.send("ok");
        //do something here
    } else {
        res.send("ng");
    }
}
module.exports = {getOTP, verifyOTP}