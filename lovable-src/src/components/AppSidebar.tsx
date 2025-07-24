
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Home, Share, History, Users, MessageSquare, Music, Settings } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const menuItems = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "File Share", url: "/files", icon: Share },
  { title: "History", url: "/history", icon: History },
  { title: "Friends", url: "/friends", icon: Users },
  { title: "Chat", url: "/chat", icon: MessageSquare },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const location = useLocation();

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
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <Link
                  to={item.url}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200",
                    location.pathname === item.url
                      ? "nav-item-active"
                      : "nav-item"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-6 border-t border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
            <span className="text-sm font-semibold text-white">DJ</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-sidebar-foreground">DJ Producer</p>
            <div className="flex items-center gap-2">
              <div className="status-online"></div>
              <span className="text-xs text-sidebar-foreground/60">Online</span>
            </div>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
