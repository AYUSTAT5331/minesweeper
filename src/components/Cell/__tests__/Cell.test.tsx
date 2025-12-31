import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Cell } from '../Cell';
import type { Cell as CellType } from '../../../types/game';

describe('Cell', () => {
  const createCell = (
    state: CellType['state'],
    value: CellType['value'],
    row = 0,
    col = 0
  ): CellType => ({
    state,
    value,
    row,
    col,
  });

  describe('セルの状態による表示', () => {
    it('Closed 状態のセルが表示される', () => {
      const cell = createCell('Closed', 0);
      const onClick = vi.fn();
      const onRightClick = vi.fn();

      render(<Cell cell={cell} onClick={onClick} onRightClick={onRightClick} />);

      const cellElement = screen.getByRole('button');
      expect(cellElement).toBeInTheDocument();
      expect(cellElement).toHaveTextContent('');
    });

    it('Flagged 状態のセルにフラグが表示される', () => {
      const cell = createCell('Flagged', 0);
      const onClick = vi.fn();
      const onRightClick = vi.fn();

      render(<Cell cell={cell} onClick={onClick} onRightClick={onRightClick} />);

      const cellElement = screen.getByRole('button');
      expect(cellElement).toBeInTheDocument();
      expect(cellElement).toHaveTextContent('🚩');
    });

    it('Opened + 空セル（value=0）が表示される', () => {
      const cell = createCell('Opened', 0);
      const onClick = vi.fn();
      const onRightClick = vi.fn();

      render(<Cell cell={cell} onClick={onClick} onRightClick={onRightClick} />);

      const cellElement = screen.getByRole('button');
      expect(cellElement).toBeInTheDocument();
      expect(cellElement).toHaveTextContent('');
    });

    it('Opened + 数字セル（value=1）が表示される', () => {
      const cell = createCell('Opened', 1);
      const onClick = vi.fn();
      const onRightClick = vi.fn();

      render(<Cell cell={cell} onClick={onClick} onRightClick={onRightClick} />);

      const cellElement = screen.getByRole('button');
      expect(cellElement).toHaveTextContent('1');
    });

    it('Opened + 数字セル（value=8）が表示される', () => {
      const cell = createCell('Opened', 8);
      const onClick = vi.fn();
      const onRightClick = vi.fn();

      render(<Cell cell={cell} onClick={onClick} onRightClick={onRightClick} />);

      const cellElement = screen.getByRole('button');
      expect(cellElement).toHaveTextContent('8');
    });

    it('Opened + 地雷セル（value=-1）に地雷アイコンが表示される', () => {
      const cell = createCell('Opened', -1);
      const onClick = vi.fn();
      const onRightClick = vi.fn();

      render(<Cell cell={cell} onClick={onClick} onRightClick={onRightClick} />);

      const cellElement = screen.getByRole('button');
      expect(cellElement).toHaveTextContent('💣');
    });

    it('各数字（1-8）が正しく表示される', () => {
      const onClick = vi.fn();
      const onRightClick = vi.fn();

      for (let value = 1; value <= 8; value++) {
        const cell = createCell('Opened', value as CellType['value']);
        const { unmount } = render(
          <Cell cell={cell} onClick={onClick} onRightClick={onRightClick} />
        );

        const cellElement = screen.getByRole('button');
        expect(cellElement).toHaveTextContent(value.toString());
        unmount();
      }
    });
  });

  describe('左クリックイベント', () => {
    it('Closed セルを左クリックすると onClick が呼ばれる', async () => {
      const user = userEvent.setup();
      const cell = createCell('Closed', 0, 2, 3);
      const onClick = vi.fn();
      const onRightClick = vi.fn();

      render(<Cell cell={cell} onClick={onClick} onRightClick={onRightClick} />);

      const cellElement = screen.getByRole('button');
      await user.click(cellElement);

      expect(onClick).toHaveBeenCalledTimes(1);
      expect(onClick).toHaveBeenCalledWith(2, 3);
    });

    it('Flagged セルを左クリックすると onClick が呼ばれる', async () => {
      const user = userEvent.setup();
      const cell = createCell('Flagged', 0, 1, 2);
      const onClick = vi.fn();
      const onRightClick = vi.fn();

      render(<Cell cell={cell} onClick={onClick} onRightClick={onRightClick} />);

      const cellElement = screen.getByRole('button');
      await user.click(cellElement);

      expect(onClick).toHaveBeenCalledTimes(1);
      expect(onClick).toHaveBeenCalledWith(1, 2);
    });

    it('Opened セルを左クリックしても onClick は呼ばれない', async () => {
      const user = userEvent.setup();
      const cell = createCell('Opened', 1, 0, 0);
      const onClick = vi.fn();
      const onRightClick = vi.fn();

      render(<Cell cell={cell} onClick={onClick} onRightClick={onRightClick} />);

      const cellElement = screen.getByRole('button');
      await user.click(cellElement);

      expect(onClick).not.toHaveBeenCalled();
    });
  });

  describe('右クリックイベント', () => {
    it('Closed セルを右クリックすると onRightClick が呼ばれる', async () => {
      const user = userEvent.setup();
      const cell = createCell('Closed', 0, 3, 4);
      const onClick = vi.fn();
      const onRightClick = vi.fn();

      render(<Cell cell={cell} onClick={onClick} onRightClick={onRightClick} />);

      const cellElement = screen.getByRole('button');
      await user.pointer({ keys: '[MouseRight]', target: cellElement });

      expect(onRightClick).toHaveBeenCalledTimes(1);
      expect(onRightClick).toHaveBeenCalledWith(3, 4);
    });

    it('Flagged セルを右クリックすると onRightClick が呼ばれる', async () => {
      const user = userEvent.setup();
      const cell = createCell('Flagged', 0, 5, 6);
      const onClick = vi.fn();
      const onRightClick = vi.fn();

      render(<Cell cell={cell} onClick={onClick} onRightClick={onRightClick} />);

      const cellElement = screen.getByRole('button');
      await user.pointer({ keys: '[MouseRight]', target: cellElement });

      expect(onRightClick).toHaveBeenCalledTimes(1);
      expect(onRightClick).toHaveBeenCalledWith(5, 6);
    });

    it('Opened セルを右クリックしても onRightClick は呼ばれない', async () => {
      const user = userEvent.setup();
      const cell = createCell('Opened', 1, 0, 0);
      const onClick = vi.fn();
      const onRightClick = vi.fn();

      render(<Cell cell={cell} onClick={onClick} onRightClick={onRightClick} />);

      const cellElement = screen.getByRole('button');
      await user.pointer({ keys: '[MouseRight]', target: cellElement });

      expect(onRightClick).not.toHaveBeenCalled();
    });

    it('右クリック時にブラウザのコンテキストメニューが表示されない', async () => {
      userEvent.setup();
      const cell = createCell('Closed', 0);
      const onClick = vi.fn();
      const onRightClick = vi.fn();

      render(<Cell cell={cell} onClick={onClick} onRightClick={onRightClick} />);

      const cellElement = screen.getByRole('button');

      // contextmenu イベントをシミュレート
      const event = new MouseEvent('contextmenu', {
        bubbles: true,
        cancelable: true,
      });
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');
      cellElement.dispatchEvent(event);

      expect(preventDefaultSpy).toHaveBeenCalled();
    });
  });

  describe('CSS クラスの適用', () => {
    it('Closed セルに closed クラスが適用される', () => {
      const cell = createCell('Closed', 0);
      const onClick = vi.fn();
      const onRightClick = vi.fn();

      render(<Cell cell={cell} onClick={onClick} onRightClick={onRightClick} />);

      const cellElement = screen.getByRole('button');
      expect(cellElement.className).toContain('closed');
    });

    it('Flagged セルに flagged クラスが適用される', () => {
      const cell = createCell('Flagged', 0);
      const onClick = vi.fn();
      const onRightClick = vi.fn();

      render(<Cell cell={cell} onClick={onClick} onRightClick={onRightClick} />);

      const cellElement = screen.getByRole('button');
      expect(cellElement.className).toContain('flagged');
    });

    it('Opened セルに opened クラスが適用される', () => {
      const cell = createCell('Opened', 1);
      const onClick = vi.fn();
      const onRightClick = vi.fn();

      render(<Cell cell={cell} onClick={onClick} onRightClick={onRightClick} />);

      const cellElement = screen.getByRole('button');
      expect(cellElement.className).toContain('opened');
    });

    it('地雷セルに mine クラスが適用される', () => {
      const cell = createCell('Opened', -1);
      const onClick = vi.fn();
      const onRightClick = vi.fn();

      const { container } = render(<Cell cell={cell} onClick={onClick} onRightClick={onRightClick} />);

      const cellElement = container.firstChild as HTMLElement;
      expect(cellElement.className).toContain('mine');
    });

    it('数字セルに対応する数字クラスが適用される', () => {
      const onClick = vi.fn();
      const onRightClick = vi.fn();

      for (let value = 1; value <= 8; value++) {
        const cell = createCell('Opened', value as CellType['value']);
        const { unmount } = render(
          <Cell cell={cell} onClick={onClick} onRightClick={onRightClick} />
        );

        const cellElement = screen.getByRole('button');
        expect(cellElement.className).toContain(`number-${value}`);
        unmount();
      }
    });
  });
});
