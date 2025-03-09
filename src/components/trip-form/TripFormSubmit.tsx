
import React from 'react';
import { Loader2, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CardFooter } from '@/components/ui/card';

interface TripFormSubmitProps {
  isSubmitting: boolean;
}

export const TripFormSubmit: React.FC<TripFormSubmitProps> = ({ isSubmitting }) => {
  return (
    <CardFooter className="px-0 pb-0 pt-2">
      <Button 
        type="submit" 
        className="w-full" 
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating Plan...
          </>
        ) : (
          <>
            <Send className="mr-2 h-4 w-4" />
            Create Trip Plan
          </>
        )}
      </Button>
    </CardFooter>
  );
};
