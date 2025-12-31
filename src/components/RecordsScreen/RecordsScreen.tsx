import { useRecords } from '../../hooks/useRecords';
import { DIFFICULTY_CONFIG } from '../../constants/difficulty';
import type { Difficulty } from '../../types/game';
import styles from './RecordsScreen.module.css';

const difficulties: Difficulty[] = ['Beginner', 'Intermediate', 'Expert'];

export const RecordsScreen = () => {
  const { records, clearRecord, clearAllRecords } = useRecords();

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const hasAnyRecord = Object.values(records).some((record) => record !== null);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Best Times</h1>

      <div className={styles.recordsList}>
        {difficulties.map((difficulty) => {
          const config = DIFFICULTY_CONFIG[difficulty];
          const record = records[difficulty];

          return (
            <div key={difficulty} className={styles.recordItem}>
              <div className={styles.difficultyInfo}>
                <h2 className={styles.difficultyName}>{difficulty}</h2>
                <p className={styles.difficultyDetails}>
                  {config.rows} × {config.cols} - {config.mines} mines
                </p>
              </div>

              <div className={styles.timeInfo}>
                <span className={styles.time}>
                  {record ? formatTime(record.time) : '--:--'}
                </span>
                {record && (
                  <button
                    className={styles.clearButton}
                    onClick={() => clearRecord(difficulty)}
                    type="button"
                    aria-label={`Clear ${difficulty} record`}
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {hasAnyRecord && (
        <button
          className={styles.clearAllButton}
          onClick={clearAllRecords}
          type="button"
          aria-label="Clear all records"
        >
          Clear All Records
        </button>
      )}
    </div>
  );
};
