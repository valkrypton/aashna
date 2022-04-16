const mysql = require('mysql2/promise')

async function connectdb() {
    return mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '&N3Bibbx43',
        database: 'aashna'
    })

}

module.exports = connectdb