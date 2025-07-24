import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Icons } from "@/components/ui/icons";
import { toast } from "@/components/ui/use-toast";
import ProtectedRoute from "@/components/ProtectedRoute";

interface User {
  id: string;
  email: string;
  displayName: string;
  isApproved: boolean;
  createdAt: string;
}

const Admin = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Simulate API call to get pending users
    const fetchPendingUsers = async () => {
      try {
        // In a real app, you would fetch this from your API
        // const response = await fetch('/api/admin/users/pending');
        // const data = await response.json();

        // Mock data for demo
        const mockUsers: User[] = [
          {
            id: "1",
            email: "user1@example.com",
            displayName: "User One",
            isApproved: false,
            createdAt: new Date().toISOString(),
          },
          {
            id: "2",
            email: "user2@example.com",
            displayName: "User Two",
            isApproved: false,
            createdAt: new Date().toISOString(),
          },
        ];

        setUsers(mockUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast({
          title: "Error",
          description: "Failed to load users",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPendingUsers();
  }, []);

  const handleApproveUser = async (userId: string) => {
    try {
      // In a real app, you would call your API to approve the user
      // await fetch(`/api/admin/users/${userId}/approve`, { method: 'POST' });

      // Update local state
      setUsers(
        users.map((user) =>
          user.id === userId ? { ...user, isApproved: true } : user,
        ),
      );

      toast({
        title: "Success",
        description: "User has been approved",
      });
    } catch (error) {
      console.error("Error approving user:", error);
      toast({
        title: "Error",
        description: "Failed to approve user",
        variant: "destructive",
      });
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.displayName.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Icons.spinner className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">User Management</h1>
        <div className="w-64">
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-gray-900 rounded-lg overflow-hidden">
        <div className="grid grid-cols-12 bg-gray-800 p-4 font-medium">
          <div className="col-span-4">User</div>
          <div className="col-span-4">Email</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2">Actions</div>
        </div>

        {filteredUsers.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No pending users found
          </div>
        ) : (
          <div className="divide-y divide-gray-800">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="grid grid-cols-12 items-center p-4 hover:bg-gray-800/50"
              >
                <div className="col-span-4 font-medium">{user.displayName}</div>
                <div className="col-span-4 text-gray-400">{user.email}</div>
                <div className="col-span-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      user.isApproved
                        ? "bg-green-900/50 text-green-400"
                        : "bg-yellow-900/50 text-yellow-400"
                    }`}
                  >
                    {user.isApproved ? "Approved" : "Pending"}
                  </span>
                </div>
                <div className="col-span-2">
                  {!user.isApproved && (
                    <Button
                      size="sm"
                      onClick={() => handleApproveUser(user.id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Approve
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Wrap with ProtectedRoute to ensure only admins can access
const AdminPage = () => (
  <ProtectedRoute requireAdmin={true}>
    <Admin />
  </ProtectedRoute>
);

export default AdminPage;
