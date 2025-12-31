import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useRecords } from '../useRecords';
import type { Difficulty } from '../../types/game';
import * as storage from '../../utils/storage';

// storage モジュールをモック
vi.mock('../../utils/storage', () => ({
  saveRecord: vi.fn(),
  getRecord: vi.fn(),
  getAllRecords: vi.fn(),
  clearRecord: vi.fn(),
  clearAllRecords: vi.fn(),
}));

describe('useRecords', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('初期状態', () => {
    it('マウント時に getAllRecords を呼び出して記録を取得する', () => {
      const mockRecords = {
        Beginner: { difficulty: 'Beginner' as Difficulty, time: 30, date: '2025-01-01' },
        Intermediate: null,
        Expert: null,
      };

      vi.mocked(storage.getAllRecords).mockReturnValue(mockRecords);

      const { result } = renderHook(() => useRecords());

      expect(storage.getAllRecords).toHaveBeenCalledTimes(1);
      expect(result.current.records).toEqual(mockRecords);
    });

    it('記録がない場合は全て null の records を返す', () => {
      const mockRecords = {
        Beginner: null,
        Intermediate: null,
        Expert: null,
      };

      vi.mocked(storage.getAllRecords).mockReturnValue(mockRecords);

      const { result } = renderHook(() => useRecords());

      expect(result.current.records).toEqual(mockRecords);
    });
  });

  describe('saveRecord', () => {
    it('saveRecord を呼び出すと storage.saveRecord が実行される', () => {
      vi.mocked(storage.getAllRecords).mockReturnValue({
        Beginner: null,
        Intermediate: null,
        Expert: null,
      });

      const { result } = renderHook(() => useRecords());

      act(() => {
        result.current.saveRecord('Beginner', 25);
      });

      expect(storage.saveRecord).toHaveBeenCalledWith('Beginner', 25);
    });

    it('saveRecord 後、records が更新される', async () => {
      const initialRecords = {
        Beginner: null,
        Intermediate: null,
        Expert: null,
      };

      const updatedRecords = {
        Beginner: { difficulty: 'Beginner' as Difficulty, time: 25, date: '2025-01-01' },
        Intermediate: null,
        Expert: null,
      };

      vi.mocked(storage.getAllRecords)
        .mockReturnValueOnce(initialRecords)
        .mockReturnValueOnce(updatedRecords);

      const { result } = renderHook(() => useRecords());

      expect(result.current.records.Beginner).toBeNull();

      act(() => {
        result.current.saveRecord('Beginner', 25);
      });

      await waitFor(() => {
        expect(result.current.records.Beginner).toEqual({
          difficulty: 'Beginner',
          time: 25,
          date: '2025-01-01',
        });
      });
    });

    it('複数の難易度の記録を保存できる', async () => {
      const initialRecords = {
        Beginner: null,
        Intermediate: null,
        Expert: null,
      };

      vi.mocked(storage.getAllRecords).mockReturnValue(initialRecords);

      const { result, rerender } = renderHook(() => useRecords());

      // Beginner の記録を保存
      const recordsAfterBeginner = {
        Beginner: { difficulty: 'Beginner' as Difficulty, time: 30, date: '2025-01-01' },
        Intermediate: null,
        Expert: null,
      };

      vi.mocked(storage.getAllRecords).mockReturnValue(recordsAfterBeginner);

      act(() => {
        result.current.saveRecord('Beginner', 30);
      });

      rerender();

      await waitFor(() => {
        expect(result.current.records.Beginner?.time).toBe(30);
      });

      // Intermediate の記録を保存
      const recordsAfterIntermediate = {
        Beginner: { difficulty: 'Beginner' as Difficulty, time: 30, date: '2025-01-01' },
        Intermediate: { difficulty: 'Intermediate' as Difficulty, time: 120, date: '2025-01-02' },
        Expert: null,
      };

      vi.mocked(storage.getAllRecords).mockReturnValue(recordsAfterIntermediate);

      act(() => {
        result.current.saveRecord('Intermediate', 120);
      });

      rerender();

      await waitFor(() => {
        expect(result.current.records.Intermediate?.time).toBe(120);
      });
    });
  });

  describe('clearRecord', () => {
    it('clearRecord を呼び出すと storage.clearRecord が実行される', () => {
      vi.mocked(storage.getAllRecords).mockReturnValue({
        Beginner: { difficulty: 'Beginner' as Difficulty, time: 30, date: '2025-01-01' },
        Intermediate: null,
        Expert: null,
      });

      const { result } = renderHook(() => useRecords());

      act(() => {
        result.current.clearRecord('Beginner');
      });

      expect(storage.clearRecord).toHaveBeenCalledWith('Beginner');
    });

    it('clearRecord 後、records が更新される', async () => {
      const initialRecords = {
        Beginner: { difficulty: 'Beginner' as Difficulty, time: 30, date: '2025-01-01' },
        Intermediate: null,
        Expert: null,
      };

      const updatedRecords = {
        Beginner: null,
        Intermediate: null,
        Expert: null,
      };

      vi.mocked(storage.getAllRecords)
        .mockReturnValueOnce(initialRecords)
        .mockReturnValueOnce(updatedRecords);

      const { result } = renderHook(() => useRecords());

      expect(result.current.records.Beginner).not.toBeNull();

      act(() => {
        result.current.clearRecord('Beginner');
      });

      await waitFor(() => {
        expect(result.current.records.Beginner).toBeNull();
      });
    });
  });

  describe('getRecordForDifficulty', () => {
    it('指定した難易度の記録を取得できる', () => {
      const mockRecords = {
        Beginner: { difficulty: 'Beginner' as Difficulty, time: 30, date: '2025-01-01' },
        Intermediate: { difficulty: 'Intermediate' as Difficulty, time: 120, date: '2025-01-02' },
        Expert: null,
      };

      vi.mocked(storage.getAllRecords).mockReturnValue(mockRecords);

      const { result } = renderHook(() => useRecords());

      expect(result.current.getRecordForDifficulty('Beginner')).toEqual({
        difficulty: 'Beginner',
        time: 30,
        date: '2025-01-01',
      });

      expect(result.current.getRecordForDifficulty('Intermediate')).toEqual({
        difficulty: 'Intermediate',
        time: 120,
        date: '2025-01-02',
      });

      expect(result.current.getRecordForDifficulty('Expert')).toBeNull();
    });
  });

  describe('ベストタイム更新判定', () => {
    it('既存の記録より速い場合のみ保存される（storage側で判定）', () => {
      vi.mocked(storage.getAllRecords).mockReturnValue({
        Beginner: { difficulty: 'Beginner' as Difficulty, time: 30, date: '2025-01-01' },
        Intermediate: null,
        Expert: null,
      });

      const { result } = renderHook(() => useRecords());

      // storage.saveRecord が呼ばれることを確認
      // （実際の更新判定は storage 側で行われる）
      act(() => {
        result.current.saveRecord('Beginner', 25);
      });

      expect(storage.saveRecord).toHaveBeenCalledWith('Beginner', 25);
    });
  });
});
