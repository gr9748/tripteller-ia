
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { TripFormData } from './useTripFormState';

export const useTripFormSubmit = (resetForm: () => void) => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Check authentication status before allowing submission
  useEffect(() => {
    const checkAuth = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error || !data.session) {
        console.log("Session check failed:", error);
        // Only show the toast if we previously thought the user was authenticated
        if (isAuthenticated) {
          toast.error('Your session has expired. Please sign in again.');
          logout();
        }
      }
    };
    
    checkAuth();
  }, [isAuthenticated, logout]);

  const submitTripPlan = async (formData: TripFormData) => {
    if (!isAuthenticated || !user) {
      toast.error('Please sign in to create a trip plan');
      navigate('/login');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Get a fresh session token right before the request
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !sessionData.session) {
        console.error('Session error:', sessionError);
        toast.error('Authentication error. Please sign in again.');
        logout();
        navigate('/login');
        return;
      }
      
      const token = sessionData.session.access_token;
      
      if (!token) {
        toast.error('Authentication error. Please sign in again.');
        logout();
        navigate('/login');
        return;
      }
      
      toast.info('Generating your personalized trip plan...');
      
      // Add some logging to debug
      console.log('Preparing request with token length:', token.length);
      
      const { data, error } = await supabase.functions.invoke('generate-trip-plan', {
        body: {
          source: formData.source,
          destination: formData.destination,
          startDate: formData.startDate,
          endDate: formData.endDate,
          budget: parseFloat(formData.budget),
          travelers: parseInt(formData.travelers),
          interests: formData.interests
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (error) {
        console.error('Error generating trip plan:', error);
        
        if (error.message?.includes('Unauthorized') || error.message?.includes('auth')) {
          toast.error('Authentication error. Please sign in again.');
          logout();
          navigate('/login');
          return;
        }
        
        toast.error('Failed to generate trip plan');
        return;
      }
      
      toast.success('Trip plan generated successfully!');
      console.log('Trip plan generated:', data);
      
      // Reset form
      resetForm();
      
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    submitTripPlan
  };
};
