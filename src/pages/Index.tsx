
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Users, ArrowRight, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import PageTransition from '@/components/PageTransition';
import TravelAssistant from '@/components/TravelAssistant';
import Navbar from '@/components/Navbar';

const features = [
  {
    icon: <MapPin className="h-8 w-8 text-primary" />,
    title: 'Discover Places',
    description: 'Find unique destinations tailored to your preferences.',
  },
  {
    icon: <Calendar className="h-8 w-8 text-primary" />,
    title: 'Plan Itineraries',
    description: 'Get AI-generated travel plans that optimize your time.',
  },
  {
    icon: <Users className="h-8 w-8 text-primary" />,
    title: 'Travel Recommendations',
    description: 'Personalized suggestions based on your interests and budget.',
  },
];

const Index: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [showPlanner, setShowPlanner] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <PageTransition>
      <Navbar />
      
      <main className="min-h-screen">
        <section className="pt-24 pb-12 md:pt-32 md:pb-20">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-4 mb-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-2"
              >
                <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-2">
                  AI-Powered Travel Assistant
                </span>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                  Plan Your Perfect Trip with{' '}
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-700">
                    TravelAI
                  </span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Your personal travel assistant powered by AI. Get intelligent travel recommendations, itineraries, and insights.
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                {!isAuthenticated ? (
                  <Button 
                    size="lg" 
                    className="mt-2"
                    onClick={() => navigate('/signup')}
                  >
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <p className="text-lg font-medium text-primary">
                    Welcome back! Ready to plan your next adventure?
                  </p>
                )}
              </motion.div>
            </div>

            {isAuthenticated && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="mb-16"
              >
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-lg mb-8 border border-blue-100 dark:border-blue-800 shadow-sm">
                  <h2 className="text-2xl font-bold mb-3 text-blue-700 dark:text-blue-300">Welcome to Your Travel Dashboard</h2>
                  <p className="text-slate-700 dark:text-slate-300 mb-5 max-w-3xl">
                    Odyssique helps you discover and plan incredible journeys around the world. Use our AI-powered 
                    assistant to create custom itineraries, explore destinations, and keep track of your travel plans. 
                    You can access your previous trips anytime and get personalized recommendations based on your preferences.
                  </p>
                  {!showPlanner ? (
                    <Button 
                      onClick={() => setShowPlanner(true)}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Create a New Trip Plan
                    </Button>
                  ) : (
                    <TravelAssistant />
                  )}
                </div>
              </motion.div>
            )}

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12"
            >
              {features.map((feature, index) => (
                <motion.div key={index} variants={itemVariants}>
                  <Card className="h-full glass border-none shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                      <div className="rounded-full w-12 h-12 flex items-center justify-center bg-primary/10 mb-4">
                        {feature.icon}
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        <section className="py-16 bg-gradient-to-b from-background to-muted/50">
          <div className="container px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto text-center"
            >
              <h2 className="text-3xl font-bold tracking-tight mb-4">
                Experience the Future of Travel Planning
              </h2>
              <p className="text-muted-foreground mb-8">
                Our AI-powered assistant learns your preferences over time to provide increasingly personalized recommendations.
              </p>
              {!isAuthenticated && (
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => navigate('/login')}
                >
                  Try it now
                </Button>
              )}
            </motion.div>
          </div>
        </section>
      </main>

      <footer className="py-6 border-t">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">About</h3>
              <p className="text-sm text-muted-foreground">
                TravelAI helps you discover and plan incredible journeys with AI-powered recommendations 
                and personalized itineraries.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Security</h3>
              <p className="text-sm text-muted-foreground">
                We prioritize your data security with end-to-end encryption and strict access controls. 
                Your travel plans and personal information are safeguarded with industry-standard protection.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Privacy & Terms</h3>
              <p className="text-sm text-muted-foreground">
                Your privacy matters to us. We only collect information necessary to provide our services, 
                and we never sell your data to third parties. You control your data and can delete it anytime.
                By using TravelAI, you agree to our terms of service. We provide our platform as-is and 
                make no guarantees about travel availability or pricing.
              </p>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t">
            <div className="mb-4 md:mb-0">
              <p className="text-sm text-muted-foreground">
                © 2023 TravelAI. All rights reserved.
              </p>
            </div>
            <div className="flex space-x-4">
              <Button variant="ghost" size="sm">
                Privacy
              </Button>
              <Button variant="ghost" size="sm">
                Terms
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </PageTransition>
  );
};

export default Index;
