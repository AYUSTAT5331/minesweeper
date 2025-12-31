import { useState } from 'react';
import { GameBoard } from './components/GameBoard/GameBoard';
import { RecordsScreen } from './components/RecordsScreen/RecordsScreen';
import styles from './App.module.css';

type Screen = 'game' | 'records';

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('game');

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1 className={styles.title}>Minesweeper</h1>
        <nav className={styles.nav}>
          {currentScreen === 'game' ? (
            <button
              className={styles.navButton}
              onClick={() => setCurrentScreen('records')}
              type="button"
              aria-label="View records"
            >
              📊 View Records
            </button>
          ) : (
            <button
              className={styles.navButton}
              onClick={() => setCurrentScreen('game')}
              type="button"
              aria-label="Back to game"
            >
              🎮 Back to Game
            </button>
          )}
        </nav>
      </header>

      <main className={styles.main}>
        {currentScreen === 'game' ? <GameBoard /> : <RecordsScreen />}
      </main>
    </div>
  );
}

export default App;
