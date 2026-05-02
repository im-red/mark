import React from 'react';
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
} from '@ionic/react';
import { Mark } from '../models';
import './BoardCard.scss';

interface BoardCardProps {
  id: string;
  name: string;
  markCount: number;
  lastUpdated: number;
  recentMarks: Mark[];
  onClick: (id: string) => void;
}

const BoardCard: React.FC<BoardCardProps> = ({
  id,
  name,
  markCount,
  lastUpdated,
  recentMarks,
  onClick,
}) => {
  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <IonCard button onClick={() => onClick(id)} className="board-card">
      <IonCardHeader>
        <div className="board-card__content">
          <div className="board-card__info">
            <IonCardTitle>{name}</IonCardTitle>
            <IonCardSubtitle>
              {markCount} marks · {formatDate(lastUpdated)}
            </IonCardSubtitle>
          </div>
          {recentMarks.length > 0 && (
            <div className="board-card__recent-marks">
              {recentMarks.map((mark) => (
                <span
                  key={mark.id}
                  className="board-card__recent-mark"
                  title={mark.name}
                >
                  {mark.emojis.join('')}
                </span>
              ))}
            </div>
          )}
        </div>
      </IonCardHeader>
    </IonCard>
  );
};

export default BoardCard;
