import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CreditsPage from "./pages/CreditsPage";
import GamePage from "./pages/GamePage";
import { GameProvider } from "./context/GameContext";
import { AudioProvider } from "./context/AudioContext";

const App = () => {
  return (
    <AudioProvider>
      <GameProvider>
        <div className="bg-[#003645] h-full ">
          <BrowserRouter>
            <Routes>
              {/* Home page route - main menu and maze selection */}
              <Route path="/" element={<HomePage />} />
              {/* Game page route - maze gameplay and algorithm visualization */}
              <Route path="/game" element={<GamePage />} />
            </Routes>
          </BrowserRouter>
        </div>
      </GameProvider>
    </AudioProvider>
  );
};

export default App;
