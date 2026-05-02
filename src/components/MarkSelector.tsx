import React, { useState, useMemo } from 'react';
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonContent,
  IonSelect,
  IonSelectOption,
} from '@ionic/react';
import { Mark, RECENT_SUITE_ID } from '../models';
import { useMarkSuite } from '../data/MarkSuiteContext';
import './MarkSelector.scss';

interface MarkSelectorProps {
  isOpen: boolean;
  selectedMarkId: string | null;
  recentMarkIds: string[];
  onSelect: (markId: string | null) => void;
  onClose: () => void;
}

const MarkSelector: React.FC<MarkSelectorProps> = ({
  isOpen,
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
    <IonModal isOpen={isOpen} onDidDismiss={onClose} breakpoints={[0, 0.5, 0.75, 1]} initialBreakpoint={0.75}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Select Mark</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={onClose}>Close</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
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
          <IonSelect
            interface="popover"
            value={selectedSuiteId}
            onIonChange={(e) => setSelectedSuiteId(e.detail.value)}
            className="suite-dropdown"
          >
            {availableSuites.map(suite => (
              <IonSelectOption key={suite.id} value={suite.id}>
                {suite.name}
              </IonSelectOption>
            ))}
          </IonSelect>

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

        {selectedMarkId && (
          <IonButton expand="block" color="danger" fill="outline" onClick={handleClear}>
            Clear Mark
          </IonButton>
        )}
      </IonContent>
    </IonModal>
  );
};

export default MarkSelector;
