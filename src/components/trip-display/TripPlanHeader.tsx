
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TripPlanHeaderProps {
  destination: string;
  onBack: () => void;
}

export const TripPlanHeader: React.FC<TripPlanHeaderProps> = ({ destination, onBack }) => {
  return (
    <div className="flex items-center mb-4 gap-2">
      <Button 
        variant="ghost" 
        size="sm"
        onClick={onBack}
        className="p-0 h-8 w-8 text-slate-600 hover:text-slate-900 hover:bg-slate-200/50 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-700/50"
      >
        <ArrowLeft className="h-4 w-4" />
      </Button>
      <h2 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
        Trip to {destination}
      </h2>
    </div>
  );
};
