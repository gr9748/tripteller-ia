
import { parseCurrencyToNumber } from './currencyUtils';

export const defaultAiResponse = {
  summary: "Your personalized trip plan",
  flights: [{ airline: "Sample Airline", price: "₹37,500", departure: "Your Location", arrival: "Destination" }],
  accommodations: [{ name: "Hotel Example", location: "City Center", pricePerNight: "₹7,500", totalCost: "₹30,000" }],
  attractions: [{ name: "Famous Landmark", description: "A beautiful place to visit", estimatedCost: "₹0" }],
  restaurants: [{ name: "Local Cuisine", cuisine: "Traditional", priceRange: "₹₹" }],
  transportation: [{ type: "Public Transit", cost: "₹1,500" }],
  itinerary: [
    { 
      day: 1, 
      activities: ["Arrive at destination", "Check in to accommodation"], 
      meals: ["Dinner at local restaurant"], 
      notes: "Rest after travel"
    }
  ],
  budgetBreakdown: { 
    flights: "₹37,500", 
    accommodations: "₹30,000", 
    food: "₹15,000", 
    activities: "₹7,500", 
    transportation: "₹3,750", 
    total: "₹93,750" 
  },
  tips: ["Book in advance", "Learn basic local phrases", "Check weather before packing"],
  activities: [{ name: "City Tour", description: "Explore the local area", cost: "₹2,250" }]
};

export const adjustPlanToFitBudget = (aiResponse: any, budget: number) => {
  if (!aiResponse || !aiResponse.budgetBreakdown) return;
  
  const scaleFactor = budget / parseCurrencyToNumber(aiResponse.budgetBreakdown.total);
  
  // Adjust budget breakdown
  Object.keys(aiResponse.budgetBreakdown).forEach(key => {
    if (key !== 'total' && typeof aiResponse.budgetBreakdown[key] === 'string') {
      const value = parseCurrencyToNumber(aiResponse.budgetBreakdown[key]);
      const adjustedValue = Math.round(value * scaleFactor);
      aiResponse.budgetBreakdown[key] = `₹${adjustedValue.toLocaleString('en-IN')}`;
    }
  });
  
  // Recalculate total
  let newTotal = 0;
  Object.keys(aiResponse.budgetBreakdown).forEach(key => {
    if (key !== 'total') {
      newTotal += parseCurrencyToNumber(aiResponse.budgetBreakdown[key]);
    }
  });
  aiResponse.budgetBreakdown.total = `₹${newTotal.toLocaleString('en-IN')}`;
  
  // Adjust accommodations
  if (Array.isArray(aiResponse.accommodations)) {
    aiResponse.accommodations.forEach((accommodation: any) => {
      if (accommodation.pricePerNight) {
        const price = parseCurrencyToNumber(accommodation.pricePerNight);
        accommodation.pricePerNight = `₹${Math.round(price * scaleFactor).toLocaleString('en-IN')}`;
      }
      if (accommodation.totalCost) {
        const cost = parseCurrencyToNumber(accommodation.totalCost);
        accommodation.totalCost = `₹${Math.round(cost * scaleFactor).toLocaleString('en-IN')}`;
      }
    });
  }
  
  // Adjust other cost items
  ['activities', 'attractions', 'flights', 'transportation'].forEach(category => {
    if (Array.isArray(aiResponse[category])) {
      aiResponse[category].forEach((item: any) => {
        ['cost', 'price', 'estimatedCost', 'costPerDay', 'totalCost'].forEach(costField => {
          if (item[costField]) {
            const cost = parseCurrencyToNumber(item[costField]);
            item[costField] = `₹${Math.round(cost * scaleFactor).toLocaleString('en-IN')}`;
          }
        });
      });
    }
  });
  
  // Update summary to mention budget adjustment
  if (aiResponse.summary) {
    aiResponse.summary = `${aiResponse.summary}\n\nNote: This plan has been optimized to fit within your budget of ₹${budget.toLocaleString('en-IN')}.`;
  }
};
