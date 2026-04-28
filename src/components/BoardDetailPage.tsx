import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import Calendar from './Calendar';
import MarkSelector from './MarkSelector';
import { Board, Mark } from '../types';
import { useMarkSuite } from '../context/MarkSuiteContext';
import { useBoard } from '../context/BoardContext';
import { exportViewAsImage } from '../utils/exportImage';

interface BoardDetailPageProps {
  board: Board;
  onBack: () => void;
  onUpdateBoard: (id: string, updates: Partial<Pick<Board, 'name' | 'marks' | 'recentMarkIds'>>) => void;
  onDeleteBoard: (id: string) => void;
  overlayCloseRef: React.RefObject<(() => boolean) | null> & { current: (() => boolean) | null };
}

const BoardDetailPage: React.FC<BoardDetailPageProps> = ({
  board,
  onBack,
  onUpdateBoard,
  onDeleteBoard,
  overlayCloseRef,
}) => {
  const { getMark } = useMarkSuite();
  const { updateRecentMarks } = useBoard();
  const [showMarkSelector, setShowMarkSelector] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [showRenameOverlay, setShowRenameOverlay] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [newName, setNewName] = useState('');
  const [calendarViewDate, setCalendarViewDate] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });
  const [calendarViewMode, setCalendarViewMode] = useState<'month' | 'year'>('month');
  const contextMenuRef = useRef<HTMLDivElement>(null);
  const exportContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        contextMenuRef.current &&
        !contextMenuRef.current.contains(event.target as Node)
      ) {
        setShowContextMenu(false);
      }
    };

    if (showContextMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showContextMenu]);

  // Register overlay close handler for Android back button
  useEffect(() => {
    overlayCloseRef.current = () => {
      if (showMarkSelector) {
        setShowMarkSelector(false);
        setSelectedDate(null);
        return true;
      }
      if (showContextMenu) {
        setShowContextMenu(false);
        return true;
      }
      if (showRenameOverlay) {
        setShowRenameOverlay(false);
        return true;
      }
      if (showDeleteConfirm) {
        setShowDeleteConfirm(false);
        return true;
      }
      return false;
    };
    return () => { overlayCloseRef.current = null; };
  });

  const handleDateClick = (date: string) => {
    setSelectedDate(date);
    setShowMarkSelector(true);
  };

  const handleMarkSelect = (markId: string | null) => {
    if (selectedDate) {
      const newMarks = { ...board.marks };
      if (markId === null) {
        delete newMarks[selectedDate];
      } else {
        newMarks[selectedDate] = markId;
        updateRecentMarks(markId);
      }
      onUpdateBoard(board.id, { marks: newMarks });
    }
    setShowMarkSelector(false);
    setSelectedDate(null);
  };

  const handleRename = () => {
    if (newName.trim()) {
      onUpdateBoard(board.id, { name: newName.trim() });
      setShowRenameOverlay(false);
      setNewName('');
    }
  };

  const handleDelete = () => {
    onDeleteBoard(board.id);
    onBack();
    setShowDeleteConfirm(false);
  };

  const handleExportImage = async () => {
    setShowContextMenu(false);
    if (exportContentRef.current) {
      const viewLabel = calendarViewMode === 'year'
        ? `${calendarViewDate.year}`
        : `${calendarViewDate.year}${String(calendarViewDate.month + 1).padStart(2, '0')}`;
      try {
        await exportViewAsImage(exportContentRef.current, board.name, viewLabel);
      } catch (err) {
        console.error('[BoardDetailPage] Export image failed:', err);
      }
    }
  };

  const markStats = useMemo(() => {
    const counts: Record<string, number> = {};
    if (calendarViewMode === 'year') {
      const yearPrefix = `${calendarViewDate.year}-`;
      Object.entries(board.marks).forEach(([dateKey, markId]) => {
        if (dateKey.startsWith(yearPrefix)) {
          counts[markId] = (counts[markId] || 0) + 1;
        }
      });
    } else {
      const monthPrefix = `${calendarViewDate.year}-${String(calendarViewDate.month + 1).padStart(2, '0')}`;
      Object.entries(board.marks).forEach(([dateKey, markId]) => {
        if (dateKey.startsWith(monthPrefix)) {
          counts[markId] = (counts[markId] || 0) + 1;
        }
      });
    }
    const entries = Object.entries(counts)
      .map(([markId, count]) => {
        const mark = getMark(markId);
        return mark ? { mark, count } : null;
      })
      .filter((entry): entry is { mark: Mark; count: number } => entry !== null)
      .sort((a, b) => b.count - a.count);
    return entries;
  }, [board.marks, getMark, calendarViewDate, calendarViewMode]);

  const handleViewDateChange = useCallback((year: number, month: number, viewMode: 'month' | 'year') => {
    setCalendarViewDate({ year, month });
    setCalendarViewMode(viewMode);
  }, []);

  const maxCount = markStats.length > 0 ? markStats[0].count : 0;

  return (
    <div className="page page--board-detail">
      <header className="app-header">
        <button className="btn-back" onClick={onBack}>
          ←
        </button>
        <div className="header-title">
          <h1>{board.name}</h1>
        </div>
        <button
          className="btn-icon"
          onClick={() => setShowContextMenu(!showContextMenu)}
        >
          ⋯
        </button>
        {showContextMenu && (
          <div className="context-menu" ref={contextMenuRef}>
            <button
              className="context-menu__item"
              onClick={() => {
                setShowContextMenu(false);
                setNewName(board.name);
                setShowRenameOverlay(true);
              }}
            >
              ✏️ Rename
            </button>
            <button
              className="context-menu__item"
              onClick={handleExportImage}
            >
              🖼️ Export as Image
            </button>
            <button
              className="context-menu__item context-menu__item--danger"
              onClick={() => {
                setShowContextMenu(false);
                setShowDeleteConfirm(true);
              }}
            >
              🗑️ Delete
            </button>
          </div>
        )}
      </header>

      <main className="page__content">
        <div className="export-capture-area" ref={exportContentRef}>
          <div className="export-capture-area__header">
            <div className="export-capture-area__title">{board.name}</div>
            <div className="export-capture-area__subtitle">
              {calendarViewMode === 'year'
                ? `${calendarViewDate.year}`
                : `${calendarViewDate.year}-${String(calendarViewDate.month + 1).padStart(2, '0')}`}
            </div>
          </div>
          <Calendar
            markIds={board.marks}
            getMarkById={getMark}
            onDateClick={handleDateClick}
            onViewDateChange={handleViewDateChange}
          />

          {markStats.length > 0 && (
            <div className="mark-stats">
              <div className="mark-stats__title">Statistics</div>
              {markStats.map(({ mark, count }) => (
                <div className="mark-stats__item" key={mark.id}>
                  <span className="mark-stats__emoji">{mark.emojis.join('')}</span>
                  <div className="mark-stats__bar-wrapper">
                    <div
                      className="mark-stats__bar"
                      style={{
                        width: `${(count / maxCount) * 100}%`,
                        backgroundColor: mark.backgroundColor,
                      }}
                    />
                  </div>
                  <span className="mark-stats__count">{count}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {showMarkSelector && selectedDate && (
        <MarkSelector
          selectedMarkId={board.marks[selectedDate] || null}
          recentMarkIds={board.recentMarkIds}
          onSelect={handleMarkSelect}
          onClose={() => {
            setShowMarkSelector(false);
            setSelectedDate(null);
          }}
        />
      )}

      {showRenameOverlay && (
        <div className="overlay" onClick={() => setShowRenameOverlay(false)}>
          <div className="overlay__panel" onClick={(e) => e.stopPropagation()}>
            <div className="overlay__header">
              <h2>Rename Board</h2>
              <button
                className="overlay__close"
                onClick={() => setShowRenameOverlay(false)}
              >
                ×
              </button>
            </div>
            <div className="overlay__content">
              <input
                type="text"
                className="input"
                placeholder="Board name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                autoFocus
              />
              <div className="overlay__actions">
                <button
                  className="btn-secondary"
                  onClick={() => setShowRenameOverlay(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn-primary"
                  onClick={handleRename}
                  disabled={!newName.trim()}
                >
                  Rename
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="overlay" onClick={() => setShowDeleteConfirm(false)}>
          <div className="overlay__panel" onClick={(e) => e.stopPropagation()}>
            <div className="overlay__header">
              <h2>Delete Board?</h2>
              <button
                className="overlay__close"
                onClick={() => setShowDeleteConfirm(false)}
              >
                ×
              </button>
            </div>
            <div className="overlay__content">
              <p className="overlay__text">
                Are you sure you want to delete "{board.name}"? This action
                cannot be undone.
              </p>
              <div className="overlay__actions">
                <button
                  className="btn-secondary"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancel
                </button>
                <button className="btn-danger" onClick={handleDelete}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BoardDetailPage;
