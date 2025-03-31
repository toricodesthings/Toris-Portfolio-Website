import React from 'react';
import './Navbar.css';
import { getToriStat } from './getToriCurStats';

export function ToriStatIndicator() {
  const stat = getToriStat();

  if (!stat) return null;

  const isOnline = stat.active;

  const getDotClass = () => {
    if (!isOnline) return 'dot-offline';

    switch (stat.status.toLowerCase()) {
      case 'active':
        return 'dot-online';
      case 'idle':
        return 'dot-idle';
      case 'coding':
        return 'dot-coding';
      case 'chilling':
        return 'dot-chilling';
      case 'producing':
        return 'dot-producing';
      default:
        return 'dot-online';
    }
  };
  return (
    <div className="nav-stat-indicator">
      <span className={`indicator-dot ${getDotClass()}`} />
      <span className="status-text">
        {isOnline
          ? `Online · ${stat.status}`
          : `Offline · ${stat.last_seen}`}
      </span>
    </div>
  );
}


