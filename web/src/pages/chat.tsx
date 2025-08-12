import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { usePageMeta } from '@/hooks/usePageMeta';
import { ROUTES } from '@/lib/routes';
import { useConversations, useMessages, useSendMessage, useFriends } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Send, Search, Users, MessageSquare } from 'lucide-react';

function ChatPanel({ 
  conversations, 
  messages, 
  onSend, 
  activeConversation, 
  setActiveConversation,
  isLoading 
}: {
  conversations: any[];
  messages: any[];
  onSend: (data: { conversationId: string; content: string }) => void;
  activeConversation: string | null;
  setActiveConversation: (id: string) => void;
  isLoading: boolean;
}) {
  const [messageInput, setMessageInput] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !activeConversation) return;
    
    onSend({ conversationId: activeConversation, content: messageInput });
    setMessageInput('');
  };

  if (isLoading) {
    return (
      <div className="flex h-[600px]">
        <aside className="w-80 border-r p-4">
          <Skeleton className="h-6 w-32 mb-4" />
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 mb-2" />
          ))}
        </aside>
        <main className="flex-1 p-4">
          <Skeleton className="h-6 w-48 mb-4" />
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-12 mb-2" />
          ))}
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-[600px]">
      {/* Conversations List */}
      <aside className="w-80 border-r p-4">
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare className="w-5 h-5" />
          <h3 className="font-semibold">Conversations</h3>
        </div>
        <div className="space-y-2">
          {conversations.map(conversation => (
            <div
              key={conversation.id}
              onClick={() => setActiveConversation(conversation.id)}
              className={`p-3 rounded-lg cursor-pointer transition-colors ${
                activeConversation === conversation.id 
                  ? 'bg-primary/10 border border-primary/20' 
                  : 'hover:bg-muted/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <span className="text-sm">
                    {conversation.participants[0]?.charAt(0) || 'U'}
                  </span>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">
                    {conversation.participants.join(', ')}
                  </p>
                  {conversation.lastMessage && (
                    <p className="text-xs text-muted-foreground truncate">
                      {conversation.lastMessage.content}
                    </p>
                  )}
                </div>
                {conversation.unreadCount > 0 && (
                  <Badge variant="destructive" className="text-xs">
                    {conversation.unreadCount}
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Chat Messages */}
      <main className="flex-1 flex flex-col">
        {activeConversation ? (
          <>
            <div className="flex-1 p-4 overflow-y-auto">
              <div className="space-y-4">
                {messages.map(message => (
                  <div key={message.id} className="flex items-start gap-3">
                    <Avatar className="w-8 h-8">
                      <span className="text-xs">{message.sender.charAt(0)}</span>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">{message.sender}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-sm">{message.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <form onSubmit={handleSendMessage} className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1"
                />
                <Button type="submit" disabled={!messageInput.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Select a conversation to start chatting</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function ChatPage() {
  usePageMeta(ROUTES.chat.name);
  const { toast } = useToast();
  
  const { data: conversations = [], isLoading: conversationsLoading } = useConversations();
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const { data: messages = [], isLoading: messagesLoading } = useMessages(activeConversation || '');
  const sendMessageMutation = useSendMessage();

  const handleSendMessage = async (data: { conversationId: string; content: string }) => {
    try {
      await sendMessageMutation.mutateAsync(data);
      // Message will be automatically added to the conversation via React Query
    } catch (error) {
      toast({
        title: 'Message Failed',
        description: 'Failed to send message. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const isLoading = conversationsLoading || messagesLoading;

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Chat</h1>
          <p className="text-muted-foreground">Connect with your collaborators in real-time</p>
        </div>
      </div>
      
      <Card>
        <CardContent className="p-0">
          <ChatPanel
            conversations={conversations}
            messages={messages}
            onSend={handleSendMessage}
            activeConversation={activeConversation}
            setActiveConversation={setActiveConversation}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
    </div>
  );
}
