
import React from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTripFormState } from '@/hooks/useTripFormState';
import { useTripFormSubmit } from '@/hooks/useTripFormSubmit';
import { TripFormLocation } from './trip-form/TripFormLocation';
import { TripFormDates } from './trip-form/TripFormDates';
import { TripFormDetails } from './trip-form/TripFormDetails';
import { TripFormSubmit } from './trip-form/TripFormSubmit';

const TripPlanForm: React.FC = () => {
  const { formData, handleChange, resetForm, validateForm } = useTripFormState();
  const { isSubmitting, submitTripPlan } = useTripFormSubmit(resetForm);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    await submitTripPlan(formData);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-2xl mx-auto"
    >
      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Plan Your Perfect Trip
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <TripFormLocation 
              source={formData.source}
              destination={formData.destination}
              handleChange={handleChange}
            />
            
            <TripFormDates
              startDate={formData.startDate}
              endDate={formData.endDate}
              handleChange={handleChange}
            />
            
            <TripFormDetails
              budget={formData.budget}
              travelers={formData.travelers}
              interests={formData.interests}
              handleChange={handleChange}
            />
            
            <TripFormSubmit isSubmitting={isSubmitting} />
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TripPlanForm;
