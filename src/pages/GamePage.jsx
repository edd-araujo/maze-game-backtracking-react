import React, { useState } from "react";
import Button from "../components/common/Button";
import { useNavigate } from "react-router-dom";

const speedOptions = [1, 1.5, 2];

const GamePage = () => {
  const navigate = useNavigate();

  const [isPlaying, setIsPlaying] = useState(false);
  const [speedIndex, setSpeedIndex] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const [showFullPath, setFullPath] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const handlePlayPause = () => setIsPlaying((prev) => !prev);
  const handleShowSolution = () => setShowSolution((prev) => !prev);
  const handleFullPath = () => setFullPath((prev) => !prev);
  const handleSpeed = () =>
    setSpeedIndex((prev) => (prev + 1) % speedOptions.length);
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div className="relative flex flex-col md:items-center justify-center h-screen w-screen">
      <button onClick={() => navigate("/")}>
        <img
          src="/src/assets/GameIcon-mobile.svg"
          alt="Ícone do Jogo"
          className="absolute top-4 left-4 md:left-6 md:top-6"
        />
      </button>
      <Button type={"song"} onClick={toggleMute} isMute={isMuted} />

      <div className="mx-4 md:w-fit md:flex md:flex-col md:items-center">
        <div className="flex items-center md:max-w-[800px] lg:max-w-2xl xl:max-w-4xl justify-center w-full bg-gray-800 aspect-square mb-4 rounded-lg">
          <span className="text-gray-100">[Maze Map]</span>
        </div>

        <div className="md:w-fit md:max-w-[400px]">
          <div className="flex justify-center items-center gap-2 mb-2">
            <Button
              type={"play/pause"}
              onClick={handlePlayPause}
              isPlaying={isPlaying}
            />
            <Button type={"reset"} />
            <Button
              type={"speed"}
              onClick={handleSpeed}
              speedOption={speedOptions[speedIndex]}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Button
              type={"solutionPath"}
              onClick={handleShowSolution}
              showSolution={showSolution}
            />
            <Button
              type={"fullPath"}
              onClick={handleFullPath}
              showFullPath={showFullPath}
            />
          </div>
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
    </div>
  );
};

export default GamePage;
