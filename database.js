// database.js
const sqlite3 = require('sqlite3').verbose();

// Initialize the database (it will create a file if it doesn't exist)
const db = new sqlite3.Database('./users.db', (err) => {
  if (err) {
    console.error("Error opening database:", err);
  } else {
    console.log("Connected to the SQLite database.");
  }
});

// Create table if it doesn't exist
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT,
    token TEXT
  );
`);

module.exports = db;