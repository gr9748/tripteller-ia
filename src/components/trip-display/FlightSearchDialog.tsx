
import React, { useState, useEffect } from 'react';
import { Search, ExternalLink, ArrowRight } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';
import { formatCurrency } from '@/lib/utils';

interface FlightOption {
  airline: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  duration: string;
  stops: number;
  flightNumber: string;
}

interface FlightSearchDialogProps {
  isOpen: boolean;
  onClose: () => void;
  source: string;
  destination: string;
  startDate: string;
  budget: number;
}

const POPULAR_AIRLINES = [
  { name: 'Air India', code: 'AI', logo: 'https://www.airindia.com/assets/images/favicon.png' },
  { name: 'IndiGo', code: 'IGO', logo: 'https://www.goindigo.in/favicon.ico' },
  { name: 'SpiceJet', code: 'SG', logo: 'https://www.spicejet.com/favicon.ico' },
  { name: 'Vistara', code: 'UK', logo: 'https://www.airvistara.com/assets/images/favicon.ico' },
  { name: 'Emirates', code: 'EK', logo: 'https://www.emirates.com/favicon.ico' },
  { name: 'Qatar Airways', code: 'QR', logo: 'https://www.qatarairways.com/favicon.ico' },
  { name: 'Lufthansa', code: 'LH', logo: 'https://www.lufthansa.com/favicon.ico' },
  { name: 'British Airways', code: 'BA', logo: 'https://www.britishairways.com/favicon.ico' }
];

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
  const [flightOptions, setFlightOptions] = useState<FlightOption[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Generate realistic flight options when dialog opens
  useEffect(() => {
    if (isOpen) {
      generateFlightOptions();
    }
  }, [isOpen, departDate, maxPrice]);
  
  const generateFlightOptions = () => {
    setLoading(true);
    
    // Generate between 5-8 flight options
    const count = Math.floor(Math.random() * 4) + 5;
    const options: FlightOption[] = [];
    
    // Base price range around the budget
    const minPrice = Math.max(budget * 0.6, 2500);
    const maxPriceValue = Math.min(budget * 1.3, budget * 2);
    
    // Departure time range (6 AM to 11 PM)
    const startTime = 6; // 6 AM
    const endTime = 23; // 11 PM
    
    for (let i = 0; i < count; i++) {
      // Random airline
      const airline = POPULAR_AIRLINES[Math.floor(Math.random() * POPULAR_AIRLINES.length)];
      
      // Random departure hour between 6 AM and 11 PM
      const departureHour = Math.floor(Math.random() * (endTime - startTime + 1)) + startTime;
      const departureMinute = Math.floor(Math.random() * 60);
      
      // Format time strings
      const departureTime = `${departureHour.toString().padStart(2, '0')}:${departureMinute.toString().padStart(2, '0')}`;
      
      // Flight duration between 1 to 5 hours
      const durationHours = Math.floor(Math.random() * 5) + 1;
      const durationMinutes = Math.floor(Math.random() * 60);
      
      // Calculate arrival time
      let arrivalHour = departureHour + durationHours;
      let arrivalMinute = departureMinute + durationMinutes;
      if (arrivalMinute >= 60) {
        arrivalHour += 1;
        arrivalMinute -= 60;
      }
      if (arrivalHour >= 24) {
        arrivalHour -= 24;
      }
      const arrivalTime = `${arrivalHour.toString().padStart(2, '0')}:${arrivalMinute.toString().padStart(2, '0')}`;
      
      // Flight duration string
      const duration = `${durationHours}h ${durationMinutes}m`;
      
      // Random price
      const price = Math.floor(minPrice + Math.random() * (maxPriceValue - minPrice));
      
      // Random stops (0-2)
      const stops = Math.floor(Math.random() * 3);
      
      // Flight number
      const flightNumber = `${airline.code}${Math.floor(Math.random() * 1000) + 100}`;
      
      options.push({
        airline: airline.name,
        departureTime,
        arrivalTime,
        price,
        duration,
        stops,
        flightNumber
      });
    }
    
    // Sort by price
    options.sort((a, b) => a.price - b.price);
    
    // Filter by max price
    const filteredOptions = options.filter(option => option.price <= maxPrice);
    
    // Simulate API delay
    setTimeout(() => {
      setFlightOptions(filteredOptions);
      setLoading(false);
    }, 500);
  };
  
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
    toast.success('Opening flight search...');
  };
  
  const handleBookFlight = (airline: string) => {
    let bookingUrl = '';
    
    const airlineWebsites: Record<string, string> = {
      'Air India': 'https://www.airindia.com',
      'IndiGo': 'https://www.goindigo.in',
      'SpiceJet': 'https://www.spicejet.com',
      'Vistara': 'https://www.airvistara.com',
      'GoAir': 'https://www.flygofirst.com',
      'AirAsia': 'https://www.airasia.com',
      'Emirates': 'https://www.emirates.com',
      'Qatar Airways': 'https://www.qatarairways.com',
      'Lufthansa': 'https://www.lufthansa.com',
      'British Airways': 'https://www.britishairways.com'
    };
    
    bookingUrl = airlineWebsites[airline] || `https://www.google.com/search?q=${encodeURIComponent(airline)} airline booking`;
    
    window.open(bookingUrl, '_blank');
    toast.success(`Opening ${airline} booking page...`);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
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
          
          <Button 
            onClick={handleSearch} 
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
          >
            <Search className="h-4 w-4 mr-2" />
            Search on Google Flights
          </Button>
          
          <Separator className="my-4" />
          
          <div className="space-y-4">
            <h3 className="font-medium text-sm">Available Flight Options:</h3>
            
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin h-8 w-8 border-b-2 border-blue-600 rounded-full"></div>
              </div>
            ) : flightOptions.length > 0 ? (
              <div className="space-y-3">
                {flightOptions.map((flight, index) => (
                  <div key={index} className="p-3 border rounded-md hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors">
                    <div className="flex justify-between items-center mb-2">
                      <div className="font-medium">{flight.airline}</div>
                      <Badge variant="outline">{flight.flightNumber}</Badge>
                    </div>
                    
                    <div className="grid grid-cols-[1fr_auto_1fr] gap-2 items-center mb-3">
                      <div>
                        <div className="text-xl font-medium">{flight.departureTime}</div>
                        <div className="text-sm text-muted-foreground">{source}</div>
                      </div>
                      <div className="flex flex-col items-center px-2">
                        <div className="text-xs text-muted-foreground mb-1">{flight.duration}</div>
                        <div className="w-16 h-[1px] bg-slate-300 relative">
                          <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 text-slate-400">
                            <ArrowRight className="h-3 w-3" />
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {flight.stops === 0 ? 'Non-stop' : `${flight.stops} ${flight.stops === 1 ? 'stop' : 'stops'}`}
                        </div>
                      </div>
                      <div>
                        <div className="text-xl font-medium">{flight.arrivalTime}</div>
                        <div className="text-sm text-muted-foreground">{destination}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-lg font-medium text-green-600 dark:text-green-500">
                        {formatCurrency(flight.price)}
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleBookFlight(flight.airline)}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                        Book Now
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-6 text-center">
                <p className="text-muted-foreground">No flights found within your budget.</p>
                <p className="text-sm text-muted-foreground mt-1">Try increasing your budget or changing the date.</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
