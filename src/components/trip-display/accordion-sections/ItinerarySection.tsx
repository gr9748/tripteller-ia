
import React from 'react';
import { Calendar } from 'lucide-react';
import { AccordionSection } from './AccordionSection';

interface ItinerarySectionProps {
  itineraryArray: any[];
}

export const ItinerarySection: React.FC<ItinerarySectionProps> = ({ itineraryArray }) => {
  if (itineraryArray.length === 0) return null;
  
  return (
    <AccordionSection
      value="itinerary"
      icon={Calendar}
      title="Itinerary"
      gradientFrom="indigo-500"
      gradientTo="violet-500"
      hoverColor="indigo-600"
      darkHoverColor="indigo-400"
    >
      <div className="space-y-6 pl-7">
        {itineraryArray.map((day: any, index: number) => (
          <div key={index} className="border-l-2 border-indigo-300 pl-4 py-2 bg-indigo-50/50 rounded-r-lg dark:bg-indigo-900/10 dark:border-indigo-800">
            <p className="font-medium text-indigo-700 dark:text-indigo-300">Day {day.day}</p>
            
            {Array.isArray(day.activities) && day.activities.length > 0 && (
              <div className="mt-2">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-200">Activities:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  {day.activities.map((activity: any, actIndex: number) => {
                    const activityText = typeof activity === 'string' ? activity : (
                      typeof activity === 'object' ? JSON.stringify(activity) : String(activity)
                    );
                    return (
                      <li key={actIndex} className="text-sm text-slate-600 dark:text-slate-300">
                        {activityText}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </AccordionSection>
  );
};
