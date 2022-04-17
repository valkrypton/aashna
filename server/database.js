const mysql = require('mysql2/promise')

async function connectdb() {
    return mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: process.env.db_pass,
        database: 'aashna'
    })

}

module.exports = connectdb