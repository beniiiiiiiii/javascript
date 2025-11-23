import sqlite3 from "sqlite3";
import { open } from "sqlite";

export async function initDB() {
  const db = await open({
    filename: "./watchlist.db",
    driver: sqlite3.Database,
  });

  // USERS tábla
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL
    );
  `);

  // MOVIES tábla user_id oszloppal
  await db.exec(`
    CREATE TABLE IF NOT EXISTS movies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      year INTEGER NOT NULL,
      genre TEXT NOT NULL,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  // WATCHLIST tábla
  await db.exec(`
    CREATE TABLE IF NOT EXISTS watchlist (
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      movie_id INTEGER REFERENCES movies(id) ON DELETE CASCADE,
      PRIMARY KEY (user_id, movie_id)
    );
  `);

  return db;
}
