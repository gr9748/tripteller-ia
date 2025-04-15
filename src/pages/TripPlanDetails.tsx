
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TripPlanDisplay from '@/components/TripPlanDisplay';
import PageTransition from '@/components/PageTransition';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface TripPlan {
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

const TripPlanDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tripPlan, setTripPlan] = useState<TripPlan | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchTripPlan = async () => {
      try {
        if (!id) {
          setError('Trip plan ID is missing');
          toast.error('Trip plan ID is missing');
          return;
        }
        
        setIsLoading(true);
        const { data, error } = await supabase
          .from('trip_plans')
          .select('*')
          .eq('id', id)
          .single();
          
        if (error) {
          console.error('Error fetching trip plan:', error);
          setError('Failed to load trip plan');
          toast.error('Failed to load trip plan');
          return;
        }
        
        if (!data) {
          setError('Trip plan not found');
          toast.error('Trip plan not found');
          return;
        }
        
        setTripPlan(data);
      } catch (err) {
        console.error('Unexpected error:', err);
        setError('An unexpected error occurred');
        toast.error('An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTripPlan();
  }, [id]);
  
  const handleBack = () => {
    navigate('/');
  };
  
  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-1 container mx-auto px-4 py-24">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">{error}</h2>
              <Button variant="outline" onClick={handleBack} className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Button>
            </div>
          ) : tripPlan ? (
            <TripPlanDisplay tripPlan={tripPlan} onBack={handleBack} />
          ) : null}
        </main>
        
        <Footer />
      </div>
    </PageTransition>
  );
};

export default TripPlanDetails;
