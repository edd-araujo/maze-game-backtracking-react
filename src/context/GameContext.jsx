import React, { createContext, useContext, useReducer } from "react";

const GameContext = createContext();

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
};

const gameReducer = (state, action) => {
  switch (action.type) {
    case "SET_SELECTED_MAP":
      return { ...state, selectedMap: action.payload };
    case "INITIALIZE_GAME":
      const { map, start, end } = action.payload;
      return {
        ...state,
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
      return { ...state, playerPosition: action.payload };
    case "ADD_VISITED_CELL":
      const newVisited = new Set(state.visitedCells);
      newVisited.add(`${action.payload.row}-${action.payload.col}`);
      return { ...state, visitedCells: newVisited };
    case "UPDATE_CURRENT_PATH":
      return { ...state, currentPath: action.payload };
    case "SET_SOLUTION_PATH":
      return { ...state, solutionPath: action.payload };
    case "SET_GAME_STATUS":
      return { ...state, gameStatus: action.payload };
    case "SET_ALGORITHM_RUNNING":
      return { ...state, isAlgorithmRunning: action.payload };
    case "SET_SPEED":
      return { ...state, speed: action.payload };
    case "TOGGLE_SHOW_SOLUTION":
      return {
        ...state,
        showSolution: !state.showSolution,
        showVisitedPath: false,
      };
    case "TOGGLE_SHOW_VISITED_PATH":
      return {
        ...state,
        showVisitedPath: !state.showVisitedPath,
        showSolution: false,
      };
    case "RESET_GAME":
      return {
        ...state,
        playerPosition: state.playerPosition,
        visitedCells: new Set(),
        solutionPath: [],
        currentPath: [],
        gameStatus: "idle",
        showSolution: false,
        showVisitedPath: false,
        isAlgorithmRunning: false,
      };

    default:
      return state;
  }
};

export const GameProvider = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
};
