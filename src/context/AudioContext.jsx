import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
} from "react";

const AudioContext = createContext();

export const AudioProvider = ({ children }) => {
  const audioRef = useRef(null);
  const [isMuted, setIsMuted] = useState(false);

  // Toca a música assim que o app inicia
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.5;
      audioRef.current.loop = true;
      audioRef.current.play().catch(() => {});
    }
  }, []);

  // Atualiza mute/desmute
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  return (
    <AudioContext.Provider value={{ isMuted, setIsMuted }}>
      {/* O elemento de áudio fica "invisível" */}
      <audio
        ref={audioRef}
        src="/audio/video-game-boss-fight.mp3"
        autoPlay
        loop
      />
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => useContext(AudioContext);
