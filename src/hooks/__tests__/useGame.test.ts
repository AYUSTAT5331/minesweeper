import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useGame } from '../useGame';
import type { CellState, CellValue } from '../../types/game';
import * as gameLogic from '../../utils/gameLogic';

// gameLogic モジュールをモック
vi.mock('../../utils/gameLogic', () => ({
  createEmptyBoard: vi.fn(),
  placeMines: vi.fn(),
  calculateAdjacentMines: vi.fn(),
  revealCell: vi.fn(),
  checkWinCondition: vi.fn(),
}));

describe('useGame', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const createMockBoard = (rows: number, cols: number) => {
    return Array.from({ length: rows }, (_, row) =>
      Array.from({ length: cols }, (_, col) => ({
        state: 'Closed' as CellState,
        value: 0 as CellValue,
        row,
        col,
      }))
    );
  };

  describe('初期状態', () => {
    it('gameStatus は Idle で初期化される', () => {
      const mockBoard = createMockBoard(9, 9);
      vi.mocked(gameLogic.createEmptyBoard).mockReturnValue(mockBoard);

      const { result } = renderHook(() => useGame());

      expect(result.current.gameStatus).toBe('Idle');
    });

    it('difficulty は Beginner で初期化される', () => {
      const mockBoard = createMockBoard(9, 9);
      vi.mocked(gameLogic.createEmptyBoard).mockReturnValue(mockBoard);

      const { result } = renderHook(() => useGame());

      expect(result.current.difficulty).toBe('Beginner');
    });

    it('minesRemaining は難易度に応じた地雷数で初期化される', () => {
      const mockBoard = createMockBoard(9, 9);
      vi.mocked(gameLogic.createEmptyBoard).mockReturnValue(mockBoard);

      const { result } = renderHook(() => useGame());

      // Beginner は 10 個の地雷
      expect(result.current.minesRemaining).toBe(10);
    });

    it('board が createEmptyBoard で初期化される', () => {
      const mockBoard = createMockBoard(9, 9);
      vi.mocked(gameLogic.createEmptyBoard).mockReturnValue(mockBoard);

      const { result } = renderHook(() => useGame());

      expect(gameLogic.createEmptyBoard).toHaveBeenCalledWith(9, 9);
      expect(result.current.board).toEqual(mockBoard);
    });

    it('time は 0 で初期化される', () => {
      const mockBoard = createMockBoard(9, 9);
      vi.mocked(gameLogic.createEmptyBoard).mockReturnValue(mockBoard);

      const { result } = renderHook(() => useGame());

      expect(result.current.time).toBe(0);
    });
  });

  describe('initGame', () => {
    it('initGame を呼ぶと新しいボードが作成される', () => {
      const mockBoard = createMockBoard(9, 9);
      vi.mocked(gameLogic.createEmptyBoard).mockReturnValue(mockBoard);

      const { result } = renderHook(() => useGame());

      act(() => {
        result.current.initGame();
      });

      expect(gameLogic.createEmptyBoard).toHaveBeenCalledWith(9, 9);
    });

    it('initGame を呼ぶと gameStatus が Idle になる', () => {
      const mockBoard = createMockBoard(9, 9);
      vi.mocked(gameLogic.createEmptyBoard).mockReturnValue(mockBoard);
      vi.mocked(gameLogic.placeMines).mockReturnValue(undefined);
      vi.mocked(gameLogic.calculateAdjacentMines).mockReturnValue(undefined);
      vi.mocked(gameLogic.revealCell).mockReturnValue(mockBoard);
      vi.mocked(gameLogic.checkWinCondition).mockReturnValue(false);

      const { result } = renderHook(() => useGame());

      // ゲームを進行させる
      act(() => {
        result.current.handleCellClick(0, 0);
      });

      expect(result.current.gameStatus).toBe('Playing');

      // initGame でリセット
      act(() => {
        result.current.initGame();
      });

      expect(result.current.gameStatus).toBe('Idle');
    });

    it('initGame を呼ぶと time が 0 にリセットされる', () => {
      const mockBoard = createMockBoard(9, 9);
      vi.mocked(gameLogic.createEmptyBoard).mockReturnValue(mockBoard);

      const { result } = renderHook(() => useGame());

      // ゲームを開始してタイマーを進める
      vi.mocked(gameLogic.placeMines).mockReturnValue(undefined);
      vi.mocked(gameLogic.calculateAdjacentMines).mockReturnValue(undefined);
      vi.mocked(gameLogic.revealCell).mockReturnValue(mockBoard);
      vi.mocked(gameLogic.checkWinCondition).mockReturnValue(false);

      act(() => {
        result.current.handleCellClick(0, 0);
      });

      act(() => {
        vi.advanceTimersByTime(5000);
      });

      expect(result.current.time).toBe(5);

      // initGame でリセット
      act(() => {
        result.current.initGame();
      });

      expect(result.current.time).toBe(0);
    });
  });

  describe('handleCellClick', () => {
    it('最初のクリックで地雷が配置される', () => {
      const mockBoard = createMockBoard(9, 9);
      vi.mocked(gameLogic.createEmptyBoard).mockReturnValue(mockBoard);
      vi.mocked(gameLogic.placeMines).mockReturnValue(undefined);
      vi.mocked(gameLogic.calculateAdjacentMines).mockReturnValue(undefined);
      vi.mocked(gameLogic.revealCell).mockReturnValue(mockBoard);
      vi.mocked(gameLogic.checkWinCondition).mockReturnValue(false);

      const { result } = renderHook(() => useGame());

      act(() => {
        result.current.handleCellClick(0, 0);
      });

      expect(gameLogic.placeMines).toHaveBeenCalledWith(mockBoard, 10, 0, 0);
      expect(gameLogic.calculateAdjacentMines).toHaveBeenCalled();
    });

    it('最初のクリックで gameStatus が Playing になる', () => {
      const mockBoard = createMockBoard(9, 9);
      vi.mocked(gameLogic.createEmptyBoard).mockReturnValue(mockBoard);
      vi.mocked(gameLogic.placeMines).mockReturnValue(undefined);
      vi.mocked(gameLogic.calculateAdjacentMines).mockReturnValue(undefined);
      vi.mocked(gameLogic.revealCell).mockReturnValue(mockBoard);
      vi.mocked(gameLogic.checkWinCondition).mockReturnValue(false);

      const { result } = renderHook(() => useGame());

      expect(result.current.gameStatus).toBe('Idle');

      act(() => {
        result.current.handleCellClick(0, 0);
      });

      expect(result.current.gameStatus).toBe('Playing');
    });

    it('最初のクリックでタイマーが開始される', () => {
      const mockBoard = createMockBoard(9, 9);
      vi.mocked(gameLogic.createEmptyBoard).mockReturnValue(mockBoard);
      vi.mocked(gameLogic.placeMines).mockReturnValue(undefined);
      vi.mocked(gameLogic.calculateAdjacentMines).mockReturnValue(undefined);
      vi.mocked(gameLogic.revealCell).mockReturnValue(mockBoard);
      vi.mocked(gameLogic.checkWinCondition).mockReturnValue(false);

      const { result } = renderHook(() => useGame());

      act(() => {
        result.current.handleCellClick(0, 0);
      });

      act(() => {
        vi.advanceTimersByTime(3000);
      });

      expect(result.current.time).toBe(3);
    });

    it('セルがクリックされると revealCell が呼ばれる', () => {
      const mockBoard = createMockBoard(9, 9);
      vi.mocked(gameLogic.createEmptyBoard).mockReturnValue(mockBoard);
      vi.mocked(gameLogic.placeMines).mockReturnValue(undefined);
      vi.mocked(gameLogic.calculateAdjacentMines).mockReturnValue(undefined);
      vi.mocked(gameLogic.revealCell).mockReturnValue(mockBoard);
      vi.mocked(gameLogic.checkWinCondition).mockReturnValue(false);

      const { result } = renderHook(() => useGame());

      act(() => {
        result.current.handleCellClick(1, 2);
      });

      expect(gameLogic.revealCell).toHaveBeenCalledWith(expect.anything(), 1, 2);
    });

    it('地雷を踏むと gameStatus が Lost になる', () => {
      const mockBoard = createMockBoard(9, 9);
      mockBoard[0][0].value = -1; // 地雷
      vi.mocked(gameLogic.createEmptyBoard).mockReturnValue(mockBoard);
      vi.mocked(gameLogic.placeMines).mockReturnValue(undefined);
      vi.mocked(gameLogic.calculateAdjacentMines).mockReturnValue(undefined);
      vi.mocked(gameLogic.revealCell).mockReturnValue(mockBoard);
      vi.mocked(gameLogic.checkWinCondition).mockReturnValue(false);

      const { result } = renderHook(() => useGame());

      act(() => {
        result.current.handleCellClick(0, 0);
      });

      expect(result.current.gameStatus).toBe('Lost');
    });

    it('勝利条件を満たすと gameStatus が Won になる', () => {
      const mockBoard = createMockBoard(9, 9);
      vi.mocked(gameLogic.createEmptyBoard).mockReturnValue(mockBoard);
      vi.mocked(gameLogic.placeMines).mockReturnValue(undefined);
      vi.mocked(gameLogic.calculateAdjacentMines).mockReturnValue(undefined);
      vi.mocked(gameLogic.revealCell).mockReturnValue(mockBoard);
      vi.mocked(gameLogic.checkWinCondition).mockReturnValue(true);

      const { result } = renderHook(() => useGame());

      act(() => {
        result.current.handleCellClick(0, 0);
      });

      expect(result.current.gameStatus).toBe('Won');
    });

    it('ゲーム終了後はクリックできない', () => {
      const mockBoard = createMockBoard(9, 9);
      mockBoard[0][0].value = -1; // 地雷
      vi.mocked(gameLogic.createEmptyBoard).mockReturnValue(mockBoard);
      vi.mocked(gameLogic.placeMines).mockReturnValue(undefined);
      vi.mocked(gameLogic.calculateAdjacentMines).mockReturnValue(undefined);
      vi.mocked(gameLogic.revealCell).mockReturnValue(mockBoard);

      const { result } = renderHook(() => useGame());

      // 地雷を踏んでゲームオーバー
      act(() => {
        result.current.handleCellClick(0, 0);
      });

      expect(result.current.gameStatus).toBe('Lost');

      // revealCell の呼び出し回数をリセット
      vi.mocked(gameLogic.revealCell).mockClear();

      // もう一度クリックしても revealCell は呼ばれない
      act(() => {
        result.current.handleCellClick(1, 1);
      });

      expect(gameLogic.revealCell).not.toHaveBeenCalled();
    });
  });

  describe('handleCellRightClick', () => {
    it('右クリックでフラグが設置される', () => {
      const mockBoard = createMockBoard(9, 9);
      vi.mocked(gameLogic.createEmptyBoard).mockReturnValue(mockBoard);

      const { result } = renderHook(() => useGame());

      expect(result.current.board[0][0].state).toBe('Closed');

      act(() => {
        result.current.handleCellRightClick(0, 0);
      });

      expect(result.current.board[0][0].state).toBe('Flagged');
    });

    it('フラグ付きセルを右クリックするとフラグが外れる', () => {
      const mockBoard = createMockBoard(9, 9);
      vi.mocked(gameLogic.createEmptyBoard).mockReturnValue(mockBoard);

      const { result } = renderHook(() => useGame());

      // フラグを立てる
      act(() => {
        result.current.handleCellRightClick(0, 0);
      });

      expect(result.current.board[0][0].state).toBe('Flagged');

      // フラグを外す
      act(() => {
        result.current.handleCellRightClick(0, 0);
      });

      expect(result.current.board[0][0].state).toBe('Closed');
    });

    it('フラグを立てると minesRemaining が減る', () => {
      const mockBoard = createMockBoard(9, 9);
      vi.mocked(gameLogic.createEmptyBoard).mockReturnValue(mockBoard);

      const { result } = renderHook(() => useGame());

      expect(result.current.minesRemaining).toBe(10);

      act(() => {
        result.current.handleCellRightClick(0, 0);
      });

      expect(result.current.minesRemaining).toBe(9);
    });

    it('フラグを外すと minesRemaining が増える', () => {
      const mockBoard = createMockBoard(9, 9);
      vi.mocked(gameLogic.createEmptyBoard).mockReturnValue(mockBoard);

      const { result } = renderHook(() => useGame());

      // フラグを立てる
      act(() => {
        result.current.handleCellRightClick(0, 0);
      });

      expect(result.current.minesRemaining).toBe(9);

      // フラグを外す
      act(() => {
        result.current.handleCellRightClick(0, 0);
      });

      expect(result.current.minesRemaining).toBe(10);
    });

    it('開封済みセルは右クリックできない', () => {
      const mockBoard = createMockBoard(9, 9);
      mockBoard[0][0].state = 'Opened';
      vi.mocked(gameLogic.createEmptyBoard).mockReturnValue(mockBoard);

      const { result } = renderHook(() => useGame());

      act(() => {
        result.current.handleCellRightClick(0, 0);
      });

      // 状態は変わらない
      expect(result.current.board[0][0].state).toBe('Opened');
      expect(result.current.minesRemaining).toBe(10);
    });

    it('ゲーム終了後は右クリックできない', () => {
      const mockBoard = createMockBoard(9, 9);
      mockBoard[0][0].value = -1; // 地雷
      vi.mocked(gameLogic.createEmptyBoard).mockReturnValue(mockBoard);
      vi.mocked(gameLogic.placeMines).mockReturnValue(undefined);
      vi.mocked(gameLogic.calculateAdjacentMines).mockReturnValue(undefined);
      vi.mocked(gameLogic.revealCell).mockReturnValue(mockBoard);

      const { result } = renderHook(() => useGame());

      // 地雷を踏んでゲームオーバー
      act(() => {
        result.current.handleCellClick(0, 0);
      });

      expect(result.current.gameStatus).toBe('Lost');

      // 右クリックしても変化なし
      act(() => {
        result.current.handleCellRightClick(1, 1);
      });

      expect(result.current.board[1][1].state).toBe('Closed');
    });
  });

  describe('restartGame', () => {
    it('restartGame を呼ぶとゲームがリセットされる', () => {
      const mockBoard = createMockBoard(9, 9);
      vi.mocked(gameLogic.createEmptyBoard).mockReturnValue(mockBoard);

      const { result } = renderHook(() => useGame());

      act(() => {
        result.current.restartGame();
      });

      expect(result.current.gameStatus).toBe('Idle');
      expect(result.current.time).toBe(0);
    });
  });

  describe('changeDifficulty', () => {
    it('changeDifficulty を呼ぶと難易度が変更される', () => {
      const mockBoardBeginner = createMockBoard(9, 9);
      const mockBoardIntermediate = createMockBoard(16, 16);
      vi.mocked(gameLogic.createEmptyBoard)
        .mockReturnValueOnce(mockBoardBeginner)
        .mockReturnValueOnce(mockBoardIntermediate);

      const { result } = renderHook(() => useGame());

      expect(result.current.difficulty).toBe('Beginner');

      act(() => {
        result.current.changeDifficulty('Intermediate');
      });

      expect(result.current.difficulty).toBe('Intermediate');
      expect(gameLogic.createEmptyBoard).toHaveBeenCalledWith(16, 16);
    });

    it('changeDifficulty を呼ぶと minesRemaining が更新される', () => {
      const mockBoardBeginner = createMockBoard(9, 9);
      const mockBoardExpert = createMockBoard(16, 30);
      vi.mocked(gameLogic.createEmptyBoard)
        .mockReturnValueOnce(mockBoardBeginner)
        .mockReturnValueOnce(mockBoardExpert);

      const { result } = renderHook(() => useGame());

      expect(result.current.minesRemaining).toBe(10); // Beginner

      act(() => {
        result.current.changeDifficulty('Expert');
      });

      expect(result.current.minesRemaining).toBe(99); // Expert
    });

    it('changeDifficulty を呼ぶとゲームがリセットされる', () => {
      const mockBoardBeginner = createMockBoard(9, 9);
      const mockBoardIntermediate = createMockBoard(16, 16);
      vi.mocked(gameLogic.createEmptyBoard)
        .mockReturnValueOnce(mockBoardBeginner)
        .mockReturnValueOnce(mockBoardIntermediate);
      vi.mocked(gameLogic.placeMines).mockReturnValue(undefined);
      vi.mocked(gameLogic.calculateAdjacentMines).mockReturnValue(undefined);
      vi.mocked(gameLogic.revealCell).mockReturnValue(mockBoardBeginner);
      vi.mocked(gameLogic.checkWinCondition).mockReturnValue(false);

      const { result } = renderHook(() => useGame());

      // ゲームを開始
      act(() => {
        result.current.handleCellClick(0, 0);
      });

      expect(result.current.gameStatus).toBe('Playing');

      // 難易度変更
      act(() => {
        result.current.changeDifficulty('Intermediate');
      });

      expect(result.current.gameStatus).toBe('Idle');
      expect(result.current.time).toBe(0);
    });
  });
});
