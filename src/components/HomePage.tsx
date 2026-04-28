import React, { useState, useEffect } from 'react';
import { Board } from '../types';
import BoardCard from './BoardCard';

interface HomePageProps {
  boards: Board[];
  onSelectBoard: (boardId: string) => void;
  onOpenMenu: () => void;
  onCreateBoard: (name: string) => void;
  overlayCloseRef: React.RefObject<(() => boolean) | null>;
}

const HomePage: React.FC<HomePageProps> = ({
  boards,
  onSelectBoard,
  onOpenMenu,
  onCreateBoard,
  overlayCloseRef,
}) => {
  const [showNewBoardOverlay, setShowNewBoardOverlay] = useState(false);
  const [newBoardName, setNewBoardName] = useState('');

  // Register overlay close handler for Android back button
  useEffect(() => {
    overlayCloseRef.current = () => {
      if (showNewBoardOverlay) {
        setShowNewBoardOverlay(false);
        setNewBoardName('');
        return true;
      }
      return false;
    };
    return () => { overlayCloseRef.current = null; };
  });

  const handleBoardClick = (boardId: string) => {
    onSelectBoard(boardId);
  };

  const handleCreateBoard = () => {
    if (newBoardName.trim()) {
      onCreateBoard(newBoardName.trim());
      setNewBoardName('');
      setShowNewBoardOverlay(false);
    }
  };

  const handleCancelCreate = () => {
    setNewBoardName('');
    setShowNewBoardOverlay(false);
  };

  const sortedBoards = [...boards].sort((a, b) => b.updatedAt - a.updatedAt);

  return (
    <div className="page page--home">
      <header className="app-header">
        <button className="btn-menu" onClick={onOpenMenu}>
          ☰
        </button>
        <div className="header-title">
          <h1>Mark</h1>
        </div>
      </header>

      <main className="page__content">
        {boards.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__icon">📅</div>
            <h2 className="empty-state__title">No boards yet</h2>
            <p className="empty-state__text">
              Create your first board to start tracking your marks
            </p>
            <button
              className="btn-primary"
              onClick={() => setShowNewBoardOverlay(true)}
            >
              Create Board
            </button>
          </div>
        ) : (
          <div className="board-list">
            {sortedBoards.map((board) => (
              <BoardCard
                key={board.id}
                id={board.id}
                name={board.name}
                markCount={Object.keys(board.marks).length}
                lastUpdated={board.updatedAt}
                onClick={handleBoardClick}
              />
            ))}
          </div>
        )}
      </main>

      <button
        className="fab"
        onClick={() => setShowNewBoardOverlay(true)}
        aria-label="Create new board"
      >
        +
      </button>

      {showNewBoardOverlay && (
        <div className="overlay" onClick={handleCancelCreate}>
          <div className="overlay__panel" onClick={(e) => e.stopPropagation()}>
            <div className="overlay__header">
              <h2>New Board</h2>
              <button className="overlay__close" onClick={handleCancelCreate}>
                ×
              </button>
            </div>
            <div className="overlay__content">
              <input
                type="text"
                className="input"
                placeholder="Board name"
                value={newBoardName}
                onChange={(e) => setNewBoardName(e.target.value)}
                autoFocus
              />
              <div className="overlay__actions">
                <button className="btn-secondary" onClick={handleCancelCreate}>
                  Cancel
                </button>
                <button
                  className="btn-primary"
                  onClick={handleCreateBoard}
                  disabled={!newBoardName.trim()}
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
