import React from 'react';
import './Navbar.css';

const Navbar = ({ onRefresh, isLoading }) => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <span className="brand-icon">📦</span>
          <h1>Order Management</h1>
        </div>
        <div className="navbar-actions">
          <button 
            className="refresh-btn"
            onClick={onRefresh}
            disabled={isLoading}
          >
            {isLoading ? '🔄 Loading...' : '🔄 Refresh'}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;