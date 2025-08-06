import { useState, useRef, useEffect } from "react";
import {
  Send,
  Paperclip,
  Mic,
  Smile,
  MoreVertical,
  Phone,
  Video,
  Search,
  UserPlus,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type Message = {
  id: string;
  content: string;
  sender: "me" | "them";
  timestamp: Date;
  status: "sent" | "delivered" | "read";
};

type Friend = {
  id: string;
  name: string;
  username: string;
  avatar?: string;
  status: "online" | "offline" | "away" | "dnd" | "streaming";
  lastSeen?: string;
  isTyping?: boolean;
};

type Plugin = {
  id: string;
  name: string;
  type: string;
  version: string;
  isActive: boolean;
  lastUsed?: string;
  category: string;
};

// Mock data for the active friend
const activeFriend: Friend = {
  id: "1",
  name: "Alex Johnson",
  username: "alexj",
  status: "online",
  avatar: "https://randomuser.me/api/portraits/men/1.jpg",
  isTyping: false,
};

// Mock plugins data for the active friend
const friendPlugins: Plugin[] = [
  {
    id: "1",
    name: "Serum",
    type: "Synthesizer",
    version: "1.2.3",
    isActive: true,
    lastUsed: "2h ago",
    category: "Synth",
  },
  {
    id: "2",
    name: "ValhallaDSP",
    type: "Reverb",
    version: "2.1.0",
    isActive: true,
    lastUsed: "1d ago",
    category: "Effect",
  },
  {
    id: "3",
    name: "Soothe2",
    type: "Dynamic EQ",
    version: "1.5.2",
    isActive: true,
    lastUsed: "3h ago",
    category: "Effect",
  },
  {
    id: "4",
    name: "Pro-Q3",
    type: "EQ",
    version: "3.0.0",
    isActive: false,
    lastUsed: "1w ago",
    category: "Effect",
  },
  {
    id: "5",
    name: "Kickstart",
    type: "Sidechain",
    version: "1.0.0",
    isActive: true,
    lastUsed: "5h ago",
    category: "Dynamics",
  },
];

// Mock chat history
const initialMessages: Message[] = [
  {
    id: "1",
    content: "Hey! How are you doing?",
    sender: "them",
    timestamp: new Date(Date.now() - 3600000 * 2),
    status: "read",
  },
  {
    id: "2",
    content: "Working on a new track. Need your opinion on the mix!",
    sender: "them",
    timestamp: new Date(Date.now() - 3600000 * 2 + 60000),
    status: "read",
  },
  {
    id: "3",
    content:
      "Hey! I'm good, thanks! Just finished a session myself. What kind of track is it?",
    sender: "me",
    timestamp: new Date(Date.now() - 3600000),
    status: "read",
  },
  {
    id: "4",
    content:
      "It's a deep house track. I'm using Serum for the bass and some ValhallaDSP for the reverb. Think you could take a listen?",
    sender: "them",
    timestamp: new Date(Date.now() - 1800000),
    status: "read",
  },
  {
    id: "5",
    content:
      "Absolutely! Send it over. Have you tried using Soothe2 on your master bus? It works wonders for taming harsh frequencies.",
    sender: "me",
    timestamp: new Date(Date.now() - 900000),
    status: "read",
  },
  {
    id: "6",
    content:
      "I haven't tried that yet. I'll give it a shot. Thanks for the tip!",
    sender: "them",
    timestamp: new Date(Date.now() - 600000),
    status: "read",
  },
];

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState("plugins");
  const [searchQuery, setSearchQuery] = useState("");

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      content: newMessage,
      sender: "me",
      timestamp: new Date(),
      status: "sent",
    };

    setMessages([...messages, message]);
    setNewMessage("");

    // Simulate reply after 1-3 seconds
    if (Math.random() > 0.3) {
      // 70% chance of reply
      const replyDelay = 1000 + Math.random() * 2000; // 1-3 seconds
      setTimeout(() => {
        const replies = [
          "That sounds great!",
          "I'll check it out.",
          "Thanks for the suggestion!",
          "What preset did you use for that?",
          "Can you send me the project file?",
          "I'm in the studio right now, can I call you later?",
        ];
        const replyMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: replies[Math.floor(Math.random() * replies.length)],
          sender: "them",
          timestamp: new Date(),
          status: "delivered",
        };
        setMessages((prev) => [...prev, replyMessage]);
      }, replyDelay);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const filteredPlugins = friendPlugins.filter(
    (plugin) =>
      plugin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plugin.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plugin.category.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="flex h-full">
      {/* Left side - Chat messages */}
      <div className="flex-1 flex flex-col">
        {/* Chat header */}
        <div className="border-b border-gray-700 p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={activeFriend.avatar}
                  alt={activeFriend.name}
                />
                <AvatarFallback>
                  {activeFriend.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div
                className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-gray-900 ${
                  activeFriend.status === "online"
                    ? "bg-green-500"
                    : activeFriend.status === "away"
                      ? "bg-yellow-500"
                      : activeFriend.status === "dnd"
                        ? "bg-red-500"
                        : activeFriend.status === "streaming"
                          ? "bg-purple-500"
                          : "bg-gray-500"
                }`}
              />
            </div>
            <div>
              <h2 className="font-medium text-white">{activeFriend.name}</h2>
              <p className="text-xs text-gray-400">
                {activeFriend.status === "online"
                  ? "Online"
                  : activeFriend.status === "away"
                    ? "Away"
                    : activeFriend.status === "dnd"
                      ? "Do Not Disturb"
                      : activeFriend.status === "streaming"
                        ? "Streaming"
                        : "Offline"}
                {activeFriend.isTyping && " • typing..."}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-400 hover:text-white hover:bg-gray-700"
                  >
                    <Phone className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Start Voice Call</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-400 hover:text-white hover:bg-gray-700"
                  >
                    <Video className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Start Video Call</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-400 hover:text-white hover:bg-gray-700"
                  >
                    <UserPlus className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Add to Group</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-400 hover:text-white hover:bg-gray-700"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>More Options</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* Messages area */}
        <ScrollArea className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-4">
            {messages.map((message, _index) => (
              <div
                key={message.id}
                className={`flex ${message.sender === "me" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md xl:max-w-lg 2xl:max-w-xl rounded-2xl px-4 py-2 ${
                    message.sender === "me"
                      ? "bg-purple-600 text-white rounded-br-none"
                      : "bg-gray-700 text-white rounded-bl-none"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <div className="flex items-center justify-end mt-1 space-x-1">
                    <span className="text-xs opacity-70">
                      {formatTime(message.timestamp)}
                    </span>
                    {message.sender === "me" && (
                      <span className="text-xs">
                        {message.status === "sent" && "✓"}
                        {message.status === "delivered" && "✓✓"}
                        {message.status === "read" && "✓✓✓"}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Message input */}
        <div className="border-t border-gray-700 p-4">
          <form
            onSubmit={handleSendMessage}
            className="flex items-end space-x-2"
          >
            <div className="flex-1 bg-gray-800 rounded-lg border border-gray-700 flex items-end">
              <Button
                variant="ghost"
                size="icon"
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-l-md"
              >
                <Paperclip className="h-5 w-5" />
              </Button>
              <Input
                type="text"
                placeholder={`Message ${activeFriend.name.split(" ")[0]}...`}
                className="flex-1 border-0 bg-transparent text-white placeholder-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(e);
                  }
                }}
              />
              <div className="flex">
                <Button
                  variant="ghost"
                  size="icon"
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-700"
                >
                  <Smile className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-r-md"
                >
                  <Mic className="h-5 w-5" />
                </Button>
              </div>
            </div>
            <Button
              type="submit"
              size="icon"
              className="bg-purple-600 hover:bg-purple-700 h-10 w-10 flex-shrink-0"
              disabled={!newMessage.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>

      {/* Right side - Friend's plugins */}
      <div className="w-80 border-l border-gray-700 bg-gray-800/50 flex flex-col">
        <Tabs defaultValue="plugins" className="flex-1 flex flex-col">
          <TabsList className="w-full rounded-none border-b border-gray-700 bg-gray-800/50 p-0 h-12">
            <TabsTrigger
              value="plugins"
              className="flex-1 rounded-none h-full data-[state=active]:bg-gray-700 data-[state=active]:text-white"
              onClick={() => setActiveTab("plugins")}
            >
              Plugins
            </TabsTrigger>
            <TabsTrigger
              value="details"
              className="flex-1 rounded-none h-full data-[state=active]:bg-gray-700 data-[state=active]:text-white"
              onClick={() => setActiveTab("details")}
            >
              Details
            </TabsTrigger>
          </TabsList>

          <div className="p-3 border-b border-gray-700">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder={`Search ${activeTab}...`}
                className="pl-8 bg-gray-700/50 border-gray-600 text-white h-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <TabsContent value="plugins" className="flex-1 m-0 overflow-y-auto">
            <div className="p-3 space-y-2">
              {filteredPlugins.length > 0 ? (
                filteredPlugins.map((plugin) => (
                  <div
                    key={plugin.id}
                    className="p-3 rounded-lg bg-gray-700/30 hover:bg-gray-700/50 transition-colors cursor-pointer"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-white">
                          {plugin.name}
                        </h4>
                        <p className="text-xs text-gray-400">
                          {plugin.type} • v{plugin.version}
                        </p>
                      </div>
                      <div className="flex items-center">
                        <div
                          className={`h-2 w-2 rounded-full mr-2 ${
                            plugin.isActive ? "bg-green-500" : "bg-gray-500"
                          }`}
                        />
                        <span className="text-xs text-gray-400">
                          {plugin.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </div>
                    {plugin.lastUsed && (
                      <div className="mt-2 text-xs text-gray-400">
                        Last used: {plugin.lastUsed}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-400 text-sm">
                  No plugins found matching "{searchQuery}"
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="details" className="m-0 p-4">
            <div className="space-y-4">
              <div className="text-center">
                <Avatar className="h-20 w-20 mx-auto mb-3">
                  <AvatarImage
                    src={activeFriend.avatar}
                    alt={activeFriend.name}
                  />
                  <AvatarFallback className="text-xl">
                    {activeFriend.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <h3 className="text-lg font-medium text-white">
                  {activeFriend.name}
                </h3>
                <p className="text-sm text-gray-400">
                  @{activeFriend.username}
                </p>
                <div className="mt-2">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      activeFriend.status === "online"
                        ? "bg-green-500/20 text-green-400"
                        : activeFriend.status === "away"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : activeFriend.status === "dnd"
                            ? "bg-red-500/20 text-red-400"
                            : activeFriend.status === "streaming"
                              ? "bg-purple-500/20 text-purple-400"
                              : "bg-gray-500/20 text-gray-400"
                    }`}
                  >
                    <span
                      className={`inline-block w-2 h-2 rounded-full mr-1.5 ${
                        activeFriend.status === "online"
                          ? "bg-green-400"
                          : activeFriend.status === "away"
                            ? "bg-yellow-400"
                            : activeFriend.status === "dnd"
                              ? "bg-red-400"
                              : activeFriend.status === "streaming"
                                ? "bg-purple-400"
                                : "bg-gray-400"
                      }`}
                    ></span>
                    {activeFriend.status === "online"
                      ? "Online"
                      : activeFriend.status === "away"
                        ? "Away"
                        : activeFriend.status === "dnd"
                          ? "Do Not Disturb"
                          : activeFriend.status === "streaming"
                            ? "Streaming"
                            : "Offline"}
                  </span>
                </div>
              </div>

              <div className="space-y-4 mt-6">
                <div>
                  <h4 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
                    About
                  </h4>
                  <p className="text-sm text-gray-300">
                    Music producer and sound designer. Love working with Serum
                    and Ableton Live.
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
                    Stats
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-gray-700/30 p-3 rounded-lg">
                      <p className="text-xs text-gray-400">Plugins</p>
                      <p className="text-white font-medium">
                        {friendPlugins.length}
                      </p>
                    </div>
                    <div className="bg-gray-700/30 p-3 rounded-lg">
                      <p className="text-xs text-gray-400">Active</p>
                      <p className="text-white font-medium">
                        {friendPlugins.filter((p) => p.isActive).length}
                      </p>
                    </div>
                    <div className="bg-gray-700/30 p-3 rounded-lg">
                      <p className="text-xs text-gray-400">Categories</p>
                      <p className="text-white font-medium">
                        {new Set(friendPlugins.map((p) => p.category)).size}
                      </p>
                    </div>
                    <div className="bg-gray-700/30 p-3 rounded-lg">
                      <p className="text-xs text-gray-400">Last Active</p>
                      <p className="text-white font-medium">2h ago</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
                    Top Categories
                  </h4>
                  <div className="space-y-2">
                    {["Effect", "Synth", "Dynamics"].map((category, index) => (
                      <div key={category} className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-purple-500 mr-2"></div>
                        <span className="text-sm text-gray-300 flex-1">
                          {category}
                        </span>
                        <span className="text-xs text-gray-400">
                          {
                            friendPlugins.filter((p) => p.category === category)
                              .length
                          }{" "}
                          plugins
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
