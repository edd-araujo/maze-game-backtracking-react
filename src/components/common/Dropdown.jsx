import React from "react";

/**
 * Dropdown Menu Component
 *
 * This component renders a dropdown menu for maze selection in the Backtracking
 * Maze Explorer application. It displays a list of available maze options and
 * includes an AI-powered maze generation option.
 */

const Dropdown = ({ options = [], onSelect, onGenerateAI }) => {
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

      <div className="border-t border-[#C88000] my-1" />
      <button
        className="block w-full p-4 text-[#E8E8E8] hover:bg-[#C88000] transition-colors rounded-b-lg font-bold"
        onClick={onGenerateAI}
      >
        Gerar Mapa com IA
      </button>
    </div>
  );
};

export default Dropdown;
