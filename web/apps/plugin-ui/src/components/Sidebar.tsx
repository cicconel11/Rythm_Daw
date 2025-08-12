import React from 'react'
import './Sidebar.css'

interface SidebarProps {
  currentSection: string
  onSectionChange: (section: string) => void
  bridgeStatus: { connected: boolean }
}

const Sidebar: React.FC<SidebarProps> = ({ currentSection, onSectionChange, bridgeStatus }) => {
  const sections = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'files', label: 'Files', icon: '📁' },
    { id: 'history', label: 'History', icon: '📜' },
    { id: 'friends', label: 'Friends', icon: '👥' },
    { id: 'chat', label: 'Chat', icon: '💬' },
    { id: 'settings', label: 'Settings', icon: '⚙️' }
  ]

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h1>RHYTHM</h1>
        <div className={`connection-status ${bridgeStatus.connected ? 'connected' : 'disconnected'}`}>
          <div className="status-dot"></div>
          <span>{bridgeStatus.connected ? 'Connected' : 'Disconnected'}</span>
        </div>
      </div>
      
      <nav className="sidebar-nav">
        {sections.map((section) => (
          <button
            key={section.id}
            className={`nav-button ${currentSection === section.id ? 'active' : ''}`}
            onClick={() => onSectionChange(section.id)}
          >
            <span className="nav-icon">{section.icon}</span>
            <span className="nav-label">{section.label}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}

export default Sidebar
