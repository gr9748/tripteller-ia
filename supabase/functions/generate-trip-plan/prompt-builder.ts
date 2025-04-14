
export function buildTripPlanPrompt(tripDetails: {
  source: string;
  destination: string;
  startDate: string;
  endDate: string;
  budget: number;
  travelers: number;
  interests?: string;
}): string {
  const { source, destination, startDate, endDate, budget, travelers, interests } = tripDetails;
  
  return `
  Create a detailed travel plan with the following information:
  - Traveling from: ${source}
  - Destination: ${destination}
  - Travel dates: ${startDate} to ${endDate}
  - Budget: ₹${budget}
  - Number of travelers: ${travelers}
  ${interests ? `- Interests/preferences: ${interests}` : ''}

  IMPORTANT: The total cost of the trip MUST NOT exceed the specified budget of ₹${budget}. This is a strict constraint.
  
  Please provide a comprehensive travel plan that includes:
  1. Suggested flights from ${source} to ${destination} (with estimated prices in Indian Rupees)
  2. Recommended hotels or accommodations (with price ranges in Indian Rupees)
  3. Must-visit attractions and activities
  4. Food and restaurant recommendations
  5. ALL transportation options within ${destination} including:
     - Local flights
     - Trains
     - Buses
     - Car rentals
     - Taxis/rideshares
     - Ferries/boats (if applicable)
     - Metros/subways
     - Walking routes for attractions close to each other
  6. A day-by-day itinerary
  7. Budget breakdown for the entire trip in Indian Rupees
  8. Travel tips specific to ${destination}
  9. Fun activities and entertainment options for travelers

  BUDGET CONSTRAINT: The sum of all costs in the budget breakdown MUST be less than or equal to ₹${budget}. Make realistic choices that fit within this budget.

  Format your response as a JSON object with the following structure:
  {
    "summary": "Brief overview of the trip plan",
    "flights": [{"airline": "...", "price": "...", "departure": "...", "arrival": "..."}],
    "accommodations": [{"name": "...", "location": "...", "pricePerNight": "...", "totalCost": "..."}],
    "attractions": [{"name": "...", "description": "...", "estimatedCost": "..."}],
    "restaurants": [{"name": "...", "cuisine": "...", "priceRange": "..."}],
    "transportation": [
      {"type": "local flight", "route": "...", "cost": "...", "details": "..."},
      {"type": "train", "route": "...", "cost": "...", "details": "..."},
      {"type": "bus", "route": "...", "cost": "...", "details": "..."},
      {"type": "taxi", "route": "...", "cost": "...", "details": "..."},
      {"type": "metro", "route": "...", "cost": "...", "details": "..."},
      {"type": "ferry", "route": "...", "cost": "...", "details": "..."},
      {"type": "car rental", "details": "...", "costPerDay": "...", "totalCost": "..."}
    ],
    "itinerary": [{"day": 1, "activities": ["...", "..."], "meals": ["...", "..."], "transportation": ["...", "..."], "notes": "..."}],
    "budgetBreakdown": {"flights": "...", "accommodations": "...", "food": "...", "activities": "...", "transportation": "...", "total": "..."},
    "tips": ["...", "..."],
    "activities": [{"name": "...", "description": "...", "cost": "..."}]
  }

  IMPORTANT: 
  1. Use Indian Rupees (₹) for ALL monetary values. DO NOT use dollar signs ($) or other currencies.
  2. Make sure the total in budgetBreakdown.total is LESS THAN OR EQUAL TO ₹${budget}.
  3. All costs must be realistic and appropriate for the destination.
  4. If necessary, adjust accommodation quality, transportation options, or activity selections to stay within budget.
  `;
}

export function parseAIResponse(responseText: string, rawResponse: any) {
  try {
    // Try to extract JSON from the response text
    const startJson = responseText.indexOf("{");
    const endJson = responseText.lastIndexOf("}") + 1;
    
    if (startJson >= 0 && endJson > startJson) {
      const jsonStr = responseText.substring(startJson, endJson);
      return JSON.parse(jsonStr);
    } else {
      // Fallback if JSON parsing fails
      return { summary: responseText };
    }
  } catch (error) {
    console.error("Error parsing AI response:", error);
    return { 
      error: "Failed to parse AI response", 
      rawResponse: rawResponse 
    };
  }
}
