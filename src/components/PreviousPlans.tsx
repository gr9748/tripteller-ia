
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCcw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import PlanCard from './plans/PlanCard';
import PlanDialog from './plans/PlanDialog';
import EmptyPlans from './plans/EmptyPlans';
import { useNavigate } from 'react-router-dom';

interface TripPlan {
  id: string;
  source: string;
  destination: string;
  start_date: string;
  end_date: string;
  budget: number;
  travelers: number;
  created_at: string;
  ai_response?: any;
  interests?: string;
}

interface PreviousPlansProps {
  plans: TripPlan[];
  isLoading: boolean;
  onRefresh: () => void;
}

const PreviousPlans: React.FC<PreviousPlansProps> = ({ plans: initialPlans, isLoading, onRefresh }) => {
  const [selectedPlan, setSelectedPlan] = useState<TripPlan | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [plans, setPlans] = useState<TripPlan[]>(initialPlans);
  const navigate = useNavigate();
  
  // Update local plans when props change
  useEffect(() => {
    setPlans(initialPlans);
  }, [initialPlans]);
  
  const handleDelete = async (id: string) => {
    try {
      setIsDeleting(id);
      
      const { error } = await supabase
        .from('trip_plans')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Supabase delete error:', error);
        throw error;
      }
      
      // If the deleted plan was selected, clear the selection
      if (selectedPlan && selectedPlan.id === id) {
        setSelectedPlan(null);
      }
      
      // Update local state to remove the deleted plan
      setPlans(prevPlans => prevPlans.filter(plan => plan.id !== id));
      
      // Show success toast
      toast.success('Trip plan deleted successfully');
      
      // Also refresh from the server to ensure consistency
      onRefresh();
    } catch (error) {
      console.error('Error deleting plan:', error);
      toast.error('Failed to delete trip plan');
    } finally {
      setIsDeleting(null);
    }
  };
  
  const handleViewPlan = (id: string) => {
    const plan = plans.find(p => p.id === id);
    if (plan) {
      setSelectedPlan(plan);
    }
  };

  const handleReusePlan = (plan: TripPlan) => {
    try {
      // Store plan data in sessionStorage for the form to use
      sessionStorage.setItem('reuseTripPlan', JSON.stringify({
        source: plan.source,
        destination: plan.destination,
        startDate: plan.start_date,
        endDate: plan.end_date,
        budget: plan.budget.toString(),
        travelers: plan.travelers.toString(),
        interests: plan.interests || ''
      }));
      
      toast.success('Plan loaded for reuse. Redirecting to planner...');
      
      // Close the dialog if it's open
      setSelectedPlan(null);
      
      // Navigate to the home page with trip planner
      navigate('/');
    } catch (error) {
      console.error('Error reusing plan:', error);
      toast.error('Failed to load plan for reuse');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (plans.length === 0) {
    return <EmptyPlans onRefresh={onRefresh} />;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end mb-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onRefresh}
          className="text-blue-600 border-blue-200 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-800 dark:hover:bg-blue-900/30"
        >
          <RefreshCcw className="h-3.5 w-3.5 mr-1" />
          Refresh
        </Button>
      </div>
      
      <div className="space-y-4">
        {plans.map((plan) => (
          <PlanCard 
            key={plan.id} 
            plan={plan} 
            onView={() => handleViewPlan(plan.id)}
            onDelete={() => handleDelete(plan.id)}
            isDeleting={isDeleting === plan.id}
          />
        ))}
      </div>
      
      <PlanDialog 
        plan={selectedPlan} 
        onClose={() => setSelectedPlan(null)} 
        onReuse={selectedPlan ? () => handleReusePlan(selectedPlan) : undefined}
      />
    </div>
  );
};

export default PreviousPlans;
