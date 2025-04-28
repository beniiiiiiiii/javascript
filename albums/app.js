import express from "express";
import path from "path";
import cors from "cors"
import { fileURLToPath } from "url";
import { dbAll, initializeDatabase, dbGet, dbRun } from "./util/database.js";

const port = 3000;
const app = express();
app.use(express.json());
app.use(cors());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile("./public/htmls/index.html", { root: __dirname });
});

app.get("/albums", async (req, res) => {
  const albums = await dbAll("SELECT * FROM albums");
  res.status(200).json(albums);
});

app.get("/albums/:id", async (req, res) => {
  const album = await dbGet("SELECT * FROM albums WHERE id = ?;", [
    req.params.id,
  ]);

  if (!album) {
    return res.status(400).json({ message: "Album not found" });
  }

  res.status(200).json(album);
});

app.post("/albums", async (req, res) => {
  const { singer, title, release_year, song_amount } = req.body;

  if ((!singer || !title || !release_year || !song_amount)) {
    return res.status(400).json({ message: "Missing data!" });
  }

  try {
    const existing = await dbGet(
      "SELECT * FROM albums WHERE singer = ? AND title = ? AND release_year = ? AND song_amount = ?",
      [singer, title, release_year, song_amount]
    );
    if (existing) {
      return res
        .status(409)
        .json({ message: "Album already exists" });
    }

    const result = await dbRun(
      `INSERT INTO albums (singer, title, release_year, song_amount) VALUES (?, ?, ?, ?);`,
      [singer, title, release_year, song_amount]
    );
    res
      .status(201)
      .json({ id: result.lastID, singer, title, release_year, song_amount });
  } catch (err) {
    console.error("Error inserting album:", err);
    res
      .status(500)
      .json({ message: "Error inserting album", error: err.message });
  }
});

app.put("/albums/:id", async (req, res) => {
  const id = req.params.id;
  const album = await dbGet("SELECT * FROM albums WHERE id = ?;", [id]);

  if (!album) {
    return res.status(404).json({ message: "Album not found" });
  }

  const { singer, title, release_year, song_amount } = req.body;

  if (
    singer == null ||
    title == null ||
    release_year == null ||
    song_amount == null
  ) {
    return res.status(400).json({ message: "Missing data!" });
  }

  await dbRun(
    "UPDATE albums SET singer = ?, title = ?, release_year = ?, song_amount = ? WHERE id = ?",
    [singer, title, release_year, song_amount, id]
  );

  res.status(200).json({
    message: "Album updated successfully",
    id,
    singer,
    title,
    release_year,
    song_amount,
  });
});

app.delete("/albums/:id", async (req, res) => {
  const id = req.params.id;
  const album = await dbGet("SELECT * FROM albums WHERE id = ?;", [id]);

  if (!album) {
    return res.status(404).json({ message: "Class not found" });
  }

  dbRun("DELETE FROM albums WHERE id = ?", [id]);
  res.status(200).json({ message: "Delete successful" });
});

async function startServer() {
  await initializeDatabase();
  app.listen(3000, () => {
    console.log(`Server running on ${port}`);
  });
}

app.use((err, req, res, next) => {
  if (err) {
    res.status(500).json({ message: err });
  }
});

startServer();