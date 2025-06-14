import React from "react";
import {
  FaPause,
  FaPlay,
  FaRedo,
  FaVolumeMute,
  FaVolumeUp,
} from "react-icons/fa";

const Button = ({
  type,
  onClick,
  isMute,
  isPlaying,
  showSolution,
  showFullPath,
  dropdownOpen,
  speedOption,
}) => {
  let buttonStyles = "";
  let buttonText = "";

  const renderSongIcon = () =>
    isMute ? <FaVolumeMute size={24} /> : <FaVolumeUp size={24} />;
  const renderPlayPauseIcon = () =>
    isPlaying ? <FaPause size={20} /> : <FaPlay size={20} />;

  if (type === "start") {
    buttonText = "Iniciar";
    buttonStyles = "bg-[#C88000] w-full text-3xl rounded-lg";
  } else if (type === "dropdown") {
    buttonText = "Selecionar Mapa";
    buttonStyles = `relative bg-[#004356] w-full text-2xl rounded-t-lg ${
      dropdownOpen ? "rounded-b-none" : "rounded-b-lg"
    }`;
  } else if (type === "song") {
    buttonStyles = "absolute top-6 right-4 md:top-8 md:right-6 w-fit h-fit";
  } else if (type === "play/pause") {
    buttonStyles =
      "bg-[#004356] rounded-lg flex items-center justify-center hover:bg-[#C88000] active:bg-[#986200]";
  } else if (type === "reset") {
    buttonStyles =
      "bg-[#004356] rounded-lg flex items-center justify-center hover:bg-[#C88000] active:bg-[#986200]";
  } else if (type === "speed") {
    buttonStyles =
      "bg-[#004356] rounded-lg text-2xl font-semibold hover:bg-[#C88000] active:bg-[#986200]";
  } else if (type === "solutionPath") {
    buttonStyles =
      "w-full text-center text-xl bg-[#004356] rounded-lg hover:bg-[#C88000] active:bg-[#986200]";
  } else if (type === "fullPath") {
    buttonStyles =
      "w-full text-center text-xl bg-[#004356] rounded-lg hover:bg-[#C88000] active:bg-[#986200]";
  }

  return (
    <button
      type="button"
      className={`font-bold text-[#E8E8E8] ${
        type !== "song" ? "w-72 h-14" : ""
      } ${buttonStyles}`}
      onClick={onClick}
    >
      {type === "song" ? renderSongIcon() : buttonText}
      {type === "play/pause" && renderPlayPauseIcon()}
      {type === "reset" && <FaRedo size={20} />}
      {type === "speed" && `${speedOption}x`}
      {type === "solutionPath" && "Exibir solução"}
      {type === "fullPath" && "Exibir caminho percorrido"}
    </button>
  );
};

export default Button;
