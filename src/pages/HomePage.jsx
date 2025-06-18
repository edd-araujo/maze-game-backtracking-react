import { useEffect, useState } from "react";
import Button from "../components/common/Button";
import { useNavigate } from "react-router-dom";
import Dropdown from "../components/common/Dropdown";
import { useGame } from "../context/GameContext";
import maps from "../data/maps";
import { useAudio } from "../context/AudioContext";
import { AIMazeGenerationService } from "../services/aiService";
import AIMazeModal from "../components/modals/AIMazeModal";

/**
 * Home Page Component
 *
 * This component serves as the main entry point for the Backtracking Maze Explorer.
 *
 * It allows the user to select a maze, generate a maze using AI, toggle audio, and start the game.
 * The component manages UI state for dropdowns and modals, and handles navigation to the game page.
 */

const HomePage = () => {
  const navigate = useNavigate();
  const { isMuted, setIsMuted } = useAudio();
  const { dispatch } = useGame();

  // Currently selected map
  const [selectedMap, setSelectedMap] = useState(null);

  // State for dropdown and AI modal visibilty
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);

  const handleToggleMute = () =>
    setIsMuted((previousMuteState) => !previousMuteState);

  /**
   * Starts the game with the selected map.
   * Navigates to the game page and dispatches the selected map to the context.
   */
  const handleStartGame = () => {
    const mapIdToPlay = selectedMap || "gameMap1";

    dispatch({ type: "SET_SELECTED_MAP", payload: mapIdToPlay });
    navigate("/game", { state: { mapId: mapIdToPlay } });
  };

  // Handles the selection of a map from the dropdown.
  const handleMapSelection = (mapKey) => {
    setSelectedMap(mapKey);
    setIsDropdownOpen(false);
  };

  const handleGenerateAI = () => {
    setIsDropdownOpen(false);
    setIsAIModalOpen(true);
  };

  /**
   * Handles the AI maze generation process.
   * Requests a new maze from the AI service, adds it to the context, and selects it.
   */
  const handleAIMazeGeneration = async () => {
    try {
      const generatedMaze =
        await AIMazeGenerationService.requestMazeGenerationFromAI();

      const generatedMapId = `ai_generated_${Date.now()}`;

      dispatch({
        type: "ADD_GENERATED_MAP",
        payload: { id: generatedMapId, map: generatedMaze },
      });

      setSelectedMap(generatedMapId);

      console.log("Maze generated succesfully!");
    } catch (error) {
      console.error("Error generating maze:", error);
      throw error; // Re-throw to be handled by modal
    }
  };

  // Returns a custom name for the selected map
  const getSelectedMapDisplayName = () => {
    if (!selectedMap) return null;

    if (selectedMap.startsWith("ai_generated_")) {
      return "Mapa Gerado por IA";
    }

    const mapIndex = Object.keys(maps).indexOf(selectedMap);
    return mapIndex >= 0 ? `Mapa ${mapIndex + 1}` : null;
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Audio toggle button */}
      <Button
        type={"song"}
        onClick={handleToggleMute}
        isMute={isMuted}
        customStyle={"absolute top-6 right-4 p4 z-20"}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 lg:gap-12">
        <h1 className="lg:w-1/3 mb-8">
          <img
            src="/GameLogo-desktop.png"
            alt="Logo do Backtracking Explorer"
            className="hidden md:block w-full"
          />
          <img
            src="/GameLogo-mobile.png"
            alt="Logo do Backtracking Explorer"
            className="block md:hidden w-full"
          />
        </h1>

        <div className="flex flex-col w-full max-w-xs lg:max-w-lg gap-4">
          <Button
            type={"start"}
            customText={"Iniciar"}
            onClick={handleStartGame}
          />
          <div className="relative">
            <Button
              customText={getSelectedMapDisplayName() || "Selecionar Mapa"}
              type={"mapSelector"}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              dropdownOpen={isDropdownOpen}
            />
            {isDropdownOpen && (
              <Dropdown
                options={Object.keys(maps)}
                onSelect={handleMapSelection}
                onGenerateAI={handleGenerateAI}
              />
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full text-center py-4 text-[#E8E8E8] text-sm lg:text-base">
        Desenvolvido por{" "}
        <a
          href="https://github.com/edd-araujo"
          className="text-[#C88000] underline decoration-2 text-sm lg:text-base"
          target="_blank"
        >
          Ed Araujo
        </a>
      </footer>

      {/* Modal for AI generation */}
      <AIMazeModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        onGenerate={handleAIMazeGeneration}
      />
    </div>
  );
};

export default HomePage;
