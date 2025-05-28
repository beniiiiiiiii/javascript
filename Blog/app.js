const express = require('express');
const path = require('path');
const db = require('./database');
const app = express();

const PORT = 3000;


app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

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
  const info = stmt.run(author_id, title, category, content, now, now);
  const newPost = db.prepare('SELECT * FROM posts WHERE id = ?').get(info.lastInsertRowid);
  newPost.author = getAuthorName(newPost.author_id);
  res.status(201).json(newPost);
});

app.put('/api/posts/:id', (req, res) => {
  const postId = req.params.id;
  const { author_id, title, category, content } = req.body;
  // Validate exists
  const post = db.prepare('SELECT * FROM posts WHERE id = ?').get(postId);
  if (!post) {
    return res.status(404).json({ error: 'Post not found' });
  }
  if (!author_id || !title || !category || !content) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const now = new Date().toISOString();
  const stmt = db.prepare(`
    UPDATE posts SET author_id = ?, title = ?, category = ?, content = ?, updated_at = ?
    WHERE id = ?
  `);
  stmt.run(author_id, title, category, content, now, postId);
  const updatedPost = db.prepare('SELECT * FROM posts WHERE id = ?').get(postId);
  updatedPost.author = getAuthorName(updatedPost.author_id);
  res.json(updatedPost);
});

app.delete('/api/posts/:id', (req, res) => {
  const postId = req.params.id;
  // Validate exists
  const post = db.prepare('SELECT * FROM posts WHERE id = ?').get(postId);
  if (!post) {
    return res.status(404).json({ error: 'Post not found' });
  }
  db.prepare('DELETE FROM posts WHERE id = ?').run(postId);
  res.json({ success: true });
});

app.get('/api/users', (req, res) => {
  const users = db.prepare('SELECT id, name FROM users').all();
  res.json(users);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

