const express = require("express");
const cors = require("cors");
const { OpenAI } = require("openai");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Maze validation function using BFS
function isMazeValid(maze) {
  const numRows = maze.length;
  const numCols = maze[0].length;
  let start = null;
  const exits = [];

  // Finds "S" and "E"
  for (let r = 0; r < numRows; r++) {
    for (let c = 0; c < numCols; c++) {
      if (maze[r][c] === "S") start = { r, c };
      if (maze[r][c] === "E") exits.push({ r, c });
    }
  }

  if (!start || exits.length === 0) return false;

  // BFS algorithm to find all cells accessible from "S"
  const visited = Array.from({ length: numRows }, () =>
    Array(numCols).fill(false)
  );

  const queue = [start];
  visited[start.r][start.c] = true;

  while (queue.length) {
    const { r, c } = queue.shift();
    for (const [dr, dc] of [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ]) {
      const nr = r + dr,
        nc = c + dc;
      if (
        nr >= 0 &&
        nr < numRows &&
        nc >= 0 &&
        nc < numCols &&
        !visited[nr][nc] &&
        (maze[nr][nc] === "." || maze[nr][nc] === "E")
      ) {
        visited[nr][nc] = true;
        queue.push({ r: nr, c: nc });
      }
    }
  }

  // Check if the Exit point is accessible from "S"
  for (const { r, c } of exits) {
    if (!visited[r][c]) return false;
  }
  return true;
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.get("/", (req, res) => {
  res.send("Maze AI Backend is running!");
});

// Main route for AI maze generation
app.post("/generate-maze", async (req, res) => {
  const MAX_ATTEMPTS = 3; // Try to generate a valid maze at least 3 times
  let attempt = 0;
  let lastError = null;

  while (attempt < MAX_ATTEMPTS) {
    attempt++;
    try {
      const { rows, cols, exits } = req.body;

      // Basic parameters validation
      if (
        !rows ||
        !cols ||
        !exits ||
        rows < 5 ||
        rows > 30 ||
        cols < 5 ||
        cols > 30 ||
        exits < 1 ||
        exits > 5
      ) {
        return res.status(400).json({ error: "Invalid parameters." });
      }

      const prompt = `Gere um labirinto de ${rows}x${cols} como uma matriz de arrays em formato JSON, usando:
- "S" para o início (exatamente 1)
- "E" para as saídas (exatamente ${exits})
- "#" para paredes
- "." para caminhos livres

REGRAS:
- "S" deve estar em uma das bordas
- Todas as saídas "E" devem estar nas bordas
- Todas as áreas acessíveis devem estar conectadas ao início
- Todas as saídas devem ser acessíveis a partir do início
- O labirinto deve ter pelo menos 8 becos sem saída
- Não gere solução trivial

Retorne APENAS o objeto JSON no formato:
{
  "maze": [
    ["#", "#", "#", ...],
    ["#", "S", ".", ...],
    ...
  ]
}`;

      console.log(`Attempt ${attempt} - Sending prompt to AI...`);

      // Request to OpenAI
      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 2000,
        temperature: 0.8,
      });

      let mazeResponse = completion.choices[0].message.content;
      let cleanResponse = mazeResponse
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      const parsed = JSON.parse(cleanResponse);
      let maze;
      if (parsed && parsed.maze && Array.isArray(parsed.maze)) {
        maze = parsed.maze;
      } else if (Array.isArray(parsed)) {
        maze = parsed;
      } else {
        throw new Error("Invalid response format");
      }

      const hasS = maze.flat().includes("S");
      const exitCount = maze.flat().filter((cell) => cell === "E").length;
      if (!hasS || exitCount !== exits) {
        throw new Error(
          "The generated maze does not contain a Start or End point."
        );
      }

      if (!isMazeValid(maze)) {
        throw new Error(
          "The generated maze does not connect the exit and the starting point."
        );
      }

      return res.json({ maze });
    } catch (error) {
      lastError = error;
      console.error(`Attempt ${attempt} failed:`, error.message);

      if (attempt >= MAX_ATTEMPTS) {
        return res.status(500).json({
          error: "Unable to generate a valid maze after many attempts.",
          details: lastError?.message || lastError,
        });
      }
    }
  }
});

app.listen(port, () => {
  console.log(`Backend listening at http://localhost:${port}`);
});
