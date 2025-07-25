import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Activity, Download, Play, Settings } from 'lucide-react';

const plugins = [
  {
    id: 1,
    name: 'Serum',
    type: 'Synthesizer',
    version: '1.365',
    status: 'Active',
    usage: '87%',
  },
  {
    id: 2,
    name: 'FabFilter Pro-Q 3',
    type: 'EQ',
    version: '3.24',
    status: 'Active',
    usage: '92%',
  },
  {
    id: 3,
    name: 'Waves SSL G-Master',
    type: 'Compressor',
    version: '14.0',
    status: 'Inactive',
    usage: '45%',
  },
  {
    id: 4,
    name: 'Native Instruments Massive X',
    type: 'Synthesizer',
    version: '1.4.1',
    status: 'Active',
    usage: '76%',
  },
  {
    id: 5,
    name: 'Valhalla VintageVerb',
    type: 'Reverb',
    version: '3.0.1',
    status: 'Active',
    usage: '69%',
  },
  {
    id: 6,
    name: 'Ozone 10',
    type: 'Mastering Suite',
    version: '10.0.2',
    status: 'Active',
    usage: '88%',
  },
];

const recentActivity = [
  { action: 'Plugin Scan Completed', time: '2 minutes ago', type: 'system' },
  { action: 'Added Serum to favorites', time: '15 minutes ago', type: 'user' },
  { action: "Exported project 'Track_01'", time: '1 hour ago', type: 'export' },
  {
    action: 'Friend request from BeatMaker99',
    time: '2 hours ago',
    type: 'social',
  },
];

export default function Dashboard() {
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
                <p className="text-2xl font-bold text-primary">{plugins.length}</p>
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
                <p className="text-2xl font-bold text-accent">
                  {plugins.filter(p => p.status === 'Active').length}
                </p>
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
                <p className="text-2xl font-bold text-green-500">74%</p>
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
                <p className="text-2xl font-bold text-orange-500">3</p>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {plugins.map(plugin => (
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
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse-slow"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
