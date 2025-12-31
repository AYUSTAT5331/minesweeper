import type { Difficulty, DifficultyConfig } from '../types/game';

/**
 * 難易度ごとの設定
 */
export const DIFFICULTY_CONFIG: Record<Difficulty, DifficultyConfig> = {
  Beginner: {
    rows: 9,
    cols: 9,
    mines: 10,
  },
  Intermediate: {
    rows: 16,
    cols: 16,
    mines: 40,
  },
  Expert: {
    rows: 16,
    cols: 30,
    mines: 99,
  },
};

/**
 * LocalStorageのキー名
 */
export const STORAGE_KEYS = {
  RECORD_PREFIX: 'minesweeper_record_',
} as const;

/**
 * その他のゲーム定数
 */
export const GAME_CONSTANTS = {
  // 地雷を表す値
  MINE_VALUE: -1,
  // 空セルを表す値
  EMPTY_VALUE: 0,
  // 最初のクリック時に地雷を配置しない範囲（クリックしたセル + 周囲8マス）
  SAFE_ZONE_RADIUS: 1,
} as const;
