import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { initDB } from "./db.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const SECRET = "supersecretjwt";
let db;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../client")));

// init DB
initDB().then((database) => {
  db = database;
  console.log("SQLite DB ready");
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/index.html"));
});

// ===== AUTH MIDDLEWARE =====
function requireAuth(req, res, next) {
  const auth = req.headers.authorization || "";
  if (!auth.startsWith("Bearer "))
    return res.status(401).json({ error: "Unauthorized" });
  try {
    const payload = jwt.verify(auth.slice(7), SECRET);
    req.userId = payload.userId;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}

// ===== REGISTER =====
app.post("/api/register", async (req, res) => {
  const { email, password } = req.body;
  const hash = await bcrypt.hash(password, 10);
  try {
    const result = await db.run(
      "INSERT INTO users (email, password_hash) VALUES (?, ?)",
      [email, hash]
    );
    const token = jwt.sign({ userId: result.lastID }, SECRET, {
      expiresIn: "7d",
    });
    res.json({ user: { id: result.lastID, email }, token });
  } catch {
    res.status(400).json({ error: "Email already registered" });
  }
});

// ===== LOGIN =====
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await db.get("SELECT * FROM users WHERE email=?", [email]);
  if (!user) return res.status(401).json({ error: "Invalid credentials" });
  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });
  const token = jwt.sign({ userId: user.id }, SECRET, { expiresIn: "7d" });
  res.json({ user: { id: user.id, email: user.email }, token });
});

// ===== MOVIES =====
// get movies (only current user's)
app.get("/api/movies", requireAuth, async (req, res) => {
  const rows = await db.all("SELECT * FROM movies WHERE user_id=?", [
    req.userId,
  ]);
  res.json(rows);
});

// add movie
app.post("/api/movies", requireAuth, async (req, res) => {
  const { title, year, genre } = req.body;
  if (!title || !year || !genre)
    return res.status(400).json({ error: "Missing fields" });
  const result = await db.run(
    "INSERT INTO movies (title, year, genre, user_id) VALUES (?, ?, ?, ?)",
    [title, year, genre, req.userId]
  );
  res.json({ id: result.lastID, title, year, genre });
});

// edit movie
app.put("/api/movies/:id", requireAuth, async (req, res) => {
  const { title, year, genre } = req.body;
  await db.run(
    "UPDATE movies SET title=?, year=?, genre=? WHERE id=? AND user_id=?",
    [title, year, genre, req.params.id, req.userId]
  );
  res.json({ ok: true });
});

// delete movie
app.delete("/api/movies/:id", requireAuth, async (req, res) => {
  await db.run("DELETE FROM movies WHERE id=? AND user_id=?", [
    req.params.id,
    req.userId,
  ]);
  res.json({ ok: true });
});

// ===== WATCHLIST =====
app.get("/api/watchlist", requireAuth, async (req, res) => {
  const rows = await db.all(
    `
    SELECT m.* FROM watchlist w
    JOIN movies m ON m.id = w.movie_id
    WHERE w.user_id=?`,
    [req.userId]
  );
  res.json(rows);
});

app.post("/api/watchlist", requireAuth, async (req, res) => {
  const { movie_id } = req.body;
  await db.run(
    "INSERT OR IGNORE INTO watchlist (user_id, movie_id) VALUES (?, ?)",
    [req.userId, movie_id]
  );
  res.json({ ok: true });
});

app.delete("/api/watchlist/:movieId", requireAuth, async (req, res) => {
  await db.run("DELETE FROM watchlist WHERE user_id=? AND movie_id=?", [
    req.userId,
    req.params.movieId,
  ]);
  res.json({ ok: true });
});

// ===== START SERVER =====
app.listen(4000, () => console.log("Server running on http://localhost:4000"));
