
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Calendar, MapPin, Users } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface TripPlan {
  id: string;
  source: string;
  destination: string;
  start_date: string;
  end_date: string;
  budget: number;
  travelers: number;
  created_at: string;
  ai_response?: any;
}

interface PlanDialogProps {
  plan: TripPlan | null;
  onClose: () => void;
}

const PlanDialog: React.FC<PlanDialogProps> = ({ plan, onClose }) => {
  if (!plan) return null;

  const formatBudget = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const handleNavigate = () => {
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(plan.destination)}`;
    window.open(googleMapsUrl, '_blank');
  };

  const handleUsePlan = () => {
    // Here we'll just close the dialog as the plan is already selected
    // In a real implementation, you might want to navigate to the trip planner with this plan pre-filled
    onClose();
  };

  return (
    <Dialog open={!!plan} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-blue-700 dark:text-blue-400">
            {plan.source} to {plan.destination}
          </DialogTitle>
          <DialogDescription className="flex flex-wrap gap-3 text-sm mt-2">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4 text-blue-500" />
              <span>{formatDate(plan.start_date || '')} to {formatDate(plan.end_date || '')}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4 text-green-500" />
              <span>Budget: {formatBudget(plan.budget)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4 text-purple-500" />
              <span>Travelers: {plan.travelers}</span>
            </div>
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4">
          {plan.ai_response ? (
            <div className="space-y-4">
              {/* Summary section */}
              {plan.ai_response.summary && (
                <div className="bg-blue-50/50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <h3 className="font-medium mb-2 text-blue-700 dark:text-blue-300">Trip Summary</h3>
                  <p className="text-sm text-slate-700 dark:text-slate-300">{plan.ai_response.summary}</p>
                </div>
              )}
              
              {/* Flights */}
              {plan.ai_response.flights && plan.ai_response.flights.length > 0 && (
                <div className="bg-sky-50/50 dark:bg-sky-900/20 p-4 rounded-lg">
                  <h3 className="font-medium mb-2 text-sky-700 dark:text-sky-300">Recommended Flights</h3>
                  <div className="space-y-2">
                    {plan.ai_response.flights.slice(0, 3).map((flight: any, index: number) => (
                      <div key={index} className="text-sm p-2 border border-sky-100 dark:border-sky-800 rounded">
                        <div className="font-medium">{flight.airline || 'Flight Option ' + (index + 1)}</div>
                        {flight.departure && flight.arrival && (
                          <div className="text-slate-600 dark:text-slate-400">
                            {flight.departure} to {flight.arrival}
                          </div>
                        )}
                        {flight.price && (
                          <div className="text-green-600 dark:text-green-400 mt-1">
                            Price: {typeof flight.price === 'string' ? 
                              flight.price.replace(/\$(\d+)/g, '₹$1') : 
                              `₹${flight.price}`}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Accommodations */}
              {plan.ai_response.accommodations && plan.ai_response.accommodations.length > 0 && (
                <div className="bg-amber-50/50 dark:bg-amber-900/20 p-4 rounded-lg">
                  <h3 className="font-medium mb-2 text-amber-700 dark:text-amber-300">Recommended Stays</h3>
                  <div className="space-y-2">
                    {plan.ai_response.accommodations.slice(0, 3).map((accommodation: any, index: number) => (
                      <div key={index} className="text-sm p-2 border border-amber-100 dark:border-amber-800 rounded">
                        <div className="font-medium">{accommodation.name}</div>
                        {accommodation.location && (
                          <div className="text-slate-600 dark:text-slate-400">{accommodation.location}</div>
                        )}
                        {(accommodation.pricePerNight || accommodation.totalCost) && (
                          <div className="text-green-600 dark:text-green-400 mt-1">
                            {accommodation.pricePerNight && 
                              `Price per night: ${accommodation.pricePerNight.toString().replace(/\$/g, '₹')}`}
                            {accommodation.pricePerNight && accommodation.totalCost && ' | '}
                            {accommodation.totalCost && 
                              `Total: ${accommodation.totalCost.toString().replace(/\$/g, '₹')}`}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Action buttons */}
              <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button 
                  variant="default" 
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
                  onClick={handleUsePlan}
                >
                  Use This Plan Again
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleNavigate}
                >
                  View Destination on Map
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center p-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <p className="text-muted-foreground">No detailed plan information available.</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PlanDialog;
