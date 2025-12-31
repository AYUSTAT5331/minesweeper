import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTimer } from '../useTimer';

describe('useTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('初期状態', () => {
    it('time は 0 で初期化される', () => {
      const { result } = renderHook(() => useTimer());
      expect(result.current.time).toBe(0);
    });

    it('isRunning は false で初期化される', () => {
      const { result } = renderHook(() => useTimer());
      expect(result.current.isRunning).toBe(false);
    });
  });

  describe('start', () => {
    it('start() を呼ぶと isRunning が true になる', () => {
      const { result } = renderHook(() => useTimer());

      act(() => {
        result.current.start();
      });

      expect(result.current.isRunning).toBe(true);
    });

    it('start() 後、1秒経過すると time が 1 になる', () => {
      const { result } = renderHook(() => useTimer());

      act(() => {
        result.current.start();
      });

      act(() => {
        vi.advanceTimersByTime(1000);
      });

      expect(result.current.time).toBe(1);
    });

    it('start() 後、5秒経過すると time が 5 になる', () => {
      const { result } = renderHook(() => useTimer());

      act(() => {
        result.current.start();
      });

      act(() => {
        vi.advanceTimersByTime(5000);
      });

      expect(result.current.time).toBe(5);
    });

    it('既に実行中の場合、start() を再度呼んでも影響しない', () => {
      const { result } = renderHook(() => useTimer());

      act(() => {
        result.current.start();
      });

      act(() => {
        vi.advanceTimersByTime(3000);
      });

      expect(result.current.time).toBe(3);

      // 2回目の start() を呼ぶ
      act(() => {
        result.current.start();
      });

      act(() => {
        vi.advanceTimersByTime(2000);
      });

      // 時間は継続してカウントされる（リセットされない）
      expect(result.current.time).toBe(5);
    });
  });

  describe('stop', () => {
    it('stop() を呼ぶと isRunning が false になる', () => {
      const { result } = renderHook(() => useTimer());

      act(() => {
        result.current.start();
      });

      expect(result.current.isRunning).toBe(true);

      act(() => {
        result.current.stop();
      });

      expect(result.current.isRunning).toBe(false);
    });

    it('stop() 後、時間が経過しても time は増えない', () => {
      const { result } = renderHook(() => useTimer());

      act(() => {
        result.current.start();
      });

      act(() => {
        vi.advanceTimersByTime(3000);
      });

      expect(result.current.time).toBe(3);

      act(() => {
        result.current.stop();
      });

      act(() => {
        vi.advanceTimersByTime(5000);
      });

      // 停止後は時間が増えない
      expect(result.current.time).toBe(3);
    });

    it('タイマーが動いていない状態で stop() を呼んでも問題ない', () => {
      const { result } = renderHook(() => useTimer());

      act(() => {
        result.current.stop();
      });

      expect(result.current.isRunning).toBe(false);
      expect(result.current.time).toBe(0);
    });
  });

  describe('reset', () => {
    it('reset() を呼ぶと time が 0 にリセットされる', () => {
      const { result } = renderHook(() => useTimer());

      act(() => {
        result.current.start();
      });

      act(() => {
        vi.advanceTimersByTime(5000);
      });

      expect(result.current.time).toBe(5);

      act(() => {
        result.current.reset();
      });

      expect(result.current.time).toBe(0);
    });

    it('reset() を呼ぶと isRunning が false になる', () => {
      const { result } = renderHook(() => useTimer());

      act(() => {
        result.current.start();
      });

      expect(result.current.isRunning).toBe(true);

      act(() => {
        result.current.reset();
      });

      expect(result.current.isRunning).toBe(false);
    });

    it('reset() 後に start() すると 0 からカウント開始される', () => {
      const { result } = renderHook(() => useTimer());

      act(() => {
        result.current.start();
      });

      act(() => {
        vi.advanceTimersByTime(5000);
      });

      act(() => {
        result.current.reset();
      });

      act(() => {
        result.current.start();
      });

      act(() => {
        vi.advanceTimersByTime(3000);
      });

      expect(result.current.time).toBe(3);
    });
  });

  describe('クリーンアップ', () => {
    it('アンマウント時にタイマーがクリーンアップされる', () => {
      const { result, unmount } = renderHook(() => useTimer());

      act(() => {
        result.current.start();
      });

      act(() => {
        vi.advanceTimersByTime(2000);
      });

      expect(result.current.time).toBe(2);

      // アンマウント
      unmount();

      // アンマウント後に時間を進めてもエラーが発生しない
      act(() => {
        vi.advanceTimersByTime(5000);
      });

      // 特に期待値のチェックはないが、エラーが出ないことを確認
    });
  });

  describe('複数回の start/stop', () => {
    it('start と stop を繰り返すと、動いている間だけ時間が増える', () => {
      const { result } = renderHook(() => useTimer());

      // 最初の start
      act(() => {
        result.current.start();
      });

      act(() => {
        vi.advanceTimersByTime(2000);
      });

      expect(result.current.time).toBe(2);

      // stop
      act(() => {
        result.current.stop();
      });

      act(() => {
        vi.advanceTimersByTime(3000);
      });

      // 停止中は増えない
      expect(result.current.time).toBe(2);

      // 再度 start
      act(() => {
        result.current.start();
      });

      act(() => {
        vi.advanceTimersByTime(4000);
      });

      // 2 + 4 = 6
      expect(result.current.time).toBe(6);
    });
  });
});
