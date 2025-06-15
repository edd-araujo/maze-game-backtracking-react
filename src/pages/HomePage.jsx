import { useEffect, useState } from "react";
import Button from "../components/common/Button";
import { useNavigate } from "react-router-dom";
import Dropdown from "../components/common/Dropdown";
import { useGame } from "../context/GameContext";
import maps from "../data/maps";
import { useAudio } from "../context/AudioContext";

const HomePage = () => {
  const navigate = useNavigate();
  const { isMuted, setIsMuted } = useAudio();
  const { dispatch } = useGame();
  const [selectedMap, setSelectedMap] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleMute = () => setIsMuted((prev) => !prev);

  const startGame = () => {
    const mapId = selectedMap || "gameMap1";

    dispatch({ type: "SET_SELECTED_MAP", payload: mapId });
    navigate("/game", { state: { mapId } });
  };

  const handleMapSelect = (mapKey) => {
    setSelectedMap(mapKey);
    setIsDropdownOpen(false);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Button
        type={"song"}
        onClick={toggleMute}
        isMute={isMuted}
        customStyle={"absolute top-6 right-4 p4 z-20"}
      />
      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 lg:gap-12">
        <h1 className="lg:w-1/3 mb-8">
          <img
            src="/src/assets/GameLogo-desktop.png"
            alt="Logo do Backtracking Explorer"
            className="hidden md:block w-full"
          />
          <img
            src="/src/assets/GameLogo-mobile.png"
            alt="Logo do Backtracking Explorer"
            className="block md:hidden w-full"
          />
        </h1>

        <div className="flex flex-col w-full max-w-xs lg:max-w-lg gap-4">
          <Button
            type={"start"}
            customText={"Iniciar"}
            onClick={() => startGame()}
          />
          <div className="relative">
            <Button
              customText={`${
                selectedMap
                  ? selectedMap.replace("gameMap", "Mapa ")
                  : "Selecionar mapa"
              }`}
              type={"mapSelector"}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              dropdownOpen={isDropdownOpen}
            />
            {isDropdownOpen && (
              <Dropdown
                options={Object.keys(maps)}
                onSelect={handleMapSelect}
              />
            )}
          </div>
        </div>
      </div>

      <footer className="w-full text-center py-4 text-[#E8E8E8] text-sm lg:text-base">
        Desenvolvido por{" "}
        <a
          href="https://github.com/edd-araujo"
          className="text-[#C88000] underline decoration-2 text-sm lg:text-base"
        >
          Ed Araujo
        </a>
      </footer>
    </div>
  );
};

export default HomePage;
