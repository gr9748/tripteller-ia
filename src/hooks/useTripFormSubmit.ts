
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { TripFormData } from './useTripFormState';
import { sanitizeCurrencyValues } from '@/utils/currencyUtils';
import { adjustPlanToFitBudget, defaultAiResponse } from '@/utils/tripPlanAdjustment';

// Define types for trip plan
export interface TripPlan {
  id: string;
  user_id: string;
  source: string;
  destination: string;
  start_date: string;
  end_date: string;
  budget: number;
  travelers: number;
  interests: string | null;
  ai_response: any;
  created_at: string;
  updated_at: string;
}

export const useTripFormSubmit = (resetForm: () => void) => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedTripPlan, setGeneratedTripPlan] = useState<TripPlan | null>(null);
  
  // Check authentication status before allowing submission
  const checkAuth = async () => {
    const { data, error } = await supabase.auth.getSession();
    if (error || !data.session) {
      console.log("Session check failed:", error);
      if (isAuthenticated) {
        toast.error('Your session has expired. Please sign in again.');
        logout();
      }
      return false;
    }
    return true;
  };

  const submitTripPlan = async (formData: TripFormData) => {
    if (!isAuthenticated || !user) {
      toast.error('Please sign in to create a trip plan');
      navigate('/login');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      if (!(await checkAuth())) {
        navigate('/login');
        return;
      }
      
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;
      
      if (!token) {
        toast.error('Authentication error. Please sign in again.');
        logout();
        navigate('/login');
        return;
      }
      
      toast.info('Generating your personalized trip plan...');
      
      const budgetValue = parseFloat(formData.budget);
      if (isNaN(budgetValue) || budgetValue <= 0) {
        toast.error('Please enter a valid budget amount');
        setIsSubmitting(false);
        return;
      }
      
      const { data, error } = await supabase.functions.invoke('generate-trip-plan', {
        body: {
          source: formData.source,
          destination: formData.destination,
          startDate: formData.startDate,
          endDate: formData.endDate,
          budget: budgetValue,
          travelers: parseInt(formData.travelers),
          interests: formData.interests
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (error) {
        handleError(error);
        return;
      }
      
      if (data?.tripPlan) {
        const processedPlan = await processTripPlan(data.tripPlan, budgetValue);
        setGeneratedTripPlan(processedPlan);
        toast.success('Trip plan generated successfully!');
        navigate(`/trip-plan/${processedPlan.id}`);
        resetForm();
      } else {
        toast.error('Failed to generate trip plan data');
      }
      
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleError = (error: any) => {
    console.error('Error generating trip plan:', error);
    
    if (error.message?.includes('Unauthorized') || error.message?.includes('auth')) {
      toast.error('Authentication error. Please sign in again.');
      logout();
      navigate('/login');
      return;
    }
    
    toast.error('Failed to generate trip plan: ' + (error.message || 'Unknown error'));
    setIsSubmitting(false);
  };
  
  const processTripPlan = async (tripPlan: any, budget: number) => {
    try {
      let parsedResponse = await parseAiResponse(tripPlan.ai_response);
      
      if (parsedResponse) {
        tripPlan.ai_response = parsedResponse;
      } else {
        console.warn('Could not parse AI response, using default response');
        tripPlan.ai_response = defaultAiResponse;
      }
      
      sanitizeCurrencyValues(tripPlan.ai_response);
      
      const budgetBreakdown = tripPlan.ai_response.budgetBreakdown;
      if (budgetBreakdown?.total) {
        const totalCost = parseFloat(budgetBreakdown.total.replace(/[^\d.]/g, ''));
        if (totalCost > budget * 1.1) {
          console.warn(`Trip plan exceeds budget: ${totalCost} > ${budget}`);
          adjustPlanToFitBudget(tripPlan.ai_response, budget);
        }
      }
      
      return tripPlan;
    } catch (error) {
      console.error('Error processing trip plan:', error);
      return tripPlan;
    }
  };
  
  const parseAiResponse = async (aiResponse: any) => {
    if (!aiResponse) return null;
    
    try {
      if (aiResponse?.rawResponse?.candidates?.[0]?.content?.parts?.[0]?.text) {
        const responseText = aiResponse.rawResponse.candidates[0].content.parts[0].text;
        const jsonMatches = responseText.match(/```json\n([\s\S]*?)\n```/) || 
                           responseText.match(/```\n([\s\S]*?)\n```/) ||
                           responseText.match(/{[\s\S]*?}/);
        
        if (jsonMatches?.[0]) {
          let jsonStr = jsonMatches[0]
            .replace(/```json\n|```\n|```/g, '')
            .replace(/([{,])\s*(\w+):/g, '$1"$2":')
            .replace(/:\s*'([^']*)'/g, ':"$1"')
            .replace(/,\s*}/g, '}')
            .replace(/,\s*]/g, ']')
            .replace(/\n/g, ' ')
            .replace(/\r/g, '')
            .replace(/\t/g, ' ')
            .replace(/\\(?!["\\/bfnrt])/g, '\\\\');
          
          const jsonStart = jsonStr.indexOf('{');
          const jsonEnd = jsonStr.lastIndexOf('}') + 1;
          
          if (jsonStart >= 0 && jsonEnd > jsonStart) {
            jsonStr = jsonStr.substring(jsonStart, jsonEnd);
            return JSON.parse(jsonStr);
          }
        }
      }
      
      return aiResponse.error ? null : aiResponse;
    } catch (error) {
      console.error('Failed to parse AI response:', error);
      return null;
    }
  };

  return {
    isSubmitting,
    submitTripPlan,
    generatedTripPlan
  };
};
