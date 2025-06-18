import { useCallback, useRef, useEffect } from "react";
import { useGame } from "../context/GameContext";

/**
 * Backtracking Algorithm Hook
 *
 * This custom React hook implements the backtracking algorithm for maze solving.
 *
 * It provides functionality to start, pause, and reset the algorithm execution,
 * while managing the visual representation of the algorithm's progress through
 * the maze.
 *
 * The hook handles the recursive backtracking logic, path tracking,
 * and UI state updates.
 */

export const useBacktracking = () => {
  const { state, dispatch } = useGame();
  const algorithmTimeoutReference = useRef(null);
  const isAlgorithmExecutingReference = useRef(false);

  // Movement directions for maze exploration
  const movementDirections = [
    { row: -1, col: 0 }, // Up
    { row: 1, col: 0 }, // Down
    { row: 0, col: -1 }, // Left
    { row: 0, col: 1 }, // Right
  ];

  useEffect(() => {
    return () => {
      if (algorithmTimeoutReference.current) {
        clearTimeout(algorithmTimeoutReference.current);
        algorithmTimeoutReference.current = null;
      }
      isAlgorithmExecutingReference.current = false;
    };
  }, []);

  /**
   * Validates if a move to a specific cell is legal
   *
   * Checks if the target position is within maze boundaries, not a wall,
   * and hasn't been visited yet during the current algorithm execution.
   */
  const isMovementValid = useCallback(
    (targetRow, targetColumn, mazeMatrix, visitedCells) => {
      return (
        targetRow >= 0 &&
        targetRow < mazeMatrix.length &&
        targetColumn >= 0 &&
        targetColumn < mazeMatrix[0].length &&
        mazeMatrix[targetRow][targetColumn] !== "#" &&
        !visitedCells.has(`${targetRow}-${targetColumn}`)
      );
    },
    []
  );

  // Creates a delay for algorithm visualization
  const createVisualizationDelay = useCallback((ms) => {
    return new Promise((resolveDelay) => {
      algorithmTimeoutReference.current = setTimeout(resolveDelay, ms);
    });
  }, []);

  /**
   * Executes the recursive backtracking algorithm
   *
   * Implements the core backtracking logic to find a path through the maze.
   * The function explores all possible paths from the current position,
   * backtracks when dead ends are reached, and updates the UI to show
   * the algorithm's progress in real-time.
   */
  const executeBacktrackingAlgorithm = useCallback(
    async (currentRow, currentCol, mazeMatrix, visitedCells, currentPath) => {
      if (!isAlgorithmExecutingReference.current) {
        return false;
      }

      try {
        // Mark current cell as visited
        visitedCells.add(`${currentRow}-${currentCol}`);
        currentPath.push({ row: currentRow, col: currentCol });

        // Update UI
        dispatch({
          type: "UPDATE_PLAYER_POSITION",
          payload: { row: currentRow, col: currentCol },
        });

        dispatch({
          type: "ADD_VISITED_CELL",
          payload: { row: currentRow, col: currentCol },
        });

        dispatch({ type: "UPDATE_CURRENT_PATH", payload: [...currentPath] });

        // Wait for animation
        await createVisualizationDelay(state.speed);

        if (!isAlgorithmExecutingReference.current) {
          return false;
        }

        // Checks if the bot reached the maze Exit point
        if (mazeMatrix[currentRow][currentCol] === "E") {
          dispatch({ type: "SET_SOLUTION_PATH", payload: [...currentPath] });
          dispatch({ type: "SET_GAME_STATUS", payload: "completed" });
          return true;
        }

        // Try all directions
        for (const direction of movementDirections) {
          if (!isAlgorithmExecutingReference.current) return false;

          const nextRow = currentRow + direction.row;
          const nextCol = currentCol + direction.col;

          if (isMovementValid(nextRow, nextCol, mazeMatrix, visitedCells)) {
            const pathFoundSuccessfully = await executeBacktrackingAlgorithm(
              nextRow,
              nextCol,
              mazeMatrix,
              visitedCells,
              currentPath
            );
            if (pathFoundSuccessfully) return true;
          }
        }

        // Backtrack: remove current cell from path
        currentPath.pop();
        dispatch({ type: "UPDATE_CURRENT_PATH", payload: [...currentPath] });

        // Visual feedback for backtracking
        if (currentPath.length > 0) {
          const previousCellInPath = currentPath[currentPath.length - 1];
          dispatch({
            type: "UPDATE_PLAYER_POSITION",
            payload: previousCellInPath,
          });

          if (isAlgorithmExecutingReference.current) {
            await createVisualizationDelay(state.speed);
          }
        }

        return false;
      } catch (error) {
        console.error("Error in backtracking algorithm:", error);
        dispatch({ type: "SET_GAME_STATUS", payload: "error" });
        return false;
      }
    },
    [
      state.speed,
      movementDirections,
      isMovementValid,
      createVisualizationDelay,
      dispatch,
    ]
  );

  // Initiates the backtracking algorithm execution
  const initiateAlgorithmExecution = useCallback(async () => {
    if (!state.currentMap || state.isAlgorithmRunning || !state.startPosition) {
      console.warn("Cannot start algorithm: invalid state");
      return;
    }

    if (algorithmTimeoutReference.current) {
      clearTimeout(algorithmTimeoutReference.current);
      algorithmTimeoutReference.current = null;
    }

    isAlgorithmExecutingReference.current = true;
    dispatch({ type: "SET_ALGORITHM_RUNNING", payload: true });
    dispatch({ type: "SET_GAME_STATUS", payload: "running" });

    try {
      const visitedCells = new Set();
      const algorithmPathArray = [];

      const solutionFoundSuccessfully = await executeBacktrackingAlgorithm(
        state.startPosition.row,
        state.startPosition.col,
        state.currentMap,
        visitedCells,
        algorithmPathArray
      );

      if (isAlgorithmExecutingReference.current) {
        if (!solutionFoundSuccessfully) {
          dispatch({ type: "SET_GAME_STATUS", payload: "no-solution" });
        }
      }
    } catch (error) {
      console.error("Error starting algorithm:", error);
      dispatch({ type: "SET_GAME_STATUS", payload: "error" });
    } finally {
      isAlgorithmExecutingReference.current = false;
      dispatch({ type: "SET_ALGORITHM_RUNNING", payload: false });
    }
  }, [
    state.currentMap,
    state.startPosition,
    state.isAlgorithmRunning,
    executeBacktrackingAlgorithm,
    dispatch,
  ]);

  // Pauses the currently running algorithm
  const pauseAlgorithmExecution = useCallback(() => {
    isAlgorithmExecutingReference.current = false;

    if (algorithmTimeoutReference.current) {
      clearTimeout(algorithmTimeoutReference.current);
      algorithmTimeoutReference.current = null;
    }

    dispatch({ type: "SET_ALGORITHM_RUNNING", payload: false });
    dispatch({ type: "SET_GAME_STATUS", payload: "paused" });
  }, [dispatch]);

  // Resets the algorithm to its initial state
  const resetAlgorithmToInitialState = useCallback(() => {
    isAlgorithmExecutingReference.current = false;

    if (algorithmTimeoutReference.current) {
      clearTimeout(algorithmTimeoutReference.current);
      algorithmTimeoutReference.current = null;
    }

    dispatch({ type: "RESET_GAME" });
  }, [dispatch]);

  return {
    startAlgorithm: initiateAlgorithmExecution,
    pauseAlgorithm: pauseAlgorithmExecution,
    resetAlgorithm: resetAlgorithmToInitialState,
    isRunning: state.isAlgorithmRunning,
  };
};
