import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useGame } from "../context/GameContext";
import MazeRenderer from "../components/game/MazeRenderer";
import ControlPanel from "../components/game/ControlPanel";
import Button from "../components/common/Button";
import maps from "../data/maps";
import { useAudio } from "../context/AudioContext";

const GamePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isMuted, setIsMuted } = useAudio();
  const { state, dispatch } = useGame();

  const toggleMute = () => setIsMuted((prev) => !prev);

  useEffect(() => {
    const mapId = location.state?.mapId || "gameMap1";
    const selectedMap = maps[mapId];

    if (!selectedMap) {
      console.error("Map not found:", mapId);
      navigate("/");
      return;
    }

    let startPos = null;
    let endPos = null;

    for (let row = 0; row < selectedMap.length; row++) {
      for (let col = 0; col < selectedMap[row].length; col++) {
        if (selectedMap[row][col] === "S") {
          startPos = { row, col };
        } else if (selectedMap[row][col] === "E") {
          endPos = { row, col };
        }
      }
    }

    if (!startPos || !endPos) {
      console.error("Start or end position not found in map");
      navigate("/");
      return;
    }

    // Initialize game state
    dispatch({ type: "SET_SELECTED_MAP", payload: mapId });
    dispatch({
      type: "INITIALIZE_GAME",
      payload: {
        map: selectedMap,
        start: startPos,
        end: endPos,
      },
    });
  }, [location.state, dispatch, navigate]);

  const handleBackToHome = () => {
    navigate("/");
  };

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
        <button onClick={handleBackToHome}>
          <img
            src="/src/assets/GameIcon-desktop.png"
            alt="Ícone do Backtracking Explorer"
            className="hidden md:block w-full"
          />
          <img
            src="/src/assets/GameIcon-mobile.svg"
            alt="Ícone do Backtracking Explorer"
            className="block md:hidden w-full"
          />
        </button>
        <Button type={"song"} onClick={toggleMute} isMute={isMuted} />
      </div>

      <div className="flex flex-col gap-2 items-center justify-center p-4 ">
        <div className="flex-1 max-w-4xl">
          <MazeRenderer />
        </div>

        <div className="w-full lg:max-w-xl">
          <ControlPanel />
        </div>
      </div>
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
