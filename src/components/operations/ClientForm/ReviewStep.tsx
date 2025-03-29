import React from 'react'
import { UseFormReturn } from 'react-hook-form'

interface ReviewStepProps {
  form: UseFormReturn<any>
}

const ReviewStep: React.FC<ReviewStepProps> = ({ form }) => {
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
              {form.getValues('billing_address_street')}, {form.getValues('billing_address_city')},{' '}
              {form.getValues('billing_address_state')} {form.getValues('billing_address_postcode')}
            </p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold">Sites ({form.getValues('sites')?.length || 0})</h3>
        <div className="space-y-4 mt-2">
          {form.getValues('sites')?.map((site: any, index: number) => (
            <div key={index} className="p-3 border rounded-md">
              <p className="font-medium">{site.site_name}</p>
              <p className="text-sm">
                {site.address_street}, {site.address_city}, {site.address_state}{' '}
                {site.address_postcode}
              </p>
              <p className="text-sm">Service Type: {site.service_type}</p>
              <p className="text-sm">
                Period:{' '}
                {site.service_start_date
                  ? new Date(site.service_start_date).toLocaleDateString()
                  : 'N/A'}
                {site.service_end_date
                  ? ` to ${new Date(site.service_end_date).toLocaleDateString()}`
                  : ''}
              </p>
              <p className="text-sm font-medium mt-2">
                Price: ${site.price_per_service} ({site.price_frequency})
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ReviewStep
