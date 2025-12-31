import { memo } from 'react';
import type { Cell as CellType } from '../../types/game';
import styles from './Cell.module.css';

interface CellProps {
  cell: CellType;
  onClick: (row: number, col: number) => void;
  onRightClick: (row: number, col: number) => void;
}

export const Cell = memo(({ cell, onClick, onRightClick }: CellProps) => {
  const { state, value, row, col } = cell;

  // セルの表示内容を決定
  const getCellContent = (): string => {
    if (state === 'Flagged') {
      return '🚩';
    }

    if (state === 'Opened') {
      if (value === -1) {
        return '💣';
      }
      if (value > 0) {
        return value.toString();
      }
    }

    return '';
  };

  // CSS クラスを決定
  const getCellClassName = (): string => {
    const classes = [styles.cell];

    if (state === 'Closed') {
      classes.push(styles.closed);
    } else if (state === 'Flagged') {
      classes.push(styles.flagged);
    } else if (state === 'Opened') {
      classes.push(styles.opened);

      if (value === -1) {
        classes.push(styles.mine);
      } else if (value > 0) {
        classes.push(styles[`number-${value}`]);
      }
    }

    return classes.join(' ');
  };

  // 左クリックハンドラー
  const handleClick = () => {
    if (state !== 'Opened') {
      onClick(row, col);
    }
  };

  // 右クリックハンドラー
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    if (state !== 'Opened') {
      onRightClick(row, col);
    }
  };

  return (
    <button
      className={getCellClassName()}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      type="button"
      aria-label={`Cell at row ${row}, column ${col}`}
    >
      {getCellContent()}
    </button>
  );
});

Cell.displayName = 'Cell';
