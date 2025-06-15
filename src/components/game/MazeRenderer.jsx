import React from "react";
import { useGame } from "../../context/GameContext";

const MazeRenderer = () => {
  const { state } = useGame();

  if (!state.currentMap) return null;

  const getCellStyle = (row, col, cellValue) => {
    const baseStyle =
      "w-8 h-8 lg:w-12 lg:h-12 border border-gray-600 items-center justify-center text-xs font-bold";
    const currentPos = `${row}-${col}`;
    const isCurrentPosition =
      state.playerPosition.row === row && state.playerPosition.col === col;
    const isVisited = state.visitedCells.has(currentPos);
    const isInSolutionPath = state.solutionPath.some(
      (pos) => pos.row === row && pos.col === col
    );
    const isInCurrentPath = state.currentPath.some(
      (pos) => pos.row === row && pos.col === col
    );

    if (cellValue === "S") {
      return `${baseStyle} bg-green-500 text-white`;
    }

    if (cellValue === "E") {
      return `${baseStyle} bg-red-500 text-white`;
    }

    if (cellValue === "#") {
      return `${baseStyle} bg-gray-800`;
    }

    if (isCurrentPosition && state.gameStatus === "running") {
      return `${baseStyle} bg-blue-500 text-white animate-pulse`;
    }

    if (state.showSolution && isInSolutionPath) {
      return `${baseStyle} bg-yellow-400`;
    }

    if (state.showVisitedPath && isVisited) {
      return `${baseStyle} bg-purple-300`;
    }

    if (isInCurrentPath && state.gameStatus === "running") {
      return `${baseStyle} bg-blue-200`;
    }

    if (isVisited && !state.showSolution && !state.showVisitedPath) {
      return `${baseStyle} bg-gray-300`;
    }

    return `${baseStyle} bg-white`;
  };

  const getCellContent = (row, col, cellValue) => {
    const isCurrentPosition =
      state.playerPosition.row === row && state.playerPosition.col === col;

    if (cellValue === "S") return "S";
    if (cellValue === "E") return "E";
    if (isCurrentPosition && state.gameStatus === "running") return "🤖";

    return "";
  };

  return (
    <div className="flex flex-col items-center pt-4">
      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${state.currentMap[0].length}, minmax(0, 1fr))`,
        }}
      >
        {state.currentMap.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={getCellStyle(rowIndex, colIndex, cell)}
            >
              {getCellContent(rowIndex, colIndex, cell)}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MazeRenderer;
