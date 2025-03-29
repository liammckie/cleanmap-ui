
import React from 'react'
import { UseFormReturn } from 'react-hook-form'
import { useClientSiteForm } from '@/hooks/operations/useClientSiteForm'
import SiteBasicDetails from './SiteBasicDetails'
import SiteAddressFields from './SiteAddressFields'
import SiteServiceDetails from './SiteServiceDetails'
import SitePricingDetails from './SitePricingDetails'
import SiteSpecialInstructions from './SiteSpecialInstructions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Trash2, ChevronDown, ChevronUp } from 'lucide-react'

interface ClientSiteFormProps {
  form: UseFormReturn<any>
  index: number
  onRemove: () => void
}

const ClientSiteForm: React.FC<ClientSiteFormProps> = ({ form, index, onRemove }) => {
  const { priceBreakdown } = useClientSiteForm(form, index)
  const [expanded, setExpanded] = React.useState(true)

  return (
    <Card className="space-y-4 border rounded-lg">
      <CardHeader className="pb-3 pt-4 px-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
            <h3 className="text-lg font-medium">Site #{index + 1}</h3>
            <span className="text-sm text-muted-foreground">
              ({form.watch(`sites.${index}.site_name`) || 'New Site'})
            </span>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
            onClick={onRemove}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Remove Site
          </Button>
        </div>
      </CardHeader>

      {expanded && (
        <CardContent className="space-y-6 px-4 pt-0 pb-4">
          <SiteBasicDetails form={form} index={index} />
          <SiteAddressFields form={form} index={index} />
          <SiteServiceDetails form={form} index={index} />
          <SitePricingDetails form={form} index={index} priceBreakdown={priceBreakdown} />
          <SiteSpecialInstructions form={form} index={index} />
        </CardContent>
      )}
    </Card>
  )
}

export default ClientSiteForm
