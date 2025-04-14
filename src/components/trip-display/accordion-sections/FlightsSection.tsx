
import React from 'react';
import { Plane, Search, ExternalLink, Calendar, Info, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AccordionSection } from './AccordionSection';
import { formatCurrency } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface FlightsSectionProps {
  flightsArray: any[];
  onOpenFlightDialog: () => void;
}

export const FlightsSection: React.FC<FlightsSectionProps> = ({ flightsArray, onOpenFlightDialog }) => {
  if (flightsArray.length === 0) return null;
  
  // Function to open flight booking websites
  const openFlightBooking = (flight: any) => {
    const departure = encodeURIComponent(flight.departure || '');
    const arrival = encodeURIComponent(flight.arrival || '');
    
    // Open in a new tab
    window.open(`https://www.skyscanner.co.in/transport/flights/${departure}/${arrival}/?adults=1&adultsv2=1`, '_blank');
  };

  // Function to open airline website directly
  const openAirlineWebsite = (airline: string) => {
    const airlineWebsites: Record<string, string> = {
      'Air India': 'https://www.airindia.com',
      'IndiGo': 'https://www.goindigo.in',
      'SpiceJet': 'https://www.spicejet.com',
      'Vistara': 'https://www.airvistara.com',
      'GoAir': 'https://www.flygofirst.com',
      'AirAsia': 'https://www.airasia.com',
      'Emirates': 'https://www.emirates.com',
      'Qatar Airways': 'https://www.qatarairways.com',
      'Lufthansa': 'https://www.lufthansa.com',
      'British Airways': 'https://www.britishairways.com',
      'Singapore Airlines': 'https://www.singaporeair.com',
      'Etihad Airways': 'https://www.etihad.com',
    };
    
    const website = airlineWebsites[airline] || `https://www.google.com/search?q=${encodeURIComponent(airline)} airline`;
    window.open(website, '_blank');
  };
  
  return (
    <AccordionSection
      value="flights"
      icon={Plane}
      title="Flights"
      gradientFrom="sky-500"
      gradientTo="blue-500"
      hoverColor="sky-600"
      darkHoverColor="sky-400"
    >
      <div className="space-y-4 pl-7">
        <div className="mb-3 flex gap-2 flex-wrap">
          <Button 
            className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
            onClick={onOpenFlightDialog}
          >
            <Search className="h-4 w-4 mr-2" />
            Find Flights Within Your Budget
          </Button>
          <Button 
            variant="outline" 
            className="text-blue-600 border-blue-200 bg-blue-50/50 hover:bg-blue-100/70 dark:text-blue-400 dark:border-blue-800 dark:bg-blue-900/20 dark:hover:bg-blue-900/30"
            onClick={() => window.open('https://www.google.com/travel/flights', '_blank')}
          >
            <Plane className="h-4 w-4 mr-2" />
            Browse All Flights
          </Button>
        </div>
        
        {flightsArray.map((flight: any, index: number) => (
          <div key={index} className="border-l-2 border-sky-300 pl-4 py-3 bg-sky-50/50 rounded-r-lg dark:bg-sky-900/10 dark:border-sky-800 hover:bg-sky-100/70 dark:hover:bg-sky-900/20 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <p className="font-medium text-sky-700 dark:text-sky-300 flex items-center">
                  {flight.airline || 'Flight Option ' + (index + 1)}
                </p>
                {flight.flightNumber && (
                  <Badge variant="outline" className="ml-2 text-xs">{flight.flightNumber}</Badge>
                )}
                {flight.airline && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => openAirlineWebsite(flight.airline)} 
                          className="h-6 w-6 rounded-full hover:bg-sky-100 dark:hover:bg-sky-900/30"
                        >
                          <Info className="h-3.5 w-3.5 text-sky-500" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Visit {flight.airline} Website</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
              {flight.duration && (
                <Badge variant="secondary" className="text-xs bg-sky-100 text-sky-700 dark:bg-sky-900 dark:text-sky-300 border-none">
                  {flight.duration}
                </Badge>
              )}
            </div>
            
            {flight.departure && flight.arrival && (
              <div className="grid grid-cols-[1fr_auto_1fr] gap-2 items-center my-2">
                <div className="text-sm">
                  <p className="font-medium">{flight.departure}</p>
                  {flight.departureTime && (
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> {flight.departureTime}
                    </p>
                  )}
                  {flight.departureAirport && (
                    <p className="text-xs text-slate-500">{flight.departureAirport}</p>
                  )}
                </div>
                <div className="flex items-center justify-center px-2">
                  <div className="w-14 h-[1px] bg-slate-300 relative">
                    <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 text-slate-400">
                      <ArrowRight className="h-3 w-3" />
                    </div>
                  </div>
                </div>
                <div className="text-sm">
                  <p className="font-medium">{flight.arrival}</p>
                  {flight.arrivalTime && (
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> {flight.arrivalTime}
                    </p>
                  )}
                  {flight.arrivalAirport && (
                    <p className="text-xs text-slate-500">{flight.arrivalAirport}</p>
                  )}
                </div>
              </div>
            )}
            
            <div className="mt-2 flex flex-wrap gap-2 items-center">
              {flight.price && (
                <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded">
                  Price: {formatCurrency(parseInt((flight.price || '0').toString().replace(/[^\d]/g, '') || '0'))}
                </p>
              )}
              
              {flight.class && (
                <Badge variant="outline" className="text-xs bg-blue-50 dark:bg-blue-900/20">
                  {flight.class} Class
                </Badge>
              )}
              
              {flight.stops !== undefined && (
                <Badge variant="outline" className={`text-xs ${flight.stops === 0 ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400' : 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400'}`}>
                  {flight.stops === 0 ? 'Non-stop' : `${flight.stops} ${flight.stops === 1 ? 'Stop' : 'Stops'}`}
                </Badge>
              )}
            </div>
            
            <div className="flex gap-2 mt-3">
              <Button 
                variant="default" 
                size="sm" 
                className="text-xs h-7 bg-sky-600 hover:bg-sky-700 text-white"
                onClick={() => openFlightBooking(flight)}
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                Book Now
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs h-7 px-2 bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-100 dark:bg-sky-900/30 dark:text-sky-300 dark:border-sky-800"
                onClick={() => {
                  const url = `https://www.google.com/flights?q=flights+from+${encodeURIComponent(flight.departure)}+to+${encodeURIComponent(flight.arrival)}&currency=INR`;
                  window.open(url, '_blank');
                }}
              >
                <Search className="h-3 w-3 mr-1" />
                Compare Prices
              </Button>
              {flight.airline && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-xs h-7 px-2 bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-100 dark:bg-sky-900/30 dark:text-sky-300 dark:border-sky-800"
                  onClick={() => openAirlineWebsite(flight.airline)}
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Visit Airline
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </AccordionSection>
  );
};
