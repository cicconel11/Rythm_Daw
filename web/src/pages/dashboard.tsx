import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, Badge, Button, Skeleton } from '@/components/ui';
import { Activity, Download, Play, Settings } from 'lucide-react';
import { usePageMeta } from '@/hooks/usePageMeta';
import { ROUTES } from '@/lib/routes';
import { useDashboard, usePlugins, useActivities } from '@/lib/api';

export default function Dashboard() {
  usePageMeta(ROUTES.dashboard.name);
  
  const { data: dashboardStats, isLoading: dashboardLoading } = useDashboard();
  const { data: plugins, isLoading: pluginsLoading } = usePlugins();
  const { data: activities, isLoading: activitiesLoading } = useActivities();

  const isLoading = dashboardLoading || pluginsLoading || activitiesLoading;

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back to your music production hub</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <Settings className="w-4 h-4 mr-2" />
          Settings
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="plugin-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Plugins</p>
                {isLoading ? (
                  <Skeleton className="h-8 w-12" />
                ) : (
                  <p className="text-2xl font-bold text-primary">{dashboardStats?.plugins.total ?? 0}</p>
                )}
              </div>
              <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                <Play className="w-5 h-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="plugin-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Plugins</p>
                {isLoading ? (
                  <Skeleton className="h-8 w-12" />
                ) : (
                  <p className="text-2xl font-bold text-accent">{dashboardStats?.plugins.active ?? 0}</p>
                )}
              </div>
              <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="plugin-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Usage</p>
                {isLoading ? (
                  <Skeleton className="h-8 w-12" />
                ) : (
                  <p className="text-2xl font-bold text-green-500">{dashboardStats?.plugins.avgUsage ?? 0}%</p>
                )}
              </div>
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                <Download className="w-5 h-5 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="plugin-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Updates Available</p>
                {isLoading ? (
                  <Skeleton className="h-8 w-12" />
                ) : (
                  <p className="text-2xl font-bold text-orange-500">{dashboardStats?.plugins.updatesAvailable ?? 0}</p>
                )}
              </div>
              <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                <Settings className="w-5 h-5 text-orange-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-xl">Installed Plugins</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="plugin-card">
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-3 w-16 mb-2" />
                    <div className="flex justify-between">
                      <Skeleton className="h-3 w-12" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {plugins?.map(plugin => (
                  <div key={plugin.id} className="plugin-card">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-foreground">{plugin.name}</h3>
                      <Badge variant={plugin.status === 'Active' ? 'default' : 'secondary'}>
                        {plugin.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{plugin.type}</p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">v{plugin.version}</span>
                      <span className="text-primary font-medium">{plugin.usage} usage</span>
                    </div>
                  </div>
                )) ?? []}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                    <Skeleton className="w-2 h-2 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-48 mb-1" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {activities?.map((activity) => (
                  <div key={activity.id} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse-slow"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                )) ?? []}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
