const express = require("express");
const cors = require("cors");
const path = require("path");
const { OpenAI } = require("openai");
require("dotenv").config();

/**
 * Backend server for maze generation using AI
 *
 * This file implements an Express server that uses the OpenAI API
 * to generate valid mazes.
 *
 * The server validates the generated mazes and ensures that they are solvable.
 */

const expressApplication = express();
const serverPort = process.env.PORT || 3001;

expressApplication.use(cors());
expressApplication.use(express.json());

const openAiClient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Validates if the generated maze is valid and solvable
 *
 * Checks if the maze has:
 * - One Start point ("S")
 * - One Exit point ("E")
 * - Connectivity between Start and Exit using the BFS algorithm
 */
function validateMazeStructureAndConnectivity(mazeMatrix) {
  const totalRows = mazeMatrix.length;
  const totalColumns = mazeMatrix[0].length;
  let startPosition = null;
  const exitPositions = [];

  //Finds the starting and exit positions in the maze
  for (let currentRow = 0; currentRow < totalRows; currentRow++) {
    for (let currentColumn = 0; currentColumn < totalColumns; currentColumn++) {
      if (mazeMatrix[currentRow][currentColumn] === "S") {
        startPosition = { row: currentRow, column: currentColumn };
      }
      if (mazeMatrix[currentRow][currentColumn] === "E") {
        exitPositions.push({ row: currentRow, column: currentColumn });
      }
    }
  }

  // Checks if there is a Start point and at least one Exit point
  if (!startPosition || exitPositions.length === 0) {
    return false;
  }

  // Implements BFS algorithm to check connectivity
  const visitedCells = Array.from({ length: totalRows }, () =>
    Array(totalColumns).fill(false)
  );

  const cellsToExplore = [startPosition];
  visitedCells[startPosition.row][startPosition.column] = true;

  /**
   * Possible directions: up, down, left right
   * Order followed by the bot: up, down, left, right
   */
  const movementDirections = [
    [-1, 0], // Up
    [1, 0], // Down
    [0, -1], // Left
    [0, 1], // Right
  ];

  // Runs the BFS algorithm to mark all accessible cells from "S"
  while (cellsToExplore.length > 0) {
    const currentCell = cellsToExplore.shift();

    for (const [deltaRow, deltaColumn] of movementDirections) {
      const nextRow = currentCell.row + deltaRow;
      const nextColumn = currentCell.column + deltaColumn;

      // Checks if the next position is valid or not visited
      if (
        nextRow >= 0 &&
        nextRow < totalRows &&
        nextColumn >= 0 &&
        nextColumn < totalColumns &&
        !visitedCells[nextRow][nextColumn] &&
        (mazeMatrix[nextRow][nextColumn] === "." ||
          mazeMatrix[nextRow][nextColumn] === "E")
      ) {
        visitedCells[nextRow][nextColumn] = true;
        cellsToExplore.push({ row: nextRow, column: nextColumn });
      }
    }
  }

  // Checks if the Exit is accessible from the Start point
  for (const exitPosition of exitPositions) {
    if (!visitedCells[exitPosition.row][exitPosition.column]) {
      return false;
    }
  }

  return true;
}

// Generates a random integer within a range
function generateRandomInteger(minValue, maxValue) {
  return Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
}

// Cleans AI response for JSON parsing
function sanitizeAiResponse(rawAiResponse) {
  return rawAiResponse
    .replace(/'/g, '"') // Replace single quotes with double quotes
    .replace(/(\r\n|\n|\r)/gm, "") // Remove break lines
    .replace(/```(json)?/g, "") // Remove markdown code blocks
    .trim(); // Remove white spaces
}

// Extracts the maze matrix from the parsed AI response
function extractMazeMatrixFromResponse(parsedResponse) {
  if (
    parsedResponse &&
    typeof parsedResponse === "object" &&
    parsedResponse.maze &&
    Array.isArray(parsedResponse.maze)
  ) {
    return parsedResponse.maze;
  } else if (Array.isArray(parsedResponse)) {
    return parsedResponse;
  } else {
    throw new Error("The API response is not a valid array.");
  }
}

// Validates that the maze has the correct number of Start ("S") and Exit ("E") points
function validateStartAndExitPoints(mazeMatrix, expectedExitCount) {
  const flattenedMaze = mazeMatrix.flat();
  const hasStartPoint = flattenedMaze.includes("S");
  const actualExitCount = flattenedMaze.filter((cell) => cell === "E").length;

  return hasStartPoint && actualExitCount === expectedExitCount;
}

expressApplication.get("/", (request, response) => {
  response.send("Maze AI Backend is running!");
});

/**
 * Main route for maze generation using AI
 *
 * Generates valid mazes with multiple attempts, ensuring that:
 * - Have correct Start and Exit points
 * - Are solvable (Exit accessible from the start)
 * - Meet project requirements (dead ends, multiple paths)
 */
expressApplication.post("/generate-maze", async (request, response) => {
  const maxGenerationAttempts = 3;
  let currentAttempt = 0;
  let lastEncounteredError = null;

  // Maze configuration parameters
  const minMazeSize = 12;
  const maxMazeSize = 22;
  const numberOfExits = 1;
  const randomMazeSize = generateRandomInteger(minMazeSize, maxMazeSize);

  // Detailed prompt for AI to generate a maze that follows project requirements
  const aiPrompt = `
Gere um labirinto de ${randomMazeSize}x${randomMazeSize} como uma matriz de arrays em formato JSON, usando:
- "S" para o início (exatamente 1, OBRIGATÓRIO)
- "E" para as saídas (exatamente ${numberOfExits}, OBRIGATÓRIO)
- "#" para paredes
- "." para caminhos livres

REGRAS:
- "S" deve estar em uma das bordas (primeira ou última linha/coluna)
- Cada "E" deve estar em uma borda diferente de "S"
- Todas as áreas acessíveis (".") devem estar conectadas ao "S" ou a uma "E"
- Todas as saídas "E" devem ser acessíveis a partir do início "S" por caminhos livres (".")
- O labirinto deve ter pelo menos 8 becos sem saída (dead ends)
- Não gere solução trivial (não pode haver caminho direto do início para qualquer saída)
- O labirinto deve ter múltiplos pontos de decisão (caminhos alternativos)
- Entre 50% e 70% do labirinto deve ser paredes "#"
- NÃO pode haver áreas de caminho (".") completamente cercadas por paredes
- NÃO pode haver áreas isoladas

ANTES DE RESPONDER, FAÇA UM CHECKLIST:
- [ ] O JSON está correto e não está dentro de blocos de código
- [ ] Há exatamente 1 "S" e ${numberOfExits} "E"
- [ ] "S" e "E" estão nas bordas corretas
- [ ] Todas as "E" são alcançáveis a partir de "S" por caminhos livres (".")
- [ ] Há pelo menos 8 becos sem saída
- [ ] Não há áreas isoladas
- [ ] Não há texto extra, explicação ou markdown

SE NÃO CONSEGUIR GERAR O LABIRINTO CORRETAMENTE, TENTE NOVAMENTE ATÉ CONSEGUIR.

Retorne APENAS o objeto JSON válido, SEM EXPLICAÇÕES, SEM MARKDOWN, SEM TEXTO EXTRA, no formato:
{
  "maze": [
    ["#", "#", "#", ...],
    ["#", "S", ".", ...],
    ...
  ]
}
`;

  // Tries generate a vald maze
  while (currentAttempt < maxGenerationAttempts) {
    currentAttempt++;

    try {
      console.log(`Attempt ${currentAttempt} - Sending prompt to AI...`);

      const aiCompletion = await openAiClient.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: aiPrompt }],
        max_tokens: 2000,
        temperature: 0.8,
      });

      console.log("AI's response:", aiCompletion.choices[0].message.content);

      // Process and cleans the AI response
      const rawAiResponse = aiCompletion.choices[0].message.content;
      const sanitizedResponse = sanitizeAiResponse(rawAiResponse);

      // Convert the response to JSON and extract the maze matrix
      const parsedAiResponse = JSON.parse(sanitizedResponse);
      const generatedMazeMatrix =
        extractMazeMatrixFromResponse(parsedAiResponse);

      if (
        !validateStartAndExitPoints(generatedMazeMatrix, numberOfExits) ||
        !validateMazeStructureAndConnectivity(generatedMazeMatrix)
      ) {
        throw new Error(
          "The generated maze does not contain a Start or End point."
        );
      }

      return response.json({ maze: generatedMazeMatrix });
    } catch (error) {
      lastEncounteredError = error;
      console.log(`Attempt ${currentAttempt} failed:`, error);

      // If its the last attempt, return error
      if (currentAttempt >= maxGenerationAttempts) {
        return response.status(500).json({
          error: "Unable to generate a valid maze after many attempts.",
          details: lastEncounteredError?.message || lastEncounteredError,
        });
      }
      // Otherwise, try again
    }
  }
});

expressApplication.use(express.static(path.join(__dirname, "../dist")));

expressApplication.get("*", (request, response) => {
  response.sendFile(path.join(__dirname, "../dist/index.html"));
});

expressApplication.listen(serverPort, () => {
  console.log(`Backend listening at http://localhost:${serverPort}`);
});
