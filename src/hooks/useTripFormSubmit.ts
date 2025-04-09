
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { TripFormData } from './useTripFormState';

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

// Default AI response for fallback/error cases
const defaultAiResponse = {
  summary: "Your personalized trip plan",
  flights: [{ airline: "Sample Airline", price: "₹37,500", departure: "Your Location", arrival: "Destination" }],
  accommodations: [{ name: "Hotel Example", location: "City Center", pricePerNight: "₹7,500", totalCost: "₹30,000" }],
  attractions: [{ name: "Famous Landmark", description: "A beautiful place to visit", estimatedCost: "₹0" }],
  restaurants: [{ name: "Local Cuisine", cuisine: "Traditional", priceRange: "₹₹" }],
  transportation: [{ type: "Public Transit", cost: "₹1,500" }],
  itinerary: [
    { 
      day: 1, 
      activities: ["Arrive at destination", "Check in to accommodation"], 
      meals: ["Dinner at local restaurant"], 
      notes: "Rest after travel"
    }
  ],
  budgetBreakdown: { 
    flights: "₹37,500", 
    accommodations: "₹30,000", 
    food: "₹15,000", 
    activities: "₹7,500", 
    transportation: "₹3,750", 
    total: "₹93,750" 
  },
  tips: ["Book in advance", "Learn basic local phrases", "Check weather before packing"],
  activities: [{ name: "City Tour", description: "Explore the local area", cost: "₹2,250" }]
};

export const useTripFormSubmit = (resetForm: () => void) => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedTripPlan, setGeneratedTripPlan] = useState<TripPlan | null>(null);
  
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
      
      // Ensure budget is a valid number
      const budgetValue = parseFloat(formData.budget);
      if (isNaN(budgetValue) || budgetValue <= 0) {
        toast.error('Please enter a valid budget amount');
        setIsSubmitting(false);
        return;
      }
      
      console.log('Preparing request with token length:', token.length);
      
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
      
      // Store the generated trip plan
      if (data?.tripPlan) {
        // Check if the AI response has an error or is missing data
        if (data.tripPlan.ai_response?.error || !data.tripPlan.ai_response?.itinerary) {
          console.warn('AI response has errors or missing data:', data.tripPlan.ai_response);
          
          // If there's raw response data in a JSON string, try to parse it
          if (data.tripPlan.ai_response?.rawResponse?.candidates?.[0]?.content?.parts?.[0]?.text) {
            try {
              const responseText = data.tripPlan.ai_response.rawResponse.candidates[0].content.parts[0].text;
              const jsonStart = responseText.indexOf('{');
              const jsonEnd = responseText.lastIndexOf('}') + 1;
              
              if (jsonStart >= 0 && jsonEnd > jsonStart) {
                const jsonStr = responseText.substring(jsonStart, jsonEnd);
                const parsedResponse = JSON.parse(jsonStr);
                
                // Update the AI response with the parsed data
                data.tripPlan.ai_response = parsedResponse;
                console.log('Successfully parsed AI response from raw text:', parsedResponse);
              }
            } catch (parseError) {
              console.error('Failed to parse AI response from raw text:', parseError);
              // Use a default response format as fallback
              data.tripPlan.ai_response = defaultAiResponse;
            }
          } else {
            // If we can't parse or there's no raw text, use the default response
            data.tripPlan.ai_response = defaultAiResponse;
          }
        }
        
        // Ensure all monetary values use the ₹ symbol and not $
        sanitizeCurrencyValues(data.tripPlan.ai_response);
        
        setGeneratedTripPlan(data.tripPlan);
      }
      
      // Reset form
      resetForm();
      
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Helper function to ensure all monetary values use ₹ symbol
  const sanitizeCurrencyValues = (aiResponse: any) => {
    if (!aiResponse) return;
    
    // Process budget breakdown
    if (aiResponse.budgetBreakdown) {
      Object.keys(aiResponse.budgetBreakdown).forEach(key => {
        const value = aiResponse.budgetBreakdown[key];
        if (typeof value === 'string' && value.includes('$')) {
          aiResponse.budgetBreakdown[key] = value.replace(/\$/g, '₹');
        }
      });
    }
    
    // Process arrays of objects with cost properties
    ['flights', 'accommodations', 'attractions', 'transportation', 'activities'].forEach(category => {
      if (Array.isArray(aiResponse[category])) {
        aiResponse[category].forEach((item: any) => {
          Object.keys(item).forEach(key => {
            if (typeof item[key] === 'string' && 
                (key.toLowerCase().includes('cost') || key.toLowerCase().includes('price')) && 
                item[key].includes('$')) {
              item[key] = item[key].replace(/\$/g, '₹');
            }
          });
        });
      }
    });
    
    // Process restaurants price range
    if (Array.isArray(aiResponse.restaurants)) {
      aiResponse.restaurants.forEach((restaurant: any) => {
        if (restaurant.priceRange && restaurant.priceRange.includes('$')) {
          restaurant.priceRange = restaurant.priceRange.replace(/\$/g, '₹');
        }
      });
    }
  };

  return {
    isSubmitting,
    submitTripPlan,
    generatedTripPlan
  };
};
