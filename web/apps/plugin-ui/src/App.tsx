import React, { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import Dashboard from './sections/Dashboard'
import Files from './sections/Files'
import History from './sections/History'
import Friends from './sections/Friends'
import Chat from './sections/Chat'
import Settings from './sections/Settings'
import { JuceBridge } from './bridge/JuceBridge'
import './App.css'

const APP_VERSION = '1.0.0'

type Section = 'dashboard' | 'files' | 'history' | 'friends' | 'chat' | 'settings'

function App() {
  const [currentSection, setCurrentSection] = useState<Section>('dashboard')
  const [bridgeStatus, setBridgeStatus] = useState({ connected: false })

  useEffect(() => {
    // Initialize JUCE bridge
    JuceBridge.init()
    
    // Send UI ready message
    JuceBridge.send('ui-ready', { version: APP_VERSION })
    
    // Listen for bridge status updates
    JuceBridge.onMessage((message) => {
      if (message.type === 'bridge-status') {
        setBridgeStatus(message.data)
      }
    })
  }, [])

  const handleSectionChange = (section: Section) => {
    setCurrentSection(section)
    JuceBridge.send('nav-change', { section })
  }

  const renderSection = () => {
    switch (currentSection) {
      case 'dashboard':
        return <Dashboard />
      case 'files':
        return <Files />
      case 'history':
        return <History />
      case 'friends':
        return <Friends />
      case 'chat':
        return <Chat />
      case 'settings':
        return <Settings />
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="app">
      <Sidebar 
        currentSection={currentSection} 
        onSectionChange={handleSectionChange}
        bridgeStatus={bridgeStatus}
      />
      <main className="main-content">
        {renderSection()}
      </main>
    </div>
  )
}

export default App
