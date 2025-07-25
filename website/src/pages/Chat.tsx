import { useState } from 'react';
import { useChatThreads } from '@shared/hooks/useChatThreads';
import { useChatMessages } from '@shared/hooks/useChatMessages';
import { useSendMessage } from '@shared/hooks/useSendMessage';

function ChatPanel({ threads, messages, onSend, activeThread, setActiveThread }) {
  return (
    <div style={{ display: 'flex', height: '100%' }}>
      <aside style={{ width: 250, borderRight: '1px solid #ccc' }}>
        <ul>
          {threads?.map(t => (
            <li key={t.id}>
              <button
                onClick={() => setActiveThread(t.id)}
                style={{ fontWeight: t.id === activeThread ? 'bold' : 'normal' }}
              >
                {t.participants.join(', ')}
              </button>
            </li>
          ))}
        </ul>
      </aside>
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          <ul>
            {messages?.map(m => (
              <li key={m.id}>
                <b>{m.sender}:</b> {m.content}
              </li>
            ))}
          </ul>
        </div>
        <form
          onSubmit={e => {
            e.preventDefault();
            const form = e.target as HTMLFormElement;
            const input = form.elements.namedItem('msg') as HTMLInputElement;
            if (input.value) {
              onSend({ threadId: activeThread, content: input.value });
              input.value = '';
            }
          }}
        >
          <input name="msg" autoComplete="off" style={{ width: '80%' }} />
          <button type="submit">Send</button>
        </form>
      </main>
    </div>
  );
}

export default function ChatPage() {
  const { data: threads } = useChatThreads();
  const [activeThread, setActiveThread] = useState<string | null>(null);
  const { data: messages } = useChatMessages(activeThread || '');
  const sendMessage = useSendMessage();

  return (
    <ChatPanel
      threads={threads}
      messages={messages}
      onSend={sendMessage.mutate}
      activeThread={activeThread}
      setActiveThread={setActiveThread}
    />
  );
}
