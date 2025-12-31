import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RecordsScreen } from '../RecordsScreen';
import { useRecords } from '../../../hooks/useRecords';
import type { Difficulty } from '../../../types/game';

vi.mock('../../../hooks/useRecords');

describe('RecordsScreen', () => {
  const mockRecords = {
    Beginner: { difficulty: 'Beginner' as Difficulty, time: 45, date: new Date('2024-01-01').toISOString() },
    Intermediate: { difficulty: 'Intermediate' as Difficulty, time: 120, date: new Date('2024-01-02').toISOString() },
    Expert: null,
  };

  const mockSaveRecord = vi.fn();
  const mockClearRecord = vi.fn();
  const mockClearAllRecords = vi.fn();
  const mockGetRecordForDifficulty = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useRecords).mockReturnValue({
      records: mockRecords,
      saveRecord: mockSaveRecord,
      clearRecord: mockClearRecord,
      clearAllRecords: mockClearAllRecords,
      getRecordForDifficulty: mockGetRecordForDifficulty,
    });
  });

  describe('画面表示', () => {
    it('タイトルが表示される', () => {
      render(<RecordsScreen />);

      expect(screen.getByRole('heading', { name: 'Best Times' })).toBeInTheDocument();
    });

    it('3つの難易度セクションが表示される', () => {
      render(<RecordsScreen />);

      expect(screen.getByText('Beginner')).toBeInTheDocument();
      expect(screen.getByText('Intermediate')).toBeInTheDocument();
      expect(screen.getByText('Expert')).toBeInTheDocument();
    });

    it('グリッドサイズと地雷数が表示される', () => {
      render(<RecordsScreen />);

      // Beginner: 9×9, 10 mines
      expect(screen.getByText(/9.*×.*9/)).toBeInTheDocument();
      expect(screen.getByText(/10.*mines/i)).toBeInTheDocument();

      // Intermediate: 16×16, 40 mines
      expect(screen.getByText(/16.*×.*16/)).toBeInTheDocument();
      expect(screen.getByText(/40.*mines/i)).toBeInTheDocument();

      // Expert: 16×30, 99 mines
      expect(screen.getByText(/16.*×.*30/)).toBeInTheDocument();
      expect(screen.getByText(/99.*mines/i)).toBeInTheDocument();
    });
  });

  describe('記録の表示', () => {
    it('記録がある場合、時間が表示される（Beginner）', () => {
      render(<RecordsScreen />);

      // 45秒 = 00:45
      expect(screen.getByText('00:45')).toBeInTheDocument();
    });

    it('記録がある場合、時間が表示される（Intermediate）', () => {
      render(<RecordsScreen />);

      // 120秒 = 02:00
      expect(screen.getByText('02:00')).toBeInTheDocument();
    });

    it('記録がない場合、「--:--」が表示される', () => {
      render(<RecordsScreen />);

      // Expert has no record
      const noRecordElements = screen.getAllByText('--:--');
      expect(noRecordElements.length).toBeGreaterThan(0);
    });

    it('すべての記録がない場合、すべて「--:--」が表示される', () => {
      vi.mocked(useRecords).mockReturnValue({
        records: {
          Beginner: null,
          Intermediate: null,
          Expert: null,
        },
        saveRecord: mockSaveRecord,
        clearRecord: mockClearRecord,
        clearAllRecords: mockClearAllRecords,
        getRecordForDifficulty: mockGetRecordForDifficulty,
      });

      render(<RecordsScreen />);

      const noRecordElements = screen.getAllByText('--:--');
      expect(noRecordElements).toHaveLength(3); // 3 difficulties
    });
  });

  describe('記録のクリア機能', () => {
    it('個別クリアボタンが表示される（記録がある場合）', () => {
      render(<RecordsScreen />);

      // Beginner と Intermediate には記録があるので、クリアボタンが表示される
      const clearButtons = screen.getAllByRole('button', { name: /clear/i });
      expect(clearButtons.length).toBeGreaterThanOrEqual(2);
    });

    it('個別クリアボタンが表示されない（記録がない場合）', () => {
      vi.mocked(useRecords).mockReturnValue({
        records: {
          Beginner: null,
          Intermediate: null,
          Expert: null,
        },
        saveRecord: mockSaveRecord,
        clearRecord: mockClearRecord,
        clearAllRecords: mockClearAllRecords,
        getRecordForDifficulty: mockGetRecordForDifficulty,
      });

      render(<RecordsScreen />);

      const clearButtons = screen.queryAllByRole('button', { name: /clear.*beginner/i });
      expect(clearButtons).toHaveLength(0);
    });

    it('個別クリアボタンをクリックするとclearRecordが呼ばれる', async () => {
      const user = userEvent.setup();
      render(<RecordsScreen />);

      // Beginnerのクリアボタンをクリック
      const clearButton = screen.getByRole('button', { name: /clear.*beginner/i });
      await user.click(clearButton);

      expect(mockClearRecord).toHaveBeenCalledTimes(1);
      expect(mockClearRecord).toHaveBeenCalledWith('Beginner');
    });

    it('全クリアボタンが表示される（記録が1つ以上ある場合）', () => {
      render(<RecordsScreen />);

      expect(screen.getByRole('button', { name: /clear all/i })).toBeInTheDocument();
    });

    it('全クリアボタンが表示されない（記録が全くない場合）', () => {
      vi.mocked(useRecords).mockReturnValue({
        records: {
          Beginner: null,
          Intermediate: null,
          Expert: null,
        },
        saveRecord: mockSaveRecord,
        clearRecord: mockClearRecord,
        clearAllRecords: mockClearAllRecords,
        getRecordForDifficulty: mockGetRecordForDifficulty,
      });

      render(<RecordsScreen />);

      const clearAllButton = screen.queryByRole('button', { name: /clear all/i });
      expect(clearAllButton).not.toBeInTheDocument();
    });

    it('全クリアボタンをクリックするとclearAllRecordsが呼ばれる', async () => {
      const user = userEvent.setup();
      render(<RecordsScreen />);

      const clearAllButton = screen.getByRole('button', { name: /clear all/i });
      await user.click(clearAllButton);

      expect(mockClearAllRecords).toHaveBeenCalledTimes(1);
    });
  });

  describe('時間のフォーマット', () => {
    it('様々な時間が正しくフォーマットされる', () => {
      const testRecords = {
        Beginner: { difficulty: 'Beginner' as Difficulty, time: 5, date: new Date().toISOString() }, // 00:05
        Intermediate: { difficulty: 'Intermediate' as Difficulty, time: 90, date: new Date().toISOString() }, // 01:30
        Expert: { difficulty: 'Expert' as Difficulty, time: 3599, date: new Date().toISOString() }, // 59:59
      };

      vi.mocked(useRecords).mockReturnValue({
        records: testRecords,
        saveRecord: mockSaveRecord,
        clearRecord: mockClearRecord,
        clearAllRecords: mockClearAllRecords,
        getRecordForDifficulty: mockGetRecordForDifficulty,
      });

      render(<RecordsScreen />);

      expect(screen.getByText('00:05')).toBeInTheDocument();
      expect(screen.getByText('01:30')).toBeInTheDocument();
      expect(screen.getByText('59:59')).toBeInTheDocument();
    });
  });

  describe('統合テスト', () => {
    it('記録画面の完全なフロー', async () => {
      const user = userEvent.setup();
      render(<RecordsScreen />);

      // タイトルと難易度が表示される
      expect(screen.getByText('Best Times')).toBeInTheDocument();
      expect(screen.getByText('Beginner')).toBeInTheDocument();

      // 記録が表示される
      expect(screen.getByText('00:45')).toBeInTheDocument();
      expect(screen.getByText('02:00')).toBeInTheDocument();

      // クリアボタンが表示される
      const clearButtons = screen.getAllByRole('button', { name: /clear/i });
      expect(clearButtons.length).toBeGreaterThan(0);

      // 個別クリア
      const beginnerClearButton = screen.getByRole('button', { name: /clear.*beginner/i });
      await user.click(beginnerClearButton);
      expect(mockClearRecord).toHaveBeenCalledWith('Beginner');

      // 全クリア
      const clearAllButton = screen.getByRole('button', { name: /clear all/i });
      await user.click(clearAllButton);
      expect(mockClearAllRecords).toHaveBeenCalledTimes(1);
    });
  });
});
