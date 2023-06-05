var mysql = require("mysql");

var connection = mysql.createConnection({
    host: 'localhost',
    database: 'student',
    user: 'root',
    password: 'Jashwa@007',
    port : 3306
});

module.exports = connection;