
import React from 'react';
import { motion } from 'framer-motion';
import { IndianRupee, Users, Heart } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface TripFormDetailsProps {
  budget: string;
  travelers: string;
  interests: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const inputVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.3 }
  }
};

export const TripFormDetails: React.FC<TripFormDetailsProps> = ({
  budget,
  travelers,
  interests,
  handleChange
}) => {
  // Function to handle budget input validation
  const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow non-negative numbers
    if (value === '' || (Number(value) >= 0)) {
      handleChange(e);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div variants={inputVariants} className="space-y-2">
          <Label htmlFor="budget" className="flex items-center gap-2">
            <IndianRupee className="h-4 w-4" />
            Budget (₹)
          </Label>
          <Input
            id="budget"
            name="budget"
            type="number"
            min="0"
            value={budget}
            onChange={handleBudgetChange}
            placeholder="Your total budget"
            required
            className="focus:border-green-500"
          />
          <p className="text-xs text-muted-foreground">Your trip plan will be optimized to fit within this budget</p>
        </motion.div>
        
        <motion.div variants={inputVariants} className="space-y-2">
          <Label htmlFor="travelers" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Number of Travelers
          </Label>
          <Input
            id="travelers"
            name="travelers"
            type="number"
            min="1"
            value={travelers}
            onChange={handleChange}
            required
          />
        </motion.div>
      </div>
      
      <motion.div variants={inputVariants} className="space-y-2">
        <Label htmlFor="interests" className="flex items-center gap-2">
          <Heart className="h-4 w-4" />
          Interests (Optional)
        </Label>
        <Textarea
          id="interests"
          name="interests"
          value={interests}
          onChange={handleChange}
          placeholder="What are you interested in? E.g., museums, hiking, food, nightlife"
          rows={3}
        />
      </motion.div>
    </>
  );
};
