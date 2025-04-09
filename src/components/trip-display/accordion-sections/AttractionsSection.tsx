
import React from 'react';
import { Map } from 'lucide-react';
import { AccordionSection } from './AccordionSection';
import { NavigationButton } from '../NavigationButton';
import { formatCurrency } from '@/lib/utils';

interface AttractionsSectionProps {
  attractionsArray: any[];
}

export const AttractionsSection: React.FC<AttractionsSectionProps> = ({ attractionsArray }) => {
  if (attractionsArray.length === 0) return null;
  
  return (
    <AccordionSection
      value="attractions"
      icon={Map}
      title="Attractions"
      gradientFrom="emerald-500"
      gradientTo="green-500"
      hoverColor="emerald-600"
      darkHoverColor="emerald-400"
    >
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
    </AccordionSection>
  );
};
