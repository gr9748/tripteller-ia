
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface FlightSearchDialogProps {
  isOpen: boolean;
  onClose: () => void;
  source: string;
  destination: string;
  startDate: string;
  budget: number;
}

export const FlightSearchDialog: React.FC<FlightSearchDialogProps> = ({ 
  isOpen, 
  onClose,
  source,
  destination,
  startDate,
  budget
}) => {
  const [maxPrice, setMaxPrice] = useState(budget);
  const [departDate, setDepartDate] = useState(startDate);
  
  const handleSearch = () => {
    const searchParams = new URLSearchParams({
      curr: 'INR',
      d1: source,
      a1: destination,
      date1: departDate,
      maxprice: maxPrice.toString()
    });
    
    const searchUrl = `https://www.google.com/travel/flights?${searchParams.toString()}`;
    window.open(searchUrl, '_blank');
    onClose();
    toast.success('Opening flight search...');
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Search Flights</DialogTitle>
          <DialogDescription>
            Find flights within your budget and schedule
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="source">From</Label>
              <Input id="source" value={source} readOnly className="bg-muted" />
            </div>
            <div>
              <Label htmlFor="destination">To</Label>
              <Input id="destination" value={destination} readOnly className="bg-muted" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">Departure Date</Label>
              <Input 
                id="date" 
                type="date" 
                value={departDate} 
                onChange={(e) => setDepartDate(e.target.value)} 
              />
            </div>
            <div>
              <Label htmlFor="budget">Max Budget (₹)</Label>
              <Input 
                id="budget" 
                type="number" 
                value={maxPrice} 
                onChange={(e) => setMaxPrice(parseInt(e.target.value))} 
              />
            </div>
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button onClick={handleSearch} className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600">
            <Search className="h-4 w-4 mr-2" />
            Search Flights
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
