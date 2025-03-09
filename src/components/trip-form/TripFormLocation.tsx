
import React from 'react';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface TripFormLocationProps {
  source: string;
  destination: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const inputVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.3 }
  }
};

export const TripFormLocation: React.FC<TripFormLocationProps> = ({
  source,
  destination,
  handleChange
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <motion.div variants={inputVariants} className="space-y-2">
        <Label htmlFor="source" className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          Source Location
        </Label>
        <Input
          id="source"
          name="source"
          value={source}
          onChange={handleChange}
          placeholder="Where are you traveling from?"
          required
        />
      </motion.div>
      
      <motion.div variants={inputVariants} className="space-y-2">
        <Label htmlFor="destination" className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          Destination
        </Label>
        <Input
          id="destination"
          name="destination"
          value={destination}
          onChange={handleChange}
          placeholder="Where do you want to go?"
          required
        />
      </motion.div>
    </div>
  );
};
