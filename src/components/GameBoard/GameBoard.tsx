import { useGame } from '../../hooks/useGame';
import { GameHeader } from '../GameHeader/GameHeader';
import { DifficultySelector } from '../DifficultySelector/DifficultySelector';
import { Cell as CellComponent } from '../Cell/Cell';
import styles from './GameBoard.module.css';

export const GameBoard = () => {
  const {
    difficulty,
    board,
    gameStatus,
    minesRemaining,
    time,
    handleCellClick,
    handleCellRightClick,
    restartGame,
    changeDifficulty,
  } = useGame();

  return (
    <div className={styles.container}>
      <DifficultySelector currentDifficulty={difficulty} onSelect={changeDifficulty} />

      <GameHeader
        time={time}
        minesRemaining={minesRemaining}
        gameStatus={gameStatus}
        onRestart={restartGame}
      />

      <div className={styles.board}>
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className={styles.row}>
            {row.map((cell) => (
              <CellComponent
                key={`${cell.row}-${cell.col}`}
                cell={cell}
                onClick={handleCellClick}
                onRightClick={handleCellRightClick}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
