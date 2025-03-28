
import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { createClient } from '@/services/clients';
import { createSite } from '@/services/siteService';
import ClientDetailsForm from './ClientDetailsForm';
import ClientSitesList from './ClientSitesList';
import { clientSchema } from '@/schema/operations/client.schema';
import { siteSchema } from '@/schema/operations/site.schema';

// Modified client form schema - removing some validation to simplify for now
const clientFormSchema = z.object({
  company_name: z.string().min(1, "Company name is required"),
  contact_name: z.string().min(1, "Contact name is required"),
  contact_email: z.string().email("Valid email is required").nullable().optional(),
  contact_phone: z.string().nullable().optional(),
  billing_address_street: z.string().min(1, "Street address is required"),
  billing_address_city: z.string().min(1, "City is required"),
  billing_address_state: z.string().min(1, "State is required"),
  billing_address_postcode: z.string().min(1, "Postcode is required"),
  billing_address_zip: z.string().min(1, "ZIP code is required"),
  billing_address_country: z.string().min(1, "Country is required").default("Australia"),
  payment_terms: z.string().min(1, "Payment terms are required"),
  status: z.enum(['Active', 'On Hold']).default('Active'),
  industry: z.string().nullable().optional(),
  region: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  business_number: z.string().nullable().optional(),
  on_hold_reason: z.string().nullable().optional(),
  sites: z.array(
    z.object({
      site_name: z.string().min(1, "Site name is required"),
      site_type: z.string().min(1, "Site type is required"),
      address_street: z.string().min(1, "Street address is required"),
      address_city: z.string().min(1, "City is required"),
      address_state: z.string().min(1, "State is required"),
      address_postcode: z.string().min(1, "Postcode is required"),
      region: z.string().nullable().optional(),
      service_start_date: z.date().optional().nullable(),
      price_per_service: z.number().min(0, "Price must be 0 or greater"),
      price_frequency: z.string().min(1, "Billing frequency is required"),
      special_instructions: z.string().nullable().optional()
    })
  ).optional().default([])
});

type ClientFormValues = z.infer<typeof clientFormSchema>;

const STEPS = {
  CLIENT_DETAILS: 0,
  SITES: 1,
  REVIEW: 2
}

const ClientFormStepper: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(STEPS.CLIENT_DETAILS);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: {
      company_name: '',
      contact_name: '',
      contact_email: '',
      contact_phone: '',
      billing_address_street: '',
      billing_address_city: '',
      billing_address_state: '',
      billing_address_postcode: '',
      billing_address_zip: '',
      billing_address_country: 'Australia',
      payment_terms: 'Net 30',
      status: 'Active',
      industry: '',
      region: '',
      notes: '',
      business_number: '',
      on_hold_reason: '',
      sites: [
        {
          site_name: '',
          site_type: '',
          address_street: '',
          address_city: '',
          address_state: '',
          address_postcode: '',
          region: '',
          service_start_date: null,
          price_per_service: 0,
          price_frequency: 'monthly',
          special_instructions: ''
        }
      ]
    }
  });

  const nextStep = async () => {
    if (currentStep === STEPS.CLIENT_DETAILS) {
      // Validate only the client details fields
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
      // Validate site fields
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

  const onSubmit = async (data: ClientFormValues) => {
    try {
      setIsSubmitting(true);
      
      // Extract site data from the form
      const { sites, ...clientData } = data;
      
      // Create the client first
      const newClient = await createClient({
        ...clientData,
        latitude: null,
        longitude: null
      });
      
      // Then create each site, linking to the new client
      if (sites && sites.length > 0) {
        for (const siteData of sites) {
          // Format the site data correctly
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
            price_per_service: siteData.price_per_service,
            price_frequency: siteData.price_frequency
          });
        }
      }
      
      toast({
        title: "Success",
        description: "Client and sites created successfully.",
      });
      
      // Navigate to clients page
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

  const renderStepContent = () => {
    switch (currentStep) {
      case STEPS.CLIENT_DETAILS:
        return <ClientDetailsForm form={form} />;
      case STEPS.SITES:
        return <ClientSitesList form={form} />;
      case STEPS.REVIEW:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold">Client Details</h3>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Company Name</p>
                  <p className="text-sm">{form.getValues('company_name')}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Contact Name</p>
                  <p className="text-sm">{form.getValues('contact_name')}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Address</p>
                  <p className="text-sm">
                    {form.getValues('billing_address_street')}, {form.getValues('billing_address_city')}, {form.getValues('billing_address_state')} {form.getValues('billing_address_postcode')}
                  </p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold">Sites ({form.getValues('sites')?.length || 0})</h3>
              <div className="space-y-4 mt-2">
                {form.getValues('sites')?.map((site, index) => (
                  <div key={index} className="p-3 border rounded-md">
                    <p className="font-medium">{site.site_name}</p>
                    <p className="text-sm">{site.address_street}, {site.address_city}, {site.address_state} {site.address_postcode}</p>
                    <p className="text-sm font-medium mt-2">Price: ${site.price_per_service} ({site.price_frequency})</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>
          {currentStep === STEPS.CLIENT_DETAILS && "Step 1: Client Details"}
          {currentStep === STEPS.SITES && "Step 2: Add Sites"}
          {currentStep === STEPS.REVIEW && "Step 3: Review & Submit"}
        </CardTitle>
      </CardHeader>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent>
            {/* Step indicator */}
            <div className="flex mb-6">
              <div className={`flex-1 text-center relative ${currentStep >= STEPS.CLIENT_DETAILS ? 'text-primary' : 'text-muted-foreground'}`}>
                <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center mb-1 ${currentStep >= STEPS.CLIENT_DETAILS ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}>
                  1
                </div>
                <div className="text-xs">Client Details</div>
                <div className="absolute top-4 left-1/2 w-full h-0.5 bg-muted -z-10" />
              </div>
              
              <div className={`flex-1 text-center relative ${currentStep >= STEPS.SITES ? 'text-primary' : 'text-muted-foreground'}`}>
                <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center mb-1 ${currentStep >= STEPS.SITES ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}>
                  2
                </div>
                <div className="text-xs">Add Sites</div>
                <div className="absolute top-4 left-1/2 w-full h-0.5 bg-muted -z-10" />
              </div>
              
              <div className={`flex-1 text-center ${currentStep >= STEPS.REVIEW ? 'text-primary' : 'text-muted-foreground'}`}>
                <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center mb-1 ${currentStep >= STEPS.REVIEW ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}>
                  3
                </div>
                <div className="text-xs">Review</div>
              </div>
            </div>
            
            {renderStepContent()}
          </CardContent>
          
          <CardFooter className="flex justify-between">
            {currentStep > STEPS.CLIENT_DETAILS ? (
              <Button type="button" variant="outline" onClick={previousStep}>
                Back
              </Button>
            ) : (
              <div></div>
            )}
            
            {currentStep < STEPS.REVIEW ? (
              <Button type="button" onClick={nextStep}>
                Next
              </Button>
            ) : (
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Client & Sites"}
              </Button>
            )}
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default ClientFormStepper;
