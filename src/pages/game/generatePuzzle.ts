import type { CellValue } from "./type"

// 내부적으로 0을 빈 칸으로 사용, 반환 시 null로 변환
type Grid = number[][];

function shuffle<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function isValid(grid: Grid, row: number, col: number, num: number): boolean {
  if (grid[row].includes(num)) return false;
  if (grid.some((r) => r[col] === num)) return false;

  const br = Math.floor(row / 3) * 3;
  const bc = Math.floor(col / 3) * 3;
  for (let r = br; r < br + 3; r++)
    for (let c = bc; c < bc + 3; c++)
      if (grid[r][c] === num) return false;

  return true;
}

// 백트래킹으로 완성 보드 생성 (각 칸에서 1~9를 랜덤 순서로 시도)
function fillGrid(grid: Grid, pos: number): boolean {
  if (pos === 81) return true;

  const row = Math.floor(pos / 9);
  const col = pos % 9;

  for (const num of shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9])) {
    if (isValid(grid, row, col, num)) {
      grid[row][col] = num;
      if (fillGrid(grid, pos + 1)) return true;
      grid[row][col] = 0;
    }
  }

  return false;
}

// 해의 개수를 셈 (limit에 도달하면 조기 종료)
function countSolutions(grid: Grid, pos: number, limit: number): number {
  if (pos === 81) return 1;

  const row = Math.floor(pos / 9);
  const col = pos % 9;

  if (grid[row][col] !== 0) {
    return countSolutions(grid, pos + 1, limit);
  }

  let count = 0;
  for (let num = 1; num <= 9 && count < limit; num++) {
    if (isValid(grid, row, col, num)) {
      grid[row][col] = num;
      count += countSolutions(grid, pos + 1, limit - count);
      grid[row][col] = 0;
    }
  }

  return count;
}

function hasUniqueSolution(grid: Grid): boolean {
  return countSolutions(grid, 0, 2) === 1;
}

/**
 * givens: 남길 주어진 숫자 칸의 수 (권장 범위: 27~45)
 * 최솟값은 17 (수학적으로 유일 해를 보장하는 최소 givens)
 */
export function generatePuzzle(givens: number): { puzzle: CellValue[][]; solution: number[][] } {
  const clampedGivens = Math.max(17, Math.min(80, givens));
  const toRemove = 81 - clampedGivens;

  const grid: Grid = Array.from({ length: 9 }, () => Array(9).fill(0));
  fillGrid(grid, 0);

  const solution = grid.map((r) => [...r]);

  const positions = shuffle(Array.from({ length: 81 }, (_, i) => i));
  let removed = 0;

  for (const pos of positions) {
    if (removed >= toRemove) break;

    const row = Math.floor(pos / 9);
    const col = pos % 9;
    const backup = grid[row][col];

    grid[row][col] = 0;

    if (hasUniqueSolution(grid)) {
      removed++;
    } else {
      grid[row][col] = backup;
    }
  }

  return {
    puzzle: grid.map((r) => r.map((v) => (v === 0 ? null : v))),
    solution,
  };
}
