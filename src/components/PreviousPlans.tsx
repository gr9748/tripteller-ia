
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { RefreshCcw, Map, Calendar, DollarSign, Users, ExternalLink, Trash2, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { formatDate } from '@/lib/utils';
import { toast } from 'sonner';

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
  const [selectedPlan, setSelectedPlan] = useState<TripPlan | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  
  const handleDelete = async (id: string) => {
    try {
      setIsDeleting(id);
      const { error } = await supabase
        .from('trip_plans')
        .delete()
        .match({ id });
      
      if (error) {
        throw error;
      }
      
      toast.success('Trip plan deleted successfully');
      onRefresh(); // Refresh the list after deletion
    } catch (error) {
      console.error('Error deleting plan:', error);
      toast.error('Failed to delete trip plan');
    } finally {
      setIsDeleting(null);
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
                  
                  <div className="flex gap-2 self-start md:self-center">
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="border-blue-200 hover:bg-blue-50 dark:border-blue-800 dark:hover:bg-blue-900/30"
                      onClick={() => setSelectedPlan(plan)}
                    >
                      <Eye className="h-3.5 w-3.5 mr-1 text-blue-500" />
                      View
                    </Button>
                    
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="border-red-200 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-900/30"
                      onClick={() => handleDelete(plan.id)}
                      disabled={isDeleting === plan.id}
                    >
                      {isDeleting === plan.id ? (
                        <div className="h-3.5 w-3.5 animate-spin rounded-full border-b-2 border-red-500 mr-1" />
                      ) : (
                        <Trash2 className="h-3.5 w-3.5 mr-1 text-red-500" />
                      )}
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
      
      {/* Plan Details Dialog */}
      <Dialog open={!!selectedPlan} onOpenChange={(open) => !open && setSelectedPlan(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-blue-700 dark:text-blue-400">
              {selectedPlan?.source} to {selectedPlan?.destination}
            </DialogTitle>
            <DialogDescription className="flex flex-wrap gap-3 text-sm mt-2">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4 text-blue-500" />
                <span>{formatDate(selectedPlan?.start_date || '')} to {formatDate(selectedPlan?.end_date || '')}</span>
              </div>
              <div className="flex items-center gap-1">
                <DollarSign className="h-4 w-4 text-green-500" />
                <span>Budget: ${selectedPlan?.budget}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4 text-purple-500" />
                <span>Travelers: {selectedPlan?.travelers}</span>
              </div>
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-4">
            {selectedPlan?.ai_response ? (
              <div className="prose prose-blue max-w-none dark:prose-invert bg-blue-50/50 dark:bg-blue-900/20 p-4 rounded-lg">
                <pre className="whitespace-pre-wrap text-sm bg-transparent border-none p-0">
                  {typeof selectedPlan.ai_response === 'string' 
                    ? selectedPlan.ai_response 
                    : JSON.stringify(selectedPlan.ai_response, null, 2)}
                </pre>
              </div>
            ) : (
              <div className="text-center p-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <p className="text-muted-foreground">No detailed plan information available.</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PreviousPlans;
