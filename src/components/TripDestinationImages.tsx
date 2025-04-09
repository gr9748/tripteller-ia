
import React, { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

interface TripDestinationImagesProps {
  destination: string;
}

export const TripDestinationImages: React.FC<TripDestinationImagesProps> = ({ destination }) => {
  const [loading, setLoading] = useState(true);
  
  // Example image URLs for popular destinations
  const getDestinationImages = (destination: string): string[] => {
    const destinationLower = destination.toLowerCase();
    
    // Return preset images based on popular destinations
    // In a real app, you would fetch these from an API like Unsplash or Google Places
    if (destinationLower.includes('paris') || destinationLower.includes('france')) {
      return [
        'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1000', // Eiffel Tower
        'https://images.unsplash.com/photo-1522093007474-d86e9bf7ba6f?q=80&w=1000', // Louvre
        'https://images.unsplash.com/photo-1546332215-2e2df697bce7?q=80&w=1000'  // Seine River
      ];
    } 
    else if (destinationLower.includes('rome') || destinationLower.includes('italy')) {
      return [
        'https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=1000', // Colosseum
        'https://images.unsplash.com/photo-1529154036614-a60975f5c760?q=80&w=1000', // Vatican
        'https://images.unsplash.com/photo-1525874684015-58379d421a52?q=80&w=1000'  // Trevi Fountain
      ];
    }
    else if (destinationLower.includes('new york') || destinationLower.includes('nyc')) {
      return [
        'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=1000', // Manhattan skyline
        'https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?q=80&w=1000', // Times Square
        'https://images.unsplash.com/photo-1568515387631-8b650bbcdb90?q=80&w=1000'  // Central Park
      ];
    }
    else if (destinationLower.includes('tokyo') || destinationLower.includes('japan')) {
      return [
        'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?q=80&w=1000', // Tokyo skyline
        'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=1000', // Temple
        'https://images.unsplash.com/photo-1554797589-7241bb691973?q=80&w=1000'  // Cherry blossoms
      ];
    }
    else if (destinationLower.includes('london') || destinationLower.includes('uk')) {
      return [
        'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=1000', // Big Ben
        'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?q=80&w=1000', // London Eye
        'https://images.unsplash.com/photo-1505761671935-60b3a7427bad?q=80&w=1000'  // London Bridge
      ];
    }
    else if (destinationLower.includes('sydney') || destinationLower.includes('australia')) {
      return [
        'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?q=80&w=1000', // Sydney Opera House
        'https://images.unsplash.com/photo-1506244856291-8910ea843e81?q=80&w=1000', // Sydney Harbour Bridge
        'https://images.unsplash.com/photo-1555400038-63f5ba517a47?q=80&w=1000'  // Bondi Beach
      ];
    }
    
    // Default images for any other destination
    return [
      'https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1000', // Generic travel image 1
      'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=1000', // Generic travel image 2
      'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1000'  // Generic travel image 3
    ];
  };

  const images = getDestinationImages(destination);
  
  useEffect(() => {
    // Simulate loading images
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [destination]);

  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium mb-2 text-blue-600 dark:text-blue-400">
        Destination Highlights
      </h3>
      <ScrollArea className="w-full whitespace-nowrap pb-4">
        <div className="flex gap-4">
          {loading ? (
            // Loading skeletons
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="w-[250px] shrink-0">
                <AspectRatio ratio={16 / 9}>
                  <Skeleton className="h-full w-full rounded-md" />
                </AspectRatio>
              </div>
            ))
          ) : (
            // Actual images
            images.map((image, index) => (
              <div key={index} className="w-[250px] shrink-0 overflow-hidden rounded-md">
                <AspectRatio ratio={16 / 9}>
                  <img 
                    src={image} 
                    alt={`${destination} highlight ${index + 1}`} 
                    className="object-cover h-full w-full transition-transform duration-300 hover:scale-105"
                  />
                </AspectRatio>
              </div>
            ))
          )}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};
