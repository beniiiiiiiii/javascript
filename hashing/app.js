import express from "express";
import cors from "cors";
import postsRoutes from "./routes/postRoute.js";
import usersRoutes from "./routes/userRoute.js";

const PORT = 3000;
const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "pages", "index.html"));
});

const loginRouter = require("./routes/login");
const postsRouter = require("./routes/posts");

app.use("/posts", postsRoutes);
app.use("/users", usersRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
