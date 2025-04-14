
import React from 'react';
import { Calendar, MapPin, IndianRupee, Users, Heart, Star } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface TripSummaryProps {
  destination: string;
  startDate: string;
  endDate: string;
  budget: number;
  summary?: string;
  travelers?: number;
}

export const TripSummary: React.FC<TripSummaryProps> = ({
  destination,
  startDate,
  endDate,
  budget,
  summary,
  travelers = 1
}) => {
  return (
    <>
      <div className="mb-6 p-5 bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 rounded-lg border border-blue-100 dark:border-blue-900 shadow-sm relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute -right-10 -top-10 w-28 h-28 bg-blue-500/10 rounded-full blur-xl"></div>
        <div className="absolute -left-5 -bottom-5 w-16 h-16 bg-purple-500/10 rounded-full blur-md"></div>
        
        <div className="relative">
          <div className="flex gap-2 items-center mb-3">
            <MapPin className="h-5 w-5 text-blue-500 dark:text-blue-400" />
            <h3 className="font-medium text-blue-700 dark:text-blue-300 text-lg">
              {destination}
            </h3>
            <Badge className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-none">
              TripTales Adventure
            </Badge>
          </div>
          
          <div className="flex flex-wrap gap-4 text-sm text-slate-600 dark:text-slate-300">
            <span className="flex items-center gap-1 px-2 py-1 rounded-md bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <Calendar className="h-4 w-4 text-indigo-500" />
              {startDate} - {endDate}
            </span>
            <span className="flex items-center gap-1 px-2 py-1 rounded-md bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-green-600 dark:text-green-400 font-medium">
              <IndianRupee className="h-4 w-4 text-green-500" />
              Budget: {formatCurrency(budget)}
            </span>
            <span className="flex items-center gap-1 px-2 py-1 rounded-md bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <Users className="h-4 w-4 text-purple-500" />
              {travelers} {travelers === 1 ? 'Traveler' : 'Travelers'}
            </span>
          </div>
        </div>
      </div>

      {summary && (
        <div className="mb-6 p-5 rounded-lg bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 text-slate-700 dark:from-purple-900/20 dark:via-indigo-900/20 dark:to-blue-900/20 dark:text-slate-200 border border-purple-100 dark:border-purple-900/50 shadow-sm relative overflow-hidden">
          <div className="absolute right-4 top-4">
            <Heart className="h-5 w-5 text-pink-400/30 dark:text-pink-400/20" />
          </div>
          <div className="absolute -right-12 -bottom-12 w-24 h-24 bg-indigo-500/5 rounded-full"></div>
          <div className="absolute left-8 -bottom-10 opacity-10">
            <Star className="h-16 w-16 text-amber-400/30" />
          </div>
          <h4 className="font-medium text-purple-700 dark:text-purple-400 mb-2 flex items-center gap-2">
            <span className="h-1 w-4 bg-purple-400 rounded-full"></span>
            Your TripTale
          </h4>
          <p className="leading-relaxed whitespace-pre-line text-sm relative z-10">
            {summary}
          </p>
        </div>
      )}
    </>
  );
};
