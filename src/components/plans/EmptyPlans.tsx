
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCcw } from 'lucide-react';

interface EmptyPlansProps {
  onRefresh: () => void;
}

const EmptyPlans: React.FC<EmptyPlansProps> = ({ onRefresh }) => {
  return (
    <div className="text-center p-8 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/30 dark:to-blue-900/30 rounded-lg">
      <h3 className="text-lg font-medium mb-4 text-purple-700 dark:text-purple-300">No Previous Plans</h3>
      <p className="text-muted-foreground mb-6">
        You haven't created any trip plans yet. Try creating one using the Trip Planner!
      </p>
      <Button 
        variant="outline" 
        className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600"
        onClick={onRefresh}
      >
        <RefreshCcw className="h-4 w-4 mr-2" />
        Refresh
      </Button>
    </div>
  );
};

export default EmptyPlans;
