
import React from 'react';
import { Plane, Search, ExternalLink, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AccordionSection } from './AccordionSection';
import { formatCurrency } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

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
        <div className="mb-3">
          <Button 
            className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
            onClick={onOpenFlightDialog}
          >
            <Search className="h-4 w-4 mr-2" />
            Find Flights Within Your Budget
          </Button>
        </div>
        
        {flightsArray.map((flight: any, index: number) => (
          <div key={index} className="border-l-2 border-sky-300 pl-4 py-3 bg-sky-50/50 rounded-r-lg dark:bg-sky-900/10 dark:border-sky-800 hover:bg-sky-100/70 dark:hover:bg-sky-900/20 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <p className="font-medium text-sky-700 dark:text-sky-300 flex items-center">
                {flight.airline || 'Flight Option ' + (index + 1)}
                {flight.flightNumber && <Badge variant="outline" className="ml-2 text-xs">{flight.flightNumber}</Badge>}
              </p>
              {flight.duration && (
                <span className="text-xs text-slate-500 dark:text-slate-400">{flight.duration}</span>
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
                </div>
                <div className="flex items-center justify-center px-2">
                  <div className="w-14 h-[1px] bg-slate-300 relative">
                    <div className="absolute -top-1.5 right-0 text-slate-400">
                      <Plane className="h-3 w-3" />
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
                </div>
              </div>
            )}
            
            {flight.price && (
              <p className="text-sm font-medium mt-2 text-emerald-600 dark:text-emerald-400">
                Price: {formatCurrency(parseInt((flight.price || '0').toString().replace(/[^\d]/g, '') || '0'))}
              </p>
            )}
            
            <div className="flex gap-2 mt-3">
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs h-7 px-2 bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-100 dark:bg-sky-900/30 dark:text-sky-300 dark:border-sky-800"
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
            </div>
          </div>
        ))}
      </div>
    </AccordionSection>
  );
};
