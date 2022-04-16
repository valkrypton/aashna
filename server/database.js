const mysql = require('mysql2')

const database = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '&N3Bibbx43',
    database: 'aashna'
})
database.connect(err => {
    if (err)
        console.log(err.message)
    else
        console.log('database connected')
})
module.exports = database