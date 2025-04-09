
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string): string {
  if (!dateString) return 'N/A';
  
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
}

export function formatCurrency(amount: number | string | undefined | null): string {
  if (amount === undefined || amount === null) return '₹0';
  
  try {
    const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    
    if (isNaN(numericAmount)) return '₹0';
    
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(numericAmount);
  } catch (error) {
    console.error('Error formatting currency:', error);
    return `₹${amount}`;
  }
}

export function truncateText(text: string, maxLength: number = 100): string {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export function convertToRupees(value: string | number | undefined | null): string {
  if (value === undefined || value === null) return '₹0';
  
  try {
    // Convert to a number first
    let numericValue: number;
    
    if (typeof value === 'string') {
      // Remove any non-numeric characters except for dots
      const cleanedValue = value.replace(/[^\d.]/g, '');
      if (cleanedValue === '') return '₹0';
      numericValue = parseFloat(cleanedValue);
    } else {
      numericValue = value;
    }
    
    if (isNaN(numericValue)) return '₹0';
    
    // Convert to rupees (using current approximate exchange rate)
    const inrAmount = Math.round(numericValue * 75);
    
    // Format the number with commas for thousands
    return `₹${inrAmount.toLocaleString('en-IN')}`;
  } catch (error) {
    console.error('Error converting to rupees:', error);
    return '₹0';
  }
}

export function getLocationQueryParam(location: string): string {
  if (!location) return '';
  return encodeURIComponent(location);
}
