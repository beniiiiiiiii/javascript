import express from "express";
import path from "path";
import cors from "cors";
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
  res.sendFile("./public/index.html", { root: __dirname });
});

app.get("/blogs", async (req, res) => {
  const blogs = await dbAll("SELECT * FROM blogs");
  res.status(200).json(blogs);
});

