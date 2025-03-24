
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Plane,
  Building2,
  Map,
  Utensils,
  Calendar,
  DollarSign,
  Info,
  ArrowLeft
} from 'lucide-react';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Party } from 'lucide-react';

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
  const {
    summary,
    flights,
    accommodations,
    attractions,
    restaurants,
    transportation,
    itinerary,
    budgetBreakdown,
    tips,
    activities
  } = tripPlan.ai_response;

  const tipsArray = Array.isArray(tips) ? tips : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-4 border rounded-lg bg-white/50 backdrop-blur-sm shadow-sm"
    >
      <div className="flex items-center mb-4 gap-2">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={onBack}
          className="p-0 h-8 w-8"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-xl font-semibold">
          Trip to {tripPlan.destination}
        </h2>
      </div>
      
      <ScrollArea className="h-[calc(100vh-230px)] pr-4 -mr-4">
        <div className="space-y-2">
          {summary && (
            <div className="mb-6 text-muted-foreground">
              <p className="leading-relaxed whitespace-pre-line">{summary}</p>
            </div>
          )}
          
          <Accordion type="single" collapsible className="w-full">
            {/* Fun Activities Section */}
            {(activities && Array.isArray(activities) && activities.length > 0) && (
              <AccordionItem value="activities" className="border-b-2 border-primary/10">
                <AccordionTrigger className="py-4">
                  <div className="flex items-center">
                    <Party className="mr-2 h-5 w-5 text-primary" />
                    <span>Fun Activities</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 pl-7">
                    {activities.map((activity: any, index: number) => (
                      <div key={index} className="border-l-2 border-primary/20 pl-4 py-2">
                        <p className="font-medium">{typeof activity === 'string' ? activity : activity.name}</p>
                        {activity.description && (
                          <p className="text-sm text-muted-foreground">{activity.description}</p>
                        )}
                        {activity.cost && (
                          <p className="text-sm font-medium mt-1">Cost: {activity.cost}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}

            {/* Extract fun activities from attractions if activities array doesn't exist */}
            {(!activities || !Array.isArray(activities) || activities.length === 0) && attractions && Array.isArray(attractions) && attractions.length > 0 && (
              <AccordionItem value="fun-activities" className="border-b-2 border-primary/10">
                <AccordionTrigger className="py-4">
                  <div className="flex items-center">
                    <Party className="mr-2 h-5 w-5 text-primary" />
                    <span>Fun Activities</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 pl-7">
                    {attractions
                      .filter((attraction: any) => 
                        typeof attraction.name === 'string' && (
                          attraction.name.toLowerCase().includes('adventure') || 
                          attraction.name.toLowerCase().includes('fun') ||
                          attraction.name.toLowerCase().includes('tour') ||
                          attraction.name.toLowerCase().includes('experience') ||
                          (typeof attraction.description === 'string' && (
                            attraction.description.toLowerCase().includes('adventure') ||
                            attraction.description.toLowerCase().includes('fun') ||
                            attraction.description.toLowerCase().includes('entertainment') ||
                            attraction.description.toLowerCase().includes('activity')
                          ))
                        )
                      )
                      .map((activity: any, index: number) => (
                        <div key={index} className="border-l-2 border-primary/20 pl-4 py-2">
                          <p className="font-medium">{activity.name}</p>
                          {activity.description && (
                            <p className="text-sm text-muted-foreground">{activity.description}</p>
                          )}
                          {activity.estimatedCost && (
                            <p className="text-sm font-medium mt-1">Cost: {activity.estimatedCost}</p>
                          )}
                        </div>
                      ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}
            
            {flights && Array.isArray(flights) && flights.length > 0 && (
              <AccordionItem value="flights">
                <AccordionTrigger className="py-4">
                  <div className="flex items-center">
                    <Plane className="mr-2 h-5 w-5 text-primary" />
                    <span>Flights</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pl-7">
                    {flights.map((flight: any, index: number) => (
                      <div key={index} className="border-l-2 border-primary/20 pl-4 py-2">
                        <p className="font-medium">{flight.airline || 'Flight Option ' + (index + 1)}</p>
                        {flight.departure && flight.arrival && (
                          <p className="text-sm text-muted-foreground">
                            {flight.departure} to {flight.arrival}
                          </p>
                        )}
                        {flight.price && (
                          <p className="text-sm font-medium mt-1">Price: {flight.price}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}
            
            {accommodations && Array.isArray(accommodations) && accommodations.length > 0 && (
              <AccordionItem value="accommodations">
                <AccordionTrigger className="py-4">
                  <div className="flex items-center">
                    <Building2 className="mr-2 h-5 w-5 text-primary" />
                    <span>Accommodations</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pl-7">
                    {accommodations.map((accommodation: any, index: number) => (
                      <div key={index} className="border-l-2 border-primary/20 pl-4 py-2">
                        <p className="font-medium">{accommodation.name}</p>
                        {accommodation.location && (
                          <p className="text-sm text-muted-foreground">{accommodation.location}</p>
                        )}
                        {(accommodation.pricePerNight || accommodation.totalCost) && (
                          <p className="text-sm font-medium mt-1">
                            {accommodation.pricePerNight && `Price per night: ${accommodation.pricePerNight}`}
                            {accommodation.pricePerNight && accommodation.totalCost && ' | '}
                            {accommodation.totalCost && `Total: ${accommodation.totalCost}`}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}
            
            {attractions && Array.isArray(attractions) && attractions.length > 0 && (
              <AccordionItem value="attractions">
                <AccordionTrigger className="py-4">
                  <div className="flex items-center">
                    <Map className="mr-2 h-5 w-5 text-primary" />
                    <span>Attractions</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pl-7">
                    {attractions.map((attraction: any, index: number) => (
                      <div key={index} className="border-l-2 border-primary/20 pl-4 py-2">
                        <p className="font-medium">{attraction.name}</p>
                        {attraction.description && (
                          <p className="text-sm text-muted-foreground">{attraction.description}</p>
                        )}
                        {attraction.estimatedCost && (
                          <p className="text-sm font-medium mt-1">Estimated cost: {attraction.estimatedCost}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}
            
            {restaurants && Array.isArray(restaurants) && restaurants.length > 0 && (
              <AccordionItem value="restaurants">
                <AccordionTrigger className="py-4">
                  <div className="flex items-center">
                    <Utensils className="mr-2 h-5 w-5 text-primary" />
                    <span>Restaurants</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pl-7">
                    {restaurants.map((restaurant: any, index: number) => (
                      <div key={index} className="border-l-2 border-primary/20 pl-4 py-2">
                        <p className="font-medium">{restaurant.name}</p>
                        {restaurant.cuisine && (
                          <p className="text-sm text-muted-foreground">Cuisine: {restaurant.cuisine}</p>
                        )}
                        {restaurant.priceRange && (
                          <p className="text-sm font-medium mt-1">Price Range: {restaurant.priceRange}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}
            
            {itinerary && Array.isArray(itinerary) && itinerary.length > 0 && (
              <AccordionItem value="itinerary">
                <AccordionTrigger className="py-4">
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-5 w-5 text-primary" />
                    <span>Itinerary</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-6 pl-7">
                    {itinerary.map((day: any, index: number) => (
                      <div key={index} className="border-l-2 border-primary/20 pl-4 py-2">
                        <p className="font-medium">Day {day.day}</p>
                        
                        {Array.isArray(day.activities) && day.activities.length > 0 && (
                          <div className="mt-2">
                            <p className="text-sm font-medium">Activities:</p>
                            <ul className="list-disc list-inside space-y-1 ml-2">
                              {day.activities.map((activity: any, actIndex: number) => (
                                <li key={actIndex} className="text-sm">{typeof activity === 'string' ? activity : JSON.stringify(activity)}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {Array.isArray(day.meals) && day.meals.length > 0 && (
                          <div className="mt-2">
                            <p className="text-sm font-medium">Meals:</p>
                            <ul className="list-disc list-inside space-y-1 ml-2">
                              {day.meals.map((meal: any, mealIndex: number) => (
                                <li key={mealIndex} className="text-sm">{typeof meal === 'string' ? meal : JSON.stringify(meal)}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {day.notes && (
                          <div className="mt-2">
                            <p className="text-sm font-medium">Notes:</p>
                            <p className="text-sm text-muted-foreground">{day.notes}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}
            
            {budgetBreakdown && (
              <AccordionItem value="budget">
                <AccordionTrigger className="py-4">
                  <div className="flex items-center">
                    <DollarSign className="mr-2 h-5 w-5 text-primary" />
                    <span>Budget Breakdown</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="pl-7">
                    <ul className="space-y-2">
                      {Object.entries(budgetBreakdown).map(([category, cost]) => (
                        <li key={category} className="flex justify-between">
                          <span className="capitalize">{category}</span>
                          <span className="font-medium">{typeof cost === 'string' ? cost : JSON.stringify(cost)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}
            
            {tipsArray.length > 0 && (
              <AccordionItem value="tips">
                <AccordionTrigger className="py-4">
                  <div className="flex items-center">
                    <Info className="mr-2 h-5 w-5 text-primary" />
                    <span>Travel Tips</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="pl-7">
                    <ul className="list-disc list-outside space-y-2 ml-4">
                      {tipsArray.map((tip: string, index: number) => (
                        <li key={index} className="text-sm">{tip}</li>
                      ))}
                    </ul>
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}
          </Accordion>
        </div>
      </ScrollArea>
    </motion.div>
  );
};

export default TripPlanDisplay;
