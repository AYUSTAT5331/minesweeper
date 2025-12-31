import type { Difficulty } from '../../types/game';
import { DIFFICULTY_CONFIG } from '../../constants/difficulty';
import styles from './DifficultySelector.module.css';

interface DifficultySelectorProps {
  currentDifficulty: Difficulty;
  onSelect: (difficulty: Difficulty) => void;
}

const difficulties: Difficulty[] = ['Beginner', 'Intermediate', 'Expert'];

export const DifficultySelector = ({
  currentDifficulty,
  onSelect,
}: DifficultySelectorProps) => {
  return (
    <div className={styles.selector}>
      <h2 className={styles.title}>Select Difficulty</h2>
      <div className={styles.buttons}>
        {difficulties.map((difficulty) => {
          const config = DIFFICULTY_CONFIG[difficulty];
          const isActive = difficulty === currentDifficulty;

          return (
            <button
              key={difficulty}
              className={`${styles.button} ${isActive ? styles.active : ''}`}
              onClick={() => onSelect(difficulty)}
              type="button"
              aria-label={`Select ${difficulty} difficulty`}
            >
              <span className={styles.difficultyName}>{difficulty}</span>
              <span className={styles.difficultyInfo}>
                {config.rows} × {config.cols}
              </span>
              <span className={styles.difficultyInfo}>{config.mines} mines</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
