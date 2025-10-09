import db from "./database.js";

db.prepare(
  `CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER,
    title TEXT,
    content TEXT,
    FOREIGN KEY (userId) REFERENCES users(id)
    )`
).run();

export const getPosts = () => db.prepare("SELECT * FROM posts").all();
export const getPostById = (id) =>
  db.prepare("SELECT * FROM posts WHERE id = ?").run(id);
