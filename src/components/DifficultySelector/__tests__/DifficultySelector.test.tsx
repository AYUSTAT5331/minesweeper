import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DifficultySelector } from '../DifficultySelector';
import type { Difficulty } from '../../../types/game';

describe('DifficultySelector', () => {
  describe('難易度ボタンの表示', () => {
    it('3つの難易度ボタンが表示される', () => {
      const onSelect = vi.fn();
      render(<DifficultySelector currentDifficulty="Beginner" onSelect={onSelect} />);

      expect(screen.getByRole('button', { name: /beginner/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /intermediate/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /expert/i })).toBeInTheDocument();
    });

    it('Beginner ボタンに詳細情報が表示される', () => {
      const onSelect = vi.fn();
      render(<DifficultySelector currentDifficulty="Beginner" onSelect={onSelect} />);

      // 9×9 と 10 mines が表示される
      const beginnerButton = screen.getByRole('button', { name: /beginner/i });
      expect(beginnerButton.textContent).toContain('9 × 9');
      expect(beginnerButton.textContent).toContain('10 mines');
    });

    it('Intermediate ボタンに詳細情報が表示される', () => {
      const onSelect = vi.fn();
      render(<DifficultySelector currentDifficulty="Intermediate" onSelect={onSelect} />);

      // 16×16 と 40 mines が表示される
      expect(screen.getByText(/16.*16/)).toBeInTheDocument();
      expect(screen.getByText(/40.*mines/i)).toBeInTheDocument();
    });

    it('Expert ボタンに詳細情報が表示される', () => {
      const onSelect = vi.fn();
      render(<DifficultySelector currentDifficulty="Expert" onSelect={onSelect} />);

      // 16×30 と 99 mines が表示される
      expect(screen.getByText(/16.*30/)).toBeInTheDocument();
      expect(screen.getByText(/99.*mines/i)).toBeInTheDocument();
    });
  });

  describe('ボタンのクリック', () => {
    const difficulties: Difficulty[] = ['Beginner', 'Intermediate', 'Expert'];

    difficulties.forEach((difficulty) => {
      it(`${difficulty} ボタンをクリックすると onSelect が呼ばれる`, async () => {
        const user = userEvent.setup();
        const onSelect = vi.fn();
        render(<DifficultySelector currentDifficulty="Beginner" onSelect={onSelect} />);

        const button = screen.getByRole('button', { name: new RegExp(difficulty, 'i') });
        await user.click(button);

        expect(onSelect).toHaveBeenCalledTimes(1);
        expect(onSelect).toHaveBeenCalledWith(difficulty);
      });
    });

    it('ボタンを複数回クリックできる', async () => {
      const user = userEvent.setup();
      const onSelect = vi.fn();
      render(<DifficultySelector currentDifficulty="Beginner" onSelect={onSelect} />);

      const beginnerButton = screen.getByRole('button', { name: /beginner/i });
      const intermediateButton = screen.getByRole('button', { name: /intermediate/i });

      await user.click(beginnerButton);
      await user.click(intermediateButton);
      await user.click(beginnerButton);

      expect(onSelect).toHaveBeenCalledTimes(3);
      expect(onSelect).toHaveBeenNthCalledWith(1, 'Beginner');
      expect(onSelect).toHaveBeenNthCalledWith(2, 'Intermediate');
      expect(onSelect).toHaveBeenNthCalledWith(3, 'Beginner');
    });
  });

  describe('現在選択中の難易度のハイライト', () => {
    it('Beginner が選択中の場合、Beginner ボタンがアクティブになる', () => {
      const onSelect = vi.fn();
      render(
        <DifficultySelector currentDifficulty="Beginner" onSelect={onSelect} />
      );

      const beginnerButton = screen.getByRole('button', { name: /beginner/i });
      expect(beginnerButton.className).toContain('active');
    });

    it('Intermediate が選択中の場合、Intermediate ボタンがアクティブになる', () => {
      const onSelect = vi.fn();
      render(<DifficultySelector currentDifficulty="Intermediate" onSelect={onSelect} />);

      const intermediateButton = screen.getByRole('button', { name: /intermediate/i });
      expect(intermediateButton.className).toContain('active');
    });

    it('Expert が選択中の場合、Expert ボタンがアクティブになる', () => {
      const onSelect = vi.fn();
      render(<DifficultySelector currentDifficulty="Expert" onSelect={onSelect} />);

      const expertButton = screen.getByRole('button', { name: /expert/i });
      expect(expertButton.className).toContain('active');
    });

    it('選択中でないボタンはアクティブにならない', () => {
      const onSelect = vi.fn();
      render(<DifficultySelector currentDifficulty="Beginner" onSelect={onSelect} />);

      const intermediateButton = screen.getByRole('button', { name: /intermediate/i });
      const expertButton = screen.getByRole('button', { name: /expert/i });

      expect(intermediateButton.className).not.toContain('active');
      expect(expertButton.className).not.toContain('active');
    });
  });

  describe('難易度の変更', () => {
    it('難易度が変更されると、ハイライトが更新される', () => {
      const onSelect = vi.fn();
      const { rerender } = render(
        <DifficultySelector currentDifficulty="Beginner" onSelect={onSelect} />
      );

      let beginnerButton = screen.getByRole('button', { name: /beginner/i });
      let intermediateButton = screen.getByRole('button', { name: /intermediate/i });

      expect(beginnerButton.className).toContain('active');
      expect(intermediateButton.className).not.toContain('active');

      // 難易度を変更
      rerender(<DifficultySelector currentDifficulty="Intermediate" onSelect={onSelect} />);

      beginnerButton = screen.getByRole('button', { name: /beginner/i });
      intermediateButton = screen.getByRole('button', { name: /intermediate/i });

      expect(beginnerButton.className).not.toContain('active');
      expect(intermediateButton.className).toContain('active');
    });
  });

  describe('統合テスト', () => {
    it('難易度選択の完全なフロー', async () => {
      const user = userEvent.setup();
      const onSelect = vi.fn();
      const { rerender } = render(
        <DifficultySelector currentDifficulty="Beginner" onSelect={onSelect} />
      );

      // 初期状態の確認
      expect(screen.getByRole('button', { name: /beginner/i }).className).toContain('active');

      // Intermediate を選択
      const intermediateButton = screen.getByRole('button', { name: /intermediate/i });
      await user.click(intermediateButton);

      expect(onSelect).toHaveBeenCalledWith('Intermediate');

      // 難易度が変更されたと仮定してrerender
      rerender(<DifficultySelector currentDifficulty="Intermediate" onSelect={onSelect} />);

      // Intermediate がアクティブになっている
      expect(screen.getByRole('button', { name: /intermediate/i }).className).toContain(
        'active'
      );
      expect(screen.getByRole('button', { name: /beginner/i }).className).not.toContain(
        'active'
      );
    });
  });
});
