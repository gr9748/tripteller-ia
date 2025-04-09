
import React from 'react';
import { Building2 } from 'lucide-react';
import { AccordionSection } from './AccordionSection';
import { NavigationButton } from '../NavigationButton';
import { formatCurrency } from '@/lib/utils';

interface AccommodationsSectionProps {
  accommodationsArray: any[];
}

export const AccommodationsSection: React.FC<AccommodationsSectionProps> = ({ accommodationsArray }) => {
  if (accommodationsArray.length === 0) return null;
  
  return (
    <AccordionSection
      value="accommodations"
      icon={Building2}
      title="Accommodations"
      gradientFrom="amber-500"
      gradientTo="orange-500"
      hoverColor="amber-600"
      darkHoverColor="amber-400"
    >
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
    </AccordionSection>
  );
};
