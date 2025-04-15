
export const parseCurrencyToNumber = (currencyStr: string): number => {
  if (!currencyStr) return 0;
  // Remove all non-numeric characters except decimal point
  const numericString = currencyStr.toString().replace(/[^\d.]/g, '');
  return parseFloat(numericString) || 0;
};

export const sanitizeCurrencyValues = (aiResponse: any) => {
  if (!aiResponse) return;
  
  // Process budget breakdown
  if (aiResponse.budgetBreakdown) {
    Object.keys(aiResponse.budgetBreakdown).forEach(key => {
      const value = aiResponse.budgetBreakdown[key];
      if (typeof value === 'string' && value.includes('$')) {
        aiResponse.budgetBreakdown[key] = value.replace(/\$/g, '₹');
      }
    });
  }
  
  // Process arrays of objects with cost properties
  ['flights', 'accommodations', 'attractions', 'transportation', 'activities'].forEach(category => {
    if (Array.isArray(aiResponse[category])) {
      aiResponse[category].forEach((item: any) => {
        Object.keys(item).forEach(key => {
          if (typeof item[key] === 'string' && 
              (key.toLowerCase().includes('cost') || key.toLowerCase().includes('price')) && 
              item[key].includes('$')) {
            item[key] = item[key].replace(/\$/g, '₹');
          }
        });
      });
    }
  });
  
  // Process restaurants price range
  if (Array.isArray(aiResponse.restaurants)) {
    aiResponse.restaurants.forEach((restaurant: any) => {
      if (restaurant.priceRange && restaurant.priceRange.includes('$')) {
        restaurant.priceRange = restaurant.priceRange.replace(/\$/g, '₹');
      }
    });
  }
};
