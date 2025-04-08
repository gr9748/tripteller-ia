
import React from 'react';
import { Plane, Train, Bus, Car, Ship, Footprints, Truck } from 'lucide-react';

export const transportationIcons: Record<string, React.ReactNode> = {
  'flight': <Plane className="h-4 w-4" />,
  'plane': <Plane className="h-4 w-4" />,
  'train': <Train className="h-4 w-4" />,
  'bus': <Bus className="h-4 w-4" />,
  'car': <Car className="h-4 w-4" />,
  'taxi': <Car className="h-4 w-4" />,
  'ferry': <Ship className="h-4 w-4" />,
  'ship': <Ship className="h-4 w-4" />,
  'boat': <Ship className="h-4 w-4" />,
  'walk': <Footprints className="h-4 w-4" />,
  'metro': <Train className="h-4 w-4" />,
  'tram': <Train className="h-4 w-4" />,
};

export const getTransportationIcon = (type: string): React.ReactNode => {
  const lowerType = type.toLowerCase();
  for (const [key, icon] of Object.entries(transportationIcons)) {
    if (lowerType.includes(key)) {
      return icon;
    }
  }
  return <Truck className="h-4 w-4" />;
};
