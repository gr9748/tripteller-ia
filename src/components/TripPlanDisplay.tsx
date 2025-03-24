
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
  ArrowLeft,
  MapPin,
  Navigation,
  Sparkles // Using Sparkles instead of Party which doesn't exist
} from 'lucide-react';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

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

const getLocationQueryParam = (location: string) => {
  return encodeURIComponent(location);
};

const getRandomImageForLocation = (location: string, size = '600x400') => {
  // Use Unsplash source for random location-based images
  return `https://source.unsplash.com/${size}/?${encodeURIComponent(location.replace(/[^\w\s]/gi, ''))}`;
};

const NavigationButton = ({ location }: { location: string }) => {
  if (!location) return null;
  
  const handleNavigate = () => {
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${getLocationQueryParam(location)}`;
    window.open(googleMapsUrl, '_blank');
  };
  
  return (
    <Button 
      variant="outline" 
      size="sm" 
      className="mt-2 text-xs h-7 px-2"
      onClick={handleNavigate}
    >
      <MapPin className="h-3 w-3 mr-1" />
      Navigate
    </Button>
  );
};

const LocationImage = ({ location, alt, className }: { location: string, alt: string, className?: string }) => {
  const [imageSrc, setImageSrc] = useState(getRandomImageForLocation(location));
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Retry with a different image if loading fails
  const handleError = () => {
    setHasError(true);
    setImageSrc(getRandomImageForLocation(location, '600x400')); // Try a different random image
  };

  return (
    <div className={cn("relative overflow-hidden rounded-md mt-2", className)}>
      {isLoading && !hasError && (
        <div className="absolute inset-0 bg-muted flex items-center justify-center">
          <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      <img
        src={imageSrc}
        alt={alt}
        className={cn(
          "w-full h-auto object-cover transition-opacity duration-300",
          isLoading ? "opacity-0" : "opacity-100"
        )}
        onLoad={() => setIsLoading(false)}
        onError={handleError}
      />
    </div>
  );
};

const LiveLocationButton = () => {
  const [isTracking, setIsTracking] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<GeolocationPosition | null>(null);
  
  const toggleLocationTracking = () => {
    if (!isTracking) {
      if ('geolocation' in navigator) {
        toast.info('Starting location tracking...');
        
        const watchId = navigator.geolocation.watchPosition(
          (position) => {
            setCurrentLocation(position);
            setIsTracking(true);
            toast.success('Location tracked successfully');
          },
          (error) => {
            console.error('Error tracking location:', error);
            toast.error(`Location tracking failed: ${error.message}`);
            setIsTracking(false);
          },
          { enableHighAccuracy: true }
        );
        
        // Store the watchId in localStorage to persist across renders
        localStorage.setItem('locationWatchId', watchId.toString());
      } else {
        toast.error('Geolocation is not supported by your browser');
      }
    } else {
      // Clear the watch when stopping tracking
      const watchId = localStorage.getItem('locationWatchId');
      if (watchId) {
        navigator.geolocation.clearWatch(parseInt(watchId));
        localStorage.removeItem('locationWatchId');
      }
      
      setIsTracking(false);
      toast.info('Location tracking stopped');
    }
  };
  
  const navigateFromCurrentLocation = (destination: string) => {
    if (!currentLocation) {
      toast.error('Current location not available. Please enable location tracking first.');
      return;
    }
    
    const { latitude, longitude } = currentLocation.coords;
    const googleMapsUrl = `https://www.google.com/maps/dir/${latitude},${longitude}/${getLocationQueryParam(destination)}`;
    window.open(googleMapsUrl, '_blank');
  };
  
  // Check if there was a previous tracking session on component mount
  useEffect(() => {
    const watchId = localStorage.getItem('locationWatchId');
    if (watchId) {
      setIsTracking(true);
    }
    
    // Clean up on unmount
    return () => {
      const storedWatchId = localStorage.getItem('locationWatchId');
      if (storedWatchId) {
        navigator.geolocation.clearWatch(parseInt(storedWatchId));
      }
    };
  }, []);
  
  return (
    <div className="mt-4 space-y-2">
      <Button 
        variant={isTracking ? "destructive" : "default"}
        size="sm"
        onClick={toggleLocationTracking}
        className="w-full"
      >
        <Navigation className="h-4 w-4 mr-2" />
        {isTracking ? 'Stop Tracking Location' : 'Start Tracking Location'}
      </Button>
      
      {currentLocation && (
        <div className="text-xs text-muted-foreground">
          <p>Current coordinates: {currentLocation.coords.latitude.toFixed(5)}, {currentLocation.coords.longitude.toFixed(5)}</p>
          <p>Accuracy: ±{currentLocation.coords.accuracy.toFixed(1)}m</p>
        </div>
      )}
    </div>
  );
};

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
      
      {/* Destination Image Banner */}
      <div className="mb-6 overflow-hidden rounded-lg">
        <LocationImage 
          location={tripPlan.destination}
          alt={`Scenic view of ${tripPlan.destination}`}
          className="h-48 md:h-64"
        />
      </div>

      {/* Live Location Tracking */}
      <LiveLocationButton />
      
      <ScrollArea className="h-[calc(100vh-430px)] pr-4 -mr-4 mt-4">
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
                    <Sparkles className="mr-2 h-5 w-5 text-primary" />
                    <span>Fun Activities</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 pl-7">
                    {activities.map((activity: any, index: number) => {
                      const activityName = typeof activity === 'string' ? activity : activity.name;
                      return (
                        <div key={index} className="border-l-2 border-primary/20 pl-4 py-2">
                          <p className="font-medium">{activityName}</p>
                          {activity.description && (
                            <p className="text-sm text-muted-foreground">{activity.description}</p>
                          )}
                          {activity.cost && (
                            <p className="text-sm font-medium mt-1">Cost: {activity.cost}</p>
                          )}
                          <LocationImage 
                            location={activityName}
                            alt={`Image of ${activityName}`}
                          />
                          <NavigationButton location={activityName} />
                        </div>
                      );
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}

            {/* Extract fun activities from attractions if activities array doesn't exist */}
            {(!activities || !Array.isArray(activities) || activities.length === 0) && attractions && Array.isArray(attractions) && attractions.length > 0 && (
              <AccordionItem value="fun-activities" className="border-b-2 border-primary/10">
                <AccordionTrigger className="py-4">
                  <div className="flex items-center">
                    <Sparkles className="mr-2 h-5 w-5 text-primary" />
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
                          <LocationImage 
                            location={activity.name}
                            alt={`Image of ${activity.name}`}
                          />
                          <NavigationButton location={activity.name} />
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
                        {flight.departure && flight.arrival && (
                          <div className="flex gap-2 mt-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-xs h-7 px-2"
                              onClick={() => {
                                const url = `https://www.google.com/flights?q=flights+from+${getLocationQueryParam(flight.departure)}+to+${getLocationQueryParam(flight.arrival)}`;
                                window.open(url, '_blank');
                              }}
                            >
                              <Plane className="h-3 w-3 mr-1" />
                              Check Flights
                            </Button>
                          </div>
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
                        <LocationImage 
                          location={accommodation.name}
                          alt={`Image of ${accommodation.name}`}
                        />
                        <NavigationButton location={accommodation.location || accommodation.name} />
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
                        <LocationImage 
                          location={attraction.name}
                          alt={`Image of ${attraction.name}`}
                        />
                        <NavigationButton location={attraction.name} />
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
                        <LocationImage 
                          location={`${restaurant.name} ${restaurant.cuisine || ""} restaurant`}
                          alt={`Image of ${restaurant.name}`}
                        />
                        <NavigationButton location={restaurant.name} />
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
                        
                        {/* Show a representative image for the day's activities */}
                        {Array.isArray(day.activities) && day.activities.length > 0 && (
                          <LocationImage 
                            location={typeof day.activities[0] === 'string' ? day.activities[0] : (day.activities[0]?.name || `Day ${day.day} activities`)}
                            alt={`Day ${day.day} activities`}
                          />
                        )}
                        
                        {Array.isArray(day.activities) && day.activities.length > 0 && (
                          <div className="mt-2">
                            <p className="text-sm font-medium">Activities:</p>
                            <ul className="list-disc list-inside space-y-1 ml-2">
                              {day.activities.map((activity: any, actIndex: number) => {
                                const activityText = typeof activity === 'string' ? activity : JSON.stringify(activity);
                                return (
                                  <li key={actIndex} className="text-sm">
                                    {activityText}
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      className="ml-2 h-6 px-2 text-xs"
                                      onClick={() => {
                                        const locationText = typeof activity === 'string' ? activity : (activity.name || activity.location || JSON.stringify(activity));
                                        const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${getLocationQueryParam(locationText)}`;
                                        window.open(googleMapsUrl, '_blank');
                                      }}
                                    >
                                      <MapPin className="h-3 w-3" />
                                    </Button>
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        )}
                        
                        {Array.isArray(day.meals) && day.meals.length > 0 && (
                          <div className="mt-2">
                            <p className="text-sm font-medium">Meals:</p>
                            <ul className="list-disc list-inside space-y-1 ml-2">
                              {day.meals.map((meal: any, mealIndex: number) => {
                                const mealText = typeof meal === 'string' ? meal : JSON.stringify(meal);
                                return (
                                  <li key={mealIndex} className="text-sm">
                                    {mealText}
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      className="ml-2 h-6 px-2 text-xs"
                                      onClick={() => {
                                        const locationText = typeof meal === 'string' ? meal : (meal.name || meal.location || JSON.stringify(meal));
                                        const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${getLocationQueryParam(locationText)}`;
                                        window.open(googleMapsUrl, '_blank');
                                      }}
                                    >
                                      <MapPin className="h-3 w-3" />
                                    </Button>
                                  </li>
                                );
                              })}
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
