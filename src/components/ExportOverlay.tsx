import React from 'react';
import { useBoard } from '../context/BoardContext';
import { useMarkSuite } from '../context/MarkSuiteContext';
import { exportData, downloadJson } from '../utils/export';

interface ExportOverlayProps {
  onClose: () => void;
}

const ExportOverlay: React.FC<ExportOverlayProps> = ({ onClose }) => {
  const { boards } = useBoard();
  const { markSuites } = useMarkSuite();

  const handleExport = async () => {
    const appState = {
      boards,
      markSuites,
      currentBoardId: null,
    };
    const data = exportData(appState);
    await downloadJson(data);
    onClose();
  };

  const totalMarks = boards.reduce(
    (sum, board) => sum + Object.keys(board.marks).length,
    0
  );

  const customSuites = markSuites.filter(s => !s.isBuiltIn && !s.isDynamic);

  return (
    <div className="overlay" onClick={onClose}>
      <div className="overlay__panel" onClick={(e) => e.stopPropagation()}>
        <div className="overlay__header">
          <h2>Export Data</h2>
          <button className="overlay__close" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="overlay__content">
          <p className="overlay__text">
            Export all your boards, marks, and custom mark suites to a JSON file. This file can
            be imported later to restore your data.
          </p>
          <div className="export-summary">
            <div className="export-summary__item">
              <span className="export-summary__label">Boards</span>
              <span className="export-summary__value">{boards.length}</span>
            </div>
            <div className="export-summary__item">
              <span className="export-summary__label">Total Marks</span>
              <span className="export-summary__value">{totalMarks}</span>
            </div>
            <div className="export-summary__item">
              <span className="export-summary__label">Custom Suites</span>
              <span className="export-summary__value">{customSuites.length}</span>
            </div>
          </div>
          <div className="overlay__actions">
            <button className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button className="btn-primary" onClick={handleExport}>
              Export
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportOverlay;
