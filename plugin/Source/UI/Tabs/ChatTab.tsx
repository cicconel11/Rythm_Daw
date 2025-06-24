import React, { useRef } from 'react';
import { Led } from '../components/Led';
import { useStore } from '@store';
import { FixedSizeList } from 'react-window';

const ChatTab: React.FC = () => {
  const { messages } = useStore();
  const listRef = useRef<FixedSizeList>(null);

  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const msg = messages[index];
    const isUser = msg.sender === 'user';
    return (
      <div
        style={style}
        className={`flex ${isUser ? 'justify-end' : 'justify-start'} px-4`}
      >
        <div
          className={`max-w-xs px-4 py-2 rounded-lg text-sm text-text_primary ${isUser ? 'bg-brand' : 'bg-card'}`}
        >
          <p>{msg.text}</p>
          <span className="text-xs text-text_secondary block mt-1">{msg.timestamp}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-background rounded-br-xl overflow-hidden relative shadow-inner-md">
      {/* Messages List */}
      <div className="flex-1 overflow-hidden relative">
        <FixedSizeList
          ref={listRef}
          height={400} // This will be overridden by flex
          width="100%"
          itemCount={messages.length}
          itemSize={80}
          className="overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent"
        >
          {Row}
        </FixedSizeList>
      </div>

      {/* Typing Indicator */}
      <div className="px-4 py-2 flex items-center space-x-1">
        <Led on={true} size={6} colorOn="#4d4d4d" colorOff="#2d2d2d" className="animate-pulse" />
        <Led on={true} size={6} colorOn="#4d4d4d" colorOff="#2d2d2d" className="animate-pulse delay-100" />
        <Led on={true} size={6} colorOn="#4d4d4d" colorOff="#2d2d2d" className="animate-pulse delay-200" />
        <span className="text-xs text-text_muted italic">Someone is typing...</span>
      </div>

      {/* Composer */}
      <div className="p-4 border-t border-gray-700">
        <div className="relative">
          <textarea
            className="w-full bg-card rounded-lg pl-3 pr-10 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-brand text-text_primary text-sm resize-none"
            placeholder="Type a message..."
            rows={2}
          />
          <div className="absolute right-2 bottom-2 flex space-x-1">
            <button className="text-text_secondary hover:text-brand p-1 rounded-full transition-colors duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" />
              </svg>
            </button>
            <button className="text-text_secondary hover:text-brand p-1 rounded-full transition-colors duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatTab;
