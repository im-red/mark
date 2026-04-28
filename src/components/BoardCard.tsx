import React from 'react';

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
    <div className="board-card" onClick={() => onClick(id)}>
      <div className="board-card__content">
        <h3 className="board-card__name">{name}</h3>
        <div className="board-card__meta">
          <span className="board-card__count">{markCount} marks</span>
          <span className="board-card__dot">·</span>
          <span className="board-card__date">{formatDate(lastUpdated)}</span>
        </div>
      </div>
      <div className="board-card__arrow">›</div>
    </div>
  );
};

export default BoardCard;
