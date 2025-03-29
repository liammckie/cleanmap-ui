
import React from 'react'
import { UseFormReturn } from 'react-hook-form'
import { formatCurrency } from '@/utils/billingCalculations'

interface ReviewStepProps {
  form: UseFormReturn<any>
}

const ReviewStep: React.FC<ReviewStepProps> = ({ form }) => {
  return (
    <div className="space-y-6">
      <div className="border rounded-md p-4">
        <h3 className="text-lg font-semibold">Client Details</h3>
        <div className="grid grid-cols-2 gap-4 mt-2">
          <div className="space-y-1">
            <p className="text-sm font-medium">Company Name</p>
            <p className="text-sm">{form.getValues('company_name')}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">Primary Contact</p>
            <p className="text-sm">{form.getValues('primary_contact') || 'Not specified'}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">Alternative Contact</p>
            <p className="text-sm">{form.getValues('contact_name') || 'Not specified'}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">Contact Information</p>
            <p className="text-sm">
              {form.getValues('contact_email') || 'No email'} | {form.getValues('contact_phone') || 'No phone'}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">Address</p>
            <p className="text-sm">
              {form.getValues('billing_address_street')}, {form.getValues('billing_address_city')},{' '}
              {form.getValues('billing_address_state')} {form.getValues('billing_address_postcode')}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">Payment Terms</p>
            <p className="text-sm">{form.getValues('payment_terms')}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">Industry</p>
            <p className="text-sm">{form.getValues('industry') || 'Not specified'}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">Status</p>
            <p className="text-sm">{form.getValues('status')}</p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Sites ({form.getValues('sites')?.length || 0})</h3>
        <div className="space-y-4">
          {form.getValues('sites')?.map((site: any, index: number) => (
            <div key={index} className="p-4 border rounded-md">
              <h4 className="font-medium text-base">{site.site_name}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                <div>
                  <p className="text-sm text-muted-foreground">Site Type</p>
                  <p className="text-sm">{site.site_type}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Primary Contact</p>
                  <p className="text-sm">{site.primary_contact || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Address</p>
                  <p className="text-sm">
                    {site.address_street}, {site.address_city}, {site.address_state}{' '}
                    {site.address_postcode}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Service Type</p>
                  <p className="text-sm">{site.service_type}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Service Period</p>
                  <p className="text-sm">
                    {site.service_start_date
                      ? new Date(site.service_start_date).toLocaleDateString()
                      : 'N/A'}
                    {site.service_end_date
                      ? ` to ${new Date(site.service_end_date).toLocaleDateString()}`
                      : ''}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Service Frequency</p>
                  <p className="text-sm">{site.service_frequency || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Price</p>
                  <p className="text-sm">
                    ${site.price_per_service} ({site.price_frequency})
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Annualized Value</p>
                  <p className="text-sm">{formatCurrency(site.price_per_service * 52)}</p>
                </div>
              </div>
              {site.special_instructions && (
                <div className="mt-2">
                  <p className="text-sm text-muted-foreground">Special Instructions</p>
                  <p className="text-sm">{site.special_instructions}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ReviewStep
