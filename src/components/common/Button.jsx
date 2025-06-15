import React from "react";
import {
  FaPause,
  FaPlay,
  FaRedo,
  FaVolumeMute,
  FaVolumeUp,
} from "react-icons/fa";

const Button = ({
  customText,
  type,
  onClick,
  isMute,
  isPlaying,
  showSolution,
  showFullPath,
  dropdownOpen,
  speedOption,
  customStyle,
  isRunning,
  gameStatus,
}) => {
  let buttonStyles = "";
  let buttonText = "";

  const renderSongIcon = () =>
    isMute ? (
      <FaVolumeMute className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10" />
    ) : (
      <FaVolumeUp className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10" />
    );
  const renderPlayPauseIcon = () =>
    isRunning ? <FaPause size={20} /> : <FaPlay size={20} />;

  if (type === "start") {
    buttonStyles = "bg-[#C88000] w-full text-3xl rounded-lg";
  } else if (type === "mapSelector") {
    buttonStyles = `relative bg-[#004356] w-full text-2xl rounded-t-lg ${
      dropdownOpen ? "rounded-b-none" : "rounded-b-lg"
    }`;
  } else if (type === "song") {
    buttonStyles = `w-fit h-fit ${customStyle}`;
  } else if (type === "play/pause") {
    buttonStyles = `bg-[#004356] rounded-lg flex items-center justify-center  ${
      gameStatus === "completed"
        ? "opacity-50 cursor-not-allowed"
        : "hover:bg-[#C88000] active:bg-[#986200]"
    } ${customStyle}`;
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
      disabled={gameStatus === "completed"}
    >
      {type === "start" && customText}
      {type === "mapSelector" && customText}
      {type === "song" ? renderSongIcon() : buttonText}
      {type === "play/pause" && renderPlayPauseIcon()}
      {type === "reset" && <FaRedo size={20} />}
      {type === "speed" && `${speedOption}x`}
      {type === "solutionPath" && customText}
      {type === "fullPath" && customText}
    </button>
  );
};

export default Button;
