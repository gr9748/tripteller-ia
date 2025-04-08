
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isLoading?: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ role, content, timestamp, isLoading = false }) => {
  return (
    <div className={`flex ${role === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div 
        className={`max-w-[80%] px-4 py-2 rounded-lg ${
          role === 'user' 
            ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white' 
            : 'bg-white dark:bg-gray-800 shadow-sm border border-indigo-100 dark:border-indigo-800/50'
        }`}
      >
        {role === 'assistant' && !isLoading && (
          <div className="flex items-center mb-2">
            <Avatar className="h-6 w-6 mr-2">
              <AvatarImage src="/placeholder.svg" alt="Odyssique" />
              <AvatarFallback className="bg-indigo-100 text-indigo-700 text-xs">OD</AvatarFallback>
            </Avatar>
            <span className="text-xs font-medium text-indigo-700 dark:text-indigo-400">Odyssique</span>
          </div>
        )}
        <p className="text-sm whitespace-pre-wrap">{content}</p>
        <p className="text-xs mt-1 opacity-70">
          {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
};

export default ChatMessage;
