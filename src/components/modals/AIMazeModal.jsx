import React, { useState } from "react";

/**
 * Modal for configuring and generating mazes using AI.
 *
 * This component presents a modal interface that allows the user
 * request automatic generation of a maze through AI.
 */

const AIMazeModal = ({ isOpen, onClose, onGenerate }) => {
  const [isGeneratingMaze, setIsGeneratingMaze] = useState(false);
  const [generationError, setGenerationError] = useState("");

  /**
   * Runs the maze generation process via AI
   *
   * Manages charging state, runs generation function provided
   * via props and handles possible errros during the process.
   */
  const runAIMazeGeneration = async () => {
    setGenerationError("");
    setIsGeneratingMaze(true);

    try {
      await onGenerate();
      onClose();
    } catch (generationException) {
      const errorMessage =
        generationException.message || "Error generating maze.";

      setGenerationError(errorMessage);
    } finally {
      setIsGeneratingMaze(false);
    }
  };

  // Dont render the modal if isnt open
  if (!isOpen) return null;

  return (
    // Dark modal background overlay
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      {/* Main container */}
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        {/* Modal header with title and close button */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Gerar Mapa com IA
          </h2>
          <button
            onClick={onClose}
            disabled={isGeneratingMaze}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold disabled:opacity-50"
          >
            ×
          </button>
        </div>

        {/* Informative section about the generation process */}
        <div className="mb-6 text-gray-700">
          <p>
            A IA irá criar um labirinto único, desafiador e com múltiplos becos
            sem saída, pronto para ser resolvido pelo algoritmo de backtracking.
          </p>
          <p className="mt-2 text-sm text-gray-500">
            O tamanho e a dificuldade do labirinto são definidos automaticamente
            para garantir uma experiência interessante.
          </p>
        </div>
        {generationError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {generationError}
          </div>
        )}

        {/* Main button to start the maze genaration */}
        <button
          onClick={runAIMazeGeneration}
          disabled={isGeneratingMaze}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
        >
          {isGeneratingMaze ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Gerando...
            </>
          ) : (
            "Gerar mapa"
          )}
        </button>

        {/* Tips and additional information section */}
        <div className="mt-4 text-xs text-gray-500">
          <p>💡 O labirinto será gerado automaticamente pela IA.</p>
          <p>⚡ Processo pode levar alguns segundos.</p>
        </div>
      </div>
    </div>
  );
};

export default AIMazeModal;
