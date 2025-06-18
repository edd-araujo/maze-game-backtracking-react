/**
 * AI Service Module
 *
 * This module provides services for generating and validating maze structures
 * using an external AI backend. It handles maze generation requests, parses
 * AI responses, and validates maze content to ensure proper game functionality.
 */

const BACKEND_URL_SERVER = import.meta.env.VITE_API_URL || "";

export class AIMazeGenerationService {
  /**
   * Generates a new maze using AI backend service
   *
   * Sends a request to the AI backend with specified dimensions and exit count,
   * then processes the response to return a valid maze structure.
   */
  static async requestMazeGenerationFromAI(
    numberOfRows,
    numberOfColumns,
    numberOfExits
  ) {
    try {
      const backendResponse = await fetch(
        `${BACKEND_URL_SERVER}/generate-maze`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            rows: numberOfRows,
            cols: numberOfColumns,
            exits: numberOfExits,
          }),
        }
      );

      if (!backendResponse.ok) {
        throw new Error("Failed to generate maze using AI service");
      }

      const responseData = await backendResponse.json();

      return this.parseAIResponseToMazeMatrix(
        responseData.maze,
        numberOfRows,
        numberOfColumns
      );
    } catch (error) {
      console.error("Error generating maze with AI:", error);
      throw error;
    }
  }

  /**
   * Converts AI-generated response into a valid maze matrix
   *
   * Handles both string and object responses from AI, parses various formats,
   * and validates the resulting maze dimensions match expectations.
   */
  static parseAIResponseToMazeMatrix(
    aiGeneratedResponse,
    expectedRowCount,
    expectedColumnCount
  ) {
    try {
      let parsedMazeMatrix;

      if (
        typeof aiGeneratedResponse === "object" &&
        aiGeneratedResponse !== null
      ) {
        if (Array.isArray(aiGeneratedResponse)) {
          parsedMazeMatrix = aiGeneratedResponse;
        } else if (Array.isArray(aiGeneratedResponse.maze)) {
          parsedMazeMatrix = aiGeneratedResponse.maze;
        } else {
          throw new Error("Formato inesperado de resposta da IA (objeto).");
        }
      } else if (typeof aiGeneratedResponse === "string") {
        // Remove markdown formatting and extra whitespace
        const cleanedAIResponse = aiGeneratedResponse
          .replace(/```(json|javascript)?/g, "")
          .replace(/'/g, '"') // Replace single quotes with double quotes
          .replace(/(\r\n|\n|\r)/gm, "") // Remove line breaks
          .trim(); // Remove white spaces

        console.log("Sanitized AI response text:", cleanedAIResponse);

        // Handle double-encoded JSON strings
        if (
          cleanedAIResponse.startsWith('"') &&
          cleanedAIResponse.endsWith('"')
        ) {
          const innerJsonString = JSON.parse(cleanedAIResponse);
          parsedMazeMatrix = JSON.parse(innerJsonString);
        } else {
          parsedMazeMatrix = JSON.parse(cleanedAIResponse);
        }

        if (parsedMazeMatrix && Array.isArray(parsedMazeMatrix.maze)) {
          parsedMazeMatrix = parsedMazeMatrix.maze;
        }
      } else {
        throw new Error(
          "Resposta da IA em formato inesperado (não é string nem objeto)."
        );
      }

      if (expectedRowCount && expectedColumnCount) {
        // Validate maze has correct number of rows
        if (
          !Array.isArray(parsedMazeMatrix) ||
          parsedMazeMatrix.length !== expectedRowCount
        ) {
          console.warn(
            `Maze row count mismatch: expected ${expectedRowCount} rows, received ${parsedMazeMatrix.length}`
          );
        }

        // Validate each row has correct number of columns
        for (let rowIndex = 0; rowIndex < parsedMazeMatrix.length; rowIndex++) {
          const currentRow = parsedMazeMatrix[rowIndex];
          if (
            !Array.isArray(currentRow) ||
            currentRow.length !== expectedColumnCount
          ) {
            console.warn(
              `Maze column count mismatch: expected ${expectedColumnCount} columns in row ${rowIndex}, received ${currentRow.length}`
            );
          }
        }
      }

      if (!Array.isArray(parsedMazeMatrix) || parsedMazeMatrix.length === 0) {
        throw new Error("Maze matrix inválida ou vazia.");
      }

      this.validateMazeContentAndStructure(parsedMazeMatrix);
      return parsedMazeMatrix;
    } catch (parsingError) {
      console.error("Error converting response to maze matrix:", parsingError);
      throw new Error("Failed to parse generated maze. Please try again.");
    }
  }

  /**
   * Validates maze content for game requirements
   *
   * Ensures the maze has exactly one Start and Exit point,
   * and only contains valid cell types for proper game functionality.
   */
  static validateMazeContentAndStructure(mazeMatrix) {
    let startPositionCount = 0;
    let exitPositionCount = 0;

    // Count start and exit positions, validate cell types
    for (let currentRow of mazeMatrix) {
      if (!Array.isArray(currentRow)) {
        throw new Error("Invalid maze row: not an array");
      }

      for (let currentCell of currentRow) {
        if (currentCell === "S") startPositionCount++;
        if (currentCell === "E") exitPositionCount++;

        // Validate cell contains only allowed characters
        if (!["S", "E", "#", "."].includes(currentCell)) {
          throw new Error(`Invalid cell value: ${currentCell}`);
        }
      }
    }

    // Checks if there's exactly one Start position
    if (startPositionCount !== 1) {
      throw new Error(
        `Maze must have exactly 1 start position, found ${startPositionCount}`
      );
    }

    // Checks if there's at least one Exit position
    if (exitPositionCount === 0) {
      throw new Error("Maze must have at least 1 exit position");
    }
  }
}
