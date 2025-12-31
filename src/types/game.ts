/**
 * セルの状態を表す型
 */
export type CellState = 'Closed' | 'Opened' | 'Flagged';

/**
 * セルの値を表す型
 * - -1: 地雷
 * - 0: 空（周囲に地雷なし）
 * - 1-8: 周囲の地雷数
 */
export type CellValue = -1 | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

/**
 * セルの情報を表すインターフェース
 */
export interface Cell {
  state: CellState;
  value: CellValue;
  row: number;
  col: number;
}

/**
 * ゲームの状態を表す型
 */
export type GameStatus = 'Idle' | 'Playing' | 'Won' | 'Lost';

/**
 * 難易度を表す型
 */
export type Difficulty = 'Beginner' | 'Intermediate' | 'Expert';

/**
 * 難易度設定を表すインターフェース
 */
export interface DifficultyConfig {
  rows: number;
  cols: number;
  mines: number;
}

/**
 * ゲーム記録を表すインターフェース
 */
export interface GameRecord {
  difficulty: Difficulty;
  time: number; // 秒単位
  date: string; // ISO 8601形式の日付文字列
}
