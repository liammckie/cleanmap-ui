import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { ChevronLeft } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useQuery } from '@tanstack/react-query'
import { fetchClients } from '@/services/clients'
import { createSite } from '@/services/sites'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import SiteBasicDetails from '@/components/operations/ClientForm/SiteBasicDetails'
import SiteAddressFields from '@/components/operations/ClientForm/SiteAddressFields'
import SiteServiceDetails from '@/components/operations/ClientForm/SiteServiceDetails'
import SitePricingDetails from '@/components/operations/ClientForm/SitePricingDetails'
import SiteSpecialInstructions from '@/components/operations/ClientForm/SiteSpecialInstructions'
import { useClientSiteForm } from '@/hooks/operations/useClientSiteForm'
import { getCoordinatesFromAddress, formatCoordinatesForStorage } from '@/utils/googleMaps'

const serviceItemSchema = z.object({
  id: z.number(),
  description: z.string().min(1, 'Description is required'),
  amount: z.number().min(0, 'Amount must be 0 or greater'),
  frequency: z.string().default('weekly'),
  provider: z.enum(['Internal', 'Contractor']).default('Internal')
});

const siteSchema = z.object({
  site_name: z.string().min(1, 'Site name is required'),
  site_type: z.string().min(1, 'Site type is required'),
  client_id: z.string().min(1, 'Client is required'),
  
  primary_contact: z.string().nullable().optional(),
  contact_phone: z.string().nullable().optional(),
  contact_email: z.string().email('Valid email is required').nullable().optional(),
  
  address_street: z.string().min(1, 'Street address is required'),
  address_city: z.string().min(1, 'City is required'),
  address_state: z.string().min(1, 'State is required'),
  address_postcode: z.string().min(1, 'Postcode is required'),
  region: z.string().nullable().optional(),
  
  service_start_date: z.date().nullable(),
  service_end_date: z.date().nullable().optional(),
  service_type: z.enum(['Internal', 'Contractor']).default('Internal'),
  service_frequency: z.string().nullable().optional(),
  custom_frequency: z.string().nullable().optional(),
  
  price_per_week: z.number().min(0, 'Price must be 0 or greater'),
  price_frequency: z.string().min(1, 'Billing frequency is required'),
  service_items: z.array(serviceItemSchema).optional(),
  
  special_instructions: z.string().nullable().optional(),
  
  coordinates: z.string().nullable().optional(),
})

type SiteFormValues = z.infer<typeof siteSchema>

const CreateSitePage: React.FC = () => {
  const { toast } = useToast()
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedClient, setSelectedClient] = useState<string | null>(null)

  const { data: clients, isLoading: clientsLoading } = useQuery({
    queryKey: ['clients-minimal'],
    queryFn: () => fetchClients({ search: '', filters: {} }),
  })

  const form = useForm<SiteFormValues>({
    resolver: zodResolver(siteSchema),
    defaultValues: {
      site_name: '',
      site_type: '',
      client_id: '',
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
      price_per_week: 0,
      price_frequency: 'weekly',
      service_items: [{ id: 0, description: 'Regular cleaning', amount: 0, frequency: 'weekly', provider: 'Internal' }],
      special_instructions: '',
      coordinates: null,
    },
  })

  const { priceBreakdown } = useClientSiteForm(form, -1)

  const handleClientChange = (clientId: string) => {
    setSelectedClient(clientId)
    form.setValue('client_id', clientId)
    
    const client = clients?.find(c => c.id === clientId)
    if (client) {
      if (client.region) {
        form.setValue('region', client.region)
      }
    }
  }

  const onSubmit = async (data: SiteFormValues) => {
    try {
      setIsSubmitting(true)
      
      let coordinates = null
      try {
        const fullAddress = `${data.address_street}, ${data.address_city}, ${data.address_state} ${data.address_postcode}, Australia`
        const coords = await getCoordinatesFromAddress(fullAddress)
        coordinates = formatCoordinatesForStorage(coords)
      } catch (error) {
        console.error('Error geocoding address:', error)
      }
      
      const serviceItems = data.service_items?.map(item => ({
        id: item.id,
        description: item.description,
        amount: Number(item.amount),
        frequency: item.frequency || 'weekly',
        provider: item.provider || 'Internal'
      })) || []
      
      const siteData = {
        ...data,
        price_per_week: Number(data.price_per_week),
        service_items: serviceItems,
        coordinates
      }
      
      console.log('Submitting site data:', siteData)
      await createSite(siteData)
      
      toast({
        title: 'Success',
        description: 'Site created successfully',
      })
      
      navigate('/operations/site-list')
    } catch (error) {
      console.error('Error creating site:', error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to create site. Please try again.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild className="flex items-center gap-1 mb-4">
          <Link to="/operations/site-list">
            <ChevronLeft className="h-4 w-4" />
            Back to Sites
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Create New Site</h1>
        <p className="text-muted-foreground">Add a new service location for an existing client</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Client Selection</CardTitle>
              <CardDescription>Select the client this site belongs to</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {clientsLoading ? (
                  <p>Loading clients...</p>
                ) : (
                  <Select
                    value={form.watch('client_id')}
                    onValueChange={handleClientChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a client" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients?.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.company_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            </CardContent>
          </Card>

          {selectedClient && (
            <Card className="space-y-4">
              <CardHeader>
                <CardTitle>Site Details</CardTitle>
                <CardDescription>Enter the details for this site</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <SiteBasicDetails form={form} index={-1} />
                <SiteAddressFields form={form} index={-1} />
                <SiteServiceDetails form={form} index={-1} />
                <SitePricingDetails 
                  form={form} 
                  index={-1} 
                  priceBreakdown={priceBreakdown} 
                />
                <SiteSpecialInstructions form={form} index={-1} />
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" type="button" onClick={() => navigate('/operations/site-list')}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Creating...' : 'Create Site'}
                </Button>
              </CardFooter>
            </Card>
          )}
        </form>
      </Form>
    </div>
  )
}

export default CreateSitePage
