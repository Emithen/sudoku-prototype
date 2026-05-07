import { useEffect, useState } from "react";
import { Board } from "./Board";
import { NumberPad } from "./NumberPad";
import { GameCompleteModal } from "./GameCompleteModal";
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

  useEffect(() => {
    localStorage.setItem(SAVE_KEY, JSON.stringify({ board, given }));
    if (isBoardComplete(board)) setComplete(true);
  }, [board]);

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

  const handleNewGame = () => {
    setPuzzle(makePuzzle());
    setSelected(null);
    setComplete(false);
  };

  const isInputDisabled = !selected || given[selected.row][selected.col];

  return (
    <div className="w-full h-screen flex flex-col items-center bg-white">
      <div className="flex flex-col items-center justify-center flex-1 w-full px-4 gap-6">
        <Board
          board={board}
          given={given}
          selected={selected}
          onCellClick={handleCellClick}
        />
        <NumberPad onInput={handleNumberInput} disabled={isInputDisabled} />
      </div>
      {complete && <GameCompleteModal onNewGame={handleNewGame} />}
    </div>
  );
};
