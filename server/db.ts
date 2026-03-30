import sqlite3 from "sqlite3";
import path from "path";

const dbPath = path.resolve(process.cwd(), ".data", "roastery.db");
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Error opening database", err.message);
  } else {
    console.log("Connected to the file-based SQLite database.");
    db.serialize(() => {
      // Coffees Table with Migration Check
      db.run(
        `CREATE TABLE IF NOT EXISTS coffees (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          brand TEXT,
          origin TEXT,
          roast_level TEXT,
          price REAL,
          notes TEXT,
          image_url TEXT,
          roast_date TEXT,
          ai_description TEXT
        )`, (err) => {
          if (!err) {
            db.all("PRAGMA table_info(coffees)", (err, columns: any[]) => {
              if (columns) {
                const hasBrand = columns.some(c => c.name === "brand");
                const hasRoastDate = columns.some(c => c.name === "roast_date");
                if (!hasBrand) db.run("ALTER TABLE coffees ADD COLUMN brand TEXT");
                if (!hasRoastDate) db.run("ALTER TABLE coffees ADD COLUMN roast_date TEXT");
              }
            });
          }
        }
      );

      // Orders Table
      db.run(
        `CREATE TABLE IF NOT EXISTS orders (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          coffee_id INTEGER,
          quantity INTEGER,
          total_price REAL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY(coffee_id) REFERENCES coffees(id)
        )`
      );

      // Standardized Users Master Repository
      // I have removed the 'DROP TABLE' command now that the schema is aligned.
      // This ensures your registered identity persists across server restarts.
      db.run(
        `CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`
      );

      // Performance Indexing
      db.run("CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)");
      db.run("CREATE INDEX IF NOT EXISTS idx_coffees_id ON coffees(id)");
    });
  }
});

export default db;
