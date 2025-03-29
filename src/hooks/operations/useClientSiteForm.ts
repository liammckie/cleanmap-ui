
import { useState, useEffect } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { calculateAllBillingFrequencies, BillingFrequency } from '@/utils/billingCalculations'

// Ensure this interface matches both usages in ClientSiteForm and SitePricingDetails
export interface PriceBreakdown {
  weekly: number
  monthly: number
  annual: number
}

export const useClientSiteForm = (form: UseFormReturn<any>, index: number) => {
  const [priceBreakdown, setPriceBreakdown] = useState<PriceBreakdown>({
    weekly: 0,
    monthly: 0,
    annual: 0, // This should be 'annual' to match the interface
  })

  // Recalculate price breakdown whenever price or frequency changes
  useEffect(() => {
    // Handle both standalone and in-client-form cases
    const fieldPrefix = index === -1 ? '' : `sites.${index}.`;
    const price = form.watch(`${fieldPrefix}price_per_week`) || 0;
    const frequency = (form.watch(`${fieldPrefix}price_frequency`) as BillingFrequency) || 'weekly';

    const breakdown = calculateAllBillingFrequencies(price, frequency);
    setPriceBreakdown({
      weekly: breakdown.weekly,
      monthly: breakdown.monthly,
      annual: breakdown.annually // Map the annually value from the calculation to annual
    });
  }, [
    form,
    index,
    form.watch(index === -1 ? 'price_per_week' : `sites.${index}.price_per_week`),
    form.watch(index === -1 ? 'price_frequency' : `sites.${index}.price_frequency`),
  ])

  return {
    priceBreakdown,
  }
}
