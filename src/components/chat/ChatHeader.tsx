
import React from 'react';
import { X, MessageSquare, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ChatHeaderProps {
  onClose: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ onClose }) => {
  return (
    <div className="p-4 border-b border-indigo-100 dark:border-indigo-800/50 flex justify-between items-center bg-gradient-to-r from-indigo-500/10 to-purple-500/5">
      <div className="flex items-center">
        <div className="h-8 w-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mr-3">
          <MessageSquare className="h-4 w-4 text-white" />
        </div>
        <div>
          <h3 className="font-medium text-slate-900 dark:text-slate-100 flex items-center gap-2">
            TripTales Assistant
            <Sparkles className="h-3 w-3 text-yellow-400" />
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Ask me anything about your trip</p>
        </div>
      </div>
      <Button
        onClick={onClose}
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default ChatHeader;
