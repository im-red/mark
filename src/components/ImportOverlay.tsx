import React, { useState, useRef } from 'react';
import { useBoard } from '../context/BoardContext';
import { useMarkSuite } from '../context/MarkSuiteContext';
import { parseImportFile, mergeImportedBoards, mergeImportedSuites } from '../utils/import';
import { Board, MarkSuite } from '../types';

interface ImportOverlayProps {
  onClose: () => void;
}

const ImportOverlay: React.FC<ImportOverlayProps> = ({ onClose }) => {
  const { boards, importBoards } = useBoard();
  const { markSuites, importSuites } = useMarkSuite();
  const [status, setStatus] = useState<'idle' | 'preview'>('idle');
  const [previewBoards, setPreviewBoards] = useState<Board[]>([]);
  const [previewSuites, setPreviewSuites] = useState<MarkSuite[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const result = await parseImportFile(file);
    if (result.success && result.boards) {
      setPreviewBoards(result.boards);
      setPreviewSuites(result.markSuites || []);
      setStatus('preview');
    } else {
      alert('Import failed: ' + (result.error || 'Unknown error'));
    }
  };

  const handleImport = () => {
    try {
      const newBoards = mergeImportedBoards(boards, previewBoards);
      importBoards(newBoards);
      
      if (previewSuites.length > 0) {
        const newSuites = mergeImportedSuites(markSuites, previewSuites);
        importSuites(newSuites);
      }
      
      alert('Import successful!');
      onClose();
    } catch {
      alert('Failed to import data. Please try again.');
    }
  };

  const handleReset = () => {
    setStatus('idle');
    setPreviewBoards([]);
    setPreviewSuites([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const totalMarks = previewBoards.reduce(
    (sum, board) => sum + Object.keys(board.marks).length,
    0
  );

  return (
    <div className="overlay" onClick={onClose}>
      <div className="overlay__panel" onClick={(e) => e.stopPropagation()}>
        <div className="overlay__header">
          <h2>Import Data</h2>
          <button className="overlay__close" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="overlay__content">
          {status === 'idle' && (
            <>
              <p className="overlay__text">
                Import boards, marks, and custom mark suites from a previously exported JSON file.
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json,application/json"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
              />
              <button
                className="btn-primary btn-full"
                onClick={() => fileInputRef.current?.click()}
              >
                Select File
              </button>
            </>
          )}

          {status === 'preview' && (
            <>
              <p className="overlay__text">Ready to import:</p>
              <div className="export-summary">
                <div className="export-summary__item">
                  <span className="export-summary__label">Boards</span>
                  <span className="export-summary__value">
                    {previewBoards.length}
                  </span>
                </div>
                <div className="export-summary__item">
                  <span className="export-summary__label">Total Marks</span>
                  <span className="export-summary__value">{totalMarks}</span>
                </div>
                {previewSuites.length > 0 && (
                  <div className="export-summary__item">
                    <span className="export-summary__label">Custom Suites</span>
                    <span className="export-summary__value">{previewSuites.length}</span>
                  </div>
                )}
              </div>
              <div className="overlay__actions">
                <button className="btn-secondary" onClick={handleReset}>
                  Cancel
                </button>
                <button className="btn-primary" onClick={handleImport}>
                  Import
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImportOverlay;
