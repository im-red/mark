import React, { createContext, useContext, useCallback, useMemo } from 'react';
import { Board, AppState, createDefaultBoard, createDefaultMarkSuites } from '../models';
import { useLocalStorageState } from '../hooks/useLocalStorageState';

interface BoardContextValue {
  boards: Board[];
  currentBoard: Board | null;
  currentBoardId: string | null;
  createBoard: (name: string) => Board;
  updateBoard: (id: string, updates: Partial<Pick<Board, 'name' | 'marks' | 'comments' | 'recentMarkIds'>>) => void;
  deleteBoard: (id: string) => void;
  switchBoard: (id: string) => void;
  setMark: (dateKey: string, markId: string | null) => void;
  getMark: (dateKey: string) => string | null;
  setComment: (dateKey: string, comment: string | null) => void;
  getComment: (dateKey: string) => string | null;
  importBoards: (boards: Board[]) => void;
}

const BoardContext = createContext<BoardContextValue | null>(null);

const STORAGE_KEY = 'mark-app-state';

const getDefaultState = (): AppState => ({
  boards: [],
  markSuites: createDefaultMarkSuites(),
  currentBoardId: null,
});

export const BoardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [appState, setAppState] = useLocalStorageState<AppState>(STORAGE_KEY, getDefaultState());

  const boards = appState.boards.map(b => ({
    ...b,
    comments: b.comments || {},
  }));
  const currentBoardId = appState.currentBoardId || (boards[0]?.id ?? null);
  const currentBoard = boards.find((b) => b.id === currentBoardId) ?? null;

  const createBoard = useCallback(
    (name: string): Board => {
      const newBoard = createDefaultBoard();
      newBoard.name = name.trim() || 'New Board';
      setAppState((prev) => ({
        ...prev,
        boards: [...prev.boards, newBoard],
        currentBoardId: newBoard.id,
      }));
      return newBoard;
    },
    [setAppState]
  );

  const updateBoard = useCallback(
    (id: string, updates: Partial<Pick<Board, 'name' | 'marks' | 'comments' | 'recentMarkIds'>>) => {
      setAppState((prev) => ({
        ...prev,
        boards: prev.boards.map((b) =>
          b.id === id
            ? {
              ...b,
              ...updates,
              name: updates.name !== undefined ? updates.name.trim() : b.name,
              updatedAt: Date.now(),
            }
            : b
        ),
      }));
    },
    [setAppState]
  );

  const deleteBoard = useCallback(
    (id: string) => {
      setAppState((prev) => {
        const filteredBoards = prev.boards.filter((b) => b.id !== id);
        if (filteredBoards.length === 0) {
          return {
            ...prev,
            boards: [],
            currentBoardId: null,
          };
        }
        const newCurrentId =
          prev.currentBoardId === id ? filteredBoards[0].id : prev.currentBoardId;
        return {
          ...prev,
          boards: filteredBoards,
          currentBoardId: newCurrentId,
        };
      });
    },
    [setAppState]
  );

  const switchBoard = useCallback(
    (id: string) => {
      setAppState((prev) => ({
        ...prev,
        currentBoardId: id,
      }));
    },
    [setAppState]
  );

  const setMark = useCallback(
    (dateKey: string, markId: string | null) => {
      setAppState((prev) => ({
        ...prev,
        boards: prev.boards.map((b) => {
          if (b.id !== currentBoardId) return b;
          const newMarks = { ...b.marks };
          if (markId === null) {
            delete newMarks[dateKey];
          } else {
            newMarks[dateKey] = markId;
          }
          return {
            ...b,
            marks: newMarks,
            updatedAt: Date.now(),
          };
        }),
      }));
    },
    [currentBoardId, setAppState]
  );

  const getMark = useCallback(
    (dateKey: string): string | null => {
      return currentBoard?.marks[dateKey] ?? null;
    },
    [currentBoard]
  );

  const setComment = useCallback(
    (dateKey: string, comment: string | null) => {
      setAppState((prev) => ({
        ...prev,
        boards: prev.boards.map((b) => {
          if (b.id !== currentBoardId) return b;
          const newComments = { ...b.comments };
          if (comment === null || comment.trim() === '') {
            delete newComments[dateKey];
          } else {
            newComments[dateKey] = comment;
          }
          return {
            ...b,
            comments: newComments,
            updatedAt: Date.now(),
          };
        }),
      }));
    },
    [currentBoardId, setAppState]
  );

  const getComment = useCallback(
    (dateKey: string): string | null => {
      return currentBoard?.comments[dateKey] ?? null;
    },
    [currentBoard]
  );

  const importBoards = useCallback(
    (newBoards: Board[]) => {
      setAppState((prev) => ({
        ...prev,
        boards: [...prev.boards, ...newBoards],
      }));
    },
    [setAppState]
  );

  const value = useMemo(
    () => ({
      boards,
      currentBoard,
      currentBoardId,
      createBoard,
      updateBoard,
      deleteBoard,
      switchBoard,
      setMark,
      getMark,
      setComment,
      getComment,
      importBoards,
    }),
    [
      boards,
      currentBoard,
      currentBoardId,
      createBoard,
      updateBoard,
      deleteBoard,
      switchBoard,
      setMark,
      getMark,
      setComment,
      getComment,
      importBoards,
    ]
  );

  return <BoardContext.Provider value={value}>{children}</BoardContext.Provider>;
};

export const useBoard = (): BoardContextValue => {
  const context = useContext(BoardContext);
  if (!context) {
    throw new Error('useBoard must be used within a BoardProvider');
  }
  return context;
};
