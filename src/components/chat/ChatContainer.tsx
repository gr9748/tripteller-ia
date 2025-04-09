
import React, { useRef, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import ChatMessage from './ChatMessage';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatContainerProps {
  chatHistory: ChatMessage[];
  isLoading: boolean;
}

const ChatContainer: React.FC<ChatContainerProps> = ({ chatHistory, isLoading }) => {
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of chat when new messages are added
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  return (
    <div 
      className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/20 dark:to-blue-950/20"
      ref={chatContainerRef}
    >
      {chatHistory.map((chat, index) => (
        <ChatMessage
          key={index}
          role={chat.role}
          content={chat.content}
          timestamp={chat.timestamp}
        />
      ))}
      {isLoading && (
        <div className="flex justify-start">
          <div className="max-w-[80%] px-4 py-2 rounded-lg bg-white dark:bg-gray-800 shadow-sm border border-indigo-100 dark:border-indigo-800/50 flex items-center space-x-2">
            <Loader2 className="h-4 w-4 animate-spin text-indigo-500" />
            <p className="text-sm">Thinking...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatContainer;
