import { useState } from "react";
import { Board, INITIAL_BOARD, GIVEN } from "./Board";
import { NumberPad } from "./NumberPad";
import type { CellValue, Position } from "./Board";

export const Game = () => {
  const [board, setBoard] = useState<CellValue[][]>(INITIAL_BOARD);
  const [selected, setSelected] = useState<Position>(null);

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

  const isInputDisabled =
    !selected || GIVEN[selected.row][selected.col];

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
    </div>
  );
};
