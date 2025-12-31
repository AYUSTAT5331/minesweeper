import { describe, it, expect } from 'vitest';
import {
  createEmptyBoard,
  placeMines,
  calculateAdjacentMines,
  revealCell,
  checkWinCondition,
} from '../gameLogic';

describe('gameLogic', () => {
  describe('createEmptyBoard', () => {
    it('指定サイズのボードが作成される', () => {
      const board = createEmptyBoard(9, 9);
      expect(board).toHaveLength(9);
      expect(board[0]).toHaveLength(9);
    });

    it('すべてのセルが初期状態（Closed, value: 0）', () => {
      const board = createEmptyBoard(3, 3);
      board.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
          expect(cell.state).toBe('Closed');
          expect(cell.value).toBe(0);
          expect(cell.row).toBe(rowIndex);
          expect(cell.col).toBe(colIndex);
        });
      });
    });

    it('異なるサイズのボードが作成できる', () => {
      const board1 = createEmptyBoard(16, 16);
      expect(board1).toHaveLength(16);
      expect(board1[0]).toHaveLength(16);

      const board2 = createEmptyBoard(16, 30);
      expect(board2).toHaveLength(16);
      expect(board2[0]).toHaveLength(30);
    });
  });

  describe('placeMines', () => {
    it('指定された数の地雷が配置される', () => {
      const board = createEmptyBoard(9, 9);
      placeMines(board, 10, 0, 0);

      let mineCount = 0;
      board.forEach((row) => {
        row.forEach((cell) => {
          if (cell.value === -1) mineCount++;
        });
      });

      expect(mineCount).toBe(10);
    });

    it('最初のクリック位置とその周囲に地雷がない', () => {
      const board = createEmptyBoard(9, 9);
      const clickRow = 4;
      const clickCol = 4;
      placeMines(board, 10, clickRow, clickCol);

      // クリック位置とその周囲8マスをチェック
      for (let r = clickRow - 1; r <= clickRow + 1; r++) {
        for (let c = clickCol - 1; c <= clickCol + 1; c++) {
          if (r >= 0 && r < 9 && c >= 0 && c < 9) {
            expect(board[r][c].value).not.toBe(-1);
          }
        }
      }
    });

    it('地雷がランダムに配置される（複数回実行で異なる配置）', () => {
      const board1 = createEmptyBoard(9, 9);
      const board2 = createEmptyBoard(9, 9);

      placeMines(board1, 10, 0, 0);
      placeMines(board2, 10, 0, 0);

      // 少なくとも1つの違いがあることを確認
      let hasDifference = false;
      for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
          if (board1[r][c].value !== board2[r][c].value) {
            hasDifference = true;
            break;
          }
        }
        if (hasDifference) break;
      }

      // 注: ランダムなので稀に同じ配置になる可能性はあるが、確率は非常に低い
      expect(hasDifference).toBe(true);
    });

    it('境界値: 最小地雷数（1個）', () => {
      const board = createEmptyBoard(9, 9);
      placeMines(board, 1, 0, 0);

      let mineCount = 0;
      board.forEach((row) => {
        row.forEach((cell) => {
          if (cell.value === -1) mineCount++;
        });
      });

      expect(mineCount).toBe(1);
    });

    it('境界値: 最大地雷数（ボードサイズ - 安全ゾーン）', () => {
      const board = createEmptyBoard(5, 5);
      // 5x5 = 25セル、安全ゾーン9セル、最大16個の地雷
      placeMines(board, 16, 2, 2);

      let mineCount = 0;
      board.forEach((row) => {
        row.forEach((cell) => {
          if (cell.value === -1) mineCount++;
        });
      });

      expect(mineCount).toBe(16);
    });
  });

  describe('calculateAdjacentMines', () => {
    it('各セルの周囲地雷数が正しく計算される', () => {
      const board = createEmptyBoard(3, 3);
      // 地雷を手動で配置
      board[0][0].value = -1;
      board[0][2].value = -1;
      board[2][1].value = -1;

      calculateAdjacentMines(board);

      // 中央のセル (1,1) は周囲に3つの地雷
      expect(board[1][1].value).toBe(3);
      // (0,1) は周囲に2つの地雷
      expect(board[0][1].value).toBe(2);
      // (1,0) は周囲に2つの地雷
      expect(board[1][0].value).toBe(2);
      // (2,2) は周囲に1つの地雷
      expect(board[2][2].value).toBe(1);
    });

    it('端のセルで正しく計算される', () => {
      const board = createEmptyBoard(3, 3);
      board[1][1].value = -1; // 中央に地雷

      calculateAdjacentMines(board);

      // 四隅のセルは全て1
      expect(board[0][0].value).toBe(1);
      expect(board[0][2].value).toBe(1);
      expect(board[2][0].value).toBe(1);
      expect(board[2][2].value).toBe(1);
    });

    it('コーナーのセルで正しく計算される', () => {
      const board = createEmptyBoard(3, 3);
      board[0][1].value = -1;
      board[1][0].value = -1;

      calculateAdjacentMines(board);

      // 左上コーナー (0,0) は周囲に2つの地雷
      expect(board[0][0].value).toBe(2);
    });

    it('地雷セルの値は変更されない', () => {
      const board = createEmptyBoard(3, 3);
      board[0][0].value = -1;
      board[1][1].value = -1;

      calculateAdjacentMines(board);

      // 地雷セルは-1のまま
      expect(board[0][0].value).toBe(-1);
      expect(board[1][1].value).toBe(-1);
    });

    it('周囲に地雷がない場合は0のまま', () => {
      const board = createEmptyBoard(5, 5);
      board[0][0].value = -1; // 隅に地雷

      calculateAdjacentMines(board);

      // 遠くのセルは0のまま
      expect(board[4][4].value).toBe(0);
    });
  });

  describe('revealCell', () => {
    it('閉じているセルを開ける', () => {
      const board = createEmptyBoard(3, 3);
      board[1][1].value = 1;

      const newBoard = revealCell(board, 1, 1);

      expect(newBoard[1][1].state).toBe('Opened');
    });

    it('地雷セルを開いた場合、すべての地雷が表示される', () => {
      const board = createEmptyBoard(3, 3);
      board[0][0].value = -1;
      board[1][1].value = -1;
      board[2][2].value = -1;

      const newBoard = revealCell(board, 1, 1);

      // クリックしたセルが開く
      expect(newBoard[1][1].state).toBe('Opened');
      // 他の地雷も開く
      expect(newBoard[0][0].state).toBe('Opened');
      expect(newBoard[2][2].state).toBe('Opened');
    });

    it('数字セルを開いた場合、そのセルのみ開く', () => {
      const board = createEmptyBoard(3, 3);
      board[0][0].value = -1;
      calculateAdjacentMines(board);

      const newBoard = revealCell(board, 1, 1);

      expect(newBoard[1][1].state).toBe('Opened');
      // 周囲のセルは閉じたまま
      expect(newBoard[0][0].state).toBe('Closed');
      expect(newBoard[0][1].state).toBe('Closed');
    });

    it('空セル（0）を開いた場合、そのセルのみ開く（連鎖なし）', () => {
      const board = createEmptyBoard(5, 5);
      board[0][0].value = -1; // 遠くに地雷
      calculateAdjacentMines(board);

      const newBoard = revealCell(board, 4, 4);

      // クリックしたセルのみ開く
      expect(newBoard[4][4].state).toBe('Opened');
      expect(newBoard[4][4].value).toBe(0);

      // 周囲のセルは閉じたまま（連鎖オープンなし）
      expect(newBoard[3][3].state).toBe('Closed');
      expect(newBoard[3][4].state).toBe('Closed');
      expect(newBoard[4][3].state).toBe('Closed');
    });

    it('フラグ付きセルは開けない', () => {
      const board = createEmptyBoard(3, 3);
      board[1][1].value = 1;
      board[1][1].state = 'Flagged';

      const newBoard = revealCell(board, 1, 1);

      expect(newBoard[1][1].state).toBe('Flagged');
    });

    it('既に開いているセルは変化なし', () => {
      const board = createEmptyBoard(3, 3);
      board[1][1].value = 1;
      board[1][1].state = 'Opened';

      const newBoard = revealCell(board, 1, 1);

      expect(newBoard[1][1].state).toBe('Opened');
    });

    it('元のボードは変更されない（イミュータブル）', () => {
      const board = createEmptyBoard(3, 3);
      board[1][1].value = 1;

      const originalState = board[1][1].state;
      revealCell(board, 1, 1);

      expect(board[1][1].state).toBe(originalState);
    });
  });

  describe('checkWinCondition', () => {
    it('すべての安全セルを開いたらtrue', () => {
      const board = createEmptyBoard(3, 3);
      board[0][0].value = -1;
      board[2][2].value = -1;

      // 安全セルをすべて開く
      board.forEach((row) => {
        row.forEach((cell) => {
          if (cell.value !== -1) {
            cell.state = 'Opened';
          }
        });
      });

      expect(checkWinCondition(board)).toBe(true);
    });

    it('未開封の安全セルが残っていればfalse', () => {
      const board = createEmptyBoard(3, 3);
      board[0][0].value = -1;

      // 一部のセルのみ開く
      board[1][1].state = 'Opened';
      board[1][2].state = 'Opened';

      expect(checkWinCondition(board)).toBe(false);
    });

    it('地雷セルは無視される（開いていなくてもOK）', () => {
      const board = createEmptyBoard(3, 3);
      board[0][0].value = -1;
      board[2][2].value = -1;

      // 安全セルのみ開く（地雷は閉じたまま）
      board.forEach((row) => {
        row.forEach((cell) => {
          if (cell.value !== -1) {
            cell.state = 'Opened';
          }
        });
      });

      expect(checkWinCondition(board)).toBe(true);
    });

    it('地雷にフラグが立っていてもクリア条件には影響しない', () => {
      const board = createEmptyBoard(3, 3);
      board[0][0].value = -1;
      board[0][0].state = 'Flagged';

      // 安全セルをすべて開く
      board.forEach((row) => {
        row.forEach((cell) => {
          if (cell.value !== -1) {
            cell.state = 'Opened';
          }
        });
      });

      expect(checkWinCondition(board)).toBe(true);
    });

    it('すべて閉じている場合はfalse', () => {
      const board = createEmptyBoard(3, 3);
      board[0][0].value = -1;

      expect(checkWinCondition(board)).toBe(false);
    });
  });
});
