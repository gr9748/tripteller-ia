import React from 'react';
import { Plane, Building2, Map, Utensils, Calendar, MapPin, Sparkles, Search } from 'lucide-react';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import { NavigationButton } from './NavigationButton';
import { getTransportationIcon } from './TransportationIcons';

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
      {transportationArray.length > 0 && (
        <AccordionItem value="transportation" className="border-b-2 border-primary/10">
          <AccordionTrigger className="py-4 group">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-cyan-500 to-blue-500 p-1.5 rounded-full text-white mr-2">
                <Utensils className="h-5 w-5" />
              </div>
              <span className="group-hover:text-cyan-600 dark:group-hover:text-cyan-400">Transportation Options</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
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
          </AccordionContent>
        </AccordionItem>
      )}

      {activitiesArray.length > 0 && (
        <AccordionItem value="activities" className="border-b-2 border-primary/10">
          <AccordionTrigger className="py-4 group">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-pink-500 to-rose-500 p-1.5 rounded-full text-white mr-2">
                <Sparkles className="h-5 w-5" />
              </div>
              <span className="group-hover:text-pink-600 dark:group-hover:text-pink-400">Fun Activities</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
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
          </AccordionContent>
        </AccordionItem>
      )}

      {(!activitiesArray.length && attractionsArray.length > 0) && (
        <AccordionItem value="fun-activities" className="border-b-2 border-primary/10">
          <AccordionTrigger className="py-4 group">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-pink-500 to-rose-500 p-1.5 rounded-full text-white mr-2">
                <Sparkles className="h-5 w-5" />
              </div>
              <span className="group-hover:text-pink-600 dark:group-hover:text-pink-400">Fun Activities</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pl-7">
              {attractionsArray
                .filter((attraction: any) => 
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
                )
                .map((activity: any, index: number) => (
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
          </AccordionContent>
        </AccordionItem>
      )}
      
      {flightsArray.length > 0 && (
        <AccordionItem value="flights">
          <AccordionTrigger className="py-4 group">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-sky-500 to-blue-500 p-1.5 rounded-full text-white mr-2">
                <Plane className="h-5 w-5" />
              </div>
              <span className="group-hover:text-sky-600 dark:group-hover:text-sky-400">Flights</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
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
          </AccordionContent>
        </AccordionItem>
      )}
      
      {accommodationsArray.length > 0 && (
        <AccordionItem value="accommodations">
          <AccordionTrigger className="py-4 group">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-1.5 rounded-full text-white mr-2">
                <Building2 className="h-5 w-5" />
              </div>
              <span className="group-hover:text-amber-600 dark:group-hover:text-amber-400">Accommodations</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
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
          </AccordionContent>
        </AccordionItem>
      )}
      
      {attractionsArray.length > 0 && (
        <AccordionItem value="attractions">
          <AccordionTrigger className="py-4 group">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-emerald-500 to-green-500 p-1.5 rounded-full text-white mr-2">
                <Map className="h-5 w-5" />
              </div>
              <span className="group-hover:text-emerald-600 dark:group-hover:text-emerald-400">Attractions</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
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
          </AccordionContent>
        </AccordionItem>
      )}
      
      {restaurantsArray.length > 0 && (
        <AccordionItem value="restaurants">
          <AccordionTrigger className="py-4 group">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-rose-500 to-red-500 p-1.5 rounded-full text-white mr-2">
                <Utensils className="h-5 w-5" />
              </div>
              <span className="group-hover:text-rose-600 dark:group-hover:text-rose-400">Restaurants</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
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
          </AccordionContent>
        </AccordionItem>
      )}
      
      {itineraryArray.length > 0 && (
        <AccordionItem value="itinerary">
          <AccordionTrigger className="py-4 group">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-indigo-500 to-violet-500 p-1.5 rounded-full text-white mr-2">
                <Calendar className="h-5 w-5" />
              </div>
              <span className="group-hover:text-indigo-600 dark:group-hover:text-indigo-400">Itinerary</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
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
          </AccordionContent>
        </AccordionItem>
      )}
    </Accordion>
  );
};
