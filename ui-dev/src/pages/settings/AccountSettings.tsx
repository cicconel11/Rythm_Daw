import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SettingsAccount } from '@/components/ui';
import { useToast } from '@/components/ui/use-toast';
import useAuth, { User } from '@/hooks/useAuth';

interface UserData extends Partial<User> {
  displayName: string;
  email: string;
  bio: string;
  avatar?: string;
}

const AccountSettings = () => {
  const { toast } = useToast();
  const { auth } = useAuth();
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData>({
    displayName: '',
    email: '',
    bio: '',
    avatar: ''
  });

  useEffect(() => {
    if (!auth?.user) {
      navigate('/signin');
      return;
    }

    setUserData({
      displayName: auth.user.displayName || auth.user.email?.split('@')[0] || 'User',
      email: auth.user.email || '',
      bio: '',
      avatar: auth.user.avatar || ''
    });
  }, [auth, navigate]);

  const handleUpdateAccount = async (data: { displayName: string; email: string; bio: string }) => {
    try {
      // In a real app, you would call your API here
      // await updateUserProfile(data);
      
      // For demo, update local state
      const updatedUser = {
        ...auth?.user,
        ...data
      };
      
      // Update localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const updatedUsers = users.map((user: any) => 
        user.id === updatedUser.id ? updatedUser : user
      );
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      
      // Update auth state
      localStorage.setItem('auth', JSON.stringify({
        ...auth,
        user: updatedUser
      }));
      
      setUserData(prev => ({
        ...prev,
        ...data
      }));
      
      toast({
        title: "Account Updated",
        description: "Your account information has been successfully updated.",
      });
    } catch (error) {
      console.error('Failed to update account:', error);
      toast({
        title: "Update Failed",
        description: "There was an error updating your account. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleRescanPlugins = () => {
    // In a real app, you would call your API here
    // await rescanPlugins();
    
    // Simulate plugin scanning
    setTimeout(() => {
      toast({
        title: "Plugin Scan Complete",
        description: "Your plugin library has been successfully rescanned.",
      });
    }, 1500);
  };

  const handleAvatarChange = async (file: File) => {
    try {
      // In a real app, you would upload the file to your server
      // const avatarUrl = await uploadAvatar(file);
      const avatarUrl = URL.createObjectURL(file); // Temporary URL for demo
      
      if (!auth?.user) {
        throw new Error('User not authenticated');
      }
      
      // Update localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const updatedUser = {
        ...auth.user,
        avatar: avatarUrl
      };
      
      const updatedUsers = users.map((user: any) => 
        user.id === updatedUser.id ? updatedUser : user
      );
      
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      
      // Update auth state
      localStorage.setItem('auth', JSON.stringify({
        ...auth,
        user: updatedUser
      }));
      
      setUserData(prev => ({
        ...prev,
        avatar: avatarUrl
      }));
      
      toast({
        title: "Avatar Updated",
        description: "Your profile picture has been updated.",
      });
    } catch (error) {
      console.error('Failed to update avatar:', error);
      toast({
        title: "Upload Failed",
        description: "There was an error updating your avatar. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <SettingsAccount
        initialData={{
          displayName: userData.displayName,
          email: userData.email,
          bio: userData.bio || '',
          avatar: userData.avatar
        }}
        onUpdateAccount={handleUpdateAccount}
        onRescanPlugins={handleRescanPlugins}
        onAvatarChange={handleAvatarChange}
      />
    </div>
  );
};

export default AccountSettings;
