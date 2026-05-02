import React from 'react';
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonIcon,
} from '@ionic/react';
import './BoardCard.scss';

interface BoardCardProps {
  id: string;
  name: string;
  markCount: number;
  lastUpdated: number;
  onClick: (id: string) => void;
}

const BoardCard: React.FC<BoardCardProps> = ({
  id,
  name,
  markCount,
  lastUpdated,
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
        <IonCardTitle>{name}</IonCardTitle>
        <IonCardSubtitle>
          {markCount} marks · {formatDate(lastUpdated)}
        </IonCardSubtitle>
      </IonCardHeader>
    </IonCard>
  );
};

export default BoardCard;
