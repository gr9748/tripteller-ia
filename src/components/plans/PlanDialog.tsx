
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Calendar, DollarSign, Users } from 'lucide-react';
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

interface PlanDialogProps {
  plan: TripPlan | null;
  onClose: () => void;
}

const PlanDialog: React.FC<PlanDialogProps> = ({ plan, onClose }) => {
  if (!plan) return null;

  return (
    <Dialog open={!!plan} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-blue-700 dark:text-blue-400">
            {plan.source} to {plan.destination}
          </DialogTitle>
          <DialogDescription className="flex flex-wrap gap-3 text-sm mt-2">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4 text-blue-500" />
              <span>{formatDate(plan.start_date || '')} to {formatDate(plan.end_date || '')}</span>
            </div>
            <div className="flex items-center gap-1">
              <DollarSign className="h-4 w-4 text-green-500" />
              <span>Budget: ${plan.budget}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4 text-purple-500" />
              <span>Travelers: {plan.travelers}</span>
            </div>
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4">
          {plan.ai_response ? (
            <div className="prose prose-blue max-w-none dark:prose-invert bg-blue-50/50 dark:bg-blue-900/20 p-4 rounded-lg">
              <pre className="whitespace-pre-wrap text-sm bg-transparent border-none p-0">
                {typeof plan.ai_response === 'string' 
                  ? plan.ai_response 
                  : JSON.stringify(plan.ai_response, null, 2)}
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
  );
};

export default PlanDialog;
