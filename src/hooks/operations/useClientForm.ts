
import { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { createClient } from '@/services/clients';
import { createSite } from '@/services/siteService';
import { calculateAllBillingFrequencies } from '@/utils/billingCalculations';
import type { BillingFrequency } from '@/utils/billingCalculations';

export const STEPS = {
  CLIENT_DETAILS: 0,
  SITES: 1,
  REVIEW: 2
};

export const useClientForm = (form: UseFormReturn<any>) => {
  const [currentStep, setCurrentStep] = useState(STEPS.CLIENT_DETAILS);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const nextStep = async () => {
    if (currentStep === STEPS.CLIENT_DETAILS) {
      const clientFields = [
        'company_name', 'contact_name', 'billing_address_street', 
        'billing_address_city', 'billing_address_state', 
        'billing_address_postcode', 'billing_address_country', 
        'payment_terms'
      ];
      
      const result = await form.trigger(clientFields as any);
      if (result) {
        setCurrentStep(STEPS.SITES);
      }
    } else if (currentStep === STEPS.SITES) {
      const result = await form.trigger('sites');
      if (result) {
        setCurrentStep(STEPS.REVIEW);
      }
    }
  };

  const previousStep = () => {
    if (currentStep === STEPS.SITES) {
      setCurrentStep(STEPS.CLIENT_DETAILS);
    } else if (currentStep === STEPS.REVIEW) {
      setCurrentStep(STEPS.SITES);
    }
  };

  const onSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);
      
      const { sites, ...clientData } = data;
      
      const newClient = await createClient({
        company_name: clientData.company_name,
        contact_name: clientData.contact_name,
        contact_email: clientData.contact_email || null,
        contact_phone: clientData.contact_phone || null,
        billing_address_street: clientData.billing_address_street,
        billing_address_city: clientData.billing_address_city,
        billing_address_state: clientData.billing_address_state,
        billing_address_zip: clientData.billing_address_zip,
        billing_address_postcode: clientData.billing_address_postcode,
        billing_address_country: clientData.billing_address_country,
        payment_terms: clientData.payment_terms,
        status: clientData.status,
        industry: clientData.industry || null,
        region: clientData.region || null,
        notes: clientData.notes || null,
        business_number: clientData.business_number || null,
        on_hold_reason: clientData.on_hold_reason || null,
        latitude: null,
        longitude: null
      });
      
      if (sites && sites.length > 0) {
        for (const siteData of sites) {
          const { weekly, monthly, annually } = calculateAllBillingFrequencies(
            siteData.price_per_service,
            siteData.price_frequency as BillingFrequency
          );

          await createSite({
            client_id: newClient.id,
            site_name: siteData.site_name,
            site_code: null,
            street_address: siteData.address_street,
            city: siteData.address_city,
            state: siteData.address_state,
            zip_code: siteData.address_postcode,
            country: 'Australia',
            contact_name: null,
            contact_email: null,
            contact_phone: null,
            square_footage: null,
            floors: null,
            site_type: siteData.site_type,
            region: siteData.region || null,
            status: 'Active',
            notes: siteData.special_instructions || null,
            latitude: null,
            longitude: null,
            service_start_date: siteData.service_start_date,
            service_end_date: siteData.service_end_date,
            service_type: siteData.service_type,
            price_per_service: siteData.price_per_service,
            price_frequency: siteData.price_frequency
          });
        }
      }
      
      toast({
        title: "Success",
        description: "Client and sites created successfully.",
      });
      
      navigate('/operations/clients');
    } catch (error) {
      console.error('Error creating client and sites:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create client and sites. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    currentStep,
    isSubmitting,
    STEPS,
    nextStep,
    previousStep,
    onSubmit
  };
};
