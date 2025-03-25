
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
import { Globe, Sparkles } from 'lucide-react';

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
  
  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Top banner with decorative elements */}
      <div className="w-full mb-6 overflow-hidden rounded-lg shadow-md bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-full">
              <Globe className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Plan Your Journey</h2>
              <p className="text-blue-100 text-sm">Create unforgettable travel experiences</p>
            </div>
          </div>
          <div className="hidden sm:block">
            <Sparkles className="h-10 w-10 text-yellow-300 animate-pulse" />
          </div>
        </div>
      </div>
      
      {/* Decorative background gradient */}
      {showForm && (
        <div 
          className="absolute top-0 left-0 w-full h-full -z-10 opacity-15 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20"
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
          <Card className="backdrop-blur-sm bg-gradient-to-br from-white/90 to-blue-50/90 border border-blue-100 shadow-lg dark:from-slate-900/90 dark:to-blue-900/30 dark:border-blue-900/40">
            <CardHeader className="bg-gradient-to-r from-blue-100/50 to-indigo-100/50 rounded-t-lg border-b border-blue-100 dark:from-blue-900/20 dark:to-indigo-900/20 dark:border-blue-900/40">
              <CardTitle className="text-2xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-700 dark:from-blue-400 dark:to-indigo-400">
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
            className="px-4 py-2 rounded-md bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-sm"
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
