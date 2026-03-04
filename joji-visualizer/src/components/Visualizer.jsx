import { useState, useEffect, useMemo, useRef } from "react";
import YouTube from "react-youtube";
import { ArrowLeft } from "lucide-react";

/* ============================================================
   BÚSQUEDA BINARIA ULTRA EFICIENTE
============================================================ */
function getCurrentLyric(lyrics, time) {
  if (!lyrics.length) return null;

  if (time < lyrics[0].time) {
    return lyrics[0];
  }

  let low = 0;
  let high = lyrics.length - 1;
  let result = lyrics[0];

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    if (time >= lyrics[mid].time) {
      result = lyrics[mid];
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }

  return result;
}

/* ============================================================
   TERMINAL GLITCH PROGRESIVO POR PALABRA
============================================================ */
const Typewriter = ({ text }) => {
  const [displayedWords, setDisplayedWords] = useState([]);
  const [currentWord, setCurrentWord] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const timeoutRef = useRef(null);
  const previousText = useRef("");

  const glitchChars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()_+-=[]{}<>?/|";

  useEffect(() => {
    if (text === previousText.current) return;
    previousText.current = text;

    clearTimeout(timeoutRef.current);

    setDisplayedWords([]);
    setCurrentWord("");
    setIsTyping(true);

    const words = text.split(" ");
    let wordIndex = 0;
    let charIndex = 0;

    const type = () => {
      if (wordIndex >= words.length) {
        setIsTyping(false);
        return;
      }

      const fullWord = words[wordIndex];

      if (charIndex <= fullWord.length) {
        const partial = fullWord.slice(0, charIndex);

        const corrupted =
          partial +
          (charIndex < fullWord.length
            ? glitchChars[Math.floor(Math.random() * glitchChars.length)]
            : "");

        setCurrentWord(corrupted);
        charIndex++;
        timeoutRef.current = setTimeout(type, 32);
      } else {
        setDisplayedWords((prev) => [...prev, fullWord]);
        setCurrentWord("");
        wordIndex++;
        charIndex = 0;
        timeoutRef.current = setTimeout(type, 55);
      }
    };

    type();
    return () => clearTimeout(timeoutRef.current);
  }, [text]);

  return (
    <span>
      {displayedWords.map((word, index) => (
        <span key={index} className="text-red-600">
          {word}{" "}
        </span>
      ))}

      {isTyping && (
        <span className="text-red-400 blur-[1px]">
          {currentWord}
        </span>
      )}
    </span>
  );
};

export default function Visualizer({ song, onBack }) {
  const [currentTime, setCurrentTime] = useState(0);
  const [player, setPlayer] = useState(null);
  const animationRef = useRef(null);

  /* ===== SINCRONIZACIÓN SUAVE ===== */
  useEffect(() => {
    const update = () => {
      if (player?.getCurrentTime) {
        const rawTime = player.getCurrentTime();
        const adjustedTime = rawTime + (song.offset || 0);
        setCurrentTime(adjustedTime);
      }
      animationRef.current = requestAnimationFrame(update);
    };

    if (player) {
      animationRef.current = requestAnimationFrame(update);
    }

    return () => cancelAnimationFrame(animationRef.current);
  }, [player, song.offset]);

  const currentLyric = useMemo(() => {
    return getCurrentLyric(song.lyrics, currentTime);
  }, [song.lyrics, currentTime]);

  /* ===== MOOD DETECTION ===== */
  const text = currentLyric?.text || "...";
  const lower = text.toLowerCase();

  const isUnderwater = lower.includes("underwater");
  const isChorus =
    lower.includes("hotel california") ||
    lower.includes("nice to meet ya");

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center relative bg-black overflow-hidden font-mono">

      <div className="scanlines"></div>

      <div className="hidden">
        <YouTube
          videoId={song.youtubeId}
          opts={{
            playerVars: {
              autoplay: 1,
              controls: 0,
              modestbranding: 1
            }
          }}
          onReady={(e) => setPlayer(e.target)}
        />
      </div>

      <button
        onClick={onBack}
        className="absolute top-8 left-8 z-50 text-red-900 hover:text-red-500 flex items-center gap-2 transition-all text-xs tracking-[0.3em] group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        <span>ABORT_SESSION</span>
      </button>

      <div className="z-30 px-6 max-w-5xl w-full text-center">

        <h2
          className={`
            text-2xl md:text-5xl lg:text-6xl font-bold leading-tight
            transition-all duration-500
            ${isUnderwater
              ? "text-blue-400 drop-shadow-[0_0_25px_rgba(59,130,246,0.9)] animate-underwater"
              : isChorus
              ? "text-red-500 drop-shadow-[0_0_25px_rgba(220,38,38,0.9)] animate-chorus"
              : "text-red-600 drop-shadow-[0_0_15px_rgba(220,38,38,0.6)]"}
          `}
        >
          <span className="mr-3 opacity-50 font-light">{">"}</span>
          <Typewriter text={text} />
          <span className="animate-cursor ml-1 border-r-8 border-current">
            &nbsp;
          </span>
        </h2>
      </div>

      {/* AMBIENT GLOW */}
      <div
        className={`absolute inset-0 pointer-events-none transition-all duration-1000 ambient-glow`}
        style={{
          background: isUnderwater
            ? `radial-gradient(circle at center, rgba(30,64,175,0.35) 0%, transparent 75%)`
            : `radial-gradient(circle at center, rgba(153,27,27,0.3) 0%, transparent 75%)`
        }}
      ></div>

      <div className="absolute bottom-8 right-8 z-30 text-[10px] text-red-900 opacity-40 text-right">
        <p>{song.artist.toUpperCase()} // {song.album.toUpperCase()}</p>
        <p>© 2026_88RISING_ARCHIVES</p>
      </div>
    </div>
  );
}