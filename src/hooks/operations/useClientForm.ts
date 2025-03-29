
import { useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { useToast } from '@/hooks/use-toast'
import { useNavigate } from 'react-router-dom'
import { createClient } from '@/services/clients'
import { createSite } from '@/services/sites'
import { calculateAllBillingFrequencies } from '@/utils/billingCalculations'
import type { BillingFrequency } from '@/utils/billingCalculations'
import type { SiteInsert } from '@/schema/operations/site.schema'
import type { ClientInsert } from '@/schema/operations/client.schema'

export const STEPS = {
  CLIENT_DETAILS: 0,
  SITES: 1,
  REVIEW: 2,
}

export const useClientForm = (form: UseFormReturn<any>) => {
  const [currentStep, setCurrentStep] = useState(STEPS.CLIENT_DETAILS)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const navigate = useNavigate()

  const nextStep = async () => {
    if (currentStep === STEPS.CLIENT_DETAILS) {
      const clientFields = [
        'company_name',
        'primary_contact',
        'billing_address_street',
        'billing_address_city',
        'billing_address_state',
        'billing_address_postcode',
        'payment_terms',
      ]

      const result = await form.trigger(clientFields as any)
      if (result) {
        setCurrentStep(STEPS.SITES)
      }
    } else if (currentStep === STEPS.SITES) {
      const result = await form.trigger('sites')
      if (result) {
        setCurrentStep(STEPS.REVIEW)
      }
    }
  }

  const previousStep = () => {
    if (currentStep === STEPS.SITES) {
      setCurrentStep(STEPS.CLIENT_DETAILS)
    } else if (currentStep === STEPS.REVIEW) {
      setCurrentStep(STEPS.SITES)
    }
  }

  const onSubmit = async (data: any) => {
    try {
      setIsSubmitting(true)
      console.log('Form data submitted:', data);

      const { sites, ...clientData } = data

      // Create the client using our mapper
      const clientPayload: ClientInsert = {
        company_name: clientData.company_name,
        contact_name: clientData.contact_name || null,
        contact_email: clientData.contact_email || null,
        contact_phone: clientData.contact_phone || null,
        billing_address_street: clientData.billing_address_street,
        billing_address_city: clientData.billing_address_city,
        billing_address_state: clientData.billing_address_state,
        billing_address_postcode: clientData.billing_address_postcode,
        payment_terms: clientData.payment_terms,
        status: clientData.status as 'Active' | 'On Hold',
        industry: clientData.industry || null,
        region: clientData.region || null,
        notes: clientData.notes || null,
        business_number: clientData.business_number || null,
        on_hold_reason: clientData.on_hold_reason || null,
      };

      console.log('Sending client data to API:', clientPayload);
      const newClient = await createClient(clientPayload)
      console.log('Client created successfully:', newClient);

      if (sites && sites.length > 0) {
        for (const siteData of sites) {
          // Process service items if present
          let serviceItems = null;
          if (siteData.service_items && Array.isArray(siteData.service_items)) {
            serviceItems = siteData.service_items;
          }

          // Create site using our mapper
          const sitePayload: SiteInsert = {
            client_id: newClient.id,
            site_name: siteData.site_name,
            site_type: siteData.site_type,
            
            // Contact info
            primary_contact: siteData.primary_contact || null,
            contact_phone: siteData.contact_phone || null,
            contact_email: siteData.contact_email || null,
            
            // Address
            address_street: siteData.address_street,
            address_city: siteData.address_city,
            address_state: siteData.address_state,
            address_postcode: siteData.address_postcode,
            region: siteData.region || null,
            
            // Service details
            service_start_date: siteData.service_start_date,
            service_end_date: siteData.service_end_date,
            service_frequency: siteData.service_frequency || null,
            custom_frequency: siteData.custom_frequency || null,
            service_type: siteData.service_type || 'Internal',
            
            // Pricing
            price_per_service: siteData.price_per_service || 0,
            price_frequency: siteData.price_frequency || 'weekly',
            service_items: serviceItems,
            
            special_instructions: siteData.special_instructions || null,
            status: 'Active',
          };

          console.log('Sending site data to API:', sitePayload);
          const newSite = await createSite(sitePayload);
          console.log('Site created successfully:', newSite);
        }
      }

      toast({
        title: 'Success',
        description: 'Client and sites created successfully.',
      })

      navigate('/operations/clients')
    } catch (error) {
      console.error('Error creating client and sites:', error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to create client and sites. Please try again.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    currentStep,
    isSubmitting,
    STEPS,
    nextStep,
    previousStep,
    onSubmit,
  }
}
