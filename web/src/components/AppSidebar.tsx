import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Music } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { cn } from '@/lib/utils';
import { getVisibleRoutes, getActiveRoute } from '@/lib/routes';
import { useCurrentUser } from '@/lib/api';

export function AppSidebar() {
  const router = useRouter();
  const { data: currentUser } = useCurrentUser();
  const visibleRoutes = getVisibleRoutes().filter(route => route.protected);
  const activeRoute = getActiveRoute(router.pathname);
  
  return (
    <Sidebar className="border-r border-sidebar-border">
      <SidebarHeader className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Music className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-sidebar-foreground">Studio Hub</h1>
            <p className="text-xs text-sidebar-foreground/60">Music Production Platform</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 py-4">
        <SidebarMenu data-testid="main-nav">
          {visibleRoutes.map(item => (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton asChild isActive={router.pathname === item.path}>
                <Link
                  href={item.path}
                  data-testid={item.testId}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200',
                    router.pathname === item.path ? 'nav-item-active' : 'nav-item'
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-6 border-t border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
            <span className="text-sm font-semibold text-white">
              {currentUser?.displayName?.charAt(0) ?? 'U'}
            </span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-sidebar-foreground">
              {currentUser?.displayName ?? 'User'}
            </p>
            <div className="flex items-center gap-2">
              <div className={`status-${currentUser?.status ?? 'offline'}`}></div>
              <span className="text-xs text-sidebar-foreground/60 capitalize">
                {currentUser?.status ?? 'offline'}
              </span>
            </div>
          </div>
          <button
            data-testid="btn-logout"
            onClick={() => {
              // Use NextAuth signOut
              import('next-auth/react').then(mod => mod.signOut());
            }}
            className="ml-2 px-3 py-2 rounded-lg bg-destructive text-white hover:bg-destructive/80 transition-all text-sm font-medium"
            type="button"
          >
            Log out
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
