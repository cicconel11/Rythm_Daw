import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Skeleton } from "./ui/skeleton";
import { ScrollArea } from "./ui/scroll-area";
import { Activity, Cpu, Users, Folder } from "lucide-react";

interface DashboardProps {
  onNavigate?: (path: string) => void;
}

const stats = [
  {
    label: "Active Plugins",
    value: "12",
    icon: Activity,
    color: "text-[#7E4FFF]",
  },
  { label: "Projects", value: "8", icon: Folder, color: "text-blue-400" },
  { label: "CPU Usage", value: "45%", icon: Cpu, color: "text-green-400" },
  { label: "Collaborators", value: "3", icon: Users, color: "text-orange-400" },
];

const plugins = [
  { name: "Serum", status: "active", cpu: "12%", type: "Synthesizer" },
  { name: "FabFilter Pro-Q 3", status: "active", cpu: "8%", type: "EQ" },
  { name: "Massive X", status: "inactive", cpu: "0%", type: "Synthesizer" },
  { name: "Ozone 10", status: "inactive", cpu: "0%", type: "Mastering" },
  { name: "Battery 4", status: "active", cpu: "15%", type: "Drums" },
];

const activities = [
  { action: "Plugin scan completed", time: "2 minutes ago", type: "system" },
  { action: "Serum preset shared", time: "15 minutes ago", type: "share" },
  { action: "Project exported", time: "1 hour ago", type: "export" },
  {
    action: "Friend request from BeatMaker99",
    time: "2 hours ago",
    type: "social",
  },
];

export function Dashboard({ onNavigate }: DashboardProps) {
  return (
    <div className="min-h-screen bg-[#0D1126] bg-gradient-to-br from-[#0D1126] via-[#141B33] to-[#0D1126] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white font-['Inter'] mb-2">
            Dashboard
          </h1>
          <p className="text-gray-400">
            Welcome back to your music production hub
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="bg-gradient-to-br from-[#141B33] to-[#1A2142] border-gray-700"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">{stat.label}</p>
                    <p className={`text-2xl font-bold ${stat.color}`}>
                      {stat.value}
                    </p>
                  </div>
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 bg-gradient-to-br from-[#141B33] to-[#1A2142] border-gray-700">
            <CardHeader>
              <CardTitle className="text-xl text-white font-['Inter']">
                Plugins
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px]">
                <div className="space-y-3">
                  {plugins.map((plugin, index) => (
                    <div
                      key={index}
                      className="bg-[#0D1126] rounded-lg p-4 border border-gray-700"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-3 h-3 rounded-full ${plugin.status === "active" ? "bg-green-400" : "bg-gray-500"}`}
                          ></div>
                          <div>
                            <h3 className="font-semibold text-white">
                              {plugin.name}
                            </h3>
                            <p className="text-sm text-gray-400">
                              {plugin.type}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge
                            variant={
                              plugin.status === "active"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {plugin.status}
                          </Badge>
                          <p className="text-sm text-gray-400 mt-1">
                            {plugin.cpu}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[#141B33] to-[#1A2142] border-gray-700">
            <CardHeader>
              <CardTitle className="text-xl text-white font-['Inter']">
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px]">
                <div className="space-y-4">
                  {activities.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-[#7E4FFF] rounded-full mt-2 flex-shrink-0"></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white">
                          {activity.action}
                        </p>
                        <p className="text-xs text-gray-400">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full bg-gray-700" />
                    <Skeleton className="h-3 w-1/2 bg-gray-700" />
                  </div>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
