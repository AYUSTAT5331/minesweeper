import { useState, useCallback, useEffect } from 'react';
import type { Cell, GameStatus, Difficulty } from '../types/game';
import { DIFFICULTY_CONFIG } from '../constants/difficulty';
import * as gameLogic from '../utils/gameLogic';
import { useTimer } from './useTimer';

interface UseGameReturn {
  board: Cell[][];
  gameStatus: GameStatus;
  difficulty: Difficulty;
  minesRemaining: number;
  time: number;
  initGame: () => void;
  handleCellClick: (row: number, col: number) => void;
  handleCellRightClick: (row: number, col: number) => void;
  restartGame: () => void;
  changeDifficulty: (newDifficulty: Difficulty) => void;
}

export const useGame = (): UseGameReturn => {
  const [difficulty, setDifficulty] = useState<Difficulty>('Beginner');
  const [board, setBoard] = useState<Cell[][]>([]);
  const [gameStatus, setGameStatus] = useState<GameStatus>('Idle');
  const [minesRemaining, setMinesRemaining] = useState(0);
  const [firstClick, setFirstClick] = useState(true);

  const { time, start: startTimer, stop: stopTimer, reset: resetTimer } = useTimer();

  // 難易度に応じたゲームの初期化
  const initGame = useCallback(() => {
    const config = DIFFICULTY_CONFIG[difficulty];
    const newBoard = gameLogic.createEmptyBoard(config.rows, config.cols);
    setBoard(newBoard);
    setGameStatus('Idle');
    setMinesRemaining(config.mines);
    setFirstClick(true);
    resetTimer();
  }, [difficulty, resetTimer]);

  // 初回マウント時とdifficulty変更時に初期化
  // Note: This effect initializes game state, which is a valid use case
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    const config = DIFFICULTY_CONFIG[difficulty];
    const newBoard = gameLogic.createEmptyBoard(config.rows, config.cols);
    setBoard(newBoard);
    setGameStatus('Idle');
    setMinesRemaining(config.mines);
    setFirstClick(true);
    resetTimer();
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [difficulty, resetTimer]);

  // セルの左クリック処理
  const handleCellClick = useCallback(
    (row: number, col: number) => {
      // ゲーム終了後はクリックできない
      if (gameStatus === 'Won' || gameStatus === 'Lost') {
        return;
      }

      let newBoard = [...board.map((r) => [...r])];

      // 最初のクリック時に地雷を配置
      if (firstClick) {
        const config = DIFFICULTY_CONFIG[difficulty];
        gameLogic.placeMines(newBoard, config.mines, row, col);
        gameLogic.calculateAdjacentMines(newBoard);
        setFirstClick(false);
        setGameStatus('Playing');
        startTimer();
      }

      // セルを開く
      newBoard = gameLogic.revealCell(newBoard, row, col);
      setBoard(newBoard);

      // 地雷を踏んだかチェック
      if (newBoard[row][col].value === -1) {
        setGameStatus('Lost');
        stopTimer();
        return;
      }

      // 勝利判定
      if (gameLogic.checkWinCondition(newBoard)) {
        setGameStatus('Won');
        stopTimer();
      }
    },
    [board, gameStatus, firstClick, difficulty, startTimer, stopTimer]
  );

  // セルの右クリック処理（フラグ設置）
  const handleCellRightClick = useCallback(
    (row: number, col: number) => {
      // ゲーム終了後は右クリックできない
      if (gameStatus === 'Won' || gameStatus === 'Lost') {
        return;
      }

      const cell = board[row][col];

      // 開封済みセルは右クリックできない
      if (cell.state === 'Opened') {
        return;
      }

      const newBoard = [...board.map((r) => [...r])];

      // フラグの切り替え
      if (cell.state === 'Closed') {
        newBoard[row][col].state = 'Flagged';
        setMinesRemaining((prev) => prev - 1);
      } else if (cell.state === 'Flagged') {
        newBoard[row][col].state = 'Closed';
        setMinesRemaining((prev) => prev + 1);
      }

      setBoard(newBoard);
    },
    [board, gameStatus]
  );

  // ゲームの再スタート
  const restartGame = useCallback(() => {
    initGame();
  }, [initGame]);

  // 難易度の変更
  const changeDifficulty = useCallback((newDifficulty: Difficulty) => {
    setDifficulty(newDifficulty);
    // initGame は useEffect で自動的に呼ばれる
  }, []);

  return {
    board,
    gameStatus,
    difficulty,
    minesRemaining,
    time,
    initGame,
    handleCellClick,
    handleCellRightClick,
    restartGame,
    changeDifficulty,
  };
};
