
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { TripFormLocation } from '@/components/trip-form/TripFormLocation';
import { TripFormDates } from '@/components/trip-form/TripFormDates';
import { TripFormDetails } from '@/components/trip-form/TripFormDetails';
import { TripFormSubmit } from '@/components/trip-form/TripFormSubmit';
import { useTripFormState } from '@/hooks/useTripFormState';
import { useTripFormSubmit } from '@/hooks/useTripFormSubmit';

const TripPlanForm = () => {
  const {
    formData,
    setFormData,
    handleChange,
    resetForm,
    isValidForm
  } = useTripFormState();

  const {
    isSubmitting,
    submitTripPlan,
    generatedTripPlan
  } = useTripFormSubmit(resetForm);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidForm()) return;
    await submitTripPlan(formData);
  };

  if (generatedTripPlan) {
    return null; // Hide form when plan is generated
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        onSubmit={handleSubmit}
        className="p-6"
      >
        <TripFormLocation 
          source={formData.source}
          destination={formData.destination}
          handleChange={handleChange}
        />
        
        <Separator className="my-6" />
        
        <TripFormDates 
          startDate={formData.startDate}
          endDate={formData.endDate}
          handleChange={handleChange}
        />
        
        <Separator className="my-6" />
        
        <TripFormDetails 
          budget={formData.budget}
          travelers={formData.travelers}
          interests={formData.interests}
          handleChange={handleChange}
        />
        
        <div className="mt-6 flex justify-end">
          <TripFormSubmit isSubmitting={isSubmitting} />
        </div>
      </motion.form>
    </Card>
  );
};

export default TripPlanForm;
