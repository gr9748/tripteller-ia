
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Loader2, Send, Calendar, Users, DollarSign, MapPin, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

const TripPlanForm: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    source: '',
    destination: '',
    startDate: '',
    endDate: '',
    budget: '',
    travelers: '1',
    interests: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated || !user) {
      toast.error('Please sign in to create a trip plan');
      navigate('/login');
      return;
    }
    
    if (!formData.source || !formData.destination || !formData.startDate || 
        !formData.endDate || !formData.budget || !formData.travelers) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    try {
      setIsSubmitting(true);
      toast.info('Generating your personalized trip plan...');
      
      // Get the user's session for authentication
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;
      
      if (!token) {
        toast.error('Authentication error. Please sign in again.');
        navigate('/login');
        return;
      }
      
      const { data, error } = await supabase.functions.invoke('generate-trip-plan', {
        body: {
          source: formData.source,
          destination: formData.destination,
          startDate: formData.startDate,
          endDate: formData.endDate,
          budget: parseFloat(formData.budget),
          travelers: parseInt(formData.travelers),
          interests: formData.interests
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (error) {
        console.error('Error generating trip plan:', error);
        toast.error('Failed to generate trip plan');
        return;
      }
      
      toast.success('Trip plan generated successfully!');
      console.log('Trip plan generated:', data);
      
      // Reset form
      setFormData({
        source: '',
        destination: '',
        startDate: '',
        endDate: '',
        budget: '',
        travelers: '1',
        interests: ''
      });
      
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-2xl mx-auto"
    >
      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Plan Your Perfect Trip
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.div variants={inputVariants} className="space-y-2">
                <Label htmlFor="source" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Source Location
                </Label>
                <Input
                  id="source"
                  name="source"
                  value={formData.source}
                  onChange={handleChange}
                  placeholder="Where are you traveling from?"
                  required
                />
              </motion.div>
              
              <motion.div variants={inputVariants} className="space-y-2">
                <Label htmlFor="destination" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Destination
                </Label>
                <Input
                  id="destination"
                  name="destination"
                  value={formData.destination}
                  onChange={handleChange}
                  placeholder="Where do you want to go?"
                  required
                />
              </motion.div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.div variants={inputVariants} className="space-y-2">
                <Label htmlFor="startDate" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Start Date
                </Label>
                <Input
                  id="startDate"
                  name="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                />
              </motion.div>
              
              <motion.div variants={inputVariants} className="space-y-2">
                <Label htmlFor="endDate" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  End Date
                </Label>
                <Input
                  id="endDate"
                  name="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={handleChange}
                  required
                />
              </motion.div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.div variants={inputVariants} className="space-y-2">
                <Label htmlFor="budget" className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Budget (USD)
                </Label>
                <Input
                  id="budget"
                  name="budget"
                  type="number"
                  min="0"
                  value={formData.budget}
                  onChange={handleChange}
                  placeholder="Your total budget"
                  required
                />
              </motion.div>
              
              <motion.div variants={inputVariants} className="space-y-2">
                <Label htmlFor="travelers" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Number of Travelers
                </Label>
                <Input
                  id="travelers"
                  name="travelers"
                  type="number"
                  min="1"
                  value={formData.travelers}
                  onChange={handleChange}
                  required
                />
              </motion.div>
            </div>
            
            <motion.div variants={inputVariants} className="space-y-2">
              <Label htmlFor="interests" className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                Interests (Optional)
              </Label>
              <Textarea
                id="interests"
                name="interests"
                value={formData.interests}
                onChange={handleChange}
                placeholder="What are you interested in? E.g., museums, hiking, food, nightlife"
                rows={3}
              />
            </motion.div>
            
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
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TripPlanForm;
