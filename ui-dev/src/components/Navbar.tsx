import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore, type Tab } from '@/store';
import { cn } from '@/lib/utils';
import { LayoutDashboard, File, Clock, Users, MessageSquare, Settings, Shield } from 'lucide-react';
import useAuth from '@/hooks/useAuth';

type NavItem = {
  id: string;
  label: string;
  icon: React.ReactNode;
};

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
  { id: 'files', label: 'File Share', icon: <File className="h-5 w-5" /> },
  { id: 'history', label: 'History', icon: <Clock className="h-5 w-5" /> },
  { id: 'friends', label: 'Friends', icon: <Users className="h-5 w-5" /> },
  { id: 'chat', label: 'Chat', icon: <MessageSquare className="h-5 w-5" /> },
  { id: 'admin', label: 'Admin', icon: <Shield className="h-5 w-5" /> },
  { id: 'settings', label: 'Settings', icon: <Settings className="h-5 w-5" /> },
];

export default function Navbar() {
  const navigate = useNavigate();
  const { activeTab, setActiveTab } = useStore();
  const { isAdmin } = useAuth();
  
  // Helper function to handle tab clicks
  const handleTabClick = (tabId: string) => {
    const validTabs = ['dashboard', 'files', 'history', 'friends', 'chat', 'settings', 'admin'];
    if (validTabs.includes(tabId)) {
      setActiveTab(tabId as Tab);
      // Navigate to the corresponding route
      navigate(`/${tabId}`);
    }
  };
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={cn(
      'h-screen bg-gray-900 text-gray-300 flex flex-col border-r border-gray-800 transition-all duration-300',
      isCollapsed ? 'w-16' : 'w-64'
    )}>
      <div className="p-4 border-b border-gray-800 flex items-center justify-between">
        {!isCollapsed && <h1 className="text-xl font-bold text-purple-400">Rythm</h1>}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 rounded-md hover:bg-gray-800 text-gray-400 hover:text-white"
        >
          {isCollapsed ? '→' : '←'}
        </button>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => {
            // Skip admin item if user is not an admin
            if (item.id === 'admin' && !isAdmin) return null;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => handleTabClick(item.id)}
                  className={cn(
                    'w-full flex items-center space-x-3 px-4 py-3 rounded-md text-sm font-medium transition-colors',
                    activeTab === item.id
                      ? 'bg-gray-800 text-white'
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white',
                    item.id === 'admin' ? 'text-purple-400' : ''
                  )}
                >
                  {item.icon}
                  {!isCollapsed && <span>{item.label}</span>}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-gray-800">
        <button
          onClick={() => handleTabClick('settings')}
          className={cn(
            'w-full flex items-center px-4 py-3 rounded-md text-sm font-medium transition-colors',
            activeTab === 'settings'
              ? 'bg-purple-500/20 text-purple-400'
              : 'text-gray-400 hover:bg-gray-800 hover:text-white',
            isCollapsed ? 'justify-center' : 'space-x-3'
          )}
        >
          <Settings className="h-5 w-5 flex-shrink-0" />
          {!isCollapsed && <span>Settings</span>}
        </button>
      </div>
    </div>
  );
}
