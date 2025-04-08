
import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import TravelAssistant from '@/components/TravelAssistant';
import PageTransition from '@/components/PageTransition';
import { useAuth } from '@/context/AuthContext';
import WelcomeSection from '@/components/WelcomeSection';
import Footer from '@/components/Footer';

const Index: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  
  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-1 container mx-auto px-4 py-24">
          {/* Conditional rendering based on authentication */}
          {isAuthenticated && user ? (
            <>
              <WelcomeSection username={user.name} />
              <TravelAssistant />
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="max-w-3xl mx-auto text-center mt-8"
            >
              <h1 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                Discover your next adventure with TravelAI
              </h1>
              <p className="text-xl mb-10 text-muted-foreground">
                Let our AI travel assistant plan your perfect trip with personalized recommendations
                for destinations, accommodations, and activities.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div className="p-6 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30">
                  <h3 className="text-xl font-semibold mb-3 text-blue-700 dark:text-blue-400">Customized Itineraries</h3>
                  <p>Tailored travel plans based on your preferences, budget, and timeframe.</p>
                </div>
                
                <div className="p-6 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/30">
                  <h3 className="text-xl font-semibold mb-3 text-indigo-700 dark:text-indigo-400">Local Insights</h3>
                  <p>Discover hidden gems and authentic experiences recommended by our AI.</p>
                </div>
                
                <div className="p-6 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800/30">
                  <h3 className="text-xl font-semibold mb-3 text-purple-700 dark:text-purple-400">Smart Suggestions</h3>
                  <p>Get intelligent recommendations for accommodations, dining, and activities.</p>
                </div>
              </div>
            </motion.div>
          )}
        </main>
        
        <Footer />
      </div>
    </PageTransition>
  );
};

export default Index;
