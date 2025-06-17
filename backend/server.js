const express = require("express");
const cors = require("cors");
const { OpenAI } = require("openai");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.get("/", (req, res) => {
  res.send("Maze AI Backend is running!");
});

// Main route for AI maze generation
app.post("/generate-maze", async (req, res) => {
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
      return res.status(400).json({
        error:
          "Invalid paremeters. Size must be between 5x5 and 30x30, exits between 1 and 5.",
      });
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
- Não gere solução trivial (caminho direto)
- Entre 50% e 70% do labirinto deve ser paredes

Retorne APENAS o objeto JSON no formato:
{
  "maze": [
    ["#", "#", "#", ...],
    ["#", "S", ".", ...],
    ...
  ]
}`;

    console.log("Sending prompt to AI...");

    // Request to OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 2000,
      temperature: 0.8,
    });

    console.log("AI's response:", completion.choices[0].message.content);

    let mazeResponse = completion.choices[0].message.content;

    let cleanResponse = mazeResponse
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const parsedResponse = JSON.parse(cleanResponse);

    let maze;
    if (
      parsedResponse &&
      parsedResponse.maze &&
      Array.isArray(parsedResponse.maze)
    ) {
      maze = parsedResponse.maze;
    } else if (Array.isArray(parsedResponse)) {
      maze = parsedResponse;
    } else {
      throw new Error("Invalid response format");
    }

    const hasStart = maze.flat().includes("S");
    const exitCount = maze.flat().filter((cell) => cell === "E").length;

    if (!hasStart) {
      throw new Error("Maze does not contain Start point ('S')");
    }

    if (exitCount !== exits) {
      throw new Error(
        `Maze must have exactly ${exits} exits, but it has ${exitCount}`
      );
    }

    res.json({
      message: maze,
      status: "Maze generated with success",
    });
  } catch (error) {
    console.log("Error generating maze:", error);

    if (error.message.includes("API key")) {
      return res.status(500).json({
        error: "API configuration error",
      });
    }

    if (error.name === "SyntaxError") {
      return res.status(500).json({
        error: "Error processing AI response",
      });
    }

    res.status(500).json({
      error: "Internal server error when generating maze",
      details: error.message,
    });
  }
});

app.listen(port, () => {
  console.log(`Backend listening at http://localhost:${port}`);
});
