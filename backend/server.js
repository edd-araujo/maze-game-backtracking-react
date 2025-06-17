const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Maze AI Backend is running!");
});

app.post("/generate-maze", (req, res) => {
  res.json({
    message: "Maze generation route - in development",
    status: "success",
  });
});

app.listen(port, () => {
  console.log(`Backend listening at http://localhost:${port}`);
});
