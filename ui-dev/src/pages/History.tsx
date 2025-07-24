import { useState } from "react";
import {
  Activity,
  Clock,
  Filter,
  Search,
  User,
  Download,
  Trash2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ActivityType = "all" | "file" | "plugin" | "collaboration" | "system";

type ActivityItem = {
  id: string;
  type: ActivityType;
  action: string;
  user: string;
  details: string;
  timestamp: string;
  icon: React.ReactNode;
};

const activities: ActivityItem[] = [
  {
    id: "1",
    type: "file",
    action: "uploaded",
    user: "Alex Johnson",
    details: "Drum_Loop_1.wav",
    timestamp: "2 minutes ago",
    icon: <Download className="h-4 w-4 text-blue-400" />,
  },
  {
    id: "2",
    type: "plugin",
    action: "updated",
    user: "Jordan Smith",
    details: "Serum to v1.2.3",
    timestamp: "15 minutes ago",
    icon: <Activity className="h-4 w-4 text-purple-400" />,
  },
  {
    id: "3",
    type: "collaboration",
    action: "shared",
    user: "Taylor Swift",
    details: "Project_Alpha with you",
    timestamp: "1 hour ago",
    icon: <User className="h-4 w-4 text-green-400" />,
  },
  {
    id: "4",
    type: "file",
    action: "modified",
    user: "You",
    details: "Vocal_Take_3.mp3",
    timestamp: "3 hours ago",
    icon: <Download className="h-4 w-4 text-blue-400" />,
  },
  {
    id: "5",
    type: "system",
    action: "backup",
    user: "System",
    details: "Daily backup completed",
    timestamp: "1 day ago",
    icon: <Clock className="h-4 w-4 text-gray-400" />,
  },
  {
    id: "6",
    type: "plugin",
    action: "installed",
    user: "You",
    details: "New plugin: Soothe2",
    timestamp: "2 days ago",
    icon: <Activity className="h-4 w-4 text-purple-400" />,
  },
  {
    id: "7",
    type: "file",
    action: "deleted",
    user: "Alex Johnson",
    details: "Old_Project_Backup.zip",
    timestamp: "3 days ago",
    icon: <Trash2 className="h-4 w-4 text-red-400" />,
  },
];

type TimeRange = "all" | "today" | "week" | "month";

export default function History() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activityType, setActivityType] = useState<ActivityType>("all");
  const [timeRange, setTimeRange] = useState<TimeRange>("all");

  const filteredActivities = activities.filter((activity) => {
    const matchesSearch =
      activity.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.action.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType =
      activityType === "all" || activity.type === activityType;

    // Simple time range filtering (in a real app, you'd use actual dates)
    const matchesTimeRange =
      timeRange === "all" ||
      (timeRange === "today" && activity.timestamp.includes("minute")) ||
      activity.timestamp.includes("hour") ||
      (timeRange === "week" &&
        !activity.timestamp.includes("month") &&
        !activity.timestamp.includes("year")) ||
      (timeRange === "month" && !activity.timestamp.includes("year"));

    return matchesSearch && matchesType && matchesTimeRange;
  });

  const getActivityTypeLabel = (type: ActivityType) => {
    switch (type) {
      case "file":
        return "File Activity";
      case "plugin":
        return "Plugin Activity";
      case "collaboration":
        return "Collaboration";
      case "system":
        return "System";
      default:
        return "All Activity";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Activity History</h1>
          <p className="text-sm text-gray-400">
            Track all your activities and changes
          </p>
        </div>
        <div className="flex w-full sm:w-auto gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Search activities..."
              className="pl-8 bg-gray-800 border-gray-700 text-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div
          className="w-full sm:w-48
        "
        >
          <Select
            value={activityType}
            onValueChange={(value: ActivityType) => setActivityType(value)}
          >
            <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
              <Filter className="h-4 w-4 mr-2 text-gray-400" />
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700 text-white">
              <SelectItem value="all">All Activity</SelectItem>
              <SelectItem value="file">File Activity</SelectItem>
              <SelectItem value="plugin">Plugin Activity</SelectItem>
              <SelectItem value="collaboration">Collaboration</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="w-full sm:w-48">
          <Select
            value={timeRange}
            onValueChange={(value: TimeRange) => setTimeRange(value)}
          >
            <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
              <Clock className="h-4 w-4 mr-2 text-gray-400" />
              <SelectValue placeholder="Time range" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700 text-white">
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1" />
        <Button
          variant="outline"
          className="bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white"
        >
          Export History
        </Button>
      </div>

      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader className="border-b border-gray-700">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg text-white">
              {getActivityTypeLabel(activityType)}
            </CardTitle>
            <p className="text-sm text-gray-400">
              {filteredActivities.length}{" "}
              {filteredActivities.length === 1 ? "activity" : "activities"}{" "}
              found
            </p>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-gray-700">
            {filteredActivities.length > 0 ? (
              filteredActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="p-4 hover:bg-gray-700/30 transition-colors"
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center">
                      {activity.icon}
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-white">
                          <span
                            className={
                              activity.user === "You" ? "text-purple-400" : ""
                            }
                          >
                            {activity.user}
                          </span>{" "}
                          {activity.action} {activity.details}
                        </p>
                        <span className="text-xs text-gray-400">
                          {activity.timestamp}
                        </span>
                      </div>
                      <div className="mt-1">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-700 text-gray-300">
                          {activity.type.charAt(0).toUpperCase() +
                            activity.type.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center">
                <div className="mx-auto h-12 w-12 text-gray-500">
                  <Search className="h-full w-full" />
                </div>
                <h3 className="mt-2 text-sm font-medium text-gray-300">
                  No activities found
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Try adjusting your search or filter to find what you're
                  looking for.
                </p>
                <div className="mt-6">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchQuery("");
                      setActivityType("all");
                      setTimeRange("all");
                    }}
                    className="bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white"
                  >
                    Clear all filters
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
