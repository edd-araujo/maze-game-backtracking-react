import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useGame } from "../context/GameContext";
import MazeRenderer from "../components/game/MazeRenderer";
import ControlPanel from "../components/game/ControlPanel";
import Button from "../components/common/Button";
import maps from "../data/maps";
import { useAudio } from "../context/AudioContext";
import Tooltip from "../components/game/Tooltip";

/**
 * Game Page Component
 *
 * This component is responsible for rendering the main gameplay interface,
 * including the maze visualization, control panel, and audio controls.
 *
 * It initializes the game state based on the selected map and manages
 * navigation and user interactions during gameplay.
 */

const GamePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isMuted, setIsMuted } = useAudio();
  const { state, dispatch } = useGame();

  const [showTooltip, setShowToolTip] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setShowToolTip(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleToggleMute = () => setIsMuted((prevMuteState) => !prevMuteState);

  /**
   * Initializes the game state based on the selected map.
   *
   * Loads the maze matrix, finds the start and end positions,
   * and dispatches actions to set up the game for play.
   *
   * Redirects to home if the map is invalid.
   */
  useEffect(() => {
    const selectedMapId = location.state?.mapId || "gameMap1";
    let mazeMatrixToLoad;

    if (selectedMapId.startsWith("ai_generated_")) {
      mazeMatrixToLoad = state.generatedMaps[selectedMapId];
    } else {
      mazeMatrixToLoad = maps[selectedMapId];
    }

    if (!mazeMatrixToLoad) {
      console.error("Map not found:", selectedMapId);
      navigate("/");
      return;
    }

    let startPos = null;
    let endPositions = [];

    for (let rowIndex = 0; rowIndex < mazeMatrixToLoad.length; rowIndex++) {
      for (
        let colIndex = 0;
        colIndex < mazeMatrixToLoad[rowIndex].length;
        colIndex++
      ) {
        if (mazeMatrixToLoad[rowIndex][colIndex] === "S") {
          startPos = { row: rowIndex, col: colIndex };
        } else if (mazeMatrixToLoad[rowIndex][colIndex] === "E") {
          endPositions.push({ row: rowIndex, col: colIndex });
        }
      }
    }

    if (!startPos || endPositions.length === 0) {
      console.error("Start or end position not found in map");
      navigate("/");
      return;
    }

    const mazeEndPosition = endPositions[0];

    // Initialize game state
    dispatch({ type: "SET_SELECTED_MAP", payload: selectedMapId });
    dispatch({
      type: "INITIALIZE_GAME",
      payload: {
        map: mazeMatrixToLoad,
        start: startPos,
        end: mazeEndPosition,
      },
    });
  }, [location.state, dispatch, navigate, state.generatedMaps]);

  // Navigates the user back to the home page.
  const handleNavigateBackToHome = () => {
    navigate("/");
  };

  const getCurrentMapDisplayName = () => {
    if (!state.selectedMap) return "Carregando...";

    if (state.selectedMap.startsWith("ai_generated_")) {
      return "Mapa Gerado por IA";
    }

    return state.selectedMap.replace("gameMap", "Mapa ");
  };

  // Show loading state if the maze is not yet loaded
  if (!state.currentMap) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-white text-xl">Carregando labirinto...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <button onClick={handleNavigateBackToHome} className="relative">
          <img
            src="/GameIcon-desktop.png"
            alt="Ícone do Backtracking Explorer"
            className="hidden md:block w-full"
          />
          <img
            src="/GameIcon-mobile.svg"
            alt="Ícone do Backtracking Explorer"
            className="block md:hidden w-full"
          />
          <Tooltip
            message={"Clique aqui para voltar"}
            show={showTooltip}
            position="right"
          />
        </button>
        <Button type={"song"} onClick={handleToggleMute} isMute={isMuted} />
      </div>

      {/* Main content */}
      <div className="flex flex-col gap-2 items-center justify-center p-4 ">
        <div className="flex-1 max-w-4xl">
          <MazeRenderer />
        </div>

        <div className="w-full lg:max-w-xl">
          <ControlPanel />
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full text-center my-4 mt-auto text-[#E8E8E8] text-sm lg:text-base">
        Desenvolvido por{" "}
        <a
          href="https://github.com/edd-araujo"
          target="_blank"
          className="text-[#C88000] underline decoration-2 text-sm lg:text-base"
        >
          Ed Araujo
        </a>
      </footer>
    </div>
  );
};

export default GamePage;
