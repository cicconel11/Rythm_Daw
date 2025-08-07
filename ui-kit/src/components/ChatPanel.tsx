import React, { useState } from "react";
import { Button } from "./ui/button.js";
import { Input } from "./ui/input.js";
import { Badge } from "./ui/badge.js";
import { ScrollArea } from "./ui/scroll-area.js";
import { Send, Search, Music, Info } from "lucide-react";

interface ChatPanelProps {
  onNavigate?: (path: string) => void;
}

const friends = [
  {
    id: 1,
    name: "BeatMaker99",
    avatar: "BM",
    status: "online",
    lastMessage: "Check out this new beat!",
    time: "2m",
    unread: 2,
  },
  {
    id: 2,
    name: "ProducerX",
    avatar: "PX",
    status: "offline",
    lastMessage: "What DAW are you using?",
    time: "1h",
    unread: 0,
  },
  {
    id: 3,
    name: "SynthWave2024",
    avatar: "SW",
    status: "online",
    lastMessage: "Thanks for the plugin tip!",
    time: "3h",
    unread: 1,
  },
];

const messages = [
  {
    id: 1,
    sender: "BeatMaker99",
    content: "Hey! Check out this new beat I made",
    time: "10:30 AM",
    isOwn: false,
  },
  {
    id: 2,
    sender: "You",
    content: "That sounds amazing! What plugins did you use?",
    time: "10:32 AM",
    isOwn: true,
  },
  {
    id: 3,
    sender: "BeatMaker99",
    content: "Mostly Serum for the lead and some FabFilter for EQ",
    time: "10:33 AM",
    isOwn: false,
  },
];

const friendPlugins = [
  { id: "serum", name: "Serum", version: "1.365", compatible: true },
  {
    id: "fabfilter",
    name: "FabFilter Pro-Q 3",
    version: "3.24",
    compatible: true,
  },
  { id: "massive", name: "Massive X", version: "1.4.1", compatible: false },
];

const currentUserPlugins = ["serum", "fabfilter"]; // Mock user's plugins

export function ChatPanel({ onNavigate: _onNavigate }: ChatPanelProps) {
  const [selectedFriend, setSelectedFriend] = useState(friends[0]);
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState<"plugins" | "details">("plugins");

  const sendMessage = () => {
    if (message.trim()) {
      console.log("Sending message:", message);
      setMessage("");
    }
  };

  return (
    <div className="min-h-screen bg-[#0D1126] bg-gradient-to-br from-[#0D1126] via-[#141B33] to-[#0D1126] flex">
      {/* Friends Sidebar */}
      <div className="w-80 border-r border-gray-700 bg-[#141B33]">
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white font-['Inter'] mb-3">
            Messages
          </h2>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
            <Input
              placeholder="Search conversations..."
              className="pl-10 bg-[#0D1126] border-gray-600 text-white"
            />
          </div>
        </div>
        <ScrollArea className="h-[calc(100vh-120px)]">
          <div className="p-2">
            {friends.map((friend) => (
              <div
                key={friend.id}
                onClick={() => setSelectedFriend(friend)}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedFriend.id === friend.id
                    ? "bg-[#7E4FFF]/20"
                    : "hover:bg-gray-700/50"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#7E4FFF] to-[#6B3FE6] rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {friend.avatar}
                      </span>
                    </div>
                    <div
                      className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[#141B33] ${
                        friend.status === "online"
                          ? "bg-green-400"
                          : "bg-gray-500"
                      }`}
                    ></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-white truncate">
                        {friend.name}
                      </h3>
                      <span className="text-xs text-gray-400">
                        {friend.time}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 truncate">
                      {friend.lastMessage}
                    </p>
                  </div>
                  {friend.unread > 0 && (
                    <Badge className="bg-[#7E4FFF] text-white">
                      {friend.unread}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b border-gray-700 bg-[#141B33]">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-[#7E4FFF] to-[#6B3FE6] rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  {selectedFriend.avatar}
                </span>
              </div>
              <div
                className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-[#141B33] ${
                  selectedFriend.status === "online"
                    ? "bg-green-400"
                    : "bg-gray-500"
                }`}
              ></div>
            </div>
            <div>
              <h3 className="font-semibold text-white">
                {selectedFriend.name}
              </h3>
              <p className="text-sm text-gray-400">{selectedFriend.status}</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.isOwn ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    msg.isOwn
                      ? "bg-[#7E4FFF] text-white"
                      : "bg-gray-700 text-white"
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                  <p className="text-xs opacity-70 mt-1">{msg.time}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Message Input */}
        <div className="p-4 border-t border-gray-700 bg-[#141B33]">
          <div className="flex space-x-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type a message..."
              className="flex-1 bg-[#0D1126] border-gray-600 text-white"
            />
            <Button
              onClick={sendMessage}
              className="bg-[#7E4FFF] hover:bg-[#6B3FE6]"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-80 border-l border-gray-700 bg-[#141B33]">
        <div className="p-4 border-b border-gray-700">
          <div className="flex space-x-2">
            <Button
              variant={activeTab === "plugins" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab("plugins")}
              className="flex-1"
            >
              <Music className="w-4 h-4 mr-1" />
              Plugins
            </Button>
            <Button
              variant={activeTab === "details" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab("details")}
              className="flex-1"
            >
              <Info className="w-4 h-4 mr-1" />
              Details
            </Button>
          </div>
        </div>

        <ScrollArea className="h-[calc(100vh-120px)] p-4">
          {activeTab === "plugins" && (
            <div className="space-y-3">
              <h3 className="font-semibold text-white">
                {selectedFriend.name}'s Plugins
              </h3>
              {friendPlugins.map((plugin, index) => (
                <div
                  key={index}
                  className="bg-[#0D1126] rounded-lg p-3 border border-gray-700"
                >
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-white text-sm">
                      {plugin.name}
                    </h4>
                    <div className="flex items-center gap-2">
                      {currentUserPlugins.includes(plugin.id) && (
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-gray-400">v{plugin.version}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {plugin.compatible ? "Compatible" : "Not installed"}
                  </p>
                </div>
              ))}
            </div>
          )}

          {activeTab === "details" && (
            <div className="space-y-4">
              <h3 className="font-semibold text-white">Profile</h3>
              <div className="bg-[#0D1126] rounded-lg p-4 border border-gray-700">
                <div className="text-center mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#7E4FFF] to-[#6B3FE6] rounded-full mx-auto flex items-center justify-center mb-2">
                    <span className="text-white font-bold">
                      {selectedFriend.avatar}
                    </span>
                  </div>
                  <h4 className="font-semibold text-white">
                    {selectedFriend.name}
                  </h4>
                  <p className="text-sm text-gray-400">Producer</p>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Status:</span>
                    <span
                      className={
                        selectedFriend.status === "online"
                          ? "text-green-400"
                          : "text-gray-400"
                      }
                    >
                      {selectedFriend.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Mutual friends:</span>
                    <span className="text-white">5</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
}
