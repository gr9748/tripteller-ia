
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Lock, GlobeCheck } from 'lucide-react';

interface WelcomeSectionProps {
  username: string;
}

const WelcomeSection: React.FC<WelcomeSectionProps> = ({ username }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mb-8"
    >
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-100 dark:border-blue-800/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-700 dark:from-blue-400 dark:to-indigo-400">
            Welcome back, {username}!
          </CardTitle>
          <CardDescription className="text-lg">
            Let's plan your next unforgettable journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            Use our AI-powered travel assistant to create personalized trip itineraries, discover hidden gems, 
            and find the best accommodations suited to your preferences.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="flex items-start space-x-3">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
                <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-medium text-blue-700 dark:text-blue-400">Security First</h3>
                <p className="text-sm text-muted-foreground">Your data is encrypted and securely stored.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="bg-indigo-100 dark:bg-indigo-900/30 p-2 rounded-full">
                <Lock className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <h3 className="font-medium text-indigo-700 dark:text-indigo-400">Privacy Protected</h3>
                <p className="text-sm text-muted-foreground">We never share your personal information.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-full">
                <GlobeCheck className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="font-medium text-purple-700 dark:text-purple-400">Global Coverage</h3>
                <p className="text-sm text-muted-foreground">Explore destinations worldwide with confidence.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default WelcomeSection;
