
import React from 'react';
import { Calendar, MapPin, IndianRupee } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface TripSummaryProps {
  destination: string;
  startDate: string;
  endDate: string;
  budget: number;
  summary?: string;
}

export const TripSummary: React.FC<TripSummaryProps> = ({
  destination,
  startDate,
  endDate,
  budget,
  summary
}) => {
  return (
    <>
      <div className="mb-6 p-4 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-lg border border-blue-100 dark:border-blue-900">
        <div className="flex gap-2 items-center mb-2">
          <MapPin className="h-5 w-5 text-blue-500 dark:text-blue-400" />
          <h3 className="font-medium text-blue-700 dark:text-blue-300">
            {destination}
          </h3>
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-slate-600 dark:text-slate-300">
          <span className="flex items-center gap-1">
            <Calendar className="h-4 w-4 text-indigo-500" />
            {startDate} - {endDate}
          </span>
          <span className="flex items-center gap-1 text-green-600 dark:text-green-400 font-medium">
            <IndianRupee className="h-4 w-4 text-green-500" />
            Budget: {formatCurrency(budget)}
          </span>
        </div>
      </div>

      {summary && (
        <div className="mb-6 p-4 rounded-lg bg-gradient-to-br from-purple-50 to-indigo-50 text-slate-700 dark:from-purple-900/20 dark:to-indigo-900/20 dark:text-slate-200 border border-purple-100 dark:border-purple-900/50">
          <p className="leading-relaxed whitespace-pre-line">{summary}</p>
        </div>
      )}
    </>
  );
};
