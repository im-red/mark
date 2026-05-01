import React, { useState, useMemo } from 'react';
import { Mark, RECENT_SUITE_ID } from '../types';
import { useMarkSuite } from '../context/MarkSuiteContext';

interface MarkSelectorProps {
  selectedMarkId: string | null;
  recentMarkIds: string[];
  onSelect: (markId: string | null) => void;
  onClose: () => void;
}

const MarkSelector: React.FC<MarkSelectorProps> = ({
  selectedMarkId,
  recentMarkIds,
  onSelect,
  onClose,
}) => {
  const { suites, getRecentSuite } = useMarkSuite();
  const availableSuites = useMemo(() => suites.filter(s => s.id !== RECENT_SUITE_ID), [suites]);
  const [selectedSuiteId, setSelectedSuiteId] = useState<string>(
    availableSuites.length > 0 ? availableSuites[0].id : ''
  );

  const recentSuite = useMemo(() => getRecentSuite(recentMarkIds), [getRecentSuite, recentMarkIds]);

  const currentSuite = useMemo(() => {
    return availableSuites.find(s => s.id === selectedSuiteId);
  }, [selectedSuiteId, availableSuites]);

  const handleMarkSelect = (mark: Mark) => {
    onSelect(mark.id);
    onClose();
  };

  const handleClear = () => {
    onSelect(null);
    onClose();
  };

  return (
    <div className="mark-selector-overlay" onClick={onClose}>
      <div className="mark-selector" onClick={e => e.stopPropagation()}>
        <div className="mark-selector-header">
          <h3>Select Mark</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="mark-selector-content">
          <div className="mark-section">
            <h4>Recent Marks</h4>
            <div className="mark-grid">
              {recentSuite.marks.map(mark => {
                const emojiText = mark.emojis.join('');
                const isNumericText = /^\d+$/.test(emojiText);
                return (
                  <button
                    key={`recent-${mark.id}`}
                    className={`mark-btn ${selectedMarkId === mark.id ? 'selected' : ''}`}
                    style={{ backgroundColor: mark.backgroundColor }}
                    onClick={() => handleMarkSelect(mark)}
                    title={mark.name}
                  >
                    {isNumericText ? (
                      <span className="mark-btn__text">{emojiText}</span>
                    ) : (
                      emojiText
                    )}
                  </button>
                );
              })}
              {recentSuite.marks.length === 0 && (
                <p className="mark-grid__empty">No recent marks.</p>
              )}
            </div>
          </div>

          <div className="mark-section">
            <h4>Mark Suites</h4>
            <div className="suite-selector">
              <select
                className="suite-dropdown"
                value={selectedSuiteId}
                onChange={e => setSelectedSuiteId(e.target.value)}
              >
                {availableSuites.map(suite => (
                  <option key={suite.id} value={suite.id}>
                    {suite.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mark-grid">
              {currentSuite?.marks.map(mark => {
                const emojiText = mark.emojis.join('');
                const isNumericText = /^\d+$/.test(emojiText);
                return (
                  <button
                    key={mark.id}
                    className={`mark-btn ${selectedMarkId === mark.id ? 'selected' : ''}`}
                    style={{ backgroundColor: mark.backgroundColor }}
                    onClick={() => handleMarkSelect(mark)}
                    title={mark.name}
                  >
                    {isNumericText ? (
                      <span className="mark-btn__text">{emojiText}</span>
                    ) : (
                      emojiText
                    )}
                  </button>
                );
              })}
              {(!currentSuite || currentSuite.marks.length === 0) && (
                <p className="mark-grid__empty">No marks in this suite.</p>
              )}
            </div>
          </div>
        </div>

        <div className="mark-selector-actions">
          {selectedMarkId && (
            <button className="clear-btn" onClick={handleClear}>
              Clear Mark
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MarkSelector;
