import React from 'react'
import { UseFormReturn } from 'react-hook-form'
import { useClientSiteForm } from '@/hooks/operations/useClientSiteForm'
import SiteBasicDetails from './SiteBasicDetails'
import SiteAddressFields from './SiteAddressFields'
import SiteServiceDetails from './SiteServiceDetails'
import SitePricingDetails from './SitePricingDetails'
import SiteSpecialInstructions from './SiteSpecialInstructions'

interface ClientSiteFormProps {
  form: UseFormReturn<any>
  index: number
  onRemove: () => void
}

const ClientSiteForm: React.FC<ClientSiteFormProps> = ({ form, index, onRemove }) => {
  const { priceBreakdown } = useClientSiteForm(form, index)

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <h3 className="text-lg font-medium">Site #{index + 1}</h3>

      <SiteBasicDetails form={form} index={index} />
      <SiteAddressFields form={form} index={index} />
      <SiteServiceDetails form={form} index={index} />
      <SitePricingDetails form={form} index={index} priceBreakdown={priceBreakdown} />
      <SiteSpecialInstructions form={form} index={index} />

      <button
        type="button"
        className="text-red-500 hover:text-red-700 text-sm mt-2"
        onClick={onRemove}
      >
        Remove Site
      </button>
    </div>
  )
}

export default ClientSiteForm
