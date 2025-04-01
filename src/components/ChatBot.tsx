
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { X, Send, MessageCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Scroll to bottom of chat when new messages are added
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    
    // Add welcome message if opening for the first time and no messages
    if (!isOpen && chatHistory.length === 0) {
      setChatHistory([
        {
          role: 'assistant',
          content: 'Hello! I\'m Odyssique, your travel companion. I can help you discover hotels, restaurants, and attractions worldwide. How can I assist with your travel plans today?',
          timestamp: new Date()
        }
      ]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    
    // Add user message to chat
    const userMessage: ChatMessage = {
      role: 'user',
      content: message,
      timestamp: new Date()
    };
    
    setChatHistory(prev => [...prev, userMessage]);
    setMessage('');
    setIsLoading(true);
    
    try {
      // Format chat history for the API
      const apiChatHistory = chatHistory.map(msg => ({
        role: msg.role,
        content: msg.content
      }));
      
      // Call the Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('chatbot', {
        body: {
          message: message.trim(),
          chatHistory: apiChatHistory
        }
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      // Add bot response to chat
      const botMessage: ChatMessage = {
        role: 'assistant',
        content: data.response,
        timestamp: new Date()
      };
      
      setChatHistory(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: 'Failed to get a response. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Chat Icon Button */}
      <motion.div
        className="fixed bottom-4 right-4 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      >
        <Button
          onClick={toggleChat}
          className="rounded-full w-14 h-14 p-0 bg-gradient-to-r from-indigo-600 to-blue-600 shadow-lg hover:from-indigo-700 hover:to-blue-700"
          aria-label="Open chat assistant"
        >
          <div className="flex items-center justify-center">
            {isOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <MessageCircle className="h-6 w-6" />
            )}
          </div>
        </Button>
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-20 right-4 z-50 w-[350px] sm:w-[400px] max-h-[600px]"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <Card className="flex flex-col h-[500px] shadow-xl border border-indigo-200 dark:border-indigo-800 overflow-hidden">
              {/* Chat Header */}
              <div className="p-3 border-b bg-gradient-to-r from-indigo-600 to-blue-600 text-white flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Avatar className="h-8 w-8 border-2 border-white/50">
                    <AvatarImage src="/placeholder.svg" alt="Odyssique" />
                    <AvatarFallback className="bg-indigo-100 text-indigo-700">OD</AvatarFallback>
                  </Avatar>
                  <span className="font-medium">Odyssique</span>
                </div>
                <Button variant="ghost" size="icon" onClick={toggleChat} className="text-white hover:bg-white/10">
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Chat Messages */}
              <div 
                className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/20 dark:to-blue-950/20"
                ref={chatContainerRef}
              >
                {chatHistory.map((chat, index) => (
                  <div
                    key={index}
                    className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-[80%] px-4 py-2 rounded-lg ${
                        chat.role === 'user' 
                          ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white' 
                          : 'bg-white dark:bg-gray-800 shadow-sm border border-indigo-100 dark:border-indigo-800/50'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{chat.content}</p>
                      <p className="text-xs mt-1 opacity-70">
                        {chat.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
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

              {/* Chat Input */}
              <form onSubmit={handleSubmit} className="p-3 border-t bg-white dark:bg-gray-900 flex items-end space-x-2">
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="resize-none min-h-[60px] max-h-[120px] border-indigo-200 dark:border-indigo-800 focus-visible:ring-indigo-500"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                  disabled={isLoading}
                />
                <Button 
                  type="submit" 
                  size="icon"
                  disabled={!message.trim() || isLoading}
                  className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatBot;
