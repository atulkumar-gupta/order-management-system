import React from 'react';
import './EmptyState.css';

const EmptyState = ({ 
  title = 'No items found', 
  message = 'Try adjusting your filters or create a new item',
  icon = '📭',
  actionText,
  onAction
}) => {
  return (
    <div className="empty-state-container">
      <div className="empty-state-content">
        <div className="empty-state-icon">{icon}</div>
        <h3 className="empty-state-title">{title}</h3>
        <p className="empty-state-message">{message}</p>
        {actionText && onAction && (
          <button className="empty-state-action" onClick={onAction}>
            {actionText}
          </button>
        )}
      </div>
    </div>
  );
};

export default EmptyState;