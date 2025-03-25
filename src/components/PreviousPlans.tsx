
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { RefreshCcw, Map, Calendar, DollarSign, Users, ExternalLink } from 'lucide-react';
import { formatDate } from '@/lib/utils';

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
}

interface PreviousPlansProps {
  plans: TripPlan[];
  isLoading: boolean;
  onRefresh: () => void;
}

const PreviousPlans: React.FC<PreviousPlansProps> = ({ plans, isLoading, onRefresh }) => {
  const navigate = useNavigate();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (plans.length === 0) {
    return (
      <div className="text-center p-8 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/30 dark:to-blue-900/30 rounded-lg">
        <h3 className="text-lg font-medium mb-4 text-purple-700 dark:text-purple-300">No Previous Plans</h3>
        <p className="text-muted-foreground mb-6">
          You haven't created any trip plans yet. Try creating one using the Trip Planner!
        </p>
        <Button 
          variant="outline" 
          className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600"
          onClick={() => onRefresh()}
        >
          <RefreshCcw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>
    );
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
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="overflow-hidden hover:shadow-md transition-shadow border border-blue-100 dark:border-blue-900/40">
              <div className="h-2 bg-gradient-to-r from-blue-400 to-indigo-500"></div>
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
                  <div>
                    <h3 className="text-lg font-medium mb-1 text-blue-700 dark:text-blue-400">
                      {plan.source} to {plan.destination}
                    </h3>
                    <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-blue-500" />
                        <span>{formatDate(plan.start_date)} to {formatDate(plan.end_date)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-3.5 w-3.5 text-green-500" />
                        <span>Budget: ${plan.budget}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5 text-purple-500" />
                        <span>Travelers: {plan.travelers}</span>
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    size="sm" 
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 self-start md:self-center"
                    onClick={() => {
                      // In a real app, you would navigate to a detailed view of this plan
                      console.log('View plan details:', plan);
                      // navigate(`/plans/${plan.id}`);
                    }}
                  >
                    <ExternalLink className="h-3.5 w-3.5 mr-1" />
                    View Plan
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default PreviousPlans;
