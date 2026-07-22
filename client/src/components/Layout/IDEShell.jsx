import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Notification from '../Notification/Notification';
import './IDEShell.css';

const IDEShell = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeSidePanel, setActiveSidePanel] = useState('explorer');

  useEffect(() => {
    document.body.classList.add('ide-mode');
    return () => {
      document.body.classList.remove('ide-mode');
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Activity Bar Items
  const activityItems = [
    { icon: 'dashboard', path: '/dashboard', label: 'Dashboard' },
    { icon: 'folder', path: '/my-project', label: 'My Projects' },
    { icon: 'add_box', path: '/create-project', label: 'Create Project' },
    { icon: 'explore', path: '/recommend-projects', label: 'Explore' },
    { icon: 'group', path: '/joined-projects', label: 'Joined' },
  ];

  // Helper to determine Explorer title based on route
  const getExplorerTitle = () => {
    const path = location.pathname;
    if (path.includes('dashboard')) return 'EXPLORER: DASHBOARD';
    if (path.includes('my-project')) return 'EXPLORER: MY PROJECTS';
    if (path.includes('recommend-projects')) return 'EXPLORER: DISCOVER';
    if (path.includes('joined-projects')) return 'EXPLORER: JOINED';
    if (path.includes('profile')) return 'EXPLORER: PROFILE';
    if (path.includes('create-project')) return 'EXPLORER: NEW PROJECT';
    if (path.includes('project-view')) return 'EXPLORER: PROJECT SPECS';
    return 'EXPLORER';
  };

  const togglePanel = (panelName) => {
    if (activeSidePanel === panelName) {
      setActiveSidePanel('none');
    } else {
      setActiveSidePanel(panelName);
    }
  };

  return (
    <div className="ide-shell">
      {/* 1. Activity Bar (Far Left) */}
      <div className="ide-activity-bar">
        <div className="ide-activity-top">
          <div className="ide-brand-icon" onClick={() => navigate('/dashboard')} title="CollabSpace">
            <span className="material-symbols-outlined">terminal</span>
          </div>
          {activityItems.map(item => (
            <NavLink 
              key={item.path}
              to={item.path}
              className={({ isActive }) => `ide-activity-icon ${isActive ? 'active' : ''}`}
              title={item.label}
              onClick={() => setActiveSidePanel('explorer')}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
            </NavLink>
          ))}
        </div>
        
        <div className="ide-activity-bottom">
          <button 
            className={`ide-activity-icon ${activeSidePanel === 'notifications' ? 'active' : ''}`}
            onClick={() => togglePanel('notifications')}
            title="Notifications"
          >
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <NavLink 
            to="/profile" 
            className={({ isActive }) => `ide-activity-icon ${isActive ? 'active' : ''}`}
            title="Profile"
            onClick={() => setActiveSidePanel('explorer')}
          >
            <span className="material-symbols-outlined">account_circle</span>
          </NavLink>
          <button className="ide-activity-icon" onClick={handleLogout} title="Logout">
            <span className="material-symbols-outlined">logout</span>
          </button>
        </div>
      </div>

      {/* 2. Explorer Pane (Inner Left) */}
      {activeSidePanel !== 'none' && (
        <div className="ide-explorer-pane">
          {activeSidePanel === 'explorer' ? (
            <>
              <div className="ide-explorer-header">
                {getExplorerTitle()}
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>more_horiz</span>
              </div>
              <div className="ide-explorer-content">
                <div className="ide-tree-item root">
                  <span className="material-symbols-outlined">keyboard_arrow_down</span>
                  workspace
                </div>
                <div className="ide-tree-item child">
                  <span className="material-symbols-outlined" style={{ color: '#4ade80' }}>description</span>
                  README.md
                </div>
                <div className="ide-tree-item child">
                  <span className="material-symbols-outlined" style={{ color: '#60a5fa' }}>data_object</span>
                  package.json
                </div>
                <div className="ide-tree-item child">
                  <span className="material-symbols-outlined" style={{ color: '#facc15' }}>folder</span>
                  src
                </div>
                <div className="ide-tree-item child" style={{ marginLeft: '24px' }}>
                  <span className="material-symbols-outlined" style={{ color: '#38bdf8' }}>code</span>
                  App.jsx
                </div>
                <div className="ide-tree-item child" style={{ marginLeft: '24px' }}>
                  <span className="material-symbols-outlined" style={{ color: '#38bdf8' }}>code</span>
                  index.css
                </div>
              </div>
            </>
          ) : activeSidePanel === 'notifications' ? (
            <div className="ide-explorer-content" style={{ padding: '16px 0', overflow: 'hidden' }}>
              <Notification />
            </div>
          ) : null}
        </div>
      )}

      {/* 3. Main Editor Window */}
      <div className="ide-main-window">
        {/* Editor Tabs */}
        <div className="ide-editor-tabs">
          <div className="ide-tab active">
            <span className="material-symbols-outlined" style={{ fontSize: '14px', color: '#38bdf8' }}>code</span>
            <span className="tab-title">CollabSpace.jsx</span>
            <span className="material-symbols-outlined tab-close">close</span>
          </div>
        </div>
        <div className="ide-editor-content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default IDEShell;
