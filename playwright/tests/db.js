const mysql = require('mysql2/promise');

// Mirrors the backend's own connection settings (see application.properties):
// same host/port/database/user, same MYSQL_PASSWORD env var with the same
// 'password' fallback, so this connects exactly the way the app itself does.
function getConnection() {
  return mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: process.env.MYSQL_PASSWORD || 'password',
    database: 'task_tracker',
  });
}

module.exports = { getConnection };
