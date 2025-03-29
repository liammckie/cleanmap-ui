
import React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import ClientDetailsForm from './ClientDetailsForm'
import ClientSitesList from './ClientSitesList'
import StepperHeader from './StepperHeader'
import ReviewStep from './ReviewStep'
import { useClientForm, STEPS } from '@/hooks/operations/useClientForm'

// Schema for service items
const serviceItemSchema = z.object({
  id: z.number(),
  description: z.string().min(1, 'Description is required'),
  amount: z.number().min(0, 'Amount must be 0 or greater')
});

const clientFormSchema = z.object({
  company_name: z.string().min(1, 'Company name is required'),
  primary_contact: z.string().min(1, 'Primary contact is required'),
  contact_name: z.string().nullable().optional(),
  contact_email: z.string().email('Valid email is required').nullable().optional(),
  contact_phone: z.string().nullable().optional(),
  billing_address_street: z.string().min(1, 'Street address is required'),
  billing_address_city: z.string().min(1, 'City is required'),
  billing_address_state: z.string().min(1, 'State is required'),
  billing_address_postcode: z.string().min(1, 'Postcode is required'),
  billing_address_zip: z.string().min(1, 'ZIP code is required'),
  billing_address_country: z.string().min(1, 'Country is required').default('Australia'),
  payment_terms: z.string().min(1, 'Payment terms are required'),
  status: z.enum(['Active', 'On Hold']).default('Active'),
  industry: z.string().nullable().optional(),
  region: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  business_number: z.string().nullable().optional(),
  on_hold_reason: z.string().nullable().optional(),
  sites: z
    .array(
      z.object({
        site_name: z.string().min(1, 'Site name is required'),
        site_type: z.string().min(1, 'Site type is required'),
        
        // Contact information
        primary_contact: z.string().nullable().optional(),
        contact_phone: z.string().nullable().optional(),
        contact_email: z.string().email('Valid email is required').nullable().optional(),
        
        // Address fields
        address_street: z.string().min(1, 'Street address is required'),
        address_city: z.string().min(1, 'City is required'),
        address_state: z.string().min(1, 'State is required'),
        address_postcode: z.string().min(1, 'Postcode is required'),
        region: z.string().nullable().optional(),
        
        // Service details
        service_start_date: z.date().nullable(),
        service_end_date: z.date().nullable().optional(),
        service_type: z.enum(['Internal', 'Contractor']).default('Internal'),
        service_frequency: z.string().nullable().optional(),
        custom_frequency: z.string().nullable().optional(),
        
        // Pricing details
        price_per_service: z.number().min(0, 'Price must be 0 or greater'),
        price_frequency: z.string().min(1, 'Billing frequency is required'),
        service_items: z.array(serviceItemSchema).optional(),
        
        special_instructions: z.string().nullable().optional(),
      }),
    )
    .optional()
    .default([]),
})

type ClientFormValues = z.infer<typeof clientFormSchema>

const ClientFormStepper: React.FC = () => {
  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: {
      company_name: '',
      primary_contact: '',
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
          primary_contact: '',
          contact_phone: '',
          contact_email: '',
          address_street: '',
          address_city: '',
          address_state: '',
          address_postcode: '',
          region: '',
          service_start_date: null,
          service_end_date: null,
          service_type: 'Internal',
          service_frequency: 'weekly',
          custom_frequency: '',
          price_per_service: 0,
          price_frequency: 'weekly',
          service_items: [{ id: 0, description: 'Regular cleaning', amount: 0 }],
          special_instructions: '',
        },
      ],
    },
  })

  const { currentStep, isSubmitting, nextStep, previousStep, onSubmit } = useClientForm(form)

  const renderStepContent = () => {
    switch (currentStep) {
      case STEPS.CLIENT_DETAILS:
        return <ClientDetailsForm form={form} />
      case STEPS.SITES:
        return <ClientSitesList form={form} />
      case STEPS.REVIEW:
        return <ReviewStep form={form} />
      default:
        return null
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>
          {currentStep === STEPS.CLIENT_DETAILS && 'Step 1: Client Details'}
          {currentStep === STEPS.SITES && 'Step 2: Add Sites'}
          {currentStep === STEPS.REVIEW && 'Step 3: Review & Submit'}
        </CardTitle>
      </CardHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent>
            <StepperHeader currentStep={currentStep} steps={STEPS} />
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
                {isSubmitting ? 'Creating...' : 'Create Client & Sites'}
              </Button>
            )}
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}

export default ClientFormStepper
