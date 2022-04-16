const nodemailer = require("nodemailer");
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'valkrypton@gmail.com',
        pass: 'mtGc1@&8%DE2$htlaN*9V&kolbu3M9^49tkDffjcS!OPn*F%gD'
    }
});

let mailOptions = {
    from: 'valkrypton@gmail.com',
    to: '',
    subject: 'Here is your verification code for Aashna',
    text: ''
};
const verificationCodeMap = new Map();

const getOTP = (req, res) => {
    const code = Math.floor(10000+(Math.random() * 90000))
    console.log(code)
    verificationCodeMap.set(req.query.id, code)
    mailOptions.to = req.query.id
    mailOptions.text = String(code)
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error.message)
        } else {
            console.log('sent successfully')
            console.log(info)
        }
    })
}
const verifyOTP = (req, res) => {
    if (String(verificationCodeMap.get(req.query.id)) === String(req.query.code)) {
        console.log("AAAAAAAAAAAAAAAAAaaa")
        verificationCodeMap.delete(req.query.id);
        res.send({validOTP: true});
        //do something here
    } else {
        res.send({validOTP: false});
    }
}
const checkIfUserExists = async (db, req, res) => {
    const email = req.query.id
    let userExists = false
    const [rows,fields] = await db.execute('SELECT email FROM user where email = ?', [email])
    userExists = rows.length!==0
    return userExists
}

module.exports = {getOTP, verifyOTP, checkIfUserExists}