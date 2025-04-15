
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FlightSearchDialog } from './trip-display/FlightSearchDialog';
import { LiveLocationButton } from './trip-display/LiveLocationButton';
import { AccordionSections } from './trip-display/AccordionSections';
import { TripSummary } from './trip-display/TripSummary';
import { TripPlanHeader } from './trip-display/TripPlanHeader';
import { TripDestinationImages } from './TripDestinationImages';

interface TripPlanDisplayProps {
  tripPlan: {
    id: string;
    user_id: string;
    source: string;
    destination: string;
    start_date: string;
    end_date: string;
    budget: number;
    travelers: number;
    interests: string | null;
    ai_response: any;
    created_at: string;
    updated_at: string;
  };
  onBack: () => void;
}

const TripPlanDisplay: React.FC<TripPlanDisplayProps> = ({ tripPlan, onBack }) => {
  const [isFlightDialogOpen, setIsFlightDialogOpen] = useState(false);
  
  const {
    summary,
    flights,
    accommodations,
    attractions,
    restaurants,
    transportation,
    itinerary,
    activities
  } = tripPlan.ai_response || {};

  // Handle potential undefined values to prevent errors
  const flightsArray = Array.isArray(flights) ? flights : [];
  const accommodationsArray = Array.isArray(accommodations) ? accommodations : [];
  const attractionsArray = Array.isArray(attractions) ? attractions : [];
  const restaurantsArray = Array.isArray(restaurants) ? restaurants : [];
  const transportationArray = Array.isArray(transportation) ? transportation : [];
  const itineraryArray = Array.isArray(itinerary) ? itinerary : [];
  const activitiesArray = Array.isArray(activities) ? activities : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-6 w-full max-w-7xl mx-auto border rounded-xl bg-gradient-to-br from-slate-50 to-blue-50 backdrop-blur-sm shadow-md dark:from-slate-900 dark:to-blue-900/30"
    >
      <div className="absolute -z-10 w-[350px] h-[350px] bg-gradient-to-br from-purple-500/20 to-indigo-500/10 rounded-full blur-3xl top-12 -right-32 opacity-40"></div>
      <div className="absolute -z-10 w-[300px] h-[300px] bg-gradient-to-tr from-blue-500/20 to-sky-400/10 rounded-full blur-3xl bottom-32 -left-24 opacity-30"></div>
      
      <TripPlanHeader destination={tripPlan.destination} onBack={onBack} />

      <TripDestinationImages destination={tripPlan.destination} />

      <TripSummary 
        destination={tripPlan.destination}
        startDate={tripPlan.start_date}
        endDate={tripPlan.end_date}
        budget={tripPlan.budget}
        summary={summary}
        travelers={tripPlan.travelers}
      />

      <LiveLocationButton destination={tripPlan.destination} />
      
      <ScrollArea className="h-[calc(100vh-450px)] pr-4 -mr-4 mt-6">
        <AccordionSections 
          transportationArray={transportationArray}
          activitiesArray={activitiesArray}
          attractionsArray={attractionsArray}
          flightsArray={flightsArray}
          accommodationsArray={accommodationsArray}
          restaurantsArray={restaurantsArray}
          itineraryArray={itineraryArray}
          onOpenFlightDialog={() => setIsFlightDialogOpen(true)}
        />
      </ScrollArea>

      <FlightSearchDialog 
        isOpen={isFlightDialogOpen}
        onClose={() => setIsFlightDialogOpen(false)}
        source={tripPlan.source}
        destination={tripPlan.destination}
        startDate={tripPlan.start_date}
        budget={tripPlan.budget}
      />
    </motion.div>
  );
};

export default TripPlanDisplay;
