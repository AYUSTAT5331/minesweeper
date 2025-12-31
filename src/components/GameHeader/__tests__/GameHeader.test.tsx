import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GameHeader } from '../GameHeader';
import type { GameStatus } from '../../../types/game';

describe('GameHeader', () => {
  describe('タイマーの表示', () => {
    it('0秒が "00:00" として表示される', () => {
      const onRestart = vi.fn();
      render(
        <GameHeader
          time={0}
          minesRemaining={10}
          gameStatus="Idle"
          onRestart={onRestart}
        />
      );

      expect(screen.getByText('00:00')).toBeInTheDocument();
    });

    it('15秒が "00:15" として表示される', () => {
      const onRestart = vi.fn();
      render(
        <GameHeader
          time={15}
          minesRemaining={10}
          gameStatus="Playing"
          onRestart={onRestart}
        />
      );

      expect(screen.getByText('00:15')).toBeInTheDocument();
    });

    it('90秒が "01:30" として表示される', () => {
      const onRestart = vi.fn();
      render(
        <GameHeader
          time={90}
          minesRemaining={10}
          gameStatus="Playing"
          onRestart={onRestart}
        />
      );

      expect(screen.getByText('01:30')).toBeInTheDocument();
    });

    it('3599秒が "59:59" として表示される', () => {
      const onRestart = vi.fn();
      render(
        <GameHeader
          time={3599}
          minesRemaining={10}
          gameStatus="Playing"
          onRestart={onRestart}
        />
      );

      expect(screen.getByText('59:59')).toBeInTheDocument();
    });

    it('3600秒（1時間）が "60:00" として表示される', () => {
      const onRestart = vi.fn();
      render(
        <GameHeader
          time={3600}
          minesRemaining={10}
          gameStatus="Playing"
          onRestart={onRestart}
        />
      );

      expect(screen.getByText('60:00')).toBeInTheDocument();
    });
  });

  describe('地雷残数の表示', () => {
    it('正の数（10）が表示される', () => {
      const onRestart = vi.fn();
      render(
        <GameHeader
          time={0}
          minesRemaining={10}
          gameStatus="Idle"
          onRestart={onRestart}
        />
      );

      expect(screen.getByText(/10/)).toBeInTheDocument();
    });

    it('0が表示される', () => {
      const onRestart = vi.fn();
      const { container } = render(
        <GameHeader
          time={0}
          minesRemaining={0}
          gameStatus="Playing"
          onRestart={onRestart}
        />
      );

      // 地雷アイコンと0が含まれることを確認
      expect(container.textContent).toContain('💣');
      expect(container.textContent).toContain('0');
    });

    it('負の数（-2）が表示される', () => {
      const onRestart = vi.fn();
      render(
        <GameHeader
          time={0}
          minesRemaining={-2}
          gameStatus="Playing"
          onRestart={onRestart}
        />
      );

      expect(screen.getByText(/-2/)).toBeInTheDocument();
    });

    it('大きな数（99）が表示される', () => {
      const onRestart = vi.fn();
      render(
        <GameHeader
          time={0}
          minesRemaining={99}
          gameStatus="Idle"
          onRestart={onRestart}
        />
      );

      expect(screen.getByText(/99/)).toBeInTheDocument();
    });
  });

  describe('ゲーム状態の表示', () => {
    const testCases: Array<{ status: GameStatus; emoji: string }> = [
      { status: 'Idle', emoji: '😊' },
      { status: 'Playing', emoji: '😊' },
      { status: 'Won', emoji: '😎' },
      { status: 'Lost', emoji: '😵' },
    ];

    testCases.forEach(({ status, emoji }) => {
      it(`${status} 状態で ${emoji} が表示される`, () => {
        const onRestart = vi.fn();
        render(
          <GameHeader
            time={0}
            minesRemaining={10}
            gameStatus={status}
            onRestart={onRestart}
          />
        );

        expect(screen.getByText(emoji)).toBeInTheDocument();
      });
    });
  });

  describe('リスタートボタン', () => {
    it('リスタートボタンが表示される', () => {
      const onRestart = vi.fn();
      render(
        <GameHeader
          time={0}
          minesRemaining={10}
          gameStatus="Idle"
          onRestart={onRestart}
        />
      );

      const restartButton = screen.getByRole('button', { name: /restart/i });
      expect(restartButton).toBeInTheDocument();
    });

    it('リスタートボタンをクリックすると onRestart が呼ばれる', async () => {
      const user = userEvent.setup();
      const onRestart = vi.fn();
      render(
        <GameHeader
          time={30}
          minesRemaining={5}
          gameStatus="Playing"
          onRestart={onRestart}
        />
      );

      const restartButton = screen.getByRole('button', { name: /restart/i });
      await user.click(restartButton);

      expect(onRestart).toHaveBeenCalledTimes(1);
    });

    it('リスタートボタンを複数回クリックできる', async () => {
      const user = userEvent.setup();
      const onRestart = vi.fn();
      render(
        <GameHeader
          time={0}
          minesRemaining={10}
          gameStatus="Idle"
          onRestart={onRestart}
        />
      );

      const restartButton = screen.getByRole('button', { name: /restart/i });
      await user.click(restartButton);
      await user.click(restartButton);
      await user.click(restartButton);

      expect(onRestart).toHaveBeenCalledTimes(3);
    });
  });

  describe('統合テスト', () => {
    it('すべての情報が正しく表示される', () => {
      const onRestart = vi.fn();
      const { container } = render(
        <GameHeader
          time={125}
          minesRemaining={7}
          gameStatus="Playing"
          onRestart={onRestart}
        />
      );

      // タイマー
      expect(screen.getByText('02:05')).toBeInTheDocument();
      // 地雷残数（containerのtextContentで確認）
      expect(container.textContent).toContain('💣');
      expect(container.textContent).toContain('7');
      // ゲーム状態
      expect(screen.getByText('😊')).toBeInTheDocument();
      // リスタートボタン
      expect(screen.getByRole('button', { name: /restart/i })).toBeInTheDocument();
    });

    it('ゲームオーバー時の表示', () => {
      const onRestart = vi.fn();
      render(
        <GameHeader
          time={45}
          minesRemaining={8}
          gameStatus="Lost"
          onRestart={onRestart}
        />
      );

      expect(screen.getByText('00:45')).toBeInTheDocument();
      expect(screen.getByText(/8/)).toBeInTheDocument();
      expect(screen.getByText('😵')).toBeInTheDocument();
    });

    it('ゲームクリア時の表示', () => {
      const onRestart = vi.fn();
      const { container } = render(
        <GameHeader
          time={180}
          minesRemaining={0}
          gameStatus="Won"
          onRestart={onRestart}
        />
      );

      expect(screen.getByText('03:00')).toBeInTheDocument();
      // 地雷アイコンと0が含まれることを確認
      expect(container.textContent).toContain('💣');
      expect(container.textContent).toContain('0');
      expect(screen.getByText('😎')).toBeInTheDocument();
    });
  });
});
