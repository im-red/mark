import React, { useState } from 'react';
import { useBoard } from '../data/BoardContext';

const BoardSelector: React.FC = () => {
  const { boards, currentBoardId, switchBoard, createBoard, updateBoard, deleteBoard } = useBoard();
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [newBoardName, setNewBoardName] = useState('');
  const [showNewBoardInput, setShowNewBoardInput] = useState(false);

  const handleSwitchBoard = (id: string) => {
    switchBoard(id);
    setIsOpen(false);
  };

  const handleCreateBoard = () => {
    if (newBoardName.trim()) {
      createBoard(newBoardName.trim());
      setNewBoardName('');
      setShowNewBoardInput(false);
    }
  };

  const handleStartEdit = (id: string, name: string) => {
    setEditingId(id);
    setEditName(name);
  };

  const handleSaveEdit = (id: string) => {
    if (editName.trim()) {
      updateBoard(id, { name: editName.trim() });
    }
    setEditingId(null);
    setEditName('');
  };

  const handleDeleteBoard = (id: string) => {
    if (window.confirm('Are you sure you want to delete this board? All marks will be lost.')) {
      deleteBoard(id);
    }
  };

  return (
    <div className="board-selector">
      <button className="board-selector-btn" onClick={() => setIsOpen(!isOpen)}>
        ☰
      </button>

      {isOpen && (
        <div className="board-dropdown">
          <div className="board-list">
            {boards.map((board) => (
              <div
                key={board.id}
                className={`board-item ${board.id === currentBoardId ? 'active' : ''}`}
              >
                {editingId === board.id ? (
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onBlur={() => handleSaveEdit(board.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveEdit(board.id);
                      if (e.key === 'Escape') setEditingId(null);
                    }}
                    autoFocus
                    className="board-edit-input"
                  />
                ) : (
                  <>
                    <span
                      className="board-name"
                      onClick={() => handleSwitchBoard(board.id)}
                    >
                      {board.name}
                    </span>
                    <div className="board-actions">
                      <button
                        className="board-action-btn"
                        onClick={() => handleStartEdit(board.id, board.name)}
                        title="Rename"
                      >
                        ✏️
                      </button>
                      <button
                        className="board-action-btn delete"
                        onClick={() => handleDeleteBoard(board.id)}
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          {showNewBoardInput ? (
            <div className="new-board-input">
              <input
                type="text"
                value={newBoardName}
                onChange={(e) => setNewBoardName(e.target.value)}
                placeholder="Board name"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleCreateBoard();
                  if (e.key === 'Escape') {
                    setShowNewBoardInput(false);
                    setNewBoardName('');
                  }
                }}
                autoFocus
              />
              <button onClick={handleCreateBoard}>Create</button>
              <button onClick={() => {
                setShowNewBoardInput(false);
                setNewBoardName('');
              }}>
                Cancel
              </button>
            </div>
          ) : (
            <button
              className="new-board-btn"
              onClick={() => setShowNewBoardInput(true)}
            >
              + New Board
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default BoardSelector;
