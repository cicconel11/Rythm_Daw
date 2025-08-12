import { SettingsAccount } from '@rythm/ui-kit';
import { useToast } from '@/hooks/use-toast';
import { usePageMeta } from '@/hooks/usePageMeta';
import { ROUTES } from '@/lib/routes';
import { useSettings, useUpdateSettings, useCurrentUser } from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';

export default function SettingsPage() {
  usePageMeta(ROUTES.settings.name);
  const { toast } = useToast();
  
  const { data: settings, isLoading: settingsLoading } = useSettings();
  const { data: currentUser, isLoading: userLoading } = useCurrentUser();
  const updateSettingsMutation = useUpdateSettings();

  const handleUpdateAccount = async (data: { displayName: string; email: string; bio: string }) => {
    try {
      await updateSettingsMutation.mutateAsync({
        notifications: settings?.notifications,
        privacy: settings?.privacy,
        appearance: settings?.appearance,
        ...data
      });
      
      toast({
        title: 'Account Updated',
        description: 'Your account information has been successfully updated.',
      });
    } catch (error) {
      toast({
        title: 'Update Failed',
        description: 'Failed to update account information. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleRescanPlugins = () => {
    // Mock plugin rescan - would integrate with actual plugin scanning
    toast({
      title: 'Plugin Scan Complete',
      description: 'Your plugin library has been successfully rescanned.',
    });
  };

  const handleAvatarChange = (file: File) => {
    // Mock avatar upload - would integrate with actual file upload
    toast({
      title: 'Avatar Updated',
      description: 'Your profile picture has been updated.',
    });
  };

  if (settingsLoading || userLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-96" />
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  return (
    <SettingsAccount
      user={currentUser}
      settings={settings}
      onUpdateAccount={handleUpdateAccount}
      onRescanPlugins={handleRescanPlugins}
      onAvatarChange={handleAvatarChange}
      isLoading={updateSettingsMutation.isPending}
    />
  );
}
