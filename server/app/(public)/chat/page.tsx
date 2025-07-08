
'use client';

import { ChatPanel } from 'ui-kit';

export default function ChatPage() {
  const handleNavigate = (path: string) => {
    console.log('Navigate to:', path);
  };

  return <ChatPanel onNavigate={handleNavigate} />;
}
