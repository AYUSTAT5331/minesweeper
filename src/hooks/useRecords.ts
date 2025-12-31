import { useState, useCallback } from 'react';
import type { Difficulty, GameRecord } from '../types/game';
import * as storage from '../utils/storage';

interface UseRecordsReturn {
  records: Record<Difficulty, GameRecord | null>;
  saveRecord: (difficulty: Difficulty, time: number) => void;
  clearRecord: (difficulty: Difficulty) => void;
  clearAllRecords: () => void;
  getRecordForDifficulty: (difficulty: Difficulty) => GameRecord | null;
}

export const useRecords = (): UseRecordsReturn => {
  const [records, setRecords] = useState<Record<Difficulty, GameRecord | null>>(() => {
    return storage.getAllRecords();
  });

  const saveRecord = useCallback((difficulty: Difficulty, time: number) => {
    storage.saveRecord(difficulty, time);
    // 保存後に最新の記録を取得して更新
    const updatedRecords = storage.getAllRecords();
    setRecords(updatedRecords);
  }, []);

  const clearRecord = useCallback((difficulty: Difficulty) => {
    storage.clearRecord(difficulty);
    // 削除後に最新の記録を取得して更新
    const updatedRecords = storage.getAllRecords();
    setRecords(updatedRecords);
  }, []);

  const clearAllRecords = useCallback(() => {
    storage.clearAllRecords();
    // 削除後に最新の記録を取得して更新
    const updatedRecords = storage.getAllRecords();
    setRecords(updatedRecords);
  }, []);

  const getRecordForDifficulty = useCallback(
    (difficulty: Difficulty): GameRecord | null => {
      return records[difficulty];
    },
    [records]
  );

  return {
    records,
    saveRecord,
    clearRecord,
    clearAllRecords,
    getRecordForDifficulty,
  };
};
