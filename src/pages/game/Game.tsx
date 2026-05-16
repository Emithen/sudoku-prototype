import { useEffect, useState } from "react";
import { Board } from "./Board";
import { NumberPad } from "./NumberPad";
import { GameCompleteModal } from "./GameCompleteModal";
import { GameFailModal } from "./GameFailModal";
import { generatePuzzle } from "./generatePuzzle";
import type { Position, CellValue } from "./type";
import { GAME_TIME, SAVE_KEY } from "../../parameters/game";

type GamePhase = "playing" | "failed" | "continued" | "complete";

type PuzzleState = {
  board: CellValue[][];
  given: boolean[][];
};

const DIFFICULTY_GIVENS: Record<string, number> = {
  easy: 54,
  normal: 42,
  hard: 33,
};

const parseSaved = () => {
  const saved = localStorage.getItem(SAVE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {}
  }
  return null;
};

const makePuzzle = (difficulty: string): PuzzleState => {
  const givens = DIFFICULTY_GIVENS[difficulty] ?? DIFFICULTY_GIVENS.normal;
  const puzzle = generatePuzzle(givens);
  return {
    board: puzzle,
    given: puzzle.map((r) => r.map((v) => v !== null)),
  };
};

const loadOrMakePuzzle = (): PuzzleState => {
  const data = parseSaved();
  if (data?.board && data?.given) return { board: data.board, given: data.given };
  return makePuzzle(data?.difficulty ?? "normal");
};

const getInitialDifficulty = (): string => parseSaved()?.difficulty ?? "normal";

const getInitialTimeLeft = (): number => {
  const saved = localStorage.getItem(SAVE_KEY);
  if (saved) {
    try {
      const { timeLeft } = JSON.parse(saved);
      if (typeof timeLeft === "number") return timeLeft;
    } catch {}
  }
  return GAME_TIME;
};

const VALID_PHASES: GamePhase[] = ["playing", "failed", "continued", "complete"];

const getInitialPhase = (): GamePhase => {
  const saved = localStorage.getItem(SAVE_KEY);
  if (saved) {
    try {
      const { phase } = JSON.parse(saved);
      if (VALID_PHASES.includes(phase)) return phase as GamePhase;
    } catch {}
  }
  return getInitialTimeLeft() === 0 ? "failed" : "playing";
};

const formatTime = (seconds: number): string => {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
};

const isBoardComplete = (board: CellValue[][]): boolean => {
  const hasAllNine = (cells: CellValue[]) => {
    const set = new Set(cells);
    return set.size === 9 && !set.has(null);
  };

  for (let i = 0; i < 9; i++) {
    if (!hasAllNine(board[i])) return false;
    if (!hasAllNine(board.map((r) => r[i]))) return false;
  }

  for (let br = 0; br < 3; br++) {
    for (let bc = 0; bc < 3; bc++) {
      const box: CellValue[] = [];
      for (let r = 0; r < 3; r++)
        for (let c = 0; c < 3; c++) box.push(board[br * 3 + r][bc * 3 + c]);
      if (!hasAllNine(box)) return false;
    }
  }

  return true;
};

export const Game = () => {
  const [{ board, given }, setPuzzle] = useState<PuzzleState>(loadOrMakePuzzle);
  const [selected, setSelected] = useState<Position>(null);
  const [phase, setPhase] = useState<GamePhase>(getInitialPhase);
  const [timeLeft, setTimeLeft] = useState<number>(getInitialTimeLeft);
  const difficulty = getInitialDifficulty();

  // 상태 변경 사항 로컬 스토리지에 반영
  useEffect(() => {
    localStorage.setItem(SAVE_KEY, JSON.stringify({ board, given, timeLeft, phase, difficulty }));
  }, [board, given, timeLeft, phase, difficulty]);

  // 성공 판정
  useEffect(() => {
    if (phase === "playing" && isBoardComplete(board)) setPhase("complete");
  }, [board, phase]);

  // 게임 타이머
  useEffect(() => {
    if (phase !== "playing") return;
    const id = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setPhase("failed");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [phase]);

  const handleCellClick = (row: number, col: number) => {
    setSelected((prev) =>
      prev?.row === row && prev?.col === col ? null : { row, col },
    );
  };

  const handleNumberInput = (value: CellValue) => {
    if (!selected) return;
    const { row, col } = selected;
    if (given[row][col]) return;
    if (board[row][col] !== null && value !== null) return;
    setPuzzle((prev) => {
      const next = prev.board.map((r) => [...r]);
      next[row][col] = value;
      return { ...prev, board: next };
    });
  };

  const resetGame = () => {
    localStorage.removeItem(SAVE_KEY);
    setPuzzle(makePuzzle(difficulty));
    setTimeLeft(GAME_TIME);
    setSelected(null);
    setPhase("playing");
  };

  const continueGame = () => {
    setPhase("continued");
  };

  const isInputDisabled = phase === "failed" || phase === "complete" || !selected || given[selected.row][selected.col];

  return (
    <div className="w-full h-dvh flex flex-col items-center bg-white">
      <div className="flex flex-col items-center justify-center flex-1 min-h-0 w-full px-4 gap-6 overflow-hidden">
        <p
          className={`text-2xl font-mono font-bold tabular-nums ${
            phase === "playing" && timeLeft < 60 ? "text-red-500" : "text-slate-700"
          }`}
        >
          {phase === "continued" ? "무제한" : formatTime(timeLeft)}
        </p>
        <Board
          board={board}
          given={given}
          selected={selected}
          onCellClick={handleCellClick}
        />
        <NumberPad onInput={handleNumberInput} disabled={isInputDisabled} />
      </div>
      {phase === "complete" && <GameCompleteModal onNewGame={resetGame} />}
      {phase === "failed" && <GameFailModal onNewGame={resetGame} onContinue={continueGame} />}
    </div>
  );
};
