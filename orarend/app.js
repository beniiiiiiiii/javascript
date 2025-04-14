import express from "express";
import cors from "cors";
import path from "path";
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

app.get("/add-class", (req, res) => {
  res.sendFile("./public/htmls/add-class.html", { root: __dirname });
});

app.get("/edit-class/:id", async (req, res) => {
  const classId = req.params.id;
  const _class = await dbGet("SELECT * FROM classes WHERE id = ?", [classId]);

  if (!_class) {
    return res.status(404).json({ message: "Class not found" });
  }

  res.sendFile("./public/htmls/edit-class.html", { root: __dirname });
});

app.get("/classes", async (req, res) => {
  const classes = await dbAll("SELECT * FROM classes");
  res.status(200).json(classes);
});

app.get("/classes/:id", async (req, res) => {
  const _class = await dbGet("SELECT * FROM classes WHERE id = ?;", [
    req.params.id,
  ]);

  if (!_class) {
    return res.status(400).json({ message: "Class not found" });
  }

  res.status(200).json(_class);
});

app.post("/classes", async (req, res) => {
  const { day, period, class_name, teacher, room } = req.body;

  if (!day || !period || !class_name || !teacher || !room) {
    return res.status(400).json({ message: "Missing data!" });
  }

  try {
    const existing = await dbGet(
      "SELECT * FROM classes WHERE day = ? AND period = ?",
      [day, period]
    );
    if (existing) {
      return res
        .status(409)
        .json({ message: "Class already exists for this slot" });
    }

    const result = await dbRun(
      `INSERT INTO classes (day, period, class_name, teacher, room) VALUES (?, ?, ?, ?, ?);`,
      [day, period, class_name, teacher, room]
    );
    res
      .status(201)
      .json({ id: result.lastID, day, period, class_name, teacher, room });
  } catch (err) {
    console.error("Error inserting class:", err);
    res
      .status(500)
      .json({ message: "Error inserting class", error: err.message });
  }
});

app.put("/classes/:id", async (req, res) => {
  const id = req.params.id;
  const _class = await dbGet("SELECT * FROM classes WHERE id = ?;", [id]);

  if (!_class) {
    return res.status(404).json({ message: "Class not found" });
  }

  const { day, period, class_name, teacher, room } = req.body;

  if (
    day == null ||
    period == null ||
    class_name == null ||
    teacher == null ||
    room == null
  ) {
    return res.status(400).json({ message: "Missing data!" });
  }

  await dbRun(
    "UPDATE classes SET day = ?, period = ?, class_name = ?, teacher = ?, room = ? WHERE id = ?",
    [day, period, class_name, teacher, room, id]
  );

  res.status(200).json({
    message: "Class updated successfully",
    id,
    day,
    period,
    class_name,
    teacher,
    room,
  });
});

app.delete("/classes/:id", async (req, res) => {
  const id = req.params.id;
  const _class = await dbGet("SELECT * FROM classes WHERE id = ?;", [id]);

  if (!_class) {
    return res.status(404).json({ message: "Class not found" });
  }

  dbRun("DELETE FROM classes WHERE id = ?", [id]);
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