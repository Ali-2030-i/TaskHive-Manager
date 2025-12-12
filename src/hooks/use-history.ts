import { useCallback, useState } from "react";

export interface History<T> {
  past: T[];
  present: T;
  future: T[];
}

export function useHistory<T>(initialValue: T, maxHistory = 50) {
  const [history, setHistory] = useState<History<T>>({
    past: [],
    present: initialValue,
    future: [],
  });

  const push = useCallback((newValue: T) => {
    setHistory(prev => ({
      past: [...prev.past, prev.present].slice(-maxHistory),
      present: newValue,
      future: [],
    }));
  }, [maxHistory]);

  const undo = useCallback(() => {
    setHistory(prev => {
      if (prev.past.length === 0) return prev;
      const newPast = prev.past.slice(0, -1);
      return {
        past: newPast,
        present: prev.past[prev.past.length - 1],
        future: [prev.present, ...prev.future],
      };
    });
  }, []);

  const redo = useCallback(() => {
    setHistory(prev => {
      if (prev.future.length === 0) return prev;
      return {
        past: [...prev.past, prev.present],
        present: prev.future[0],
        future: prev.future.slice(1),
      };
    });
  }, []);

  const reset = useCallback((newValue: T) => {
    setHistory({
      past: [],
      present: newValue,
      future: [],
    });
  }, []);

  const canUndo = history.past.length > 0;
  const canRedo = history.future.length > 0;

  return {
    value: history.present,
    push,
    undo,
    redo,
    reset,
    canUndo,
    canRedo,
  };
}
