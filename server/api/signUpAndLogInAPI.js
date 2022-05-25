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
            console.log(info)
        }
    })
}
const verifyOTP = (req, res) => {
    if (String(verificationCodeMap.get(req.query.id)) === String(req.query.code)) {
        verificationCodeMap.delete(req.query.id);
        res.send({validOTP: true});
        //do something here
    } else {
        res.send({validOTP: false});
    }
}
const checkIfUserExists = async (db, email) => {
    const [rows, fields] = await db.execute('SELECT user_id, email FROM user where email = ?', [email])
    return rows.length !== 0
}

const registerUser = async (db, req, res) => {
    try {
        await db.execute('INSERT INTO user VALUES(null,?,?,?,?,?,?,?,?,?,?,?)',
            [req.body.email, await bcrypt.hash(req.body.password, 5), req.body.first_name, req.body.last_name,
                req.body.bio, req.body.DOB, req.body.school, req.body.batch, Number(req.body.gender),
                Number(req.body.genderpreference), req.file.path])

        const [rows, fields] = await db.execute('SELECT user_id FROM user where email=? ', [req.body.email])
        for (let i = 0; i < req.body.interests.length; ++i)
            await db.execute('INSERT INTO user_interests values(?,?)', [Number(rows[0].user_id), req.body.interests[i]])
        return true;
    } catch (err) {
        console.log(err)
        return false;
    }
}

const verifyPassword = async (db, req, res) => {
    const [rows, fields] = await db.execute('SELECT * FROM user WHERE email = ?', [req.body.email])
    if (await bcrypt.compare(req.body.password, rows[0].password)) {
        const returnedUser = rows[0]
        delete returnedUser.password
        return returnedUser
    }
    return null
}

module.exports = {getOTP, verifyOTP, checkIfUserExists, registerUser, verifyPassword}