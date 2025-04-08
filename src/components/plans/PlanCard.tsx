
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, DollarSign, Users, Trash2, Eye } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface PlanCardProps {
  plan: {
    id: string;
    source: string;
    destination: string;
    start_date: string;
    end_date: string;
    budget: number;
    travelers: number;
  };
  onView: (id: string) => void;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

const PlanCard: React.FC<PlanCardProps> = ({ plan, onView, onDelete, isDeleting }) => {
  return (
    <motion.div
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
                onClick={() => onView(plan.id)}
              >
                <Eye className="h-3.5 w-3.5 mr-1 text-blue-500" />
                View
              </Button>
              
              <Button 
                size="sm" 
                variant="outline"
                className="border-red-200 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-900/30"
                onClick={() => onDelete(plan.id)}
                disabled={isDeleting}
              >
                {isDeleting ? (
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
  );
};

export default PlanCard;
