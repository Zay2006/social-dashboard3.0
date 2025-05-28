import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(num: number | null | undefined): string {
  // Handle null, undefined, or NaN values
  if (num === null || num === undefined || isNaN(Number(num))) {
    return '0';
  }
  
  // Convert to number if it's a string
  const numValue = typeof num === 'string' ? parseFloat(num) : num;
  
  if (numValue >= 1000000) {
    return (numValue / 1000000).toFixed(1) + 'M';
  }
  if (numValue >= 1000) {
    return (numValue / 1000).toFixed(1) + 'K';
  }
  return numValue.toString();
}

export function formatPercentage(num: number | null | undefined): string {
  // Handle null, undefined, or NaN values
  if (num === null || num === undefined || isNaN(Number(num))) {
    return '0.0%';
  }
  
  // Convert to number if it's a string
  const numValue = typeof num === 'string' ? parseFloat(num) : num;
  
  return numValue > 0 ? `+${numValue.toFixed(1)}%` : `${numValue.toFixed(1)}%`;
}

export function getGrowthColor(growth: number | null | undefined): string {
  // Handle null, undefined, or NaN values
  if (growth === null || growth === undefined || isNaN(Number(growth))) {
    return 'text-gray-500';
  }
  
  // Convert to number if it's a string
  const growthValue = typeof growth === 'string' ? parseFloat(growth) : growth;
  
  return growthValue > 0 ? 'text-green-500' : growthValue < 0 ? 'text-red-500' : 'text-gray-500';
}
