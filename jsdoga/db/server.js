/*
books
get all /books
get by id /books/:id
post /books

book = {title, autor, year}


*/

import express from "express";

const app = express();
const PORT = 3000;
app.use(express.json());

let nextId = 1;
const books = [
  { id: nextId++, title: "test", autor: "valaki", year: 2025 },
];

app.get("/books", (req, res) => {
  res.json(books);
});

app.get("/books/:id", (req, res) => {
  const id = Number(req.params.id);
  const book = books.find((b) => b.id === id);
  if (!book) return res.status(404).json({ error: "Book not found" });
  res.json(book);
});

app.post("/books", (req, res) => {
  const { title, autor, year } = req.body;
  if (!title || !autor || !year) {
    return res.status(400).json({ error: "Missing title, autor or year" });
  }
  const book = { id: nextId++, title, autor, year };
  books.push(book);
  res.status(201).json(book);
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
