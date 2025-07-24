import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@store";

type User = {
  id: string;
  name: string;
  avatar?: string;
  status: "online" | "offline" | "away" | "busy";
};

type CreateGroupModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const CreateGroupModal: React.FC<CreateGroupModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { users, createGroup } = useStore();
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [isPrivate, setIsPrivate] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const currentUserId = "user1"; // In a real app, this would come from auth
  const otherUsers = users.filter((user) => user.id !== currentUserId);

  const filteredUsers = otherUsers.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleUserToggle = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName.trim() || selectedUsers.length === 0) return;

    createGroup({
      name: groupName,
      participants: selectedUsers,
      description: description.trim() || undefined,
      isPrivate,
      // In a real app, you might want to allow users to upload an avatar
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(groupName)}&background=random`,
    });

    // Reset form
    setGroupName("");
    setDescription("");
    setSelectedUsers([]);
    setIsPrivate(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
        <motion.div
          className="bg-panel rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 pb-0">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-text_primary">
                Create New Group
              </h2>
              <button
                onClick={onClose}
                className="text-text_secondary hover:text-text_primary transition-colors"
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="groupName"
                  className="block text-sm font-medium text-text_secondary mb-1"
                >
                  Group Name *
                </label>
                <input
                  id="groupName"
                  type="text"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  className="w-full px-3 py-2 bg-card border border-gray-700 rounded-lg text-text_primary focus:outline-none focus:ring-2 focus:ring-brand"
                  placeholder="Enter group name"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-text_secondary mb-1"
                >
                  Description (Optional)
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-card border border-gray-700 rounded-lg text-text_primary focus:outline-none focus:ring-2 focus:ring-brand"
                  placeholder="What's this group about?"
                  rows={2}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-sm font-medium text-text_secondary">
                    Add Members
                  </label>
                  <span className="text-xs text-text_secondary">
                    {selectedUsers.length} selected
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-3 py-2 bg-card border border-gray-700 rounded-lg text-text_primary focus:outline-none focus:ring-2 focus:ring-brand mb-2"
                    placeholder="Search users..."
                  />
                  <div className="max-h-48 overflow-y-auto bg-card border border-gray-700 rounded-lg divide-y divide-gray-700">
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((user) => (
                        <div
                          key={user.id}
                          className={`flex items-center p-3 hover:bg-gray-800 cursor-pointer ${selectedUsers.includes(user.id) ? "bg-gray-800" : ""}`}
                          onClick={() => handleUserToggle(user.id)}
                        >
                          <div className="relative">
                            <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-white">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                            <span
                              className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-panel ${
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
                          <div className="ml-3">
                            <p className="text-sm font-medium text-text_primary">
                              {user.name}
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
                          <div className="ml-auto">
                            <div
                              className={`w-5 h-5 rounded border-2 ${
                                selectedUsers.includes(user.id)
                                  ? "bg-brand border-brand"
                                  : "border-gray-600"
                              } flex items-center justify-center`}
                            >
                              {selectedUsers.includes(user.id) && (
                                <svg
                                  className="w-3 h-3 text-white"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-text_secondary text-sm">
                        No users found
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isPrivate"
                  checked={isPrivate}
                  onChange={(e) => setIsPrivate(e.target.checked)}
                  className="h-4 w-4 text-brand focus:ring-brand border-gray-700 rounded"
                />
                <label
                  htmlFor="isPrivate"
                  className="ml-2 block text-sm text-text_secondary"
                >
                  Make this group private
                </label>
              </div>

              <div className="pt-4 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-text_secondary hover:text-text_primary rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!groupName.trim() || selectedUsers.length === 0}
                  className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors ${
                    !groupName.trim() || selectedUsers.length === 0
                      ? "bg-gray-600 cursor-not-allowed"
                      : "bg-brand hover:bg-brand/90"
                  }`}
                >
                  Create Group
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CreateGroupModal;
