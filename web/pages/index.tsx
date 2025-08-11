import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Dashboard } from '@rythm/ui-kit';
import { useDashboard } from '@shared/hooks/useDashboard';
import { Skeleton } from '@rythm/ui-kit';
import ErrorBoundary from '@/components/ErrorBoundary';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';

function DashboardPage() {
  const { isLoading, isError, error, ...hook } = useDashboard();
  const { toast } = useToast();

  if (isLoading) return <Skeleton className="h-32 w-full" />;
  if (isError) {
    toast({
      title: 'Error',
      description: error?.message || 'Failed to load dashboard',
      variant: 'destructive',
    });
    return <div>Error loading dashboard.</div>;
  }

  return (
    <>
      <Toaster />
      <ErrorBoundary>
        <Dashboard
          stats={hook.stats}
          onNavigate={(path: string) => {
            // Handle navigation if needed
            console.log('Navigating to:', path);
          }}
        />
      </ErrorBoundary>
    </>
  );
}

export default function IndexPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return; // Still loading

    if (status === 'unauthenticated') {
      router.push('/landing');
    }
  }, [session, status, router]);

  // Show loading while checking auth status
  if (status === 'loading') {
    return (
      <main className="min-h-screen flex flex-col justify-center items-center bg-white dark:bg-black transition-colors">
        <div className="text-lg text-gray-600 dark:text-gray-300">Loading...</div>
      </main>
    );
  }

  // Don't render if user is unauthenticated (will redirect)
  if (status === 'unauthenticated') {
    return null;
  }

  // Show dashboard for authenticated users
  return <DashboardPage />;
}
