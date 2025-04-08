
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

export function formatCurrency(amount: number): string {
  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  } catch (error) {
    console.error('Error formatting currency:', error);
    return `₹${amount}`;
  }
}

export function truncateText(text: string, maxLength: number = 100): string {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export function convertToRupees(value: string | number | undefined): string {
  if (!value) return '₹0';
  
  if (typeof value === 'string') {
    // Remove any non-numeric characters except for dots
    const numericValue = value.replace(/[^\d.]/g, '');
    if (numericValue === '') return '₹0';
    
    // Convert to rupees (assuming dollar values need to be multiplied by 75)
    // This is a simplification - real currency conversion would use current rates
    const amount = parseFloat(numericValue) * 75;
    return `₹${Math.round(amount).toLocaleString('en-IN')}`;
  }
  
  if (typeof value === 'number') {
    return `₹${Math.round(value * 75).toLocaleString('en-IN')}`;
  }
  
  return '₹0';
}

export function getLocationQueryParam(location: string): string {
  return encodeURIComponent(location);
}
