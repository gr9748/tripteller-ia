
import React from 'react';
import TripPlanForm from './TripPlanForm';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const TravelAssistant: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 p-6 text-center">
        <h2 className="text-2xl font-bold">Sign in to use the Travel Assistant</h2>
        <p className="text-muted-foreground">
          You need to be signed in to create personalized travel plans.
        </p>
        <Button onClick={() => navigate('/login')}>
          Sign In
        </Button>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-full">
      <TripPlanForm />
    </div>
  );
};

export default TravelAssistant;
