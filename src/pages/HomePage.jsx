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
    <div className=" relative border border-red-500 flex flex-col items-center justify-center h-full p-4">
      <h1 className="w-72 font-bold text-white text-5xl mb-8">
        Backtracking Explorer
      </h1>

      <div className="flex flex-col gap-4">
        <Button type={"start"} onClick={() => startGame()} />
        <div className="relative">
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

      <p className="absolute bottom-4 inline-block text-[#E8E8E8] ">
        Desenvolvido por{" "}
        <a
          href="https://github.com/edd-araujo"
          className="text-[#C88000] underline decoration-2"
        >
          Ed Araujo
        </a>
      </p>

      <Button type={"song"} onClick={() => toggleMute()} isMute={isMuted} />
    </div>
  );
};

export default HomePage;
