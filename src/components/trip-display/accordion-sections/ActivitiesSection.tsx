
import React from 'react';
import { Sparkles } from 'lucide-react';
import { AccordionSection } from './AccordionSection';
import { NavigationButton } from '../NavigationButton';
import { formatCurrency } from '@/lib/utils';

interface ActivitiesSectionProps {
  activitiesArray: any[];
  attractionsArray: any[];
}

export const ActivitiesSection: React.FC<ActivitiesSectionProps> = ({ activitiesArray, attractionsArray }) => {
  // If there are activities, display those directly
  if (activitiesArray.length > 0) {
    return (
      <AccordionSection
        value="activities"
        icon={Sparkles}
        title="Fun Activities"
        gradientFrom="pink-500"
        gradientTo="rose-500"
        hoverColor="pink-600"
        darkHoverColor="pink-400"
      >
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
      </AccordionSection>
    );
  }
  
  // If no activities but attractions are available, filter attractions for fun activities
  if (attractionsArray.length > 0) {
    const funActivities = attractionsArray.filter((attraction: any) => 
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
    );
    
    if (funActivities.length > 0) {
      return (
        <AccordionSection
          value="fun-activities"
          icon={Sparkles}
          title="Fun Activities"
          gradientFrom="pink-500"
          gradientTo="rose-500"
          hoverColor="pink-600"
          darkHoverColor="pink-400"
        >
          <div className="space-y-3 pl-7">
            {funActivities.map((activity: any, index: number) => (
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
        </AccordionSection>
      );
    }
  }
  
  return null;
};
