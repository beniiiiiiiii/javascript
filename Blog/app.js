import express from 'express';
import path from 'path';
import db from './util/database.js';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(process.cwd(), 'public'))); 

const getAuthorName = (id) => {
  const row = db.prepare('SELECT name FROM users WHERE id = ?').get(id);
  return row ? row.name : 'Unknown';
};

app.get('/api/posts', (req, res) => {
  const posts = db.prepare(`
    SELECT p.id, p.author_id, u.name as author, p.title, p.category, p.content, p.created_at, p.updated_at
    FROM posts p
    JOIN users u ON p.author_id = u.id
    ORDER BY datetime(p.updated_at) DESC
  `).all();
  res.json(posts);
});

app.get('/api/users', (req, res) => {
  try {
    const users = db.prepare('SELECT id, name FROM users').all(); 
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

app.post('/api/posts', (req, res) => {
  const { author_id, title, category, content } = req.body;
  if (!author_id || !title || !category || !content) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const now = new Date().toISOString();
  const stmt = db.prepare(`
    INSERT INTO posts (author_id, title, category, content, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  stmt.run(author_id, title, category, content, now, now);
  res.status(201).json({ message: 'Post created successfully' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});