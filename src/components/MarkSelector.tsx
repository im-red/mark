import React, { useState, useMemo, useEffect, useRef } from 'react';
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
  IonTextarea,
  IonIcon,
} from '@ionic/react';
import { create } from 'ionicons/icons';
import { Mark, RECENT_SUITE_ID } from '../models';
import { useMarkSuite } from '../data/MarkSuiteContext';
import './MarkSelector.scss';

interface MarkSelectorProps {
  isOpen: boolean;
  selectedMarkId: string | null;
  recentMarkIds: string[];
  selectedDate: string | null;
  existingComment: string | null;
  onSelect: (markId: string | null) => void;
  onSaveComment: (comment: string | null) => void;
  onClose: () => void;
}

const MarkSelector: React.FC<MarkSelectorProps> = ({
  isOpen,
  selectedMarkId,
  recentMarkIds,
  selectedDate,
  existingComment,
  onSelect,
  onSaveComment,
  onClose,
}) => {
  const { suites, getRecentSuite } = useMarkSuite();
  const availableSuites = useMemo(() => suites.filter(s => s.id !== RECENT_SUITE_ID), [suites]);
  const [selectedSuiteId, setSelectedSuiteId] = useState<string>(
    availableSuites.length > 0 ? availableSuites[0].id : ''
  );

  const [isEditingComment, setIsEditingComment] = useState(false);
  const [comment, setComment] = useState('');
  const prevIsOpen = useRef(isOpen);
  const commentInputRef = useRef<HTMLIonTextareaElement>(null);

  useEffect(() => {
    if (isOpen && !prevIsOpen.current) {
      const hasExistingComment = existingComment && existingComment.trim().length > 0;
      setIsEditingComment(!hasExistingComment);
      setComment(existingComment || '');
    }
    prevIsOpen.current = isOpen;
  }, [isOpen, existingComment]);

  const handleModalClose = () => {
    const trimmedComment = comment.trim() || null;
    if (trimmedComment !== existingComment) {
      onSaveComment(trimmedComment);
    }
    onClose();
  };

  const recentSuite = useMemo(() => getRecentSuite(recentMarkIds), [getRecentSuite, recentMarkIds]);

  const currentSuite = useMemo(() => {
    return availableSuites.find(s => s.id === selectedSuiteId);
  }, [selectedSuiteId, availableSuites]);

  const handleMarkSelect = (mark: Mark) => {
    onSelect(mark.id);
  };

  const handleClear = () => {
    onSelect(null);
  };

  const handleEditToggle = () => {
    setIsEditingComment(true);
    setTimeout(async () => {
      await commentInputRef.current?.setFocus();
      const nativeEl = await commentInputRef.current?.getInputElement();
      if (nativeEl && comment) {
        const len = comment.length;
        nativeEl.setSelectionRange(len, len);
      }
    }, 50);
  };

  const formatDate = (dateKey: string | null) => {
    if (!dateKey) return '';
    const [year, month, day] = dateKey.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    return date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
  };

  return (
    <IonModal isOpen={isOpen} onDidDismiss={handleModalClose} breakpoints={[0, 0.5, 0.75, 1]} initialBreakpoint={0.75}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>{formatDate(selectedDate)}</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleModalClose}>Close</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <div className="mark-section">
          <div className="comment-section">
            {isEditingComment ? (
              <IonTextarea
                ref={commentInputRef}
                className="comment-input"
                placeholder="Add a comment (optional)"
                value={comment}
                onIonInput={(e) => setComment(e.detail.value || '')}
                autoGrow
                rows={1}
              />
            ) : (
              <div className="comment-display">
                <span className="comment-text">{comment}</span>
                <IonButton fill="clear" size="small" className="comment-edit-btn" onClick={handleEditToggle}>
                  <IonIcon slot="icon-only" icon={create} />
                </IonButton>
              </div>
            )}
          </div>
        </div>

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
