
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, Calendar, History, Plane, Globe } from 'lucide-react';
import TripPlanForm from './TripPlanForm';
import PreviousPlans from './PreviousPlans';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

const TravelAssistant: React.FC = () => {
  const [activeTab, setActiveTab] = useState('trip-plan');
  const { isAuthenticated } = useAuth();
  const [previousPlans, setPreviousPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated && activeTab === 'previous-plans') {
      fetchPreviousPlans();
    }
  }, [activeTab, isAuthenticated]);

  const fetchPreviousPlans = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('trip_plans')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching previous plans:', error);
        toast.error('Failed to load previous plans');
        return;
      }

      setPreviousPlans(data || []);
    } catch (err) {
      console.error('Unexpected error:', err);
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full"
    >
      <Card className="border shadow-md bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-indigo-950">
        <CardHeader className="pb-4 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-slate-700 dark:to-indigo-900 rounded-t-lg">
          <CardTitle className="flex items-center gap-2 text-xl font-semibold">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-full text-white">
              <Globe className="h-5 w-5" />
            </div>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-700 dark:from-blue-400 dark:to-indigo-400">
              Travel Assistant
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="trip-plan" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4 bg-blue-100/50 dark:bg-slate-800">
              <TabsTrigger 
                value="trip-plan" 
                className="flex items-center gap-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white"
              >
                <Plane className="h-4 w-4" />
                <span className="hidden sm:inline">Trip Planner</span>
              </TabsTrigger>
              <TabsTrigger 
                value="previous-plans" 
                className="flex items-center gap-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white"
              >
                <History className="h-4 w-4" />
                <span className="hidden sm:inline">Previous Plans</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="trip-plan" className="mt-0">
              <TripPlanForm />
            </TabsContent>
            
            <TabsContent value="previous-plans" className="mt-0">
              <PreviousPlans 
                plans={previousPlans} 
                isLoading={isLoading}
                onRefresh={fetchPreviousPlans}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TravelAssistant;
