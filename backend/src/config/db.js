const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "abc54321",
  database: "test",
  waitForConnections: true,
  connectionLimit: 10,
});

module.exports = pool;
