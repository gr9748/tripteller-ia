
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTripFormState } from '@/hooks/useTripFormState';
import { useTripFormSubmit } from '@/hooks/useTripFormSubmit';
import { TripFormLocation } from './trip-form/TripFormLocation';
import { TripFormDates } from './trip-form/TripFormDates';
import { TripFormDetails } from './trip-form/TripFormDetails';
import { TripFormSubmit } from './trip-form/TripFormSubmit';
import TripPlanDisplay from './TripPlanDisplay';

const TripPlanForm: React.FC = () => {
  const { formData, handleChange, resetForm, validateForm } = useTripFormState();
  const { isSubmitting, submitTripPlan, generatedTripPlan } = useTripFormSubmit(resetForm);
  const [showForm, setShowForm] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    await submitTripPlan(formData);
    
    // If trip plan was generated successfully, hide the form to focus on the result
    if (generatedTripPlan) {
      setShowForm(false);
    }
  };

  const handleCreateNew = () => {
    setShowForm(true);
    resetForm();
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      {generatedTripPlan && !showForm && (
        <TripPlanDisplay 
          tripPlan={generatedTripPlan} 
          onBack={() => setShowForm(true)}
        />
      )}
      
      {showForm && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full"
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
      )}
      
      {generatedTripPlan && !showForm && (
        <div className="flex justify-center mt-6 mb-8">
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="px-4 py-2 rounded-md bg-primary/10 hover:bg-primary/20 transition-colors text-primary"
            onClick={handleCreateNew}
          >
            Create Another Trip Plan
          </motion.button>
        </div>
      )}
    </div>
  );
};

export default TripPlanForm;
