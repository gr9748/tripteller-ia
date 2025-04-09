
import React from 'react';
import { Utensils } from 'lucide-react';
import { AccordionSection } from './AccordionSection';
import { NavigationButton } from '../NavigationButton';

interface RestaurantsSectionProps {
  restaurantsArray: any[];
}

export const RestaurantsSection: React.FC<RestaurantsSectionProps> = ({ restaurantsArray }) => {
  if (restaurantsArray.length === 0) return null;
  
  return (
    <AccordionSection
      value="restaurants"
      icon={Utensils}
      title="Restaurants"
      gradientFrom="rose-500"
      gradientTo="red-500"
      hoverColor="rose-600"
      darkHoverColor="rose-400"
    >
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
    </AccordionSection>
  );
};
