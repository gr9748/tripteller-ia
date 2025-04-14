
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MessageCircle, X, MapPin, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import ChatHeader from './chat/ChatHeader';
import ChatInput from './chat/ChatInput';
import ChatContainer from './chat/ChatContainer';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// Fun travel quotes for occasional messages
const travelQuotes = [
  "Adventure awaits around every corner! ✈️",
  "Collect moments, not things! 📸",
  "Travel is the only thing you buy that makes you richer! 💫",
  "Let's wander where the WiFi is weak! 🧭",
  "Life is short, and the world is wide! 🌎",
  "The journey, not the arrival, matters. 🛤️",
  "Travel far, travel wide, travel deep! 🌄",
  "Not all who wander are lost! 🧗‍♀️",
];

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showTravelTip, setShowTravelTip] = useState(false);
  const { toast } = useToast();

  // Every 10 minutes, show a travel tip if the chat is open
  useEffect(() => {
    let intervalId: number;
    
    if (isOpen && chatHistory.length > 0) {
      intervalId = window.setInterval(() => {
        setShowTravelTip(true);
        setTimeout(() => setShowTravelTip(false), 6000);
      }, 10 * 60 * 1000); // 10 minutes
    }
    
    return () => {
      if (intervalId) window.clearInterval(intervalId);
    };
  }, [isOpen, chatHistory.length]);
  
  const toggleChat = () => {
    setIsOpen(!isOpen);
    
    // Add welcome message if opening for the first time and no messages
    if (!isOpen && chatHistory.length === 0) {
      setChatHistory([
        {
          role: 'assistant',
          content: "Hello traveler! ✨ I'm your TripTales guide. How can I make your travel planning magical today? Ask me about destinations, budgets, or travel tips!",
          timestamp: new Date()
        }
      ]);
    }
  };

  const handleSendMessage = async (message: string) => {
    // Add user message to chat
    const userMessage: ChatMessage = {
      role: 'user',
      content: message,
      timestamp: new Date()
    };
    
    setChatHistory(prev => [...prev, userMessage]);
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
          message: message,
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

  // Get a random travel quote
  const getRandomQuote = () => {
    return travelQuotes[Math.floor(Math.random() * travelQuotes.length)];
  };

  return (
    <>
      {/* Travel tip toast */}
      <AnimatePresence>
        {showTravelTip && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-24 right-4 z-40 bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-4 rounded-lg shadow-lg max-w-xs"
          >
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="h-4 w-4" />
              <span className="font-medium">Travel Tip</span>
            </div>
            <p className="text-sm">{getRandomQuote()}</p>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Chat Icon Button */}
      <motion.div
        className="fixed bottom-4 right-4 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      >
        <Button
          onClick={toggleChat}
          className="rounded-full w-14 h-14 p-0 bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg hover:from-indigo-700 hover:to-purple-700"
          aria-label="Open chat assistant"
        >
          <div className="flex items-center justify-center">
            {isOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <div className="relative">
                <MessageCircle className="h-6 w-6" />
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-pink-500"></span>
                </span>
              </div>
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
            <Card className="flex flex-col h-[500px] shadow-xl border border-indigo-200 dark:border-indigo-800 overflow-hidden bg-gradient-to-b from-white to-indigo-50/30 dark:from-gray-900 dark:to-indigo-950/30">
              {/* Chat Header */}
              <ChatHeader onClose={toggleChat} />

              {/* Chat Messages */}
              <ChatContainer chatHistory={chatHistory} isLoading={isLoading} />

              {/* Chat Input */}
              <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatBot;
