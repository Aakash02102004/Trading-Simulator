// backend/config/db.js
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./users.db', (err) => {
  if (err) console.error("Error opening database:", err);
  else {
    console.log("Connected to SQLite database.");
    db.run(
      `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
      );`
    );
    db.run(`
        CREATE TABLE IF NOT EXISTS watchlist (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT,
            symbol TEXT,
            FOREIGN KEY (user_id) REFERENCES users(email)
        )
    `);
    
      db.run(`CREATE TABLE IF NOT EXISTS portfolio (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id TEXT,
          symbol TEXT,
          quantity INTEGER,
          price REAL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`);
      db.run(`CREATE TABLE IF NOT EXISTS wallet (
        userId TEXT PRIMARY KEY,
        walletBalance REAL DEFAULT 0.0 NOT NULL
    )`);
  
  }
});

module.exports = db;
