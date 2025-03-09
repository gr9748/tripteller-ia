
import React from 'react';
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface TripFormDatesProps {
  startDate: string;
  endDate: string;
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

export const TripFormDates: React.FC<TripFormDatesProps> = ({
  startDate,
  endDate,
  handleChange
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <motion.div variants={inputVariants} className="space-y-2">
        <Label htmlFor="startDate" className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Start Date
        </Label>
        <Input
          id="startDate"
          name="startDate"
          type="date"
          value={startDate}
          onChange={handleChange}
          required
        />
      </motion.div>
      
      <motion.div variants={inputVariants} className="space-y-2">
        <Label htmlFor="endDate" className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          End Date
        </Label>
        <Input
          id="endDate"
          name="endDate"
          type="date"
          value={endDate}
          onChange={handleChange}
          required
        />
      </motion.div>
    </div>
  );
};
