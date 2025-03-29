
import React from 'react'
import { UseFormReturn } from 'react-hook-form'
import { useClientSiteForm } from '@/hooks/operations/useClientSiteForm'
import SiteBasicDetails from './SiteBasicDetails'
import SiteAddressFields from './SiteAddressFields'
import SiteServiceDetails from './SiteServiceDetails'
import SitePricingDetails from './SitePricingDetails'
import SiteSpecialInstructions from './SiteSpecialInstructions'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'

interface ClientSiteFormProps {
  form: UseFormReturn<any>
  index: number
  onRemove: () => void
}

const ClientSiteForm: React.FC<ClientSiteFormProps> = ({ form, index, onRemove }) => {
  const { priceBreakdown } = useClientSiteForm(form, index)

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Site #{index + 1}</h3>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="text-red-500 hover:text-red-700 hover:bg-red-50"
          onClick={onRemove}
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Remove Site
        </Button>
      </div>

      <SiteBasicDetails form={form} index={index} />
      <SiteAddressFields form={form} index={index} />
      <SiteServiceDetails form={form} index={index} />
      <SitePricingDetails form={form} index={index} priceBreakdown={priceBreakdown} />
      <SiteSpecialInstructions form={form} index={index} />
    </div>
  )
}

export default ClientSiteForm
