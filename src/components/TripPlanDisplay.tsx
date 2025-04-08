import React from 'react';
import { motion } from 'framer-motion';
import { 
  Plane,
  Building2,
  Map,
  Utensils,
  Calendar,
  MapPin,
  Info,
  ArrowLeft,
  Navigation,
  Sparkles,
  Search,
  IndianRupee,
  Train,
  Bus,
  Car,
  Truck,
  Ship,
  Footprints
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
import { cn, formatCurrency } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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
      className="mt-2 text-xs h-7 px-2 bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800"
      onClick={handleNavigate}
    >
      <MapPin className="h-3 w-3 mr-1" />
      Navigate
    </Button>
  );
};

// Define the transportation icons map
const transportationIcons: Record<string, React.ReactNode> = {
  'flight': <Plane className="h-4 w-4" />,
  'plane': <Plane className="h-4 w-4" />,
  'train': <Train className="h-4 w-4" />,
  'bus': <Bus className="h-4 w-4" />,
  'car': <Car className="h-4 w-4" />,
  'taxi': <Car className="h-4 w-4" />,
  'ferry': <Ship className="h-4 w-4" />,
  'ship': <Ship className="h-4 w-4" />,
  'boat': <Ship className="h-4 w-4" />,
  'walk': <Footprints className="h-4 w-4" />,
  'metro': <Train className="h-4 w-4" />,
  'tram': <Train className="h-4 w-4" />,
};

const getTransportationIcon = (type: string) => {
  const lowerType = type.toLowerCase();
  for (const [key, icon] of Object.entries(transportationIcons)) {
    if (lowerType.includes(key)) {
      return icon;
    }
  }
  return <Truck className="h-4 w-4" />;
};

const FlightSearchDialog = ({ 
  isOpen, 
  onClose,
  source,
  destination,
  startDate,
  budget
}: { 
  isOpen: boolean, 
  onClose: () => void,
  source: string,
  destination: string,
  startDate: string,
  budget: number
}) => {
  const [maxPrice, setMaxPrice] = useState(budget);
  const [departDate, setDepartDate] = useState(startDate);
  
  const handleSearch = () => {
    const searchParams = new URLSearchParams({
      curr: 'INR',
      d1: source,
      a1: destination,
      date1: departDate,
      maxprice: maxPrice.toString()
    });
    
    const searchUrl = `https://www.google.com/travel/flights?${searchParams.toString()}`;
    window.open(searchUrl, '_blank');
    onClose();
    toast.success('Opening flight search...');
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Search Flights</DialogTitle>
          <DialogDescription>
            Find flights within your budget and schedule
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="source">From</Label>
              <Input id="source" value={source} readOnly className="bg-muted" />
            </div>
            <div>
              <Label htmlFor="destination">To</Label>
              <Input id="destination" value={destination} readOnly className="bg-muted" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">Departure Date</Label>
              <Input 
                id="date" 
                type="date" 
                value={departDate} 
                onChange={(e) => setDepartDate(e.target.value)} 
              />
            </div>
            <div>
              <Label htmlFor="budget">Max Budget (₹)</Label>
              <Input 
                id="budget" 
                type="number" 
                value={maxPrice} 
                onChange={(e) => setMaxPrice(parseInt(e.target.value))} 
              />
            </div>
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button onClick={handleSearch} className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600">
            <Search className="h-4 w-4 mr-2" />
            Search Flights
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const LiveLocationButton = ({ destination }: { destination: string }) => {
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
        
        localStorage.setItem('locationWatchId', watchId.toString());
      } else {
        toast.error('Geolocation is not supported by your browser');
      }
    } else {
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
  
  useEffect(() => {
    const watchId = localStorage.getItem('locationWatchId');
    if (watchId) {
      setIsTracking(true);
    }
    
    return () => {
      const storedWatchId = localStorage.getItem('locationWatchId');
      if (storedWatchId) {
        navigator.geolocation.clearWatch(parseInt(storedWatchId));
      }
    };
  }, []);
  
  return (
    <div className="space-y-2">
      <div className="flex flex-col sm:flex-row gap-2">
        <Button 
          variant={isTracking ? "destructive" : "default"}
          size="sm"
          onClick={toggleLocationTracking}
          className={`flex-1 ${!isTracking ? 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700' : ''}`}
        >
          <Navigation className="h-4 w-4 mr-2" />
          {isTracking ? 'Stop Tracking Location' : 'Start Tracking Location'}
        </Button>
        
        {isTracking && currentLocation && (
          <Button
            variant="default"
            size="sm"
            className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            onClick={() => navigateFromCurrentLocation(destination)}
          >
            <MapPin className="h-4 w-4 mr-2" />
            Navigate to Destination
          </Button>
        )}
      </div>
      
      {currentLocation && (
        <div className="text-xs text-muted-foreground bg-slate-50 p-2 rounded-md border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
          <p>Current coordinates: {currentLocation.coords.latitude.toFixed(5)}, {currentLocation.coords.longitude.toFixed(5)}</p>
          <p>Accuracy: ±{currentLocation.coords.accuracy.toFixed(1)}m</p>
        </div>
      )}
    </div>
  );
};

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
    budgetBreakdown,
    tips,
    activities
  } = tripPlan.ai_response || {};

  // Handle potential undefined values to prevent errors
  const tipsArray = Array.isArray(tips) ? tips : [];
  const flightsArray = Array.isArray(flights) ? flights : [];
  const accommodationsArray = Array.isArray(accommodations) ? accommodations : [];
  const attractionsArray = Array.isArray(attractions) ? attractions : [];
  const restaurantsArray = Array.isArray(restaurants) ? restaurants : [];
  const transportationArray = Array.isArray(transportation) ? transportation : [];
  const itineraryArray = Array.isArray(itinerary) ? itinerary : [];
  const activitiesArray = Array.isArray(activities) ? activities : [];
  const budget = budgetBreakdown || {};

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-4 border rounded-lg bg-gradient-to-br from-slate-50 to-blue-50 backdrop-blur-sm shadow-sm dark:from-slate-900 dark:to-blue-900/30"
    >
      <div className="flex items-center mb-4 gap-2">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={onBack}
          className="p-0 h-8 w-8 text-slate-600 hover:text-slate-900 hover:bg-slate-200/50 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-700/50"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
          Trip to {tripPlan.destination}
        </h2>
      </div>

      <div className="mb-6 p-4 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-lg border border-blue-100 dark:border-blue-900">
        <div className="flex gap-2 items-center mb-2">
          <MapPin className="h-5 w-5 text-blue-500 dark:text-blue-400" />
          <h3 className="font-medium text-blue-700 dark:text-blue-300">
            {tripPlan.destination}
          </h3>
        </div>
        <div className="flex gap-4 text-sm text-slate-600 dark:text-slate-300">
          <span className="flex items-center gap-1">
            <Calendar className="h-4 w-4 text-indigo-500" />
            {tripPlan.start_date} - {tripPlan.end_date}
          </span>
          <span className="flex items-center gap-1">
            <IndianRupee className="h-4 w-4 text-green-500" />
            Budget: {formatCurrency(tripPlan.budget)}
          </span>
        </div>
      </div>

      <LiveLocationButton destination={tripPlan.destination} />
      
      <ScrollArea className="h-[calc(100vh-430px)] pr-4 -mr-4 mt-4">
        <div className="space-y-2">
          {summary && (
            <div className="mb-6 p-4 rounded-lg bg-gradient-to-br from-purple-50 to-indigo-50 text-slate-700 dark:from-purple-900/20 dark:to-indigo-900/20 dark:text-slate-200 border border-purple-100 dark:border-purple-900/50">
              <p className="leading-relaxed whitespace-pre-line">{summary}</p>
            </div>
          )}
          
          <Accordion type="single" collapsible className="w-full">
            {transportationArray.length > 0 && (
              <AccordionItem value="transportation" className="border-b-2 border-primary/10">
                <AccordionTrigger className="py-4 group">
                  <div className="flex items-center">
                    <div className="bg-gradient-to-r from-cyan-500 to-blue-500 p-1.5 rounded-full text-white mr-2">
                      <Bus className="h-5 w-5" />
                    </div>
                    <span className="group-hover:text-cyan-600 dark:group-hover:text-cyan-400">Transportation Options</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 pl-7">
                    {transportationArray.map((transport: any, index: number) => (
                      <div key={index} className="border-l-2 border-cyan-300 pl-4 py-2 bg-cyan-50/50 rounded-r-lg dark:bg-cyan-900/10 dark:border-cyan-800">
                        <div className="flex items-center gap-2">
                          {getTransportationIcon(transport.type || '')}
                          <p className="font-medium text-cyan-700 dark:text-cyan-300">{transport.type}</p>
                        </div>
                        
                        {transport.route && (
                          <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                            Route: {transport.route}
                          </p>
                        )}
                        
                        {transport.details && (
                          <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                            {transport.details}
                          </p>
                        )}
                        
                        {transport.cost && (
                          <p className="text-sm font-medium mt-1 text-emerald-600 dark:text-emerald-400">
                            Cost: {formatCurrency(parseInt(transport.cost.toString().replace(/[^\d]/g, '') || '0'))}
                          </p>
                        )}
                        
                        {transport.costPerDay && (
                          <p className="text-sm font-medium mt-1 text-emerald-600 dark:text-emerald-400">
                            Cost per day: {formatCurrency(parseInt(transport.costPerDay.toString().replace(/[^\d]/g, '') || '0'))}
                          </p>
                        )}
                        
                        {transport.totalCost && (
                          <p className="text-sm font-medium mt-1 text-emerald-600 dark:text-emerald-400">
                            Total cost: {formatCurrency(parseInt(transport.totalCost.toString().replace(/[^\d]/g, '') || '0'))}
                          </p>
                        )}
                        
                        {transport.route && (
                          <NavigationButton location={transport.route} />
                        )}
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}

            {activitiesArray.length > 0 && (
              <AccordionItem value="activities" className="border-b-2 border-primary/10">
                <AccordionTrigger className="py-4 group">
                  <div className="flex items-center">
                    <div className="bg-gradient-to-r from-pink-500 to-rose-500 p-1.5 rounded-full text-white mr-2">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <span className="group-hover:text-pink-600 dark:group-hover:text-pink-400">Fun Activities</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 pl-7">
                    {activitiesArray.map((activity: any, index: number) => {
                      const activityName = typeof activity === 'string' ? activity : (activity.name || '');
                      return (
                        <div key={index} className="border-l-2 border-pink-300 pl-4 py-2 bg-pink-50/50 rounded-r-lg dark:bg-pink-900/10 dark:border-pink-800">
                          <p className="font-medium text-pink-700 dark:text-pink-300">{activityName}</p>
                          {activity.description && (
                            <p className="text-sm text-slate-600 dark:text-slate-300">{activity.description}</p>
                          )}
                          {activity.cost && (
                            <p className="text-sm font-medium mt-1 text-emerald-600 dark:text-emerald-400">
                              Cost: {formatCurrency(parseInt((activity.cost || '0').toString().replace(/[^\d]/g, '') || '0'))}
                            </p>
                          )}
                          <NavigationButton location={activityName} />
                        </div>
                      );
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}

            {(!activitiesArray.length && attractionsArray.length > 0) && (
              <AccordionItem value="fun-activities" className="border-b-2 border-primary/10">
                <AccordionTrigger className="py-4 group">
                  <div className="flex items-center">
                    <div className="bg-gradient-to-r from-pink-500 to-rose-500 p-1.5 rounded-full text-white mr-2">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <span className="group-hover:text-pink-600 dark:group-hover:text-pink-400">Fun Activities</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 pl-7">
                    {attractionsArray
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
                        <div key={index} className="border-l-2 border-pink-300 pl-4 py-2 bg-pink-50/50 rounded-r-lg dark:bg-pink-900/10 dark:border-pink-800">
                          <p className="font-medium text-pink-700 dark:text-pink-300">{activity.name}</p>
                          {activity.description && (
                            <p className="text-sm text-slate-600 dark:text-slate-300">{activity.description}</p>
                          )}
                          {activity.estimatedCost && (
                            <p className="text-sm font-medium mt-1 text-emerald-600 dark:text-emerald-400">
                              Cost: {formatCurrency(Number(activity.estimatedCost || 0))}
                            </p>
                          )}
                          <NavigationButton location={activity.name} />
                        </div>
                      ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}
            
            {flightsArray.length > 0 && (
              <AccordionItem value="flights">
                <AccordionTrigger className="py-4 group">
                  <div className="flex items-center">
                    <div className="bg-gradient-to-r from-sky-500 to-blue-500 p-1.5 rounded-full text-white mr-2">
                      <Plane className="h-5 w-5" />
                    </div>
                    <span className="group-hover:text-sky-600 dark:group-hover:text-sky-400">Flights</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pl-7">
                    <div className="mb-3">
                      <Button 
                        className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
                        onClick={() => setIsFlightDialogOpen(true)}
                      >
                        <Search className="h-4 w-4 mr-2" />
                        Find Flights Within Your Budget
                      </Button>
                    </div>
                    
                    {flightsArray.map((flight: any, index: number) => (
                      <div key={index} className="border-l-2 border-sky-300 pl-4 py-2 bg-sky-50/50 rounded-r-lg dark:bg-sky-900/10 dark:border-sky-800">
                        <p className="font-medium text-sky-700 dark:text-sky-300">{flight.airline || 'Flight Option ' + (index + 1)}</p>
                        {flight.departure && flight.arrival && (
                          <p className="text-sm text-slate-600 dark:text-slate-300">
                            {flight.departure} to {flight.arrival}
                          </p>
                        )}
                        {flight.price && (
                          <p className="text-sm font-medium mt-1 text-emerald-600 dark:text-emerald-400">
                            Price: {formatCurrency(parseInt((flight.price || '0').toString().replace(/[^\d]/g, '') || '0'))}
                          </p>
                        )}
                        {flight.departure && flight.arrival && (
                          <div className="flex gap-2 mt-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-xs h-7 px-2 bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-100 dark:bg-sky-900/30 dark:text-sky-300 dark:border-sky-800"
                              onClick={() => {
                                const url = `https://www.google.com/flights?q=flights+from+${getLocationQueryParam(flight.departure)}+to+${getLocationQueryParam(flight.arrival)}&currency=INR`;
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
            
            {accommodationsArray.length > 0 && (
              <AccordionItem value="accommodations">
                <AccordionTrigger className="py-4 group">
                  <div className="flex items-center">
                    <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-1.5 rounded-full text-white mr-2">
                      <Building2 className="h-5 w-5" />
                    </div>
                    <span className="group-hover:text-amber-600 dark:group-hover:text-amber-400">Accommodations</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pl-7">
                    {accommodationsArray.map((accommodation: any, index: number) => (
                      <div key={index} className="border-l-2 border-amber-300 pl-4 py-2 bg-amber-50/50 rounded-r-lg dark:bg-amber-900/10 dark:border-amber-800">
                        <p className="font-medium text-amber-700 dark:text-amber-300">{accommodation.name}</p>
                        {accommodation.location && (
                          <p className="text-sm text-slate-600 dark:text-slate-300">{accommodation.location}</p>
                        )}
                        {(accommodation.pricePerNight || accommodation.totalCost) && (
                          <p className="text-sm font-medium mt-1 text-emerald-600 dark:text-emerald-400">
                            {accommodation.pricePerNight && `Price per night: ${formatCurrency(parseInt((accommodation.pricePerNight || '0').toString().replace(/[^\d]/g, '') || '0'))}`}
                            {accommodation.pricePerNight && accommodation.totalCost && ' | '}
                            {accommodation.totalCost && `Total: ${formatCurrency(parseInt((accommodation.totalCost || '0').toString().replace(/[^\d]/g, '') || '0'))}`}
                          </p>
                        )}
                        <NavigationButton location={accommodation.location || accommodation.name} />
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}
            
            {attractionsArray.length > 0 && (
              <AccordionItem value="attractions">
                <AccordionTrigger className="py-4 group">
                  <div className="flex items-center">
                    <div className="bg-gradient-to-r from-emerald-500 to-green-500 p-1.5 rounded-full text-white mr-2">
                      <Map className="h-5 w-5" />
                    </div>
                    <span className="group-hover:text-emerald-600 dark:group-hover:text-emerald-400">Attractions</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pl-7">
                    {attractionsArray.map((attraction: any, index: number) => (
                      <div key={index} className="border-l-2 border-emerald-300 pl-4 py-2 bg-emerald-50/50 rounded-r-lg dark:bg-emerald-900/10 dark:border-emerald-800">
                        <p className="font-medium text-emerald-700 dark:text-emerald-300">{attraction.name}</p>
                        {attraction.description && (
                          <p className="text-sm text-slate-600 dark:text-slate-300">{attraction.description}</p>
                        )}
                        {attraction.estimatedCost && (
                          <p className="text-sm font-medium mt-1 text-emerald-600 dark:text-emerald-400">
                            Estimated cost: {formatCurrency(parseInt((attraction.estimatedCost || '0').toString().replace(/[^\d]/g, '') || '0'))}
                          </p>
                        )}
                        <NavigationButton location={attraction.name} />
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}
            
            {restaurantsArray.length > 0 && (
              <AccordionItem value="restaurants">
                <AccordionTrigger className="py-4 group">
                  <div className="flex items-center">
                    <div className="bg-gradient-to-r from-rose-500 to-red-500 p-1.5 rounded-full text-white mr-2">
                      <Utensils className="h-5 w-5" />
                    </div>
                    <span className="group-hover:text-rose-600 dark:group-hover:text-rose-400">Restaurants</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pl-7">
                    {restaurantsArray.map((restaurant: any, index: number) => (
                      <div key={index} className="border-l-2 border-rose-300 pl-4 py-2 bg-rose-50/50 rounded-r-lg dark:bg-rose-900/10 dark:border-rose-800">
                        <p className="font-medium text-rose-700 dark:text-rose-300">{restaurant.name}</p>
                        {restaurant.cuisine && (
                          <p className="text-sm text-slate-600 dark:text-slate-300">Cuisine: {restaurant.cuisine}</p>
                        )}
                        {restaurant.priceRange && (
                          <p className="text-sm font-medium mt-1 text-emerald-600 dark:text-emerald-400">
                            Price Range: {restaurant.priceRange.replace(/\$/g, '₹')}
                          </p>
                        )}
                        <NavigationButton location={restaurant.name} />
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}
            
            {itineraryArray.length > 0 && (
              <AccordionItem value="itinerary">
                <AccordionTrigger className="py-4 group">
                  <div className="flex items-center">
                    <div className="bg-gradient-to-r from-indigo-500 to-violet-500 p-1.5 rounded-full text-white mr-2">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <span className="group-hover:text-indigo-600 dark:group-hover:text-indigo-400">Itinerary</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-6 pl-7">
                    {itineraryArray.map((day: any, index: number) => (
                      <div key={index} className="border-l-2 border-indigo-300 pl-4 py-2 bg-indigo-50/50 rounded-r-lg dark:bg-indigo-900/10 dark:border-indigo-800">
                        <p className="font-medium text-indigo-700 dark:text-indigo-300">Day {day.day}</p>
                        
                        {Array.isArray(day.activities) && day.activities.length > 0 && (
                          <div className="mt-2">
                            <p className="text-sm font-medium text-slate-700 dark:text-slate-200">Activities:</p>
                            <ul className="list-disc list-inside space-y-1 ml-2">
                              {day.activities.map((activity: any, actIndex: number) => {
                                const activityText = typeof activity === 'string' ? activity : JSON.stringify(activity);
                                return (
                                  <li key={actIndex} className="text-sm text-slate-600 dark:text-slate-300">
                                    {activityText}
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      className="ml-
