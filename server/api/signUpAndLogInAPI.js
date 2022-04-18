const nodemailer = require("nodemailer");
const bcrypt = require('bcrypt')
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.email,
        pass: process.env.EMAIL_PW
    }
});

let mailOptions = {
    from: process.env.email,
    to: '',
    subject: 'Here is your verification code for Aashna',
    text: ''
};
const verificationCodeMap = new Map();

const getOTP = (req, res) => {
    const code = Math.floor(10000 + (Math.random() * 90000))
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
    let email = ''
    if (req.body.userData) {
        email = req.body.userData.email
    }
    if (req.query.id) {
        email = req.query.id
    }
    const [rows, fields] = await db.execute('SELECT email FROM user where email = ?', [email])
    return rows.length !== 0
}

const registerUser = async (db, req, res) => {
    const user = req.body.userData
    await db.execute('INSERT INTO user VALUES(null,?,?,?,?,?,?,?,?,?,?,"")',
        [user.email, await bcrypt.hash(user.pass, 5), user.fname, user.lname, user.bio, 20, user.school,
             user.batch, Number(user.gender), Number(user.genderPreference)])
    for (let i = 0; i < user.interests.length; ++i)
        await db.execute('INSERT INTO user_interests values(1   ,?)', [user.interests[i]])
}
const verifyPassword = async (db, req, res) => {
    const [rows, fields] = await db.execute('SELECT * FROM user WHERE email = ?', [req.body.userData.email])
    if (await bcrypt.compare(req.body.userData.pass, rows[0].password)){
        const returnedUser = rows[0]
        delete returnedUser.password
        return returnedUser
    }
    return null
}

module.exports = {getOTP, verifyOTP, checkIfUserExists, registerUser, verifyPassword}