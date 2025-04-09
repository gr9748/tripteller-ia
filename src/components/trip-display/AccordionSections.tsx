
import React from 'react';
import { Accordion } from '@/components/ui/accordion';
import { TransportationSection } from './accordion-sections/TransportationSection';
import { ActivitiesSection } from './accordion-sections/ActivitiesSection';
import { FlightsSection } from './accordion-sections/FlightsSection';
import { AccommodationsSection } from './accordion-sections/AccommodationsSection';
import { AttractionsSection } from './accordion-sections/AttractionsSection';
import { RestaurantsSection } from './accordion-sections/RestaurantsSection';
import { ItinerarySection } from './accordion-sections/ItinerarySection';

interface AccordionSectionsProps {
  transportationArray: any[];
  activitiesArray: any[];
  attractionsArray: any[];
  flightsArray: any[];
  accommodationsArray: any[];
  restaurantsArray: any[];
  itineraryArray: any[];
  onOpenFlightDialog: () => void;
}

export const AccordionSections: React.FC<AccordionSectionsProps> = ({
  transportationArray,
  activitiesArray,
  attractionsArray,
  flightsArray,
  accommodationsArray,
  restaurantsArray,
  itineraryArray,
  onOpenFlightDialog
}) => {
  return (
    <Accordion type="single" collapsible className="w-full">
      <TransportationSection transportationArray={transportationArray} />
      
      <ActivitiesSection 
        activitiesArray={activitiesArray} 
        attractionsArray={attractionsArray} 
      />
      
      <FlightsSection 
        flightsArray={flightsArray} 
        onOpenFlightDialog={onOpenFlightDialog} 
      />
      
      <AccommodationsSection accommodationsArray={accommodationsArray} />
      
      <AttractionsSection attractionsArray={attractionsArray} />
      
      <RestaurantsSection restaurantsArray={restaurantsArray} />
      
      <ItinerarySection itineraryArray={itineraryArray} />
    </Accordion>
  );
};
