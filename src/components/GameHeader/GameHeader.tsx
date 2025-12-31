import type { GameStatus } from '../../types/game';
import styles from './GameHeader.module.css';

interface GameHeaderProps {
  time: number;
  minesRemaining: number;
  gameStatus: GameStatus;
  onRestart: () => void;
}

export const GameHeader = ({
  time,
  minesRemaining,
  gameStatus,
  onRestart,
}: GameHeaderProps) => {
  // 時間を MM:SS 形式に変換
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // ゲーム状態に応じた絵文字を取得
  const getStatusEmoji = (): string => {
    switch (gameStatus) {
      case 'Won':
        return '😎';
      case 'Lost':
        return '😵';
      case 'Idle':
      case 'Playing':
      default:
        return '😊';
    }
  };

  return (
    <div className={styles.header}>
      <div className={styles.info}>
        <div className={styles.counter}>
          <span className={styles.label}>💣</span>
          <span className={styles.value}>{minesRemaining}</span>
        </div>

        <button
          className={styles.restartButton}
          onClick={onRestart}
          type="button"
          aria-label="Restart game"
        >
          {getStatusEmoji()}
        </button>

        <div className={styles.counter}>
          <span className={styles.label}>⏱️</span>
          <span className={styles.value}>{formatTime(time)}</span>
        </div>
      </div>
    </div>
  );
};
