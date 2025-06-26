
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Upload, MessageSquare, UserPlus, Download, Music } from "lucide-react";
import { useState } from "react";

const activities = [
  {
    id: 1,
    type: "upload",
    action: "Uploaded file",
    details: "Track_01_Master.wav",
    timestamp: "2024-01-15T10:30:00",
    user: "You"
  },
  {
    id: 2,
    type: "message",
    action: "Sent message",
    details: "Check out this new beat!",
    timestamp: "2024-01-15T09:45:00",
    user: "You"
  },
  {
    id: 3,
    type: "friend",
    action: "Added friend",
    details: "BeatMaker99",
    timestamp: "2024-01-15T08:20:00",
    user: "You"
  },
  {
    id: 4,
    type: "download",
    action: "Downloaded file",
    details: "Bass_Line_v2.mid",
    timestamp: "2024-01-14T16:15:00",
    user: "You"
  },
  {
    id: 5,
    type: "plugin",
    action: "Installed plugin",
    details: "Serum v1.365",
    timestamp: "2024-01-14T14:30:00",
    user: "You"
  },
  {
    id: 6,
    type: "upload",
    action: "Uploaded file",
    details: "Drum_Pattern.flp",
    timestamp: "2024-01-14T11:45:00",
    user: "You"
  },
  {
    id: 7,
    type: "message",
    action: "Received message",
    details: "What DAW are you using?",
    timestamp: "2024-01-13T20:10:00",
    user: "ProducerX"
  },
  {
    id: 8,
    type: "friend",
    action: "Friend request received",
    details: "SynthWave2024",
    timestamp: "2024-01-13T18:30:00",
    user: "SynthWave2024"
  },
];

const getActivityIcon = (type: string) => {
  switch (type) {
    case "upload":
      return <Upload className="w-4 h-4 text-accent" />;
    case "download":
      return <Download className="w-4 h-4 text-green-500" />;
    case "message":
      return <MessageSquare className="w-4 h-4 text-primary" />;
    case "friend":
      return <UserPlus className="w-4 h-4 text-orange-500" />;
    case "plugin":
      return <Music className="w-4 h-4 text-purple-500" />;
    default:
      return <div className="w-4 h-4 bg-muted-foreground rounded-full" />;
  }
};

const getActivityColor = (type: string) => {
  switch (type) {
    case "upload":
      return "bg-accent/20 text-accent";
    case "download":
      return "bg-green-500/20 text-green-500";
    case "message":
      return "bg-primary/20 text-primary";
    case "friend":
      return "bg-orange-500/20 text-orange-500";
    case "plugin":
      return "bg-purple-500/20 text-purple-500";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) return "Less than an hour ago";
  if (diffInHours < 24) return `${diffInHours} hours ago`;
  if (diffInHours < 48) return "Yesterday";
  return date.toLocaleDateString();
};

export default function History() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.details.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === "all" || activity.type === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">History</h1>
          <p className="text-muted-foreground">Track your recent activity across the platform</p>
        </div>
        <Button variant="outline">
          <Filter className="w-4 h-4 mr-2" />
          Export History
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
          <Input
            placeholder="Search activities..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="px-3 py-2 bg-secondary border border-border rounded-md text-foreground"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="all">All Activities</option>
          <option value="upload">Uploads</option>
          <option value="download">Downloads</option>
          <option value="message">Messages</option>
          <option value="friend">Friends</option>
          <option value="plugin">Plugins</option>
        </select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Activity Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredActivities.map((activity, index) => (
              <div key={activity.id} className="flex items-start gap-4 p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
                <div className="flex-shrink-0 w-10 h-10 bg-card rounded-full flex items-center justify-center border border-border">
                  {getActivityIcon(activity.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className={`text-xs ${getActivityColor(activity.type)}`}>
                      {activity.type.toUpperCase()}
                    </Badge>
                    <span className="text-sm text-muted-foreground">by {activity.user}</span>
                  </div>
                  
                  <h3 className="font-medium text-foreground mb-1">
                    {activity.action}
                  </h3>
                  
                  <p className="text-sm text-muted-foreground mb-2">
                    {activity.details}
                  </p>
                  
                  <span className="text-xs text-muted-foreground">
                    {formatTimestamp(activity.timestamp)}
                  </span>
                </div>

                {index < filteredActivities.length - 1 && (
                  <div className="absolute left-9 top-16 w-0.5 h-8 bg-border"></div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
