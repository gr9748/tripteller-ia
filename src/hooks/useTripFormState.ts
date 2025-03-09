
import { useState } from 'react';

export interface TripFormData {
  source: string;
  destination: string;
  startDate: string;
  endDate: string;
  budget: string;
  travelers: string;
  interests: string;
}

export const initialTripFormState: TripFormData = {
  source: '',
  destination: '',
  startDate: '',
  endDate: '',
  budget: '',
  travelers: '1',
  interests: ''
};

export const useTripFormState = () => {
  const [formData, setFormData] = useState<TripFormData>(initialTripFormState);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData(initialTripFormState);
  };

  const validateForm = (): boolean => {
    return !!(
      formData.source &&
      formData.destination &&
      formData.startDate &&
      formData.endDate &&
      formData.budget &&
      formData.travelers
    );
  };

  return {
    formData,
    handleChange,
    resetForm,
    validateForm,
  };
};
