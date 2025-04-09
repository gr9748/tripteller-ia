
import React from 'react';
import { Plane, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AccordionSection } from './AccordionSection';
import { formatCurrency } from '@/lib/utils';

interface FlightsSectionProps {
  flightsArray: any[];
  onOpenFlightDialog: () => void;
}

export const FlightsSection: React.FC<FlightsSectionProps> = ({ flightsArray, onOpenFlightDialog }) => {
  if (flightsArray.length === 0) return null;
  
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
                    const url = `https://www.google.com/flights?q=flights+from+${encodeURIComponent(flight.departure)}+to+${encodeURIComponent(flight.arrival)}&currency=INR`;
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
    </AccordionSection>
  );
};
