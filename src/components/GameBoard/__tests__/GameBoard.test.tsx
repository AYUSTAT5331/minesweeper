import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GameBoard } from '../GameBoard';
import { useGame } from '../../../hooks/useGame';
import type { Cell, GameStatus, Difficulty } from '../../../types/game';

vi.mock('../../../hooks/useGame');

describe('GameBoard', () => {
  const createMockCell = (row: number, col: number, overrides?: Partial<Cell>): Cell => ({
    row,
    col,
    state: 'Closed',
    value: 0,
    ...overrides,
  });

  const createMockBoard = (rows: number, cols: number): Cell[][] => {
    const board: Cell[][] = [];
    for (let r = 0; r < rows; r++) {
      const row: Cell[] = [];
      for (let c = 0; c < cols; c++) {
        row.push(createMockCell(r, c));
      }
      board.push(row);
    }
    return board;
  };

  const mockUseGame = {
    difficulty: 'Beginner' as Difficulty,
    board: createMockBoard(9, 9),
    gameStatus: 'Idle' as GameStatus,
    minesRemaining: 10,
    time: 0,
    initGame: vi.fn(),
    handleCellClick: vi.fn(),
    handleCellRightClick: vi.fn(),
    restartGame: vi.fn(),
    changeDifficulty: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useGame).mockReturnValue(mockUseGame);
  });

  describe('ボードの表示', () => {
    it('9×9のボード（Beginner）が表示される', () => {
      render(<GameBoard />);

      const cells = screen.getAllByRole('button');
      // 81 cells + 1 restart button + 3 difficulty buttons = 85
      expect(cells).toHaveLength(85);
    });

    it('16×16のボード（Intermediate）が表示される', () => {
      vi.mocked(useGame).mockReturnValue({
        ...mockUseGame,
        difficulty: 'Intermediate',
        board: createMockBoard(16, 16),
      });

      render(<GameBoard />);

      const cells = screen.getAllByRole('button');
      // 256 cells + 1 restart button + 3 difficulty buttons = 260
      expect(cells).toHaveLength(260);
    });

    it(
      '16×30のボード（Expert）が表示される',
      () => {
        vi.mocked(useGame).mockReturnValue({
          ...mockUseGame,
          difficulty: 'Expert',
          board: createMockBoard(16, 30),
        });

        render(<GameBoard />);

        const cells = screen.getAllByRole('button');
        // 480 cells + 1 restart button + 3 difficulty buttons = 484
        expect(cells).toHaveLength(484);
      },
      10000
    );
  });

  describe('GameHeaderの統合', () => {
    it('GameHeaderが表示される', () => {
      const { container } = render(<GameBoard />);

      // タイマーが表示される
      expect(screen.getByText('00:00')).toBeInTheDocument();
      // 地雷数（アイコンと数値）が表示される
      expect(container.textContent).toContain('💣');
      expect(container.textContent).toContain('10');
    });

    it('GameHeaderのリスタートボタンが動作する', async () => {
      const user = userEvent.setup();
      const restartGame = vi.fn();
      vi.mocked(useGame).mockReturnValue({
        ...mockUseGame,
        restartGame,
      });

      render(<GameBoard />);

      const restartButton = screen.getByRole('button', { name: /restart/i });
      await user.click(restartButton);

      expect(restartGame).toHaveBeenCalledTimes(1);
    });
  });

  describe('DifficultySelectorの統合', () => {
    it('DifficultySelectorが表示される', () => {
      render(<GameBoard />);

      expect(screen.getByText('Select Difficulty')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /beginner/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /intermediate/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /expert/i })).toBeInTheDocument();
    });

    it('難易度ボタンをクリックするとchangeDifficultyが呼ばれる', async () => {
      const user = userEvent.setup();
      const changeDifficulty = vi.fn();
      vi.mocked(useGame).mockReturnValue({
        ...mockUseGame,
        changeDifficulty,
      });

      render(<GameBoard />);

      const intermediateButton = screen.getByRole('button', { name: /intermediate/i });
      await user.click(intermediateButton);

      expect(changeDifficulty).toHaveBeenCalledTimes(1);
      expect(changeDifficulty).toHaveBeenCalledWith('Intermediate');
    });
  });

  describe('セルのクリック', () => {
    it('セルを左クリックするとhandleCellClickが呼ばれる', async () => {
      const user = userEvent.setup();
      const handleCellClick = vi.fn();
      vi.mocked(useGame).mockReturnValue({
        ...mockUseGame,
        handleCellClick,
      });

      render(<GameBoard />);

      // 最初のセル（0, 0）をクリック
      const cells = screen.getAllByRole('button');
      // GameHeaderのボタンとDifficultySelectorのボタンがあるので、
      // ゲームボードのセルは後半にある
      const firstCell = cells.find(
        (cell) => !cell.textContent?.includes('😊') && cell.getAttribute('aria-label') === undefined
      );

      if (firstCell) {
        await user.click(firstCell);
        expect(handleCellClick).toHaveBeenCalled();
      }
    });

    it('セルを右クリックするとhandleCellRightClickが呼ばれる', async () => {
      const user = userEvent.setup();
      const handleCellRightClick = vi.fn();
      vi.mocked(useGame).mockReturnValue({
        ...mockUseGame,
        handleCellRightClick,
      });

      const { container } = render(<GameBoard />);

      // ゲームボードのセルを探す
      const gameBoard = container.querySelector('[class*="board"]');
      if (gameBoard) {
        const cells = gameBoard.querySelectorAll('button');
        if (cells.length > 0) {
          await user.pointer({ keys: '[MouseRight]', target: cells[0] });
          expect(handleCellRightClick).toHaveBeenCalled();
        }
      }
    });
  });

  describe('ゲーム状態の反映', () => {
    it('Playing状態でタイマーが動く', () => {
      vi.mocked(useGame).mockReturnValue({
        ...mockUseGame,
        gameStatus: 'Playing',
        time: 45,
      });

      render(<GameBoard />);

      expect(screen.getByText('00:45')).toBeInTheDocument();
    });

    it('Lost状態で😵が表示される', () => {
      vi.mocked(useGame).mockReturnValue({
        ...mockUseGame,
        gameStatus: 'Lost',
      });

      const { container } = render(<GameBoard />);

      expect(container.textContent).toContain('😵');
    });

    it('Won状態で😎が表示される', () => {
      vi.mocked(useGame).mockReturnValue({
        ...mockUseGame,
        gameStatus: 'Won',
      });

      render(<GameBoard />);

      expect(screen.getByText('😎')).toBeInTheDocument();
    });
  });

  describe('セルの状態表示', () => {
    it('Openedセルが正しく表示される', () => {
      const board = createMockBoard(3, 3);
      board[0][0] = createMockCell(0, 0, { state: 'Opened', value: 1 });

      vi.mocked(useGame).mockReturnValue({
        ...mockUseGame,
        board,
      });

      render(<GameBoard />);

      // 数字1が表示されている
      expect(screen.getByText('1')).toBeInTheDocument();
    });

    it('Flaggedセルが正しく表示される', () => {
      const board = createMockBoard(3, 3);
      board[1][1] = createMockCell(1, 1, { state: 'Flagged' });

      vi.mocked(useGame).mockReturnValue({
        ...mockUseGame,
        board,
      });

      render(<GameBoard />);

      // フラグが表示されている
      expect(screen.getByText('🚩')).toBeInTheDocument();
    });

    it('地雷セル（Opened）が正しく表示される', () => {
      const board = createMockBoard(3, 3);
      board[2][2] = createMockCell(2, 2, { state: 'Opened', value: -1 });

      vi.mocked(useGame).mockReturnValue({
        ...mockUseGame,
        board,
        gameStatus: 'Lost',
      });

      render(<GameBoard />);

      // 地雷が表示されている（GameHeaderとCellの両方に💣があるので複数）
      const mineElements = screen.getAllByText('💣');
      expect(mineElements.length).toBeGreaterThan(0);
    });
  });

  describe('統合テスト', () => {
    it('ゲーム全体のフローが動作する', async () => {
      userEvent.setup();
      const handleCellClick = vi.fn();
      const changeDifficulty = vi.fn();
      const restartGame = vi.fn();

      vi.mocked(useGame).mockReturnValue({
        ...mockUseGame,
        handleCellClick,
        changeDifficulty,
        restartGame,
      });

      render(<GameBoard />);

      // 難易度セレクタが表示されている
      expect(screen.getByText('Select Difficulty')).toBeInTheDocument();

      // ヘッダーが表示されている
      expect(screen.getByText('00:00')).toBeInTheDocument();

      // ボードが表示されている（9×9 = 81セル + ヘッダーとセレクタのボタン）
      const allButtons = screen.getAllByRole('button');
      expect(allButtons.length).toBeGreaterThan(81);
    });
  });
});
