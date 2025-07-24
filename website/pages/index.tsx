import { Dashboard } from '@ui-kit/components/Dashboard';
import { useDashboard } from '@shared/hooks/useDashboard';
import { withAuth } from '@shared/hooks/withAuth';
import { Skeleton } from '@ui-kit/components/ui/skeleton';
import ErrorBoundary from '@/components/ErrorBoundary';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';

function DashboardPage() {
  const { isLoading, isError, error, ...hook } = useDashboard();
  const { toast } = useToast();

  if (isLoading) return <Skeleton className="h-32 w-full" />;
  if (isError) {
    toast({ title: "Error", description: error?.message || 'Failed to load dashboard', variant: "destructive" });
    return <div>Error loading dashboard.</div>;
  }

  return (
    <>
      <Toaster />
      <ErrorBoundary>
        <Dashboard {...hook} />
      </ErrorBoundary>
    </>
  );
}

export default withAuth(DashboardPage);
