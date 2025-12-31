import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  saveRecord,
  getRecord,
  getAllRecords,
  clearRecord,
  clearAllRecords,
} from '../storage';
import type { Difficulty } from '../../types/game';

// LocalStorageのモック
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

// グローバルのlocalStorageを置き換え
Object.defineProperty(globalThis, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

describe('storage', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  describe('saveRecord', () => {
    it('新しい記録を保存できる', () => {
      const difficulty: Difficulty = 'Beginner';
      const time = 120; // 2分

      saveRecord(difficulty, time);

      const saved = getRecord(difficulty);
      expect(saved).not.toBeNull();
      expect(saved?.time).toBe(120);
      expect(saved?.difficulty).toBe('Beginner');
    });

    it('既存の記録より速い場合のみ更新される', () => {
      const difficulty: Difficulty = 'Intermediate';

      // 最初の記録: 180秒
      saveRecord(difficulty, 180);
      let saved = getRecord(difficulty);
      expect(saved?.time).toBe(180);

      // より遅い記録: 200秒 (更新されない)
      saveRecord(difficulty, 200);
      saved = getRecord(difficulty);
      expect(saved?.time).toBe(180);

      // より速い記録: 150秒 (更新される)
      saveRecord(difficulty, 150);
      saved = getRecord(difficulty);
      expect(saved?.time).toBe(150);
    });

    it('保存される記録にはdateが含まれる', () => {
      const difficulty: Difficulty = 'Expert';
      saveRecord(difficulty, 300);

      const saved = getRecord(difficulty);
      expect(saved?.date).toBeDefined();
      expect(typeof saved?.date).toBe('string');

      // ISO 8601形式かチェック
      const date = new Date(saved!.date);
      expect(date.toString()).not.toBe('Invalid Date');
    });

    it('異なる難易度の記録は独立して保存される', () => {
      saveRecord('Beginner', 100);
      saveRecord('Intermediate', 200);
      saveRecord('Expert', 300);

      expect(getRecord('Beginner')?.time).toBe(100);
      expect(getRecord('Intermediate')?.time).toBe(200);
      expect(getRecord('Expert')?.time).toBe(300);
    });
  });

  describe('getRecord', () => {
    it('保存された記録を正しく取得できる', () => {
      const difficulty: Difficulty = 'Beginner';
      saveRecord(difficulty, 150);

      const record = getRecord(difficulty);
      expect(record).not.toBeNull();
      expect(record?.difficulty).toBe('Beginner');
      expect(record?.time).toBe(150);
    });

    it('記録がない場合はnullを返す', () => {
      const record = getRecord('Intermediate');
      expect(record).toBeNull();
    });

    it('不正なデータの場合はnullを返す', () => {
      // 不正なJSONを直接保存
      localStorage.setItem('minesweeper_record_Beginner', 'invalid json');

      const record = getRecord('Beginner');
      expect(record).toBeNull();
    });
  });

  describe('getAllRecords', () => {
    it('すべての難易度の記録を取得できる', () => {
      saveRecord('Beginner', 100);
      saveRecord('Intermediate', 200);
      saveRecord('Expert', 300);

      const records = getAllRecords();
      expect(records.Beginner?.time).toBe(100);
      expect(records.Intermediate?.time).toBe(200);
      expect(records.Expert?.time).toBe(300);
    });

    it('記録がない難易度はnullになる', () => {
      saveRecord('Beginner', 100);
      // Intermediate と Expert の記録はなし

      const records = getAllRecords();
      expect(records.Beginner).not.toBeNull();
      expect(records.Beginner?.difficulty).toBe('Beginner');
      expect(records.Intermediate).toBeNull();
      expect(records.Expert).toBeNull();
    });

    it('記録が全くない場合はすべてnullを返す', () => {
      const records = getAllRecords();
      expect(records).toEqual({
        Beginner: null,
        Intermediate: null,
        Expert: null,
      });
    });
  });

  describe('clearRecord', () => {
    it('指定された難易度の記録を削除できる', () => {
      saveRecord('Beginner', 100);
      saveRecord('Intermediate', 200);

      clearRecord('Beginner');

      expect(getRecord('Beginner')).toBeNull();
      expect(getRecord('Intermediate')?.time).toBe(200);
    });

    it('存在しない記録を削除してもエラーにならない', () => {
      expect(() => clearRecord('Expert')).not.toThrow();
    });
  });

  describe('clearAllRecords', () => {
    it('すべての記録を削除できる', () => {
      saveRecord('Beginner', 100);
      saveRecord('Intermediate', 200);
      saveRecord('Expert', 300);

      clearAllRecords();

      expect(getRecord('Beginner')).toBeNull();
      expect(getRecord('Intermediate')).toBeNull();
      expect(getRecord('Expert')).toBeNull();
      expect(getAllRecords()).toEqual({
        Beginner: null,
        Intermediate: null,
        Expert: null,
      });
    });

    it('記録がない状態でも実行できる', () => {
      expect(() => clearAllRecords()).not.toThrow();
    });
  });

  describe('エラーハンドリング', () => {
    it('LocalStorageが使えない場合でもエラーにならない', () => {
      // localStorageを一時的に無効化
      const originalLocalStorage = globalThis.localStorage;
      // @ts-expect-error テスト用に一時的に削除
      delete globalThis.localStorage;

      expect(() => saveRecord('Beginner', 100)).not.toThrow();
      expect(() => getRecord('Beginner')).not.toThrow();
      expect(() => getAllRecords()).not.toThrow();
      expect(() => clearRecord('Beginner')).not.toThrow();
      expect(() => clearAllRecords()).not.toThrow();

      // 元に戻す
      Object.defineProperty(globalThis, 'localStorage', {
        value: originalLocalStorage,
        writable: true,
      });
    });

    it('QuotaExceededError が発生してもエラーにならない', () => {
      // setItemでエラーを投げるようにモック
      const originalSetItem = localStorage.setItem;
      vi.spyOn(localStorage, 'setItem').mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });

      expect(() => saveRecord('Beginner', 100)).not.toThrow();

      // 元に戻す
      localStorage.setItem = originalSetItem;
    });
  });
});
