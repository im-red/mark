import React, { createContext, useContext, useMemo, useCallback } from 'react';
import {
  Mark,
  MarkSuite,
  AppState,
  RECENT_SUITE_ID,
  createDefaultMarkSuites,
  generateId,
} from '../models';
import { useLocalStorageState } from '../hooks/useLocalStorageState';
import { syncBuiltInSuites } from '../util/syncBuiltInSuites';

interface MarkSuiteContextValue {
  suites: MarkSuite[];
  markSuites: MarkSuite[];
  getMark: (markId: string) => Mark | undefined;
  getRecentSuite: (recentMarkIds: string[]) => MarkSuite;
  createSuite: (name: string) => void;
  updateSuite: (id: string, name: string) => void;
  deleteSuite: (id: string) => void;
  createMark: (suiteId: string, mark: Omit<Mark, 'id'>) => Mark;
  updateMark: (suiteId: string, markId: string, updates: Partial<Mark>) => void;
  deleteMark: (suiteId: string, markId: string) => void;
  importSuites: (suites: MarkSuite[]) => void;
}

const MarkSuiteContext = createContext<MarkSuiteContextValue | null>(null);

const STORAGE_KEY = 'mark-app-state';

const getDefaultState = (): AppState => ({
  boards: [],
  markSuites: createDefaultMarkSuites(),
  currentBoardId: null,
});

export const MarkSuiteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [appState, setAppState] = useLocalStorageState<AppState>(STORAGE_KEY, getDefaultState(), syncBuiltInSuites);

  const suites = useMemo(() => {
    const customSuites = appState.markSuites.filter(s => !s.isBuiltIn && !s.isDynamic);
    return [
      { id: RECENT_SUITE_ID, name: 'Recent', marks: [], isBuiltIn: false, isDynamic: true },
      ...appState.markSuites.filter(s => s.isBuiltIn),
      ...customSuites.sort((a, b) => a.name.localeCompare(b.name)),
    ];
  }, [appState.markSuites]);

  const getMark = useCallback(
    (markId: string): Mark | undefined => {
      for (const suite of appState.markSuites) {
        const mark = suite.marks.find(m => m.id === markId);
        if (mark) return mark;
      }
      return undefined;
    },
    [appState.markSuites]
  );

  const getRecentSuite = useCallback(
    (recentMarkIds: string[]): MarkSuite => {
      const marks: Mark[] = [];
      for (const markId of recentMarkIds) {
        const mark = getMark(markId);
        if (mark) marks.push(mark);
      }
      return {
        id: RECENT_SUITE_ID,
        name: 'Recent',
        marks,
        isBuiltIn: false,
        isDynamic: true,
      };
    },
    [getMark]
  );

  const createSuite = useCallback(
    (name: string) => {
      const newSuite: MarkSuite = {
        id: generateId(),
        name,
        marks: [],
        isBuiltIn: false,
        isDynamic: false,
      };
      setAppState(prev => ({
        ...prev,
        markSuites: [...prev.markSuites, newSuite],
      }));
    },
    [setAppState]
  );

  const updateSuite = useCallback(
    (id: string, name: string) => {
      setAppState(prev => ({
        ...prev,
        markSuites: prev.markSuites.map(s =>
          s.id === id && !s.isBuiltIn ? { ...s, name } : s
        ),
      }));
    },
    [setAppState]
  );

  const deleteSuite = useCallback(
    (id: string) => {
      setAppState(prev => ({
        ...prev,
        markSuites: prev.markSuites.filter(s => s.id !== id || s.isBuiltIn),
      }));
    },
    [setAppState]
  );

  const createMark = useCallback(
    (suiteId: string, mark: Omit<Mark, 'id'>): Mark => {
      const newMark: Mark = { ...mark, id: generateId() };
      setAppState(prev => ({
        ...prev,
        markSuites: prev.markSuites.map(s =>
          s.id === suiteId && !s.isBuiltIn ? { ...s, marks: [...s.marks, newMark] } : s
        ),
      }));
      return newMark;
    },
    [setAppState]
  );

  const updateMark = useCallback(
    (suiteId: string, markId: string, updates: Partial<Mark>) => {
      setAppState(prev => ({
        ...prev,
        markSuites: prev.markSuites.map(s =>
          s.id === suiteId && !s.isBuiltIn
            ? { ...s, marks: s.marks.map(m => (m.id === markId ? { ...m, ...updates } : m)) }
            : s
        ),
      }));
    },
    [setAppState]
  );

  const deleteMark = useCallback(
    (suiteId: string, markId: string) => {
      setAppState(prev => ({
        ...prev,
        markSuites: prev.markSuites.map(s =>
          s.id === suiteId && !s.isBuiltIn
            ? { ...s, marks: s.marks.filter(m => m.id !== markId) }
            : s
        ),
      }));
    },
    [setAppState]
  );

  const importSuites = useCallback(
    (newSuites: MarkSuite[]) => {
      setAppState(prev => ({
        ...prev,
        markSuites: [...prev.markSuites, ...newSuites],
      }));
    },
    [setAppState]
  );

  const value = useMemo(
    () => ({
      suites,
      markSuites: appState.markSuites,
      getMark,
      getRecentSuite,
      createSuite,
      updateSuite,
      deleteSuite,
      createMark,
      updateMark,
      deleteMark,
      importSuites,
    }),
    [suites, appState.markSuites, getMark, getRecentSuite, createSuite, updateSuite, deleteSuite, createMark, updateMark, deleteMark, importSuites]
  );

  return <MarkSuiteContext.Provider value={value}>{children}</MarkSuiteContext.Provider>;
};

export const useMarkSuite = (): MarkSuiteContextValue => {
  const context = useContext(MarkSuiteContext);
  if (!context) {
    throw new Error('useMarkSuite must be used within a MarkSuiteProvider');
  }
  return context;
};
