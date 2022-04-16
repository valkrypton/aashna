const checkIfUserExistsAPI = (db, req, res) => {
    console.log('checking')
    const email = req.query.id
    db.promise().query('SELECT email FROM user where email = ?', [email])
        .then((output) => {
            const [results, fields] = output
            if (results.length === 0) {
                res.json({userExists: false})
            } else {
                res.json({userExists: true})
            }
        })
        .catch(err => console.log(err.message))
}

module.exports = {checkIfUserExistsAPI}