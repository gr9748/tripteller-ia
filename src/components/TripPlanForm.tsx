
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
  const [heroImageLoaded, setHeroImageLoaded] = useState(false);
  const [heroImageError, setHeroImageError] = useState(false);

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
    setHeroImageLoaded(false);
    setHeroImageError(false);
  };

  // Get a Google Maps Static image for the background
  const getGoogleMapImage = (location: string, width = 1600, height = 900, zoom = 12) => {
    // Format the location for the URL
    const formattedLocation = encodeURIComponent(location || 'world');
    
    // Create the Google Maps Static API URL
    return `https://maps.googleapis.com/maps/api/staticmap?center=${formattedLocation}&zoom=${zoom}&size=${width}x${height}&maptype=roadmap&key=AIzaSyDZKk5fy9S15OzHgfKSVdvZCbxPoUyA8xE`;
  };
  
  const backgroundImage = getGoogleMapImage(formData.destination, 1600, 900, 10);
  const heroImage = getGoogleMapImage(formData.destination, 1600, 400, 12);
  
  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Hero image at the top */}
      <div className="w-full h-48 mb-6 overflow-hidden rounded-lg shadow-md">
        {!heroImageLoaded && !heroImageError && (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        <img 
          src={heroImage} 
          alt="Travel destination" 
          className={`w-full h-full object-cover transition-opacity duration-300 ${heroImageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setHeroImageLoaded(true)}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            setHeroImageError(true);
            target.src = "https://maps.googleapis.com/maps/api/staticmap?center=world&zoom=2&size=1600x400&maptype=roadmap&key=AIzaSyDZKk5fy9S15OzHgfKSVdvZCbxPoUyA8xE";
            setHeroImageLoaded(true);
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
