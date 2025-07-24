import { FileShare } from '@ui-kit/components/FileShare';
import { useFriends } from '@shared/hooks/useFriends';
import { useTransfers } from '@shared/hooks/useTransfers';
import { useFileUpload } from '@shared/hooks/useFileUpload';
import { useTransferActions } from '@shared/hooks/useTransferActions';
import { Skeleton } from '@ui-kit/components/ui/skeleton';
import ErrorBoundary from '@/components/ErrorBoundary';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';

export default function FilesPage() {
  const friends = useFriends();
  const transfers = useTransfers();
  const upload = useFileUpload();
  const actions = useTransferActions();
  const { toast } = useToast();

  const isLoading = friends.isLoading || transfers.isLoading;
  const isError = friends.isError || transfers.isError;
  const error = friends.error || transfers.error;

  if (isLoading) return <Skeleton className="h-32 w-full" />;
  if (isError) {
    toast({ title: "Error", description: error?.message || 'Failed to load files', variant: "destructive" });
    return <div>Error loading files.</div>;
  }

  return (
    <>
      <Toaster />
      <ErrorBoundary>
        <FileShare friends={friends} transfers={transfers} upload={upload} actions={actions} />
      </ErrorBoundary>
    </>
  );
} 