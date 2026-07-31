import React from 'react';
import './StatusFilter.css';

const StatusFilter = ({ selectedStatus, onStatusChange }) => {
  const statuses = [
    { value: 'ALL', label: 'All Orders', color: '#6c757d' },
    { value: 'PLACED', label: 'Placed', color: '#3498db' },
    { value: 'PROCESSING', label: 'Processing', color: '#f39c12' },
    { value: 'READY_TO_SHIP', label: 'Ready to Ship', color: '#2ecc71' },
    { value: 'COMPLETED', label: 'Completed', color: '#27ae60' },
    { value: 'CANCELLED', label: 'Cancelled', color: '#e74c3c' }
  ];

  return (
    <div className="status-filter">
      <div className="filter-label">
        <span>🔍 Filter by Status:</span>
      </div>
      <div className="filter-buttons">
        {statuses.map(status => (
          <button
            key={status.value}
            className={`filter-btn ${selectedStatus === status.value ? 'active' : ''}`}
            style={{ 
              borderColor: status.color,
              backgroundColor: selectedStatus === status.value ? status.color : 'transparent',
              color: selectedStatus === status.value ? 'white' : status.color
            }}
            onClick={() => onStatusChange(status.value)}
          >
            {status.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default StatusFilter;