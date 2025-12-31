import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

// Mock the components
vi.mock('./components/GameBoard/GameBoard', () => ({
  GameBoard: () => <div data-testid="game-board">Game Board Mock</div>,
}));

vi.mock('./components/RecordsScreen/RecordsScreen', () => ({
  RecordsScreen: () => <div data-testid="records-screen">Records Screen Mock</div>,
}));

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('画面の表示', () => {
    it('初期状態でゲーム画面が表示される', () => {
      render(<App />);

      expect(screen.getByTestId('game-board')).toBeInTheDocument();
      expect(screen.queryByTestId('records-screen')).not.toBeInTheDocument();
    });

    it('レコード画面切り替えボタンが表示される', () => {
      render(<App />);

      expect(screen.getByRole('button', { name: /records/i })).toBeInTheDocument();
    });
  });

  describe('画面の切り替え', () => {
    it('レコードボタンをクリックするとレコード画面が表示される', async () => {
      const user = userEvent.setup();
      render(<App />);

      const recordsButton = screen.getByRole('button', { name: /records/i });
      await user.click(recordsButton);

      expect(screen.getByTestId('records-screen')).toBeInTheDocument();
      expect(screen.queryByTestId('game-board')).not.toBeInTheDocument();
    });

    it('レコード画面からゲーム画面に戻れる', async () => {
      const user = userEvent.setup();
      render(<App />);

      // レコード画面に移動
      const recordsButton = screen.getByRole('button', { name: /records/i });
      await user.click(recordsButton);

      // ゲーム画面に戻る
      const gameButton = screen.getByRole('button', { name: /game|back/i });
      await user.click(gameButton);

      expect(screen.getByTestId('game-board')).toBeInTheDocument();
      expect(screen.queryByTestId('records-screen')).not.toBeInTheDocument();
    });

    it('画面切り替えを複数回行える', async () => {
      const user = userEvent.setup();
      render(<App />);

      // ゲーム → レコード
      await user.click(screen.getByRole('button', { name: /records/i }));
      expect(screen.getByTestId('records-screen')).toBeInTheDocument();

      // レコード → ゲーム
      await user.click(screen.getByRole('button', { name: /game|back/i }));
      expect(screen.getByTestId('game-board')).toBeInTheDocument();

      // ゲーム → レコード
      await user.click(screen.getByRole('button', { name: /records/i }));
      expect(screen.getByTestId('records-screen')).toBeInTheDocument();
    });
  });

  describe('ボタンの表示制御', () => {
    it('ゲーム画面ではレコードボタンのみ表示される', () => {
      render(<App />);

      expect(screen.getByRole('button', { name: /records/i })).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /game|back/i })).not.toBeInTheDocument();
    });

    it('レコード画面ではゲームに戻るボタンのみ表示される', async () => {
      const user = userEvent.setup();
      render(<App />);

      await user.click(screen.getByRole('button', { name: /view records/i }));

      expect(screen.getByRole('button', { name: /game|back/i })).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /view records/i })).not.toBeInTheDocument();
    });
  });

  describe('統合テスト', () => {
    it('アプリケーション全体のフロー', async () => {
      const user = userEvent.setup();
      render(<App />);

      // 初期状態：ゲーム画面
      expect(screen.getByTestId('game-board')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /records/i })).toBeInTheDocument();

      // レコード画面に切り替え
      await user.click(screen.getByRole('button', { name: /records/i }));
      expect(screen.getByTestId('records-screen')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /game|back/i })).toBeInTheDocument();

      // ゲーム画面に戻る
      await user.click(screen.getByRole('button', { name: /game|back/i }));
      expect(screen.getByTestId('game-board')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /records/i })).toBeInTheDocument();
    });
  });
});
