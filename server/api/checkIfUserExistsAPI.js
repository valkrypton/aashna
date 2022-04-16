const checkIfUserExistsAPI = (db, req, res) => {
    const email = req.query.id
    let userExists = false
    db.promise().query('SELECT email FROM user where email = ?', [email])
        .then((output) => {
            const [results, fields] = output
            if (results.length === 0) {
                userExists = false
            } else {
                userExists = true
            }
        })
        .catch(err => console.log(err.message))
    return userExists
}

module.exports = {checkIfUserExistsAPI}