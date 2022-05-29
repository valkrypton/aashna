const bcrypt = require("bcrypt");

const checkPassword = async (db, pass, id) => {
    try {
        console.log(id)
        const [rows, fields] = await db.execute('SELECT password FROM user WHERE user_id = ?', [id])
        return await bcrypt.compare(pass, rows[0].password)
    } catch (err) {
        console.log(err)
        return false
    }
}
const changePassword = async (db, req) => {
    try {
        await db.execute('UPDATE user SET password = ? WHERE user_id = ?',
            [await bcrypt.hash(req.body.newPass, 5), req.body.user_id])
    } catch (err) {
        throw err
    }

}
const changeData = async (db, req) => {
    try {
        await db.execute('UPDATE user SET fname = ?, lname = ?, bio = ?, dob = ?, school = ?, batch = ?, gender = ?,' +
            'gender_preference = ?, img_url = ? WHERE user_id = ?',
            [req.body.fname, req.body.lname, req.body.bio, req.body.dob, req.body.school,
                req.body.batch, req.body.gender, req.body.gender_preference,
                req.body.img_url, req.body.id])
        await db.execute('DELETE FROM user_interests WHERE user_id = ?', [req.body.id])
        req.body.interest = req.body.interest.split(",")
        for (let i = 0; i < req.body.interest.length; ++i) {
            await db.execute('INSERT INTO user_interests VALUE(?,?)', [req.body.id, req.body.interest[i]])
        }
    } catch (err) {
        throw err
    }
}
const deleteUser = async (db, id) => {
    try {
        db.execute('DELETE FROM user WHERE user_id = ?', [id])
    } catch (err) {
        throw err
    }
}
module.exports = {checkPassword, changePassword, changeData, deleteUser}