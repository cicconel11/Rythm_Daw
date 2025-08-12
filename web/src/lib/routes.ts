import { Home, Share, History, Users, MessageSquare, Settings, Music, UserPlus, Download, Smartphone } from 'lucide-react';

export type RouteKey = 
  | 'dashboard' 
  | 'files' 
  | 'history' 
  | 'friends' 
  | 'chat' 
  | 'settings' 
  | 'landing' 
  | 'login' 
  | 'registerCredentials' 
  | 'registerBio' 
  | 'scan' 
  | 'device' 
  | 'notFound';

export interface RouteConfig {
  path: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  protected?: boolean;
  testId?: string;
  iconKey?: string;
  featureFlag?: string;
  description?: string;
}

export const ROUTES: Record<RouteKey, RouteConfig> = {
  landing: { 
    path: '/landing', 
    name: 'Landing', 
    icon: Music,
    protected: false,
    description: 'Welcome to RHYTHM Studio Hub'
  },
  login: { 
    path: '/auth/login', 
    name: 'Login', 
    icon: Settings,
    protected: false,
    description: 'Sign in to your account'
  },
  registerCredentials: { 
    path: '/register/credentials', 
    name: 'Register', 
    icon: UserPlus,
    protected: false,
    description: 'Create your account'
  },
  registerBio: { 
    path: '/register/bio', 
    name: 'Complete Profile', 
    icon: UserPlus,
    protected: false,
    description: 'Tell us about yourself'
  },
  scan: { 
    path: '/scan', 
    name: 'Plugin Download', 
    icon: Download,
    protected: false,
    description: 'Download and install plugins'
  },
  device: { 
    path: '/device', 
    name: 'Device Connection', 
    icon: Smartphone,
    protected: false,
    description: 'Connect your devices'
  },
  dashboard: {
    path: '/dashboard',
    name: 'Dashboard',
    icon: Home,
    protected: true,
    testId: 'nav-dashboard',
    iconKey: 'dashboard',
    description: 'Overview of your music production hub'
  },
  files: {
    path: '/files',
    name: 'File Share',
    icon: Share,
    protected: true,
    testId: 'nav-files',
    iconKey: 'files',
    description: 'Share and manage your music files'
  },
  history: {
    path: '/history',
    name: 'History',
    icon: History,
    protected: true,
    testId: 'nav-history',
    iconKey: 'history',
    description: 'View your activity timeline'
  },
  friends: {
    path: '/friends',
    name: 'Friends',
    icon: Users,
    protected: true,
    testId: 'nav-friends',
    iconKey: 'friends',
    description: 'Connect with other musicians'
  },
  chat: {
    path: '/chat',
    name: 'Chat',
    icon: MessageSquare,
    protected: true,
    testId: 'nav-chat',
    iconKey: 'chat',
    description: 'Real-time messaging with collaborators'
  },
  settings: {
    path: '/settings',
    name: 'Settings',
    icon: Settings,
    protected: true,
    testId: 'nav-settings',
    iconKey: 'settings',
    description: 'Manage your account and preferences'
  },
  notFound: { 
    path: '/404', 
    name: 'Not Found', 
    icon: Settings,
    protected: false,
    description: 'Page not found'
  },
};

export const PROTECTED_ROUTES = Object.values(ROUTES).filter(route => route.protected);
export const PUBLIC_ROUTES = Object.values(ROUTES).filter(route => !route.protected);

export function getRouteByPath(path: string): RouteConfig | undefined {
  return Object.values(ROUTES).find(route => route.path === path);
}

export function getRouteByName(name: string): RouteConfig | undefined {
  return Object.values(ROUTES).find(route => route.name === name);
}

export function getRouteByKey(key: RouteKey): RouteConfig {
  return ROUTES[key];
}

export function getVisibleRoutes(): RouteConfig[] {
  return Object.values(ROUTES).filter(route => {
    if (!route.featureFlag) return true;
    return process.env[`NEXT_PUBLIC_${route.featureFlag}`] === 'true';
  });
}

export function getActiveRoute(pathname: string): RouteConfig | undefined {
  return Object.values(ROUTES).find(route => route.path === pathname);
}
