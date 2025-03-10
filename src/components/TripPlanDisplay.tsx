
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent, 
  CardDescription 
} from '@/components/ui/card';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  MapPin, 
  Users, 
  DollarSign, 
  Plane, 
  Home, 
  Utensils, 
  MapIcon, 
  Bus, 
  CalendarDays, 
  LightbulbIcon,
  Smile
} from 'lucide-react';
import { TripPlan } from '@/hooks/useTripFormSubmit';

interface TripPlanDisplayProps {
  tripPlan: TripPlan;
}

const TripPlanDisplay: React.FC<TripPlanDisplayProps> = ({ tripPlan }) => {
  if (!tripPlan || !tripPlan.ai_response) {
    return null;
  }
  
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-3xl mx-auto mt-8 mb-12"
    >
      <Card className="glass overflow-hidden">
        <CardHeader className="bg-primary/10">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold">
                {tripPlan.source} to {tripPlan.destination}
              </CardTitle>
              <CardDescription className="flex items-center mt-1">
                <Calendar className="h-4 w-4 mr-1" />
                {new Date(tripPlan.start_date).toLocaleDateString()} - {new Date(tripPlan.end_date).toLocaleDateString()}
              </CardDescription>
            </div>
            <div className="text-right">
              <Badge className="mb-1">${tripPlan.budget} Budget</Badge>
              <CardDescription className="flex items-center justify-end">
                <Users className="h-4 w-4 mr-1" />
                {tripPlan.travelers} Travelers
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-6">
          {summary && (
            <div className="mb-6">
              <p className="text-md italic text-muted-foreground">{summary}</p>
            </div>
          )}
          
          <Accordion type="single" collapsible className="w-full">
            {/* Fun Activities Section */}
            {(activities && activities.length > 0) && (
              <AccordionItem value="activities" className="border-b-2 border-primary/10">
                <AccordionTrigger className="py-4">
                  <div className="flex items-center">
                    <Smile className="h-5 w-5 mr-2 text-primary" />
                    <span className="font-semibold">Fun Activities</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 pl-7">
                    {activities.map((activity: any, index: number) => (
                      <div key={index} className="border-l-2 border-primary/20 pl-4 py-2">
                        <p className="font-medium">{activity.name || activity}</p>
                        {activity.description && (
                          <p className="text-sm text-muted-foreground">{activity.description}</p>
                        )}
                        {activity.cost && (
                          <p className="text-xs mt-1">Cost: {activity.cost}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}

            {/* Extract fun activities from attractions if activities array doesn't exist */}
            {(!activities || activities.length === 0) && attractions && attractions.length > 0 && (
              <AccordionItem value="fun-activities" className="border-b-2 border-primary/10">
                <AccordionTrigger className="py-4">
                  <div className="flex items-center">
                    <Smile className="h-5 w-5 mr-2 text-primary" />
                    <span className="font-semibold">Fun Activities</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 pl-7">
                    {attractions
                      .filter((attraction: any) => 
                        attraction.name.toLowerCase().includes('adventure') || 
                        attraction.name.toLowerCase().includes('fun') ||
                        attraction.name.toLowerCase().includes('tour') ||
                        attraction.name.toLowerCase().includes('experience') ||
                        (attraction.description && (
                          attraction.description.toLowerCase().includes('adventure') ||
                          attraction.description.toLowerCase().includes('fun') ||
                          attraction.description.toLowerCase().includes('entertainment') ||
                          attraction.description.toLowerCase().includes('activity')
                        ))
                      )
                      .map((activity: any, index: number) => (
                        <div key={index} className="border-l-2 border-primary/20 pl-4 py-2">
                          <p className="font-medium">{activity.name}</p>
                          <p className="text-sm text-muted-foreground">{activity.description}</p>
                          <p className="text-xs mt-1">Cost: {activity.estimatedCost}</p>
                        </div>
                      ))
                    }
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}
            
            {flights && flights.length > 0 && (
              <AccordionItem value="flights">
                <AccordionTrigger className="py-4">
                  <div className="flex items-center">
                    <Plane className="h-5 w-5 mr-2" />
                    <span>Flights</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 pl-7">
                    {flights.map((flight: any, index: number) => (
                      <div key={index} className="border-l-2 border-primary/20 pl-4 py-2">
                        <p className="font-medium">{flight.airline}</p>
                        <p className="text-sm">Price: {flight.price}</p>
                        <div className="flex text-xs text-muted-foreground mt-1">
                          <span className="flex-1">Departure: {flight.departure}</span>
                          <span className="flex-1">Arrival: {flight.arrival}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}
            
            {accommodations && accommodations.length > 0 && (
              <AccordionItem value="accommodations">
                <AccordionTrigger className="py-4">
                  <div className="flex items-center">
                    <Home className="h-5 w-5 mr-2" />
                    <span>Accommodations</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 pl-7">
                    {accommodations.map((accommodation: any, index: number) => (
                      <div key={index} className="border-l-2 border-primary/20 pl-4 py-2">
                        <p className="font-medium">{accommodation.name}</p>
                        <p className="text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3 inline mr-1" /> {accommodation.location}
                        </p>
                        <div className="flex justify-between text-xs mt-1">
                          <span>Per night: {accommodation.pricePerNight}</span>
                          <span>Total: {accommodation.totalCost}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}
            
            {attractions && attractions.length > 0 && (
              <AccordionItem value="attractions">
                <AccordionTrigger className="py-4">
                  <div className="flex items-center">
                    <MapIcon className="h-5 w-5 mr-2" />
                    <span>Attractions</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 pl-7">
                    {attractions.map((attraction: any, index: number) => (
                      <div key={index} className="border-l-2 border-primary/20 pl-4 py-2">
                        <p className="font-medium">{attraction.name}</p>
                        <p className="text-sm text-muted-foreground">{attraction.description}</p>
                        <p className="text-xs mt-1">Cost: {attraction.estimatedCost}</p>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}
            
            {restaurants && restaurants.length > 0 && (
              <AccordionItem value="restaurants">
                <AccordionTrigger className="py-4">
                  <div className="flex items-center">
                    <Utensils className="h-5 w-5 mr-2" />
                    <span>Restaurants</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 pl-7">
                    {restaurants.map((restaurant: any, index: number) => (
                      <div key={index} className="border-l-2 border-primary/20 pl-4 py-2">
                        <p className="font-medium">{restaurant.name}</p>
                        <p className="text-sm text-muted-foreground">{restaurant.cuisine}</p>
                        <p className="text-xs mt-1">Price Range: {restaurant.priceRange}</p>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}
            
            {transportation && transportation.length > 0 && (
              <AccordionItem value="transportation">
                <AccordionTrigger className="py-4">
                  <div className="flex items-center">
                    <Bus className="h-5 w-5 mr-2" />
                    <span>Transportation</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 pl-7">
                    {transportation.map((transport: any, index: number) => (
                      <div key={index} className="border-l-2 border-primary/20 pl-4 py-2">
                        <p className="font-medium">{transport.type}</p>
                        <p className="text-sm mt-1">Cost: {transport.cost}</p>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}
            
            {itinerary && itinerary.length > 0 && (
              <AccordionItem value="itinerary">
                <AccordionTrigger className="py-4">
                  <div className="flex items-center">
                    <CalendarDays className="h-5 w-5 mr-2" />
                    <span>Daily Itinerary</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pl-7">
                    {itinerary.map((day: any, index: number) => (
                      <div key={index} className="border-l-2 border-primary/20 pl-4 py-2">
                        <p className="font-medium">Day {day.day}</p>
                        
                        {day.activities && (
                          <div className="mt-2">
                            <p className="text-sm font-medium">Activities:</p>
                            <ul className="list-disc list-inside text-sm text-muted-foreground ml-2">
                              {day.activities.map((activity: string, actIdx: number) => (
                                <li key={actIdx}>{activity}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {day.meals && (
                          <div className="mt-2">
                            <p className="text-sm font-medium">Meals:</p>
                            <ul className="list-disc list-inside text-sm text-muted-foreground ml-2">
                              {day.meals.map((meal: string, mealIdx: number) => (
                                <li key={mealIdx}>{meal}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {day.notes && (
                          <p className="text-xs italic mt-2">{day.notes}</p>
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
                    <DollarSign className="h-5 w-5 mr-2" />
                    <span>Budget Breakdown</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 pl-7">
                    {Object.entries(budgetBreakdown).map(([category, cost]) => (
                      <div key={category} className="flex justify-between">
                        <span className="capitalize">{category}:</span>
                        <span>{cost}</span>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}
            
            {tips && tips.length > 0 && (
              <AccordionItem value="tips">
                <AccordionTrigger className="py-4">
                  <div className="flex items-center">
                    <LightbulbIcon className="h-5 w-5 mr-2" />
                    <span>Travel Tips</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="pl-7">
                    <ul className="list-disc list-outside space-y-2 ml-4">
                      {tips.map((tip: string, index: number) => (
                        <li key={index} className="text-sm">{tip}</li>
                      ))}
                    </ul>
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}
          </Accordion>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TripPlanDisplay;
