
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, Calendar, DollarSign } from 'lucide-react';
import TripPlanForm from './TripPlanForm';

const TravelAssistant: React.FC = () => {
  const [activeTab, setActiveTab] = useState('trip-plan');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full"
    >
      <Card className="border shadow-md">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-xl font-semibold">
            <div className="bg-primary/10 p-2 rounded-full">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
            Travel Assistant
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="trip-plan" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="trip-plan" className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span className="hidden sm:inline">Trip Planner</span>
              </TabsTrigger>
              <TabsTrigger value="activities" className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span className="hidden sm:inline">Activities</span>
              </TabsTrigger>
              <TabsTrigger value="budget" className="flex items-center gap-1">
                <DollarSign className="h-4 w-4" />
                <span className="hidden sm:inline">Budget</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="trip-plan" className="mt-0">
              <TripPlanForm />
            </TabsContent>
            
            <TabsContent value="activities" className="mt-0">
              <div className="text-center p-8">
                <h3 className="text-lg font-medium mb-2">Activities Finder</h3>
                <p className="text-muted-foreground">
                  Coming soon! Discover and book exciting activities for your trip.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="budget" className="mt-0">
              <div className="text-center p-8">
                <h3 className="text-lg font-medium mb-2">Budget Calculator</h3>
                <p className="text-muted-foreground">
                  Coming soon! Plan and track your travel expenses with our budget calculator.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TravelAssistant;
