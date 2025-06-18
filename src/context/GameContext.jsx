import React, { createContext, useContext, useReducer } from "react";

/**
 * Game State Management Context
 *
 * This module provides centralized state management for the Backtracking Maze Explorer application.
 *
 *  It manages all game-related state including maze data,
 * player position, algorithm execution status, visualization settings, and
 * AI-generated mazes.
 */

const GameContext = createContext();

// Initial application state with default values
const initialState = {
  selectedMap: "gameMap1",
  currentMap: null,
  playerPosition: { row: 0, col: 0 },
  startPosition: { row: 0, col: 0 },
  endPosition: { row: 0, col: 0 },
  visitedCells: new Set(),
  solutionPath: [],
  currentPath: [],
  gameStatus: "idle",
  showSolution: false,
  showVisitedPath: false,
  speed: 500,
  isAlgorithmRunning: false,
  generatedMaps: {},
};

/**
 * Handles all game state transitions and updates
 *
 * Processes different action types to update the game state appropriately.
 * Each case handles a specific aspect of the game state, from maze initialization
 * to algorithm execution control and visualization toggles.
 */
const gameStateReducer = (currentState, dispatchedAction) => {
  switch (dispatchedAction.type) {
    case "SET_SELECTED_MAP":
      return { ...currentState, selectedMap: dispatchedAction.payload };

    case "ADD_GENERATED_MAP":
      return {
        ...currentState,
        generatedMaps: {
          ...currentState.generatedMaps,
          [dispatchedAction.payload.id]: dispatchedAction.payload.map,
        },
      };

    case "INITIALIZE_GAME":
      const { map, start, end } = dispatchedAction.payload;
      return {
        ...currentState,
        currentMap: map,
        playerPosition: start,
        startPosition: start,
        endPosition: end,
        visitedCells: new Set(),
        solutionPath: [],
        currentPath: [],
        gameStatus: "idle",
        showSolution: false,
        showVisitedPath: false,
        isAlgorithmRunning: false,
      };

    case "UPDATE_PLAYER_POSITION":
      return { ...currentState, playerPosition: dispatchedAction.payload };

    case "ADD_VISITED_CELL":
      const newVisitedCell = new Set(currentState.visitedCells);
      newVisitedCell.add(
        `${dispatchedAction.payload.row}-${dispatchedAction.payload.col}`
      );
      return { ...currentState, visitedCells: newVisitedCell };

    case "UPDATE_CURRENT_PATH":
      return { ...currentState, currentPath: dispatchedAction.payload };

    case "SET_SOLUTION_PATH":
      return { ...currentState, solutionPath: dispatchedAction.payload };

    case "SET_GAME_STATUS":
      return { ...currentState, gameStatus: dispatchedAction.payload };

    case "SET_ALGORITHM_RUNNING":
      return { ...currentState, isAlgorithmRunning: dispatchedAction.payload };

    case "SET_SPEED":
      return { ...currentState, speed: dispatchedAction.payload };

    case "TOGGLE_SHOW_SOLUTION":
      return {
        ...currentState,
        showSolution: !currentState.showSolution,
        showVisitedPath: false,
      };

    case "TOGGLE_SHOW_VISITED_PATH":
      return {
        ...currentState,
        showVisitedPath: !currentState.showVisitedPath,
        showSolution: false,
      };

    case "RESET_GAME":
      return {
        ...currentState,
        playerPosition: currentState.startPosition,
        visitedCells: new Set(),
        solutionPath: [],
        currentPath: [],
        gameStatus: "idle",
        showSolution: false,
        showVisitedPath: false,
        isAlgorithmRunning: false,
      };

    default:
      return currentState;
  }
};

/**
 * Provides game state context to child components
 *
 * Creates and manages the game state using useReducer, then provides
 * both the current state and dispatch function to all child components
 * through React Context API.
 */
export const GameProvider = ({ children }) => {
  const [gameState, dispatchGameAction] = useReducer(
    gameStateReducer,
    initialState
  );

  return (
    <GameContext.Provider
      value={{ state: gameState, dispatch: dispatchGameAction }}
    >
      {children}
    </GameContext.Provider>
  );
};

// Custom hook for accessing game context
export const useGame = () => {
  const gameContextValue = useContext(GameContext);
  if (!gameContextValue) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return gameContextValue;
};
