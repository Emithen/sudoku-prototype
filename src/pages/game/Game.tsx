import { useEffect, useState } from "react";
import { Board } from "./Board";
import { NumberPad } from "./NumberPad";
import { GameCompleteModal } from "./GameCompleteModal";
import { GameFailModal } from "./GameFailModal";
import { generatePuzzle } from "./generatePuzzle";
import type { Position, CellValue } from "./type";

type PuzzleState = {
  board: CellValue[][];
  given: boolean[][];
};

const DIFFICULTY_GIVENS: Record<string, number> = {
  easy: 54,
  normal: 42,
  hard: 33,
};

const GAME_TIME = 2;

const SAVE_KEY = "sudoku-saved-game";

const makePuzzle = (): PuzzleState => {
  const stored = localStorage.getItem("sudoku-difficulty") ?? "normal";
  const givens = DIFFICULTY_GIVENS[stored] ?? DIFFICULTY_GIVENS.normal;
  const puzzle = generatePuzzle(givens);
  return {
    board: puzzle,
    given: puzzle.map((r) => r.map((v) => v !== null)),
  };
};

const loadOrMakePuzzle = (): PuzzleState => {
  const saved = localStorage.getItem(SAVE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved) as PuzzleState;
    } catch {
      // 손상된 데이터면 새 퍼즐 생성
    }
  }
  return makePuzzle();
};

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
  const [complete, setComplete] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(getInitialTimeLeft);
  const [failed, setFailed] = useState<boolean>(() => getInitialTimeLeft() === 0);

  useEffect(() => {
    localStorage.setItem(SAVE_KEY, JSON.stringify({ board, given, timeLeft }));
  }, [board, given, timeLeft]);

  useEffect(() => {
    if (isBoardComplete(board)) setComplete(true);
  }, [board]);

  useEffect(() => {
    if (complete || failed) return;
    const id = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setFailed(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [complete, failed]);

  const handleCellClick = (row: number, col: number) => {
    setSelected((prev) =>
      prev?.row === row && prev?.col === col ? null : { row, col },
    );
  };

  const handleNumberInput = (value: CellValue) => {
    if (!selected) return;
    const { row, col } = selected;
    if (given[row][col]) return;
    setPuzzle((prev) => {
      const next = prev.board.map((r) => [...r]);
      next[row][col] = value;
      return { ...prev, board: next };
    });
  };

  const resetGame = () => {
    localStorage.removeItem(SAVE_KEY);
    setPuzzle(makePuzzle());
    setTimeLeft(GAME_TIME);
    setSelected(null);
    setComplete(false);
    setFailed(false);
  };

  const isInputDisabled = failed || !selected || given[selected.row][selected.col];

  return (
    <div className="w-full h-screen flex flex-col items-center bg-white">
      <div className="flex flex-col items-center justify-center flex-1 w-full px-4 gap-6">
        <p
          className={`text-2xl font-mono font-bold tabular-nums ${
            timeLeft < 60 ? "text-red-500" : "text-slate-700"
          }`}
        >
          {formatTime(timeLeft)}
        </p>
        <Board
          board={board}
          given={given}
          selected={selected}
          onCellClick={handleCellClick}
        />
        <NumberPad onInput={handleNumberInput} disabled={isInputDisabled} />
      </div>
      {complete && <GameCompleteModal onNewGame={resetGame} />}
      {failed && <GameFailModal onRetry={resetGame} />}
    </div>
  );
};
