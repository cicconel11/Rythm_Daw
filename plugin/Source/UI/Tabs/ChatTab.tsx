// @ts-nocheck
import * as React from "react";
import { useRef, useEffect, useState } from "react";
import { Led } from "../components/Led";
import { useStore } from "@store";
import { FixedSizeList as List } from "react-window";
import Sidebar from "../components/Sidebar";

type Message = {
  id: string;
  text: string;
  sender: string;
  timestamp: number;
  channelId: string;
};

type Channel = {
  id: string;
  name: string;
  type: string;
  participants: string[];
  unreadCount?: number;
};

const ChatTab: React.FC = () => {
  const {
    messages,
    activeChannel,
    channels,
    users,
    sendMessage,
    setActiveChannel,
  } = useStore();

  const [message, setMessage] = useState("");
  const listRef = useRef<List>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Filter messages for the active channel
  const channelMessages = React.useMemo(
    () => messages.filter((msg) => msg.channelId === activeChannel),
    [messages, activeChannel],
  );

  const activeChannelData = channels.find((c) => c.id === activeChannel);
  const isGroupChat = activeChannelData?.type === "group";
  const isDirectMessage = activeChannelData?.type === "direct";
  const isProjectChannel = activeChannelData?.type === "project";

  // Get participants for the active channel
  const channelParticipants = React.useMemo(() => {
    if (!activeChannelData) return [];
    return users.filter((user) =>
      activeChannelData.participants.includes(user.id),
    );
  }, [activeChannelData, users]);

  // Get other participants for direct messages
  const otherParticipants = React.useMemo(() => {
    if (!isDirectMessage || !activeChannelData) return [];
    return users.filter(
      (user) =>
        user.id !== "user1" && activeChannelData.participants.includes(user.id),
    );
  }, [isDirectMessage, activeChannelData, users]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [channelMessages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !activeChannel) return;

    sendMessage(message, activeChannel);
    setMessage("");
  };

  const Row = ({
    index,
    style,
  }: {
    index: number;
    style: React.CSSProperties;
  }) => {
    const msg = channelMessages[index];
    const isUser = msg.sender === "user1"; // TODO: Replace with actual current user ID
    const sender = users.find((u) => u.id === msg.sender);

    return (
      <div
        style={style}
        className={`flex ${isUser ? "justify-end" : "justify-start"} px-4`}
      >
        {!isUser && (
          <div className="w-8 h-8 rounded-full bg-gray-700 flex-shrink-0 mr-2 mt-1 flex items-center justify-center text-white">
            {sender?.name?.charAt(0) || "?"}
          </div>
        )}
        <div className="max-w-xs">
          {!isUser && (
            <div className="text-xs text-text_secondary mb-1">
              {sender?.name || "Unknown User"}
            </div>
          )}
          <div
            className={`px-4 py-2 rounded-lg text-sm ${isUser ? "bg-brand" : "bg-card"}`}
          >
            <p className="text-text_primary">{msg.text}</p>
            <span className="text-xs text-text_secondary block mt-1">
              {new Date(msg.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>
      </div>
    );
  };

  if (!activeChannel) {
    return (
      <div className="flex items-center justify-center h-full bg-background">
        <p className="text-text_secondary">
          Select a channel to start chatting
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full bg-background rounded-br-xl overflow-hidden relative">
      {/* Sidebar or Member List */}
      {isGroupChat ? (
        <div className="w-64 border-l border-gray-700 bg-panel flex flex-col">
          <div className="p-4 border-b border-gray-700 flex justify-between items-center">
            <h3 className="font-medium text-text_primary">Group Members</h3>
            <button
              className="text-text_secondary hover:text-text_primary p-1 rounded-full hover:bg-gray-700/50 transition-colors"
              title="Add people"
              onClick={() => {}}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            {channelParticipants.map((user) => (
              <div
                key={user.id}
                className="flex items-center p-3 hover:bg-gray-700/30 transition-colors"
              >
                <div className="relative">
                  <div className="w-9 h-9 rounded-full bg-gray-600 flex items-center justify-center text-white font-medium">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span
                    className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-panel ${
                      user.status === "online"
                        ? "bg-green-500"
                        : user.status === "away"
                          ? "bg-yellow-500"
                          : user.status === "busy"
                            ? "bg-red-500"
                            : "bg-gray-500"
                    }`}
                  ></span>
                </div>
                <div className="ml-3 overflow-hidden">
                  <p className="text-sm font-medium text-text_primary truncate">
                    {user.name}
                    {user.id === "user1" && " (You)"}
                  </p>
                  <p className="text-xs text-text_secondary">
                    {user.status === "online"
                      ? "Online"
                      : user.status === "away"
                        ? "Away"
                        : user.status === "busy"
                          ? "Busy"
                          : "Offline"}
                  </p>
                </div>
                {user.id !== "user1" && (
                  <button
                    className="ml-auto text-text_secondary hover:text-red-400 p-1"
                    title="Remove from group"
                    onClick={(e) => {
                      e.stopPropagation();
                      // TODO: Implement remove participant
                    }}
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
          <div className="p-3 border-t border-gray-700">
            <button
              className="w-full py-2 px-3 bg-red-900/30 text-red-400 text-sm font-medium rounded-lg hover:bg-red-900/40 transition-colors flex items-center justify-center space-x-2"
              onClick={() => {}}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              <span>Leave Group</span>
            </button>
          </div>
        </div>
      ) : (
        <Sidebar />
      )}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b border-gray-700 flex items-center justify-between">
          <div className="flex items-center">
            <h2 className="text-lg font-semibold text-text_primary">
              {isDirectMessage
                ? activeChannelData?.name
                : `# ${activeChannelData?.name}`}
            </h2>

            {(isDirectMessage || isGroupChat) && (
              <div className="flex items-center ml-2 space-x-2">
                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-700 text-text_secondary">
                  {isDirectMessage
                    ? `${otherParticipants.length} member${otherParticipants.length !== 1 ? "s" : ""}`
                    : `${channelParticipants.length} member${channelParticipants.length !== 1 ? "s" : ""}`}
                </span>

                {isDirectMessage && otherParticipants[0]?.status && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      otherParticipants[0].status === "online"
                        ? "bg-green-900/30 text-green-400"
                        : otherParticipants[0].status === "away"
                          ? "bg-yellow-900/30 text-yellow-400"
                          : otherParticipants[0].status === "busy"
                            ? "bg-red-900/30 text-red-400"
                            : "bg-gray-700 text-text_secondary"
                    }`}
                  >
                    {otherParticipants[0].status === "online"
                      ? "Online"
                      : otherParticipants[0].status === "away"
                        ? "Away"
                        : otherParticipants[0].status === "busy"
                          ? "Busy"
                          : "Offline"}
                  </span>
                )}
              </div>
            )}
          </div>

          {isGroupChat && (
            <div className="flex items-center space-x-2">
              <button
                className="text-text_secondary hover:text-text_primary p-1 rounded-full hover:bg-gray-700/50 transition-colors"
                title="Group info"
                onClick={() => {}}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </button>
              <button
                className="text-text_secondary hover:text-text_primary p-1 rounded-full hover:bg-gray-700/50 transition-colors"
                title="Add people"
                onClick={() => {}}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-hidden">
          {channelMessages.length > 0 ? (
            <List
              height={window.innerHeight - 150}
              itemCount={channelMessages.length}
              itemSize={100}
              width="100%"
              ref={listRef}
              className="scrollbar-hide"
            >
              {Row}
            </List>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-text_secondary">
              <svg
                className="w-16 h-16 mb-4 opacity-30"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
              <p className="text-lg font-medium">No messages yet</p>
              <p className="text-sm mt-1">
                Send a message to start the conversation
              </p>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <form
          onSubmit={handleSendMessage}
          className="p-4 border-t border-gray-700"
        >
          <div className="relative">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={`Message ${isGroupChat ? activeChannelData?.name : activeChannelData?.type === "direct" ? activeChannelData.name : "channel"}`}
              className="w-full bg-input text-text_primary rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-brand/50 resize-none"
              rows={1}
              style={{ minHeight: "44px", maxHeight: "200px" }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
            />
            <button
              type="submit"
              disabled={!message.trim()}
              className="absolute right-2 bottom-2 p-1 rounded-full text-text_secondary hover:text-brand disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatTab;
