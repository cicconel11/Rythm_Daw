import { ChatPanel } from '@ui-kit/components/ChatPanel';
import { useChatThreads } from '@shared/hooks/useChatThreads';
import { useChatMessages } from '@shared/hooks/useChatMessages';
import { useSendMessage } from '@shared/hooks/useSendMessage';
import { Skeleton } from '@ui-kit/components/ui/skeleton';
import ErrorBoundary from '@/components/ErrorBoundary';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';

export default function ChatPage() {
  const threads = useChatThreads();
  const sendMessage = useSendMessage();
  const threadId = threads.data?.[0]?.id;
  const messages = useChatMessages(threadId);
  const { toast } = useToast();

  const isLoading = threads.isLoading || messages.isLoading;
  const isError = threads.isError || messages.isError;
  const error = threads.error || messages.error;

  if (isLoading) return <Skeleton className="h-32 w-full" />;
  if (isError) {
    toast({ title: "Error", description: error?.message || 'Failed to load chat', variant: "destructive" });
    return <div>Error loading chat.</div>;
  }

  return (
    <>
      <Toaster />
      <ErrorBoundary>
        <ChatPanel threads={threads} messages={messages} sendMessage={sendMessage} />
      </ErrorBoundary>
    </>
  );
} 