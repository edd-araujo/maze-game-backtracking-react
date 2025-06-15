import React, { useState } from "react";
import { useGame } from "../../context/GameContext";
import { useBacktracking } from "../../hooks/useBacktracking";
import Button from "../common/Button";

const ControlPanel = () => {
  const { state, dispatch } = useGame();
  const { startAlgorithm, pauseAlgorithm, resetAlgorithm, isRunning } =
    useBacktracking();
  const [speedMultiplier, setSpeedMultiplier] = useState(1);

  const handlePlayPause = () => {
    if (isRunning) {
      pauseAlgorithm();
    } else {
      startAlgorithm();
    }
  };

  const handleReset = () => {
    resetAlgorithm();
  };

  const handleSpeedChange = () => {
    let newSpeedMultiplier;
    if (speedMultiplier === 1) {
      newSpeedMultiplier = 1.5;
    } else if (speedMultiplier === 1.5) {
      newSpeedMultiplier = 2;
    } else {
      newSpeedMultiplier = 1;
    }

    setSpeedMultiplier(newSpeedMultiplier);

    const baseSpeed = 500;
    const newSpeed = baseSpeed / newSpeedMultiplier;
    dispatch({ type: "SET_SPEED", payload: newSpeed });
  };

  const handleShowSolution = () => {
    if (state.gameStatus === "completed") {
      dispatch({ type: "TOGGLE_SHOW_SOLUTION" });
    }
  };

  const handleShowVisitedPath = () => {
    if (state.gameStatus === "completed") {
      dispatch({ type: "TOGGLE_SHOW_VISITED_PATH" });
    }
  };

  return (
    <div className="w-full">
      <div className="text-gray-300 text-sm lg:text-base flex justify-around items-center gap-4 mb-4">
        <p>Células visitadas: {state.visitedCells.size}</p>
        <p>Células até a saída: {state.solutionPath.length}</p>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex gap-2 justify-center">
          <Button
            type={"play/pause"}
            onClick={handlePlayPause}
            isRunning={isRunning}
            gameStatus={state.gameStatus}
          />

          <Button type={"reset"} onClick={handleReset} />
          <Button
            type={"speed"}
            speedOption={speedMultiplier}
            onClick={handleSpeedChange}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Button
            type={"solutionPath"}
            customText={`${
              state.showSolution ? "Ocultar solução" : "Exibir solução"
            }`}
            onClick={handleShowSolution}
          />
          <Button
            type={"fullPath"}
            onClick={handleShowVisitedPath}
            customText={`${
              state.showVisitedPath
                ? "Ocultar caminho percorrido"
                : "Exibir caminho percorrido"
            }`}
          />
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
