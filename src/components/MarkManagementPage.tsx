import React, { useState, useEffect } from 'react';
import { MarkSuite, Mark, RECENT_SUITE_ID } from '../types';
import { useMarkSuite } from '../context/MarkSuiteContext';

interface MarkManagementPageProps {
  onBack: () => void;
  overlayCloseRef: React.RefObject<(() => boolean) | null>;
}

const PRESET_COLORS = [
  '#fecaca', '#fed7aa', '#d9f99d', '#a5f3fc', '#e9d5ff',
  '#fbcfe8', '#fde68a', '#a7f3d0', '#bfdbfe', '#c4b5fd',
];

const MarkManagementPage: React.FC<MarkManagementPageProps> = ({ onBack, overlayCloseRef }) => {
  const { suites, createSuite, updateSuite, deleteSuite, createMark, updateMark, deleteMark } = useMarkSuite();
  const [selectedSuiteId, setSelectedSuiteId] = useState<string | null>(null);
  const [showSuiteOverlay, setShowSuiteOverlay] = useState(false);
  const [showMarkOverlay, setShowMarkOverlay] = useState(false);
  const [editingSuite, setEditingSuite] = useState<MarkSuite | null>(null);
  const [editingMark, setEditingMark] = useState<Mark | null>(null);
  const [suiteName, setSuiteName] = useState('');
  const [markEmojis, setMarkEmojis] = useState('');
  const [markColor, setMarkColor] = useState('#fecaca');
  const [markName, setMarkName] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<'suite' | 'mark' | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const customSuites = suites.filter(s => !s.isBuiltIn && !s.isDynamic);
  const manageSuites = suites.filter(s => !s.isDynamic);
  const selectedSuite = suites.find(s => s.id === selectedSuiteId);

  // Register overlay close handler for Android back button
  useEffect(() => {
    overlayCloseRef.current = () => {
      if (showDeleteConfirm) {
        setShowDeleteConfirm(null);
        setDeleteTargetId(null);
        return true;
      }
      if (showMarkOverlay) {
        setShowMarkOverlay(false);
        return true;
      }
      if (showSuiteOverlay) {
        setShowSuiteOverlay(false);
        return true;
      }
      return false;
    };
    return () => { overlayCloseRef.current = null; };
  });

  const handleCreateSuite = () => {
    if (suiteName.trim()) {
      createSuite(suiteName.trim());
      setSuiteName('');
      setShowSuiteOverlay(false);
    }
  };

  const handleUpdateSuite = () => {
    if (editingSuite && suiteName.trim()) {
      updateSuite(editingSuite.id, suiteName.trim());
      setSuiteName('');
      setEditingSuite(null);
      setShowSuiteOverlay(false);
    }
  };

  const handleDeleteSuite = () => {
    if (deleteTargetId) {
      deleteSuite(deleteTargetId);
      if (selectedSuiteId === deleteTargetId) {
        setSelectedSuiteId(null);
      }
      setDeleteTargetId(null);
      setShowDeleteConfirm(null);
    }
  };

  const handleCreateMark = () => {
    if (selectedSuiteId && markEmojis.trim()) {
      createMark(selectedSuiteId, {
        emojis: markEmojis.trim().split(''),
        backgroundColor: markColor,
        name: markName.trim() || undefined,
      });
      setMarkEmojis('');
      setMarkColor('#f5f5f4');
      setMarkName('');
      setShowMarkOverlay(false);
    }
  };

  const handleUpdateMark = () => {
    if (editingSuite && editingMark && markEmojis.trim()) {
      updateMark(editingSuite.id, editingMark.id, {
        emojis: markEmojis.trim().split(''),
        backgroundColor: markColor,
        name: markName.trim() || undefined,
      });
      setMarkEmojis('');
      setMarkColor('#f5f5f4');
      setMarkName('');
      setEditingMark(null);
      setEditingSuite(null);
      setShowMarkOverlay(false);
    }
  };

  const handleDeleteMark = () => {
    if (editingSuite && deleteTargetId) {
      deleteMark(editingSuite.id, deleteTargetId);
      setDeleteTargetId(null);
      setShowDeleteConfirm(null);
      setEditingSuite(null);
    }
  };

  const openEditSuite = (suite: MarkSuite) => {
    setEditingSuite(suite);
    setSuiteName(suite.name);
    setShowSuiteOverlay(true);
  };

  const openEditMark = (suite: MarkSuite, mark: Mark) => {
    setEditingSuite(suite);
    setEditingMark(mark);
    setMarkEmojis(mark.emojis.join(''));
    setMarkColor(mark.backgroundColor);
    setMarkName(mark.name || '');
    setShowMarkOverlay(true);
  };

  return (
    <div className="page page--mark-management">
      <header className="app-header">
        <button className="btn-back" onClick={onBack}>
          ←
        </button>
        <div className="header-title">
          <h1>Manage Marks</h1>
        </div>
        <button
          className="btn-icon"
          onClick={() => {
            setEditingSuite(null);
            setSuiteName('');
            setShowSuiteOverlay(true);
          }}
        >
          +
        </button>
      </header>

      <main className="page__content">
        <div className="suite-list">
          <h2 className="section-title">Suites</h2>

          {manageSuites.map(suite => (
            <div
              key={suite.id}
              className={`suite-item ${selectedSuiteId === suite.id ? 'suite-item--selected' : ''}`}
              onClick={() => setSelectedSuiteId(suite.id)}
            >
              <div className="suite-item__info">
                <span className="suite-item__name">{suite.name}</span>
                <span className="suite-item__count">{suite.marks.length} marks</span>
              </div>
              {!suite.isBuiltIn && !suite.isDynamic && (
                <div className="suite-item__actions">
                  <button
                    className="btn-small"
                    onClick={(e) => {
                      e.stopPropagation();
                      openEditSuite(suite);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="btn-small btn-small--danger"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteTargetId(suite.id);
                      setShowDeleteConfirm('suite');
                    }}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {selectedSuite && (
          <div className="mark-list">
            <div className="mark-list__header">
              <h2 className="section-title">{selectedSuite.name}</h2>
              {!selectedSuite.isBuiltIn && !selectedSuite.isDynamic && (
                <button
                  className="btn-small"
                  onClick={() => {
                    setEditingMark(null);
                    setMarkEmojis('');
                    setMarkColor('#e0e0e0');
                    setMarkName('');
                    setShowMarkOverlay(true);
                  }}
                >
                  + Add Mark
                </button>
              )}
            </div>

            {selectedSuite.isDynamic && (
              <p className="mark-list__hint">
                Recent marks are automatically added when you use marks on the calendar.
              </p>
            )}

            <div className="mark-grid">
              {selectedSuite.marks.map(mark => (
                <div
                  key={mark.id}
                  className="mark-item"
                  style={{ backgroundColor: mark.backgroundColor }}
                  onClick={() => {
                    if (!selectedSuite.isBuiltIn && !selectedSuite.isDynamic) {
                      openEditMark(selectedSuite, mark);
                    }
                  }}
                >
                  <span className="mark-item__emojis">{mark.emojis.join('')}</span>
                  {mark.name && <span className="mark-item__name">{mark.name}</span>}
                </div>
              ))}
              {selectedSuite.marks.length === 0 && (
                <p className="mark-list__empty">No marks in this suite</p>
              )}
            </div>
          </div>
        )}
      </main>

      {showSuiteOverlay && (
        <div className="overlay" onClick={() => setShowSuiteOverlay(false)}>
          <div className="overlay__panel" onClick={e => e.stopPropagation()}>
            <div className="overlay__header">
              <h2>{editingSuite ? 'Edit Suite' : 'New Suite'}</h2>
              <button className="overlay__close" onClick={() => setShowSuiteOverlay(false)}>
                ×
              </button>
            </div>
            <div className="overlay__content">
              <input
                type="text"
                className="input"
                placeholder="Suite name"
                value={suiteName}
                onChange={e => setSuiteName(e.target.value)}
                autoFocus
              />
              <div className="overlay__actions">
                <button className="btn-secondary" onClick={() => setShowSuiteOverlay(false)}>
                  Cancel
                </button>
                <button
                  className="btn-primary"
                  onClick={editingSuite ? handleUpdateSuite : handleCreateSuite}
                  disabled={!suiteName.trim()}
                >
                  {editingSuite ? 'Save' : 'Create'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showMarkOverlay && (
        <div className="overlay" onClick={() => setShowMarkOverlay(false)}>
          <div className="overlay__panel" onClick={e => e.stopPropagation()}>
            <div className="overlay__header">
              <h2>{editingMark ? 'Edit Mark' : 'New Mark'}</h2>
              <button className="overlay__close" onClick={() => setShowMarkOverlay(false)}>
                ×
              </button>
            </div>
            <div className="overlay__content">
              <label className="input-label">Emojis</label>
              <input
                type="text"
                className="input"
                placeholder="Enter emoji(s)"
                value={markEmojis}
                onChange={e => setMarkEmojis(e.target.value)}
                autoFocus
              />

              <label className="input-label">Name (optional)</label>
              <input
                type="text"
                className="input"
                placeholder="Mark name"
                value={markName}
                onChange={e => setMarkName(e.target.value)}
              />

              <label className="input-label">Background Color</label>
              <div className="color-picker">
                {PRESET_COLORS.map(color => (
                  <button
                    key={color}
                    className={`color-picker__item ${markColor === color ? 'color-picker__item--selected' : ''}`}
                    style={{ backgroundColor: color }}
                    onClick={() => setMarkColor(color)}
                  />
                ))}
              </div>

              <div className="mark-preview">
                <span>Preview:</span>
                <div
                  className="mark-preview__item"
                  style={{ backgroundColor: markColor }}
                >
                  {markEmojis || '?'}
                </div>
              </div>

              <div className="overlay__actions">
                {editingMark && (
                  <button
                    className="btn-secondary btn-secondary--danger"
                    onClick={() => {
                      setDeleteTargetId(editingMark.id);
                      setShowDeleteConfirm('mark');
                    }}
                  >
                    Delete
                  </button>
                )}
                <button className="btn-secondary" onClick={() => setShowMarkOverlay(false)}>
                  Cancel
                </button>
                <button
                  className="btn-primary"
                  onClick={editingMark ? handleUpdateMark : handleCreateMark}
                  disabled={!markEmojis.trim()}
                >
                  {editingMark ? 'Save' : 'Create'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="overlay" onClick={() => setShowDeleteConfirm(null)}>
          <div className="overlay__panel overlay__panel--small" onClick={e => e.stopPropagation()}>
            <div className="overlay__header">
              <h2>Confirm Delete</h2>
            </div>
            <div className="overlay__content">
              <p>Are you sure you want to delete this {showDeleteConfirm}?</p>
              <div className="overlay__actions">
                <button className="btn-secondary" onClick={() => setShowDeleteConfirm(null)}>
                  Cancel
                </button>
                <button
                  className="btn-primary btn-primary--danger"
                  onClick={showDeleteConfirm === 'suite' ? handleDeleteSuite : handleDeleteMark}
                >
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

export default MarkManagementPage;
