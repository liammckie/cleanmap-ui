
/**
 * Utility functions for billing calculations between different frequencies
 */

export type BillingFrequency = 'weekly' | 'fortnightly' | 'monthly' | 'quarterly' | 'annually'

interface BillingConversionFactors {
  weekly: number
  fortnightly: number
  monthly: number
  quarterly: number
  annually: number
}

// Conversion factors relative to a weekly amount
const CONVERSION_FACTORS: BillingConversionFactors = {
  weekly: 1,
  fortnightly: 2,
  monthly: 4.33, // Average weeks in a month (52/12)
  quarterly: 13, // 3 months worth of weeks
  annually: 52,
}

/**
 * Converts an amount from one billing frequency to another
 * @param amount The monetary amount to convert
 * @param fromFrequency The frequency the amount is currently in
 * @param toFrequency The target frequency to convert to
 * @returns The converted amount
 */
export function convertBillingAmount(
  amount: number,
  fromFrequency: BillingFrequency,
  toFrequency: BillingFrequency,
): number {
  // Convert to weekly rate first
  const weeklyRate = amount / CONVERSION_FACTORS[fromFrequency]

  // Convert from weekly to target frequency
  const convertedAmount = weeklyRate * CONVERSION_FACTORS[toFrequency]

  // Return rounded to 2 decimal places
  return Math.round(convertedAmount * 100) / 100
}

/**
 * Calculates weekly, monthly, and annual amounts from a base amount
 * @param amount The base monetary amount
 * @param frequency The frequency of the base amount
 * @returns Object containing weekly, monthly, and annual amounts
 */
export function calculateAllBillingFrequencies(
  amount: number,
  frequency: BillingFrequency,
): { weekly: number; monthly: number; annually: number } {
  if (amount === 0 || !amount) {
    return { weekly: 0, monthly: 0, annually: 0 }
  }

  const weeklyAmount = convertBillingAmount(amount, frequency, 'weekly')
  const monthlyAmount = convertBillingAmount(amount, frequency, 'monthly')
  const annualAmount = convertBillingAmount(amount, frequency, 'annually')

  return {
    weekly: weeklyAmount,
    monthly: monthlyAmount,
    annually: annualAmount, // Changed from 'annual' to 'annually' for consistency
  }
}

/**
 * Formats a monetary value as currency
 * @param amount The amount to format
 * @param currency The currency code (default: AUD)
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number, currency: string = 'AUD'): string {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: currency,
  }).format(amount)
}
