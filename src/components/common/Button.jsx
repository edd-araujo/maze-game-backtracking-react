import React from "react";
import { FaVolumeMute, FaVolumeUp } from "react-icons/fa";

const Button = ({ type, onClick, isMute, dropdownOpen }) => {
  let buttonStyles = "";
  let buttonText = "";

  const renderSongIcon = () =>
    isMute ? <FaVolumeMute size={24} /> : <FaVolumeUp size={24} />;

  if (type === "start") {
    buttonText = "Iniciar";
    buttonStyles = "bg-[#C88000] text-3xl rounded-lg";
  } else if (type === "dropdown") {
    buttonText = "Selecionar Mapa";
    buttonStyles = `relative bg-[#004356] text-2xl rounded-t-lg ${
      dropdownOpen ? "rounded-b-none" : "rounded-b-lg"
    }`;
  } else if (type === "song") {
    buttonStyles = "absolute top-4 right-4 w-fit h-fit";
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
    </button>
  );
};

export default Button;
