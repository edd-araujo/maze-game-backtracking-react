import { useEffect, useState } from "react";
import Button from "../components/common/Button";
import { useNavigate } from "react-router-dom";
import Dropdown from "../components/common/Dropdown";
import maps from "../data/maps";

const HomePage = () => {
  const navigate = useNavigate();
  const [isMuted, setIsMuted] = useState(false);
  const [selectedMap, setSelectedMap] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const startGame = () => {
    if (selectedMap) {
      navigate("/game", { state: { mapId: selectedMap } });
    } else {
      navigate("/game", { state: { mapId: "gameMap1" } });
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center lg:gap-12 min-h-screen p-4 sm:p-8 border border-red-500">
      <h1 className="lg:w-1/3 mb-8 border border-green-500">
        <img
          src="/src/assets/GameLogo-mobile.png"
          alt="Logo do Jogo"
          className="block md:hidden w-full"
        />
        <img
          src="/src/assets/GameLogo-desktop.png"
          alt="Logo do Jogo"
          className="hidden md:block w-full"
        />
      </h1>

      <div className="flex flex-col gap-4 w-full max-w-xs lg:max-w-lg border border-blue-500">
        <Button type={"start"} onClick={() => startGame()} />
        <div className="relative w-full border-pink-400">
          <Button
            type={"dropdown"}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            dropdownOpen={isDropdownOpen}
          />
          {isDropdownOpen && (
            <Dropdown
              options={Object.keys(maps)}
              onSelect={(mapKey) => {
                setSelectedMap(mapKey);
                setIsDropdownOpen(false);
              }}
            />
          )}
        </div>
      </div>

      <div className="w-full flex justify-center absolute bottom-4 left-0">
        <p className="inline-block text-[#E8E8E8]">
          Desenvolvido por{" "}
          <a
            href="https://github.com/edd-araujo"
            className="text-[#C88000] underline decoration-2"
          >
            Ed Araujo
          </a>
        </p>
      </div>

      <Button type={"song"} onClick={() => toggleMute()} isMute={isMuted} />
    </div>
  );
};

export default HomePage;
