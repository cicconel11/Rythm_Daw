import { SettingsAccount } from '@rythm/ui-kit';

import { useToast } from '@/hooks/use-toast';

export default function SettingsPage() {
  const { toast } = useToast();

  const handleUpdateAccount = (data: { displayName: string; email: string; bio: string }) => {
    console.log('Update account:', data);
    toast({
      title: "Account Updated",
      description: "Your account information has been successfully updated.",
    });
  };

  const handleRescanPlugins = () => {
    console.log('Rescan plugins completed');
    toast({
      title: "Plugin Scan Complete",
      description: "Your plugin library has been successfully rescanned.",
    });
  };

  const handleAvatarChange = (file: File) => {
    console.log('Avatar changed:', file.name);
    toast({
      title: "Avatar Updated",
      description: "Your profile picture has been updated.",
    });
  };

  return (
    <SettingsAccount
      onUpdateAccount={handleUpdateAccount}
      onRescanPlugins={handleRescanPlugins}
      onAvatarChange={handleAvatarChange}
    />
  );
}
