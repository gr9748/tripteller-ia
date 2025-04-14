
import { useState, useEffect, ChangeEvent } from 'react';
import { toast } from 'sonner';

export interface TripFormData {
  source: string;
  destination: string;
  startDate: string;
  endDate: string;
  budget: string;
  travelers: string;
  interests: string;
}

export const useTripFormState = () => {
  const [formData, setFormData] = useState<TripFormData>({
    source: '',
    destination: '',
    startDate: '',
    endDate: '',
    budget: '',
    travelers: '1',
    interests: ''
  });

  // Check for reused trip plan data on component mount
  useEffect(() => {
    try {
      const savedPlanData = sessionStorage.getItem('reuseTripPlan');
      if (savedPlanData) {
        const planData = JSON.parse(savedPlanData);
        
        setFormData({
          source: planData.source || '',
          destination: planData.destination || '',
          startDate: planData.start_date || '',
          endDate: planData.end_date || '',
          budget: planData.budget ? planData.budget.toString() : '',
          travelers: planData.travelers ? planData.travelers.toString() : '1',
          interests: planData.interests || ''
        });
        
        // Clear the saved data after loading it
        sessionStorage.removeItem('reuseTripPlan');
        toast.success('Previous trip plan loaded successfully!');
      }
    } catch (error) {
      console.error('Error loading saved trip plan:', error);
      toast.error('Error loading saved trip plan');
    }
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      source: '',
      destination: '',
      startDate: '',
      endDate: '',
      budget: '',
      travelers: '1',
      interests: ''
    });
  };

  const isValidForm = () => {
    if (!formData.source) {
      toast.error('Please enter your starting location');
      return false;
    }
    if (!formData.destination) {
      toast.error('Please enter your destination');
      return false;
    }
    if (!formData.startDate) {
      toast.error('Please select a start date');
      return false;
    }
    if (!formData.endDate) {
      toast.error('Please select an end date');
      return false;
    }
    if (new Date(formData.endDate) <= new Date(formData.startDate)) {
      toast.error('End date must be after start date');
      return false;
    }
    if (!formData.budget || isNaN(parseFloat(formData.budget)) || parseFloat(formData.budget) <= 0) {
      toast.error('Please enter a valid budget amount');
      return false;
    }
    if (!formData.travelers || isNaN(parseInt(formData.travelers)) || parseInt(formData.travelers) < 1) {
      toast.error('Please enter at least 1 traveler');
      return false;
    }
    return true;
  };

  return {
    formData,
    setFormData,
    handleChange,
    resetForm,
    isValidForm
  };
};
