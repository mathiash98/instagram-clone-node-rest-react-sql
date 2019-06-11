const mysql = require('mysql2/promise');

// General dependencies
const config = require('./../config');
const port = process.env.PORT || config.port.development;

let pool;
// Connect to database
if (port == config.port.development) {
    // dev database
    pool = mysql.createPool({
        host: config.database.mariadb.host,
        user: config.database.mariadb.user,
        database: config.database.mariadb.database,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });
} else {
    // Live database
}
module.exports = pool;