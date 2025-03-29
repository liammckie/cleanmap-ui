
import { useState, useEffect } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { calculateAllBillingFrequencies, BillingFrequency } from '@/utils/billingCalculations'

interface PriceBreakdown {
  weekly: number
  monthly: number
  annually: number
}

export const useClientSiteForm = (form: UseFormReturn<any>, index: number) => {
  const [priceBreakdown, setPriceBreakdown] = useState<PriceBreakdown>({
    weekly: 0,
    monthly: 0,
    annually: 0,
  })

  // Recalculate price breakdown whenever price or frequency changes
  useEffect(() => {
    // Handle both standalone and in-client-form cases
    const fieldPrefix = index === -1 ? '' : `sites.${index}.`;
    const price = form.watch(`${fieldPrefix}price_per_service`) || 0;
    const frequency = (form.watch(`${fieldPrefix}price_frequency`) as BillingFrequency) || 'weekly';

    const breakdown = calculateAllBillingFrequencies(price, frequency);
    setPriceBreakdown(breakdown);
  }, [
    form,
    index,
    form.watch(index === -1 ? 'price_per_service' : `sites.${index}.price_per_service`),
    form.watch(index === -1 ? 'price_frequency' : `sites.${index}.price_frequency`),
  ])

  return {
    priceBreakdown,
  }
}
