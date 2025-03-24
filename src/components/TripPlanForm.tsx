
import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    // When generatedTripPlan changes and is valid, hide the form
    if (generatedTripPlan) {
      console.log("Trip plan generated successfully, hiding form", generatedTripPlan);
      setShowForm(false);
    }
  }, [generatedTripPlan]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    await submitTripPlan(formData);
  };

  const handleCreateNew = () => {
    setShowForm(true);
    resetForm();
  };

  // Get a random travel background image
  const backgroundImage = `https://source.unsplash.com/1600x900/?travel,vacation,${formData.destination || 'adventure'}`;
  const heroImage = `https://source.unsplash.com/1600x400/?${formData.destination || 'paris,travel,landscape'}`;

  // Debug logs to understand what's happening with the generated trip plan
  console.log("Current generatedTripPlan:", generatedTripPlan);
  console.log("showForm state:", showForm);
  
  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Hero image at the top */}
      <div className="w-full h-48 mb-6 overflow-hidden rounded-lg shadow-md">
        <img 
          src={heroImage} 
          alt="Travel destination" 
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "https://source.unsplash.com/1600x400/?travel,landscape";
            console.log("Hero image failed to load, using fallback");
          }}
        />
      </div>
      
      {/* Background image for the form */}
      {showForm && (
        <div 
          className="absolute top-0 left-0 w-full h-full -z-10 opacity-15 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
      )}
      
      {generatedTripPlan && !showForm ? (
        <TripPlanDisplay 
          tripPlan={generatedTripPlan} 
          onBack={handleCreateNew}
        />
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full"
        >
          <Card className="glass backdrop-blur-sm bg-white/75 border shadow-lg">
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
