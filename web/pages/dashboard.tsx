'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { getSession } from 'next-auth/react';
import { usePageMeta } from '@/hooks/usePageMeta';
import { useDashboard, usePlugins, useActivities } from '@/lib/api';
import { Layout } from '@/components/Layout';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Settings, Activity, Download, Play } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  
  // Use dynamic data hooks
  const { data: dashboardStats, isLoading: dashboardLoading, error: dashboardError } = useDashboard();
  const { data: plugins, isLoading: pluginsLoading } = usePlugins();
  const { data: activities, isLoading: activitiesLoading } = useActivities();
  
  const isLoading = dashboardLoading || pluginsLoading || activitiesLoading;
  const error = dashboardError;

  // Use dynamic page meta
  usePageMeta('Dashboard');

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Skip auth check in test environment
        if (process.env.NODE_ENV === 'test') {
          return;
        }
        
        const session = await getSession();
        if (!session) {
          router.push('/auth/login');
          return;
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        if (process.env.NODE_ENV !== 'test') {
          router.push('/auth/login');
        }
      }
    };

    checkAuth();
  }, [router]);

  const dashboardContent = () => {
    if (isLoading) {
      return (
        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-96" />
          </div>
          <div className="text-center">
            <div className="animate-spin inline-block w-6 h-6 border-2 border-current border-t-transparent rounded-full" />
            <p className="mt-2 text-muted-foreground">Loading dashboard...</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Skeleton className="h-96" />
            <Skeleton className="h-96" />
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="p-6">
          <div className="text-center">
            <p className="text-red-600">Failed to load dashboard data</p>
            <Button
              onClick={() => window.location.reload()}
              className="mt-4"
            >
              Retry
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">Overview of your music production hub</p>
          </div>
          <Button onClick={() => router.push('/settings')}>
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>

                 {/* Stats Cards */}
         {dashboardStats && (
           <div className="grid grid-cols-1 md:grid-cols-4 gap-4" data-testid="dashboard-metrics">
             <Card>
               <CardContent className="p-6">
                 <div className="flex items-center justify-between">
                   <div>
                     <p className="text-sm text-muted-foreground">Total Plugins</p>
                     <p className="text-2xl font-bold text-primary">{dashboardStats.plugins.total}</p>
                   </div>
                   <Download className="w-8 h-8 text-primary" />
                 </div>
               </CardContent>
             </Card>

             <Card>
               <CardContent className="p-6">
                 <div className="flex items-center justify-between">
                   <div>
                     <p className="text-sm text-muted-foreground">Active Plugins</p>
                     <p className="text-2xl font-bold text-green-500">{dashboardStats.plugins.active}</p>
                   </div>
                   <Play className="w-8 h-8 text-green-500" />
                 </div>
               </CardContent>
             </Card>

             <Card>
               <CardContent className="p-6">
                 <div className="flex items-center justify-between">
                   <div>
                     <p className="text-sm text-muted-foreground">Avg Usage</p>
                     <p className="text-2xl font-bold text-blue-500">{dashboardStats.plugins.avgUsage}%</p>
                   </div>
                   <Activity className="w-8 h-8 text-blue-500" />
                 </div>
               </CardContent>
             </Card>

             <Card>
               <CardContent className="p-6">
                 <div className="flex items-center justify-between">
                   <div>
                     <p className="text-sm text-muted-foreground">Updates Available</p>
                     <p className="text-2xl font-bold text-yellow-500">{dashboardStats.plugins.updatesAvailable}</p>
                   </div>
                   <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                     <span className="text-white font-bold text-sm">U</span>
                   </div>
                 </div>
               </CardContent>
             </Card>
           </div>
         )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Installed Plugins */}
          <Card>
            <CardHeader>
              <CardTitle>Installed Plugins</CardTitle>
            </CardHeader>
            <CardContent>
              {plugins && plugins.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {plugins.slice(0, 5).map((plugin) => (
                    <div key={plugin.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <span className="text-primary font-semibold">{plugin.name.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="font-medium">{plugin.name}</p>
                          <p className="text-sm text-muted-foreground">{plugin.type}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={plugin.status === 'Active' ? 'default' : 'secondary'}>
                          {plugin.status}
                        </Badge>
                        <span className="text-sm text-muted-foreground">{plugin.usage}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">No plugins installed</p>
              )}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
                             {activities && activities.length > 0 ? (
                 <div className="space-y-4">
                   {activities.slice(0, 5).map((activity) => (
                     <div key={activity.id} className="flex items-center gap-3">
                       <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                         <span className="text-muted-foreground text-sm font-medium">
                           {activity.type.charAt(0)}
                         </span>
                       </div>
                       <div className="flex-1">
                         <p className="text-sm font-medium">{activity.action}</p>
                         <p className="text-xs text-muted-foreground">{activity.type}</p>
                       </div>
                       <span className="text-xs text-muted-foreground">
                         {activity.time}
                       </span>
                     </div>
                   ))}
                 </div>
               ) : (
                 <p className="text-muted-foreground text-center py-8">No recent activity</p>
               )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  return (
    <Layout>
      {dashboardContent()}
    </Layout>
  );
}
