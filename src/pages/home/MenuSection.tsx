import { useState } from "react";
import { useNavigate } from "react-router";

const DIFFICULTIES = [
  { key: "easy", label: "쉬움" },
  { key: "normal", label: "보통" },
  { key: "hard", label: "어려움" },
] as const;

type Difficulty = (typeof DIFFICULTIES)[number]["key"];

export const MenuSection = () => {
  const navigate = useNavigate();
  const [showDifficulty, setShowDifficulty] = useState(false);

  const handleDifficultySelect = (difficulty: Difficulty) => {
    localStorage.setItem("sudoku-difficulty", difficulty);
    navigate("/game");
  };

  return (
    <div className="flex flex-col items-center gap-3 w-full max-w-xs px-6">
      <MenuItem
        title="새 게임"
        primary
        active={showDifficulty}
        onClick={() => setShowDifficulty((prev) => !prev)}
      />
      {showDifficulty && (
        <div className="flex gap-2 w-full">
          {DIFFICULTIES.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => handleDifficultySelect(key)}
              className="flex-1 py-3 rounded-xl text-sm font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200 active:scale-95 transition-all duration-150 cursor-pointer"
            >
              {label}
            </button>
          ))}
        </div>
      )}
      <MenuItem title="계속하기" />
      <MenuItem title="설정" />
    </div>
  );
};

const MenuItem = ({
  title,
  primary = false,
  active = false,
  onClick,
}: {
  title: string;
  primary?: boolean;
  active?: boolean;
  onClick?: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      className={`w-full py-3.5 rounded-xl text-base font-semibold tracking-wide transition-all duration-150 cursor-pointer
        ${
          primary
            ? active
              ? "bg-slate-600 text-white"
              : "bg-slate-800 text-white hover:bg-slate-700 active:scale-95"
            : "bg-slate-100 text-slate-600 hover:bg-slate-200 active:scale-95"
        }`}
    >
      {title}
    </button>
  );
};
