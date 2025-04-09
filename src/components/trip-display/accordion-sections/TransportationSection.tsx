
import React from 'react';
import { Utensils } from 'lucide-react';
import { AccordionSection } from './AccordionSection';
import { NavigationButton } from '../NavigationButton';
import { formatCurrency } from '@/lib/utils';
import { getTransportationIcon } from '../TransportationIcons';

interface TransportationSectionProps {
  transportationArray: any[];
}

export const TransportationSection: React.FC<TransportationSectionProps> = ({ transportationArray }) => {
  if (transportationArray.length === 0) return null;
  
  return (
    <AccordionSection
      value="transportation"
      icon={Utensils}
      title="Transportation Options"
      gradientFrom="cyan-500"
      gradientTo="blue-500"
      hoverColor="cyan-600"
      darkHoverColor="cyan-400"
    >
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
    </AccordionSection>
  );
};
