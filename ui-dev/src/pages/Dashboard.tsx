import { User, Plug2, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ToastExample } from "@/components/examples/ToastExample";

type Plugin = {
  id: string;
  name: string;
  category: string;
  version: string;
  isActive: boolean;
};

type RecentActivity = {
  id: string;
  action: string;
  plugin: string;
  time: string;
};

const plugins: Plugin[] = [
  {
    id: "1",
    name: "Serum",
    category: "Synthesizer",
    version: "1.2.3",
    isActive: true,
  },
  {
    id: "2",
    name: "ValhallaDSP",
    category: "Reverb",
    version: "2.1.0",
    isActive: true,
  },
  {
    id: "3",
    name: "Soothe2",
    category: "Dynamic EQ",
    version: "1.5.2",
    isActive: true,
  },
  {
    id: "4",
    name: "Pro-Q3",
    category: "EQ",
    version: "3.0.0",
    isActive: false,
  },
  {
    id: "5",
    name: "Kickstart",
    category: "Sidechain",
    version: "1.0.0",
    isActive: true,
  },
];

const recentActivity: RecentActivity[] = [
  {
    id: "1",
    action: "Opened project",
    plugin: "Ableton Live",
    time: "2 min ago",
  },
  { id: "2", action: "Added plugin", plugin: "Serum", time: "15 min ago" },
  {
    id: "3",
    action: "Exported track",
    plugin: "Project 1",
    time: "1 hour ago",
  },
  {
    id: "4",
    action: "Updated plugin",
    plugin: "ValhallaDSP",
    time: "2 hours ago",
  },
];

export default function Dashboard() {
  const activePlugins = plugins.filter((plugin) => plugin.isActive);
  const inactivePlugins = plugins.filter((plugin) => !plugin.isActive);

  return (
    <div className="space-y-6">
      {/* Toast Example */}
      <ToastExample />

      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Welcome back, Producer
          </h1>
          <p className="text-gray-400">
            Here's what's happening with your music today
          </p>
        </div>
        <div className="flex items-center space-x-2 bg-gray-800/50 rounded-full px-4 py-2">
          <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-sm text-gray-300">Connected to DAW</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Active Plugins
            </CardTitle>
            <Plug2 className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {activePlugins.length}
            </div>
            <p className="text-xs text-gray-400">+2 from yesterday</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Projects
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-blue-400"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">8</div>
            <p className="text-xs text-gray-400">+1 in progress</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              CPU Usage
            </CardTitle>
            <Activity className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">42%</div>
            <p className="text-xs text-gray-400">+2% from last hour</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Collaborators
            </CardTitle>
            <User className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">3</div>
            <p className="text-xs text-gray-400">2 online now</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Active Plugins */}
        <Card className="col-span-4 bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Active Plugins</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activePlugins.map((plugin) => (
                <div
                  key={plugin.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-700/30 hover:bg-gray-700/50 transition-colors"
                >
                  <div>
                    <p className="font-medium text-white">{plugin.name}</p>
                    <p className="text-xs text-gray-400">
                      {plugin.category} • v{plugin.version}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-xs text-gray-400">Active</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="col-span-3 bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="p-1.5 rounded-full bg-purple-500/20">
                    <Activity className="h-3.5 w-3.5 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">
                      {activity.action}{" "}
                      <span className="text-purple-400">{activity.plugin}</span>
                    </p>
                    <p className="text-xs text-gray-400">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Inactive Plugins */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Inactive Plugins</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {inactivePlugins.map((plugin) => (
              <div
                key={plugin.id}
                className="p-3 rounded-lg bg-gray-700/30 hover:bg-gray-700/50 transition-colors"
              >
                <p className="font-medium text-white">{plugin.name}</p>
                <p className="text-xs text-gray-400">
                  {plugin.category} • v{plugin.version}
                </p>
                <button className="mt-2 text-xs text-purple-400 hover:text-purple-300 transition-colors">
                  Activate
                </button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
