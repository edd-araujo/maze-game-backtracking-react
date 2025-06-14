import { useCallback, useRef } from "react";
import { useGame } from "../context/GameContext";

export const useBacktracking = () => {
  const { state, dispatch } = useGame();
  const timeoutRef = useRef(null);
  const isRunningRef = useRef(false);

  const directions = [
    { row: -1, col: 0 }, // Up
    { row: 1, col: 0 }, // Down
    { row: 0, col: -1 }, // Left
    { row: 0, col: 1 }, // Right
  ];

  const isValidMove = useCallback((row, col, map, visited) => {
    return (
      row >= 0 &&
      row < map.length &&
      col >= 0 &&
      col < map[0].length &&
      map[row][col] !== "#" &&
      !visited.has(`${row}-${col}`)
    );
  }, []);

  const sleep = useCallback((ms) => {
    return new Promise((resolve) => {
      timeoutRef.current = setTimeout(resolve, ms);
    });
  }, []);

  const backtrackSolve = useCallback(
    async (
      currentRow,
      currentCol,
      targetRow,
      targetCol,
      map,
      visited,
      path
    ) => {
      if (!isRunningRef.current) return false;

      // Mark current cell as visited
      visited.add(`${currentRow}-${currentCol}`);
      path.push({ row: currentRow, col: currentCol });

      // Update UI
      dispatch({
        type: "UPDATE_PLAYER_POSITION",
        payload: { row: currentRow, col: currentCol },
      });
      dispatch({
        type: "ADD_VISITED_CELL",
        payload: { row: currentRow, col: currentCol },
      });
      dispatch({ type: "UPDATE_CURRENT_PATH", payload: [...path] });

      // Wait for animation
      await sleep(state.speed);

      // Check if reachead the target
      if (currentRow === targetRow && currentCol === targetCol) {
        dispatch({ type: "SET_SOLUTION_PATH", payload: [...path] });
        dispatch({ type: "SET_GAME_STATUS", payload: "completed" });
        return true;
      }

      // Try all directions
      for (const direction of directions) {
        if (!isRunningRef.current) return false;

        const newRow = currentRow + direction.row;
        const newCol = currentCol + direction.col;

        if (isValidMove(newRow, newCol, map, visited)) {
          const found = await backtrackSolve(
            newRow,
            newCol,
            targetRow,
            targetCol,
            map,
            visited,
            path
          );
          if (found) return true;
        }
      }

      // Backtrack: remove current cell from path
      path.pop();
      dispatch({ type: "UPDATE_CURRENT_PATH", payload: [...path] });

      // Visual feedback for backtracking
      if (path.length > 0) {
        const previousCell = path[path.length - 1];
        dispatch({ type: "UPDATE_PLAYER_POSITION", payload: previousCell });
        await sleep(state.speed);
      }

      return false;
    },
    [state.speed, directions, isValidMove, sleep, dispatch]
  );

  const startAlgorithm = useCallback(async () => {
    if (!state.currentMap || state.isAlgorithmRunning) return;

    isRunningRef.current = true;
    dispatch({ type: "SET_ALGORITHM_RUNNING", payload: true });
    dispatch({ type: "SET_GAME_STATUS", payload: "running" });

    const visited = new Set();
    const path = [];

    const success = await backtrackSolve(
      state.startPosition.row,
      state.startPosition.col,
      state.endPosition.row,
      state.endPosition.col,
      state.currentMap,
      visited,
      path
    );

    if (!success && isRunningRef.current) {
      dispatch({ type: "SET_GAME_STATUS", payload: "no-solution" });
    }

    isRunningRef.current = false;
    dispatch({ type: "SET_ALGORITHM_RUNNING", payload: false });
  }, [
    state.currentMap,
    state.startPosition,
    state.endPosition,
    state.isAlgorithmRunning,
    backtrackSolve,
    dispatch,
  ]);

  const pauseAlgorithm = useCallback(() => {
    isRunningRef.current = false;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    dispatch({ type: "SET_ALGORITHM_RUNNING", payload: false });
    dispatch({ type: "SET_GAME_STATUS", payload: "paused" });
  }, [dispatch]);

  const resetAlgorithm = useCallback(() => {
    isRunningRef.current = false;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    dispatch({ type: "RESET_GAME" });
  }, [dispatch]);

  return {
    startAlgorithm,
    pauseAlgorithm,
    resetAlgorithm,
    isRunning: state.isAlgorithmRunning,
  };
};
