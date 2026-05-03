import { useState } from "react";

type CellValue = number | null;
type Position = { row: number; col: number } | null;

const INITIAL_BOARD: CellValue[][] = [
  [5, 3, null, null, 7, null, null, null, null],
  [6, null, null, 1, 9, 5, null, null, null],
  [null, 9, 8, null, null, null, null, 6, null],
  [8, null, null, null, 6, null, null, null, 3],
  [4, null, null, 8, null, 3, null, null, 1],
  [7, null, null, null, 2, null, null, null, 6],
  [null, 6, null, null, null, null, 2, 8, null],
  [null, null, null, 4, 1, 9, null, null, 5],
  [null, null, null, null, 8, null, null, 7, 9],
];

const GIVEN: boolean[][] = INITIAL_BOARD.map((row) =>
  row.map((v) => v !== null),
);

const isSameBox = (r1: number, c1: number, r2: number, c2: number) =>
  Math.floor(r1 / 3) === Math.floor(r2 / 3) &&
  Math.floor(c1 / 3) === Math.floor(c2 / 3);

const getCellBg = (
  row: number,
  col: number,
  selected: Position,
  board: CellValue[][],
): string => {
  if (!selected) return "bg-white";
  const { row: sr, col: sc } = selected;
  if (row === sr && col === sc) return "bg-blue-200";
  if (row === sr || col === sc || isSameBox(row, col, sr, sc))
    return "bg-blue-50";
  const selVal = board[sr][sc];
  if (selVal !== null && board[row][col] === selVal) return "bg-blue-50";
  return "bg-white";
};

// --- Main component ---

export const Board = () => {
  const [board] = useState<CellValue[][]>(INITIAL_BOARD);
  const [selected, setSelected] = useState<Position>(null);

  const handleCellClick = (row: number, col: number) => {
    setSelected((prev) =>
      prev?.row === row && prev?.col === col ? null : { row, col },
    );
  };

  return (
    <div className="w-full max-w-sm aspect-square bg-slate-800 p-0.5 grid grid-cols-3 grid-rows-3 gap-0.5">
      {Array.from({ length: 9 }, (_, i) => {
        const br = Math.floor(i / 3);
        const bc = i % 3;
        return (
          <Box
            key={`${br}-${bc}`}
            boxRow={br}
            boxCol={bc}
            board={board}
            given={GIVEN}
            selected={selected}
            onCellClick={handleCellClick}
          />
        );
      })}
    </div>
  );
};

// --- Sub-components ---

// 3 x 3 박스
const Box = ({
  boxRow,
  boxCol,
  board,
  given,
  selected,
  onCellClick,
}: {
  boxRow: number;
  boxCol: number;
  board: CellValue[][];
  given: boolean[][];
  selected: Position;
  onCellClick: (row: number, col: number) => void;
}) => (
  <div className="bg-slate-300 grid grid-cols-3 grid-rows-3 gap-px">
    {Array.from({ length: 9 }, (_, i) => {
      const row = boxRow * 3 + Math.floor(i / 3);
      const col = boxCol * 3 + (i % 3);
      return (
        <Cell
          key={`${row}-${col}`}
          value={board[row][col]}
          isGiven={given[row][col]}
          bg={getCellBg(row, col, selected, board)}
          onClick={() => onCellClick(row, col)}
        />
      );
    })}
  </div>
);

// 1 x 1 칸
const Cell = ({
  value,
  isGiven,
  bg,
  onClick,
}: {
  value: CellValue;
  isGiven: boolean;
  bg: string;
  onClick: () => void;
}) => (
  <div
    onClick={onClick}
    className={`flex items-center justify-center cursor-pointer select-none transition-colors duration-75 ${bg}`}
  >
    {value !== null && (
      <span
        className={`text-lg leading-none ${
          isGiven ? "font-semibold text-slate-800" : "font-medium text-blue-500"
        }`}
      >
        {value}
      </span>
    )}
  </div>
);
