
import React, { useState, useEffect } from 'react';
import { Navigation, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { getLocationQueryParam } from '@/lib/utils';

interface LiveLocationButtonProps {
  destination: string;
}

export const LiveLocationButton: React.FC<LiveLocationButtonProps> = ({ destination }) => {
  const [isTracking, setIsTracking] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<GeolocationPosition | null>(null);
  
  const toggleLocationTracking = () => {
    if (!isTracking) {
      if ('geolocation' in navigator) {
        toast.info('Starting location tracking...');
        
        const watchId = navigator.geolocation.watchPosition(
          (position) => {
            setCurrentLocation(position);
            setIsTracking(true);
            toast.success('Location tracked successfully');
          },
          (error) => {
            console.error('Error tracking location:', error);
            toast.error(`Location tracking failed: ${error.message}`);
            setIsTracking(false);
          },
          { enableHighAccuracy: true }
        );
        
        localStorage.setItem('locationWatchId', watchId.toString());
      } else {
        toast.error('Geolocation is not supported by your browser');
      }
    } else {
      const watchId = localStorage.getItem('locationWatchId');
      if (watchId) {
        navigator.geolocation.clearWatch(parseInt(watchId));
        localStorage.removeItem('locationWatchId');
      }
      
      setIsTracking(false);
      toast.info('Location tracking stopped');
    }
  };
  
  const navigateFromCurrentLocation = (destination: string) => {
    if (!currentLocation) {
      toast.error('Current location not available. Please enable location tracking first.');
      return;
    }
    
    const { latitude, longitude } = currentLocation.coords;
    const googleMapsUrl = `https://www.google.com/maps/dir/${latitude},${longitude}/${getLocationQueryParam(destination)}`;
    window.open(googleMapsUrl, '_blank');
  };
  
  useEffect(() => {
    const watchId = localStorage.getItem('locationWatchId');
    if (watchId) {
      setIsTracking(true);
    }
    
    return () => {
      const storedWatchId = localStorage.getItem('locationWatchId');
      if (storedWatchId) {
        navigator.geolocation.clearWatch(parseInt(storedWatchId));
      }
    };
  }, []);
  
  return (
    <div className="space-y-2">
      <div className="flex flex-col sm:flex-row gap-2">
        <Button 
          variant={isTracking ? "destructive" : "default"}
          size="sm"
          onClick={toggleLocationTracking}
          className={`flex-1 ${!isTracking ? 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700' : ''}`}
        >
          <Navigation className="h-4 w-4 mr-2" />
          {isTracking ? 'Stop Tracking Location' : 'Start Tracking Location'}
        </Button>
        
        {isTracking && currentLocation && (
          <Button
            variant="default"
            size="sm"
            className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            onClick={() => navigateFromCurrentLocation(destination)}
          >
            <MapPin className="h-4 w-4 mr-2" />
            Navigate to Destination
          </Button>
        )}
      </div>
      
      {currentLocation && (
        <div className="text-xs text-muted-foreground bg-slate-50 p-2 rounded-md border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
          <p>Current coordinates: {currentLocation.coords.latitude.toFixed(5)}, {currentLocation.coords.longitude.toFixed(5)}</p>
          <p>Accuracy: ±{currentLocation.coords.accuracy.toFixed(1)}m</p>
        </div>
      )}
    </div>
  );
};
