import type { Cell, CellValue } from '../types/game';

/**
 * 空のボードを作成する
 * @param rows 行数
 * @param cols 列数
 * @returns 初期化されたボード
 */
export function createEmptyBoard(rows: number, cols: number): Cell[][] {
  const board: Cell[][] = [];

  for (let row = 0; row < rows; row++) {
    const rowCells: Cell[] = [];
    for (let col = 0; col < cols; col++) {
      rowCells.push({
        state: 'Closed',
        value: 0,
        row,
        col,
      });
    }
    board.push(rowCells);
  }

  return board;
}

/**
 * ボードに地雷を配置する
 * @param board ボード
 * @param mineCount 地雷の数
 * @param firstClickRow 最初にクリックした行
 * @param firstClickCol 最初にクリックした列
 */
export function placeMines(
  board: Cell[][],
  mineCount: number,
  firstClickRow: number,
  firstClickCol: number
): void {
  const rows = board.length;
  const cols = board[0].length;

  // 安全ゾーン（最初のクリック位置 + 周囲8マス）を特定
  const safeZone = new Set<string>();
  for (let r = firstClickRow - 1; r <= firstClickRow + 1; r++) {
    for (let c = firstClickCol - 1; c <= firstClickCol + 1; c++) {
      if (r >= 0 && r < rows && c >= 0 && c < cols) {
        safeZone.add(`${r},${c}`);
      }
    }
  }

  // 配置可能な位置のリストを作成
  const availablePositions: { row: number; col: number }[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (!safeZone.has(`${r},${c}`)) {
        availablePositions.push({ row: r, col: c });
      }
    }
  }

  // ランダムに地雷を配置
  for (let i = 0; i < mineCount; i++) {
    if (availablePositions.length === 0) break;

    const randomIndex = Math.floor(Math.random() * availablePositions.length);
    const { row, col } = availablePositions[randomIndex];

    board[row][col].value = -1;
    availablePositions.splice(randomIndex, 1);
  }
}

/**
 * 各セルの周囲の地雷数を計算する
 * @param board ボード
 */
export function calculateAdjacentMines(board: Cell[][]): void {
  const rows = board.length;
  const cols = board[0].length;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      // 地雷セルはスキップ
      if (board[row][col].value === -1) continue;

      let mineCount = 0;

      // 周囲8マスをチェック
      for (let r = row - 1; r <= row + 1; r++) {
        for (let c = col - 1; c <= col + 1; c++) {
          // 自分自身はスキップ
          if (r === row && c === col) continue;

          // ボードの範囲内かチェック
          if (r >= 0 && r < rows && c >= 0 && c < cols) {
            if (board[r][c].value === -1) {
              mineCount++;
            }
          }
        }
      }

      board[row][col].value = mineCount as CellValue;
    }
  }
}

/**
 * セルを開く
 * @param board ボード
 * @param row 行
 * @param col 列
 * @returns 新しいボード（元のボードは変更しない）
 */
export function revealCell(board: Cell[][], row: number, col: number): Cell[][] {
  // ディープコピー
  const newBoard = board.map((rowCells) =>
    rowCells.map((cell) => ({ ...cell }))
  );

  const cell = newBoard[row][col];

  // フラグ付きセルまたは既に開いているセルは何もしない
  if (cell.state === 'Flagged' || cell.state === 'Opened') {
    return newBoard;
  }

  // セルを開く
  cell.state = 'Opened';

  // 地雷セルの場合、すべての地雷を表示
  if (cell.value === -1) {
    newBoard.forEach((rowCells) => {
      rowCells.forEach((c) => {
        if (c.value === -1) {
          c.state = 'Opened';
        }
      });
    });
  }

  // 数字セルまたは空セルの場合、そのセルのみ開く（連鎖オープンなし）

  return newBoard;
}

/**
 * 勝利条件をチェックする
 * @param board ボード
 * @returns すべての安全セルが開かれている場合true
 */
export function checkWinCondition(board: Cell[][]): boolean {
  for (const row of board) {
    for (const cell of row) {
      // 地雷でないセルが閉じている、またはフラグ付きの場合はまだクリアしていない
      if (cell.value !== -1 && cell.state !== 'Opened') {
        return false;
      }
    }
  }
  return true;
}
