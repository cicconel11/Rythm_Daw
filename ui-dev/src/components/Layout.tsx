import { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Folder, Clock, Users, MessageSquare, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: ReactNode;
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Files', href: '/files', icon: Folder },
  { name: 'History', href: '/history', icon: Clock },
  { name: 'Friends', href: '/friends', icon: Users },
  { name: 'Chat', href: '/chat', icon: MessageSquare },
];

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex h-screen bg-music-bg text-music-text overflow-hidden">
      {/* Sidebar */}
      <div className="w-20 md:w-64 bg-music-card border-r border-music-border flex flex-col">
        <div className="p-4 border-b border-music-border">
          <h1 className="text-xl font-bold text-music-primary text-center md:text-left">Rythm</h1>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-2">
            {navigation.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.href}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center p-3 rounded-lg text-music-text-muted hover:bg-music-primary/10 hover:text-music-primary transition-colors',
                      'group',
                      isActive && 'bg-music-primary/10 text-music-primary font-medium'
                    )
                  }
                >
                  <item.icon className="h-6 w-6 flex-shrink-0" aria-hidden="true" />
                  <span className="ml-3 hidden md:inline">{item.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="p-4 border-t border-music-border">
          <NavLink
            to="/settings"
            className="flex items-center p-3 rounded-lg text-music-text-muted hover:bg-music-primary/10 hover:text-music-primary transition-colors"
          >
            <Settings className="h-6 w-6" aria-hidden="true" />
            <span className="ml-3 hidden md:inline">Settings</span>
          </NavLink>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-music-card border-b border-music-border h-16 flex items-center px-6">
          <div className="flex-1">
            {/* Search bar or page title can go here */}
          </div>
          <div className="flex items-center space-x-4">
            {/* User profile and notifications can go here */}
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto bg-gradient-to-br from-music-bg to-music-card/50 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
