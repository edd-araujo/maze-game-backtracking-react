import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CreditsPage from "./pages/CreditsPage";
import GamePage from "./pages/GamePage";

const App = () => {
  return (
    <div className="bg-[#003645] h-screen">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/credits" element={<CreditsPage />} />
          <Route path="/game" element={<GamePage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
