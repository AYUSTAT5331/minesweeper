import type { Difficulty, GameRecord } from '../types/game';
import { STORAGE_KEYS } from '../constants/difficulty';

/**
 * LocalStorageが使用可能かチェック
 */
function isLocalStorageAvailable(): boolean {
  try {
    return typeof localStorage !== 'undefined';
  } catch {
    return false;
  }
}

/**
 * 記録のキーを生成
 */
function getRecordKey(difficulty: Difficulty): string {
  return `${STORAGE_KEYS.RECORD_PREFIX}${difficulty}`;
}

/**
 * 記録を保存する
 * 既存の記録より速い場合のみ更新する
 * @param difficulty 難易度
 * @param time タイム（秒）
 */
export function saveRecord(difficulty: Difficulty, time: number): void {
  if (!isLocalStorageAvailable()) return;

  try {
    const existingRecord = getRecord(difficulty);

    // 既存の記録がない、または既存の記録より速い場合のみ保存
    if (!existingRecord || time < existingRecord.time) {
      const record: GameRecord = {
        difficulty,
        time,
        date: new Date().toISOString(),
      };

      localStorage.setItem(getRecordKey(difficulty), JSON.stringify(record));
    }
  } catch (error) {
    // エラーが発生しても処理を続行
    console.error('Failed to save record:', error);
  }
}

/**
 * 記録を取得する
 * @param difficulty 難易度
 * @returns 記録。存在しない場合はnull
 */
export function getRecord(difficulty: Difficulty): GameRecord | null {
  if (!isLocalStorageAvailable()) return null;

  try {
    const data = localStorage.getItem(getRecordKey(difficulty));
    if (!data) return null;

    const record = JSON.parse(data) as GameRecord;
    return record;
  } catch (error) {
    // パースエラーなどの場合はnullを返す
    console.error('Failed to get record:', error);
    return null;
  }
}

/**
 * すべての難易度の記録を取得する
 * @returns 記録の配列
 */
export function getAllRecords(): Record<Difficulty, GameRecord | null> {
  const difficulties: Difficulty[] = ['Beginner', 'Intermediate', 'Expert'];
  const records: Record<Difficulty, GameRecord | null> = {
    Beginner: null,
    Intermediate: null,
    Expert: null,
  };

  for (const difficulty of difficulties) {
    const record = getRecord(difficulty);
    records[difficulty] = record;
  }

  return records;
}

/**
 * 指定された難易度の記録を削除する
 * @param difficulty 難易度
 */
export function clearRecord(difficulty: Difficulty): void {
  if (!isLocalStorageAvailable()) return;

  try {
    localStorage.removeItem(getRecordKey(difficulty));
  } catch (error) {
    console.error('Failed to clear record:', error);
  }
}

/**
 * すべての記録を削除する
 */
export function clearAllRecords(): void {
  const difficulties: Difficulty[] = ['Beginner', 'Intermediate', 'Expert'];

  for (const difficulty of difficulties) {
    clearRecord(difficulty);
  }
}
