import { useEffect, useState } from "react";
import { Board } from "./Board";
import { NumberPad } from "./NumberPad";
import { GameCompleteModal } from "./GameCompleteModal";
import { PUZZLES } from "./puzzles";
import type { CellValue, Position } from "./Board";

// 테스트할 케이스를 바꿔가며 확인: empty | normal | almostComplete
const ACTIVE_PUZZLE = PUZZLES.almostComplete;
const GIVEN = ACTIVE_PUZZLE.board.map((r) => r.map((v) => v !== null));
const freshBoard = () => ACTIVE_PUZZLE.board.map((r) => [...r]);

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
  const [board, setBoard] = useState<CellValue[][]>(freshBoard);
  const [selected, setSelected] = useState<Position>(null);
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    if (isBoardComplete(board)) setComplete(true);
  }, [board]);

  const handleCellClick = (row: number, col: number) => {
    setSelected((prev) =>
      prev?.row === row && prev?.col === col ? null : { row, col },
    );
  };

  const handleNumberInput = (value: number | null) => {
    if (!selected) return;
    const { row, col } = selected;
    if (GIVEN[row][col]) return;
    setBoard((prev) => {
      const next = prev.map((r) => [...r]);
      next[row][col] = value;
      return next;
    });
  };

  const handleNewGame = () => {
    setBoard(freshBoard());
    setSelected(null);
    setComplete(false);
  };

  const isInputDisabled = !selected || GIVEN[selected.row][selected.col];

  return (
    <div className="w-full h-screen flex flex-col items-center bg-white">
      <div className="flex flex-col items-center justify-center flex-1 w-full px-4 gap-6">
        <Board
          board={board}
          given={GIVEN}
          selected={selected}
          onCellClick={handleCellClick}
        />
        <NumberPad onInput={handleNumberInput} disabled={isInputDisabled} />
      </div>
      {complete && <GameCompleteModal onNewGame={handleNewGame} />}
    </div>
  );
};
