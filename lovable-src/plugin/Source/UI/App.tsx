
import React, { useState } from 'react';
import { Dashboard, ChatPanel, FriendsPanel, Settings } from '@rythm/ui-kit';
import { JuceBridge } from './JuceBridge';
import { Home, MessageCircle, Users, Settings as SettingsIcon, Share, History } from 'lucide-react';

export function App() {
  const [activeView, setActiveView] = useState('dashboard');

  const menuItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard' },
    { id: 'files', icon: Share, label: 'Files' },
    { id: 'history', icon: History, label: 'History' },
    { id: 'friends', icon: Users, label: 'Friends' },
    { id: 'chat', icon: MessageCircle, label: 'Chat' },
    { id: 'settings', icon: SettingsIcon, label: 'Settings' },
  ];

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard />;
      case 'chat':
        return <ChatPanel />;
      case 'friends':
        return <FriendsPanel />;
      case 'settings':
        return <Settings 
          onUpdateAccount={(data) => console.log('Update account:', data)}
          onRescanPlugins={() => console.log('Rescan plugins')}
          onDownloadPlugin={() => console.log('Download plugin')}
        />;
      case 'files':
        return <div className="p-6 text-white">Files view coming soon...</div>;
      case 'history':
        return <div className="p-6 text-white">History view coming soon...</div>;
      default:
        return <Dashboard />;
    }
  };

  React.useEffect(() => {
    // Initialize JUCE bridge
    JuceBridge.send('plugin-loaded', {});
    
    // Listen for plugin events
    JuceBridge.on('parameter-changed', (data) => {
      console.log('Parameter changed:', data);
    });

    return () => {
      JuceBridge.send('plugin-unloaded', {});
    };
  }, []);

  return (
    <div className="h-screen flex bg-[#0D1126] max-w-[900px] mx-auto">
      {/* Side Navigation */}
      <div className="w-16 bg-[#141B33] border-r border-gray-700 flex flex-col items-center py-4">
        <div className="w-10 h-10 bg-gradient-to-br from-[#7E4FFF] to-[#6B3FE6] rounded-lg flex items-center justify-center mb-8">
          <span className="text-white font-bold font-['JetBrains_Mono']">R</span>
        </div>
        
        <nav className="flex flex-col gap-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-12 h-12 rounded-lg flex items-center justify-center transition-colors ${
                activeView === item.id
                  ? 'bg-[#7E4FFF] text-white'
                  : 'text-gray-400 hover:text-white hover:bg-[#1A2142]'
              }`}
              title={item.label}
            >
              <item.icon className="w-5 h-5" />
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {renderView()}
      </div>
    </div>
  );
}

export default App;
