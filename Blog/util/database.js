const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.resolve(__dirname, 'blog.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    author_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY(author_id) REFERENCES users(id)
  );
`);

const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get().count;

if (userCount === 0) {
  const insertUser = db.prepare('INSERT INTO users (name) VALUES (?)');
  const userIds = [];
  userIds.push(insertUser.run('Anna Kovács').lastInsertRowid);
  userIds.push(insertUser.run('Béla Nagy').lastInsertRowid);
  userIds.push(insertUser.run('Csilla Tóth').lastInsertRowid);

  const insertPost = db.prepare(`
    INSERT INTO posts (author_id, title, category, content, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const now = new Date();

  userIds.forEach((userId, index) => {
    for (let i = 1; i <= 2; i++) {
      const createdAt = new Date(now.getTime() - (index * 5 + i) * 24 * 60 * 60 * 1000);
      const updatedAt = new Date(createdAt.getTime() + 2 * 60 * 60 * 1000); 

      insertPost.run(
        userId,
        `Blogbejegyzés ${i} - ${index + 1}. felhasználó`,
        ['Tech', 'Utazás', 'Gasztronómia'][index % 3],
        `Ez a(z) ${i}. bejegyzés tartalma a(z) ${index + 1}. felhasználótól.`,
        createdAt.toISOString(),
        updatedAt.toISOString()
      );
    }
  });
}

module.exports = db;

