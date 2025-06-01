import React from "react";

const Dropdown = ({ options = [], onSelect }) => {
  return (
    <div className="absolute top-full w-full text-center  bg-[#004356] rounded-b-lg z-10">
      {options.map((option, idx) => (
        <button
          key={option}
          className={`block w-full p-4 text-[#E8E8E8] hover:bg-[#C88000] transition-colors border-blue-300 ${
            idx === options.length - 1 ? "rounded-b-lg" : ""
          }`}
          onClick={() => onSelect(option)}
        >
          {`Mapa ${idx + 1}`}
        </button>
      ))}
    </div>
  );
};

export default Dropdown;
