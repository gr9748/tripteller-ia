
import React from 'react';
import { MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getLocationQueryParam } from '@/lib/utils';

interface NavigationButtonProps {
  location: string;
}

export const NavigationButton: React.FC<NavigationButtonProps> = ({ location }) => {
  if (!location) return null;
  
  const handleNavigate = () => {
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${getLocationQueryParam(location)}`;
    window.open(googleMapsUrl, '_blank');
  };
  
  return (
    <Button 
      variant="outline" 
      size="sm" 
      className="mt-2 text-xs h-7 px-2 bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800"
      onClick={handleNavigate}
    >
      <MapPin className="h-3 w-3 mr-1" />
      Navigate
    </Button>
  );
};
