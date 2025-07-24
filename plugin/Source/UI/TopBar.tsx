// @ts-nocheck
import * as React from "react";
import { useState, useMemo } from "react";
import { useStore } from "@store";
import { motion, AnimatePresence } from "framer-motion";

type Status = "online" | "offline" | "away";

type Channel = {
  id: string;
  name: string;
  type: "direct" | "group" | "project";
  participants: string[];
  unreadCount?: number;
};

type User = {
  id: string;
  name: string;
  avatar?: string;
  status: Status;
};

const TopBar: React.FC = () => {
  const [bpm, setBpm] = React.useState(120);
  const [project, setProject] = React.useState("Lo-Fi Groove v2");
  const [isConversationOpen, setIsConversationOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isSearchFocused, setIsSearchFocused] = React.useState(false);
  const [isStatusMenuOpen, setIsStatusMenuOpen] = React.useState(false);
  const [currentUserStatus, setCurrentUserStatus] =
    React.useState<Status>("online");

  const projects = ["Lo-Fi Groove v2", "House Jam", "Client Mix"];

  const statusColors = {
    online: "bg-green-500",
    away: "bg-yellow-500",
    offline: "bg-gray-500",
  };

  const statusLabels = {
    online: "Online",
    away: "Away",
    offline: "Offline",
  };

  const handleStatusChange = (status: Status) => {
    setCurrentUserStatus(status);
    setIsStatusMenuOpen(false);
    // In a real app, you would also update the status on the server
  };

  // Get store values
  const { activeChannel, channels, setActiveChannel, activeTab } = useStore();

  // Filter channels to only show direct messages for conversation switching
  const directMessageChannels = useMemo<Channel[]>(
    () =>
      (channels as Channel[]).filter(
        (channel: Channel) => channel.type === "direct",
      ),
    [channels],
  );

  // Get current conversation name
  const currentConversation = useMemo(() => {
    if (!activeChannel) return "Select Conversation";
    const channel = channels.find((c) => c.id === activeChannel);
    return channel?.name || "Unknown";
  }, [activeChannel, channels]);

  // Mock users data - in a real app, this would come from your store/API
  const users: User[] = [
    { id: "1", name: "Alex Johnson", status: "online" },
    { id: "2", name: "Jamie Smith", status: "offline" },
    { id: "3", name: "Taylor Wilson", status: "away" },
    { id: "4", name: "Morgan Lee", status: "online" },
    { id: "5", name: "Casey Kim", status: "offline" },
  ];

  // Filter users based on search query
  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return users.filter((user) => user.name.toLowerCase().includes(query));
  }, [searchQuery]);

  const handleUserSelect = (user: User) => {
    // In a real app, this would create a new DM channel with the selected user
    const existingChannel = channels.find(
      (c: Channel) => c.type === "direct" && c.participants.includes(user.id),
    );

    if (existingChannel) {
      setActiveChannel(existingChannel.id);
    } else {
      // Create a new DM channel (simplified)
      const newChannel = {
        id: `dm-${Date.now()}`,
        name: user.name,
        type: "direct" as const,
        participants: [user.id],
      };
      // In a real app, you would dispatch an action to add this channel
      console.log("New DM channel created:", newChannel);
      setActiveChannel(newChannel.id);
    }

    setSearchQuery("");
    setIsSearchFocused(false);
  };

  return (
    <header className="bg-panel h-16 flex items-center justify-between px-6 rounded-t-xl shadow-outer-md text-text_primary">
      {/* Left: RHYTHM Wordmark */}
      <div className="flex items-center">
        <svg
          width="120"
          height="40"
          viewBox="0 0 120 40"
          className="text-brand"
        >
          <text
            x="10"
            y="30"
            fontSize="24"
            fontWeight="bold"
            fill="currentColor"
          >
            RHYTHM
          </text>
        </svg>
      </div>

      {/* Center: Project and Conversation Selector */}
      <div className="flex items-center space-x-4">
        {/* Project Dropdown */}
        <div className="relative">
          <select
            value={project}
            onChange={(e) => setProject(e.target.value)}
            className="bg-card text-text_primary rounded-md px-4 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-brand min-w-48"
          >
            {projects.map((proj) => (
              <option key={proj} value={proj}>
                {proj}
              </option>
            ))}
          </select>
        </div>

        {/* Conversation Selector */}
        {activeTab === "Chat" && (
          <div className="relative">
            <button
              onClick={() => setIsConversationOpen(!isConversationOpen)}
              className="bg-card text-text_primary rounded-md px-4 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-brand flex items-center space-x-2 min-w-48 justify-between"
            >
              <span className="truncate">{currentConversation}</span>
              <svg
                className={`w-4 h-4 transition-transform duration-200 ${isConversationOpen ? "transform rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            <AnimatePresence>
              {isConversationOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute z-10 mt-1 w-full bg-card border border-gray-700 rounded-md shadow-lg py-1"
                >
                  {directMessageChannels.length > 0 ? (
                    directMessageChannels.map((channel: Channel) => (
                      <button
                        key={channel.id}
                        onClick={() => {
                          setActiveChannel(channel.id);
                          setIsConversationOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm ${
                          activeChannel === channel.id
                            ? "bg-brand/20 text-brand"
                            : "text-text_primary hover:bg-gray-700/50"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="truncate">{channel.name}</span>
                          {channel.unreadCount > 0 && (
                            <span className="bg-brand text-white text-xs rounded-full h-5 w-5 flex items-center justify-center ml-2">
                              {channel.unreadCount}
                            </span>
                          )}
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-sm text-text_secondary">
                      No conversations
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Center: Search Bar */}
      <div className="flex-1 max-w-2xl px-4 relative">
        <div className="relative">
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
            className="w-full bg-card/50 border border-gray-700 rounded-full py-2 px-4 text-text_primary placeholder-text_secondary focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg
              className="h-5 w-5 text-text_secondary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {/* Search Results Dropdown */}
          {isSearchFocused && searchQuery && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute z-50 mt-1 w-full bg-card border border-gray-700 rounded-lg shadow-lg overflow-hidden"
            >
              {filteredUsers.length > 0 ? (
                <div className="py-1">
                  {filteredUsers.map((user) => (
                    <button
                      key={user.id}
                      onMouseDown={() => handleUserSelect(user)}
                      className="w-full text-left px-4 py-2 text-sm text-text_primary hover:bg-gray-700/50 flex items-center space-x-3"
                    >
                      <div
                        className={`h-2 w-2 rounded-full ${
                          user.status === "online"
                            ? "bg-green-500"
                            : user.status === "away"
                              ? "bg-yellow-500"
                              : "bg-gray-500"
                        }`}
                      ></div>
                      <span>{user.name}</span>
                      <span className="ml-auto text-xs text-text_secondary">
                        {user.status === "online"
                          ? "Online"
                          : user.status === "away"
                            ? "Away"
                            : "Offline"}
                      </span>
                    </button>
                  ))}
                </div>
              ) : searchQuery ? (
                <div className="px-4 py-3 text-sm text-text_secondary">
                  No users found for "{searchQuery}"
                </div>
              ) : null}
            </motion.div>
          )}
        </div>
      </div>

      {/* Right: Status and BPM */}
      <div className="flex items-center space-x-6">
        {/* Status Selector */}
        <div className="relative">
          <button
            onClick={() => setIsStatusMenuOpen(!isStatusMenuOpen)}
            className="flex items-center space-x-2 focus:outline-none"
            onBlur={() => setTimeout(() => setIsStatusMenuOpen(false), 200)}
          >
            <div
              className={`w-3 h-3 rounded-full ${statusColors[currentUserStatus]}`}
            ></div>
            <span className="text-sm text-text_secondary">
              {statusLabels[currentUserStatus]}
            </span>
            <svg
              className={`w-4 h-4 text-text_secondary transition-transform ${isStatusMenuOpen ? "transform rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {/* Status Dropdown */}
          <AnimatePresence>
            {isStatusMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute right-0 mt-2 w-40 bg-card border border-gray-700 rounded-lg shadow-lg overflow-hidden z-50"
              >
                <div className="py-1">
                  {(["online", "away", "offline"] as Status[]).map((status) => (
                    <button
                      key={status}
                      onClick={() => handleStatusChange(status as Status)}
                      className="w-full text-left px-4 py-2 text-sm text-text_primary hover:bg-gray-700/50 flex items-center space-x-2"
                    >
                      <div
                        className={`w-2 h-2 rounded-full ${statusColors[status]}`}
                      ></div>
                      <span>{statusLabels[status]}</span>
                      {currentUserStatus === status && (
                        <svg
                          className="w-4 h-4 ml-auto text-brand"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* BPM Field */}
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">BPM:</span>
          <input
            type="number"
            value={bpm}
            onChange={(e) =>
              setBpm(
                Math.max(40, Math.min(200, parseInt(e.target.value) || 120)),
              )
            }
            className="w-16 bg-card text-text_primary rounded-md px-2 py-1 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-brand"
          />
        </div>
      </div>
    </header>
  );
};

export default TopBar;
