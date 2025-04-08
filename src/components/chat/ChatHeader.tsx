
import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { X } from 'lucide-react';

interface ChatHeaderProps {
  onClose: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ onClose }) => {
  return (
    <div className="p-3 border-b bg-gradient-to-r from-indigo-600 to-blue-600 text-white flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <Avatar className="h-8 w-8 border-2 border-white/50">
          <AvatarImage src="/placeholder.svg" alt="Odyssique" />
          <AvatarFallback className="bg-indigo-100 text-indigo-700">OD</AvatarFallback>
        </Avatar>
        <span className="font-medium">Odyssique</span>
      </div>
      <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/10">
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default ChatHeader;
