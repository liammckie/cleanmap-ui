
import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { 
  MapPin, 
  Building, 
  Calendar, 
  Clock, 
  ClipboardCheck, 
  User, 
  Phone, 
  Mail,
  ArrowLeft
} from 'lucide-react'
import { format } from 'date-fns'
import { Site } from '@/schema/operations'
import { fetchSiteById } from '@/services/sites/siteCoreService'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'
import SiteMap from '@/components/Map/SiteMap'

const StatusBadge = ({ status }: { status: string }) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'inactive':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'pending launch':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'suspended':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return <Badge className={`${getStatusColor(status)}`}>{status}</Badge>
}

const ServiceTypeBadge = ({ type }: { type: string }) => {
  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'internal':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'contractor':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return <Badge className={`${getTypeColor(type)}`}>{type}</Badge>
}

const SiteDetailsPage: React.FC = () => {
  const { siteId } = useParams<{ siteId: string }>()
  const navigate = useNavigate()
  const { toast } = useToast()

  const {
    data: site,
    isLoading,
    error
  } = useQuery({
    queryKey: ['site', siteId],
    queryFn: () => fetchSiteById(siteId as string),
    enabled: !!siteId,
    meta: {
      onError: (err: Error) => {
        console.error('Failed to fetch site:', err)
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to load site data. Please try again.'
        })
      }
    }
  })

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 max-w-7xl">
        <div className="flex items-center mb-6">
          <Button variant="ghost" className="mr-4" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Loading site...</h1>
          </div>
        </div>
        <div className="grid gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <div className="h-full w-full bg-muted/20 animate-pulse rounded-md p-8"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error || !site) {
    return (
      <div className="container mx-auto py-6">
        <Button variant="ghost" className="mb-4" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Sites
        </Button>
        <Card className="p-6 text-center">
          <div className="flex flex-col items-center justify-center gap-2">
            <h2 className="text-xl font-bold">Error Loading Site</h2>
            <p className="text-muted-foreground">
              {error instanceof Error ? error.message : 'Failed to load site details'}
            </p>
            <Button className="mt-4" onClick={() => navigate('/operations/site-list')}>
              Return to Sites List
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  // Parse coordinates for map display
  const coordinates = site.coordinates
    ? site.coordinates.split(',').map(Number)
    : [0, 0]
  
  const siteLocation = {
    id: site.id,
    name: site.site_name,
    lat: coordinates[0] || 0,
    lng: coordinates[1] || 0,
    count: 1,
    address: site.address_street,
    city: site.address_city,
    clientName: site.clients?.company_name
  }

  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button variant="ghost" className="mr-4" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{site.site_name}</h1>
            <p className="text-muted-foreground flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              {site.address_city}, {site.address_state}
              {site.region && <span className="ml-2">• Region: {site.region}</span>}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate(`/operations/sites/edit/${site.id}`)}>
            Edit Site
          </Button>
          <Button onClick={() => navigate(`/operations/work-orders/create?siteId=${site.id}`)}>
            Create Work Order
          </Button>
        </div>
      </div>

      <Tabs defaultValue="details" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="details">Site Details</TabsTrigger>
          <TabsTrigger value="contracts">Contracts</TabsTrigger>
          <TabsTrigger value="work-orders">Work Orders</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Site Information</CardTitle>
                <CardDescription>
                  Details about this service location
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center mb-4">
                  <StatusBadge status={site.status} />
                  {/* Fixed: Use default 'Internal' if service_type is missing */}
                  <ServiceTypeBadge type={site.service_type || 'Internal'} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-md font-semibold mb-4">Location Details</h3>
                    
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <Building className="h-4 w-4 mt-1 mr-2 text-muted-foreground" />
                        <div>
                          <div className="font-medium">Site Type</div>
                          <div className="text-muted-foreground">{site.site_type}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <MapPin className="h-4 w-4 mt-1 mr-2 text-muted-foreground" />
                        <div>
                          <div className="font-medium">Address</div>
                          <div className="text-muted-foreground">
                            {site.address_street}<br />
                            {site.address_city}, {site.address_state} {site.address_postcode}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-md font-semibold mb-4">Service Details</h3>
                    
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <Calendar className="h-4 w-4 mt-1 mr-2 text-muted-foreground" />
                        <div>
                          <div className="font-medium">Service Schedule</div>
                          <div className="text-muted-foreground">
                            {/* Fixed: Handle missing service_frequency */}
                            {site.service_frequency || 'Not specified'}
                            {/* Fixed: Handle missing custom_frequency */}
                            {site.custom_frequency && <span> - {site.custom_frequency}</span>}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <Clock className="h-4 w-4 mt-1 mr-2 text-muted-foreground" />
                        <div>
                          <div className="font-medium">Service Period</div>
                          <div className="text-muted-foreground">
                            Start: {site.service_start_date ? format(new Date(site.service_start_date), 'PPP') : 'Not set'}<br />
                            {/* Fixed: Handle missing service_end_date */}
                            End: {site.service_end_date ? format(new Date(site.service_end_date), 'PPP') : 'Ongoing'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />

                {site.special_instructions && (
                  <div>
                    <h3 className="text-md font-semibold mb-2">Special Instructions</h3>
                    <div className="text-muted-foreground bg-muted/30 p-3 rounded-md">
                      {site.special_instructions}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Client Information</CardTitle>
                <CardDescription>
                  Client who owns this site
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    {/* Fixed: Use clients instead of client */}
                    <div className="font-semibold text-lg">{site.clients?.company_name}</div>
                    <Button 
                      variant="link" 
                      className="p-0 h-auto text-sm"
                      onClick={() => navigate(`/operations/clients/${site.client_id}`)}
                    >
                      View Client Details
                    </Button>
                  </div>

                  {/* Fixed: Check if primary_contact exists */}
                  {site.primary_contact && (
                    <div className="space-y-2">
                      <div className="font-medium">Site Contact</div>
                      
                      <div className="flex items-start">
                        <User className="h-4 w-4 mt-1 mr-2 text-muted-foreground" />
                        <div className="text-muted-foreground">{site.primary_contact}</div>
                      </div>
                      
                      {/* Fixed: Check if contact_phone exists */}
                      {site.contact_phone && (
                        <div className="flex items-start">
                          <Phone className="h-4 w-4 mt-1 mr-2 text-muted-foreground" />
                          <div className="text-muted-foreground">{site.contact_phone}</div>
                        </div>
                      )}
                      
                      {/* Fixed: Check if contact_email exists */}
                      {site.contact_email && (
                        <div className="flex items-start">
                          <Mail className="h-4 w-4 mt-1 mr-2 text-muted-foreground" />
                          <div className="text-muted-foreground">{site.contact_email}</div>
                        </div>
                      )}
                    </div>
                  )}

                  <div>
                    <div className="font-medium">Pricing</div>
                    <div className="text-muted-foreground">
                      {/* Fixed: Check if price_per_week exists */}
                      {site.price_per_week 
                        ? `$${site.price_per_week} per week`
                        : 'No pricing information available'}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Site Location</CardTitle>
              <CardDescription>
                Map view of this service location
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 h-[350px]">
              <SiteMap locations={[siteLocation]} isFullscreen={false} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contracts">
          <Card>
            <CardHeader>
              <CardTitle>Associated Contracts</CardTitle>
              <CardDescription>
                Contracts associated with this site
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Contract details for this site will be shown here.
              </p>
              <Button className="mt-4" onClick={() => navigate(`/operations/contracts?siteId=${site.id}`)}>
                View All Contracts
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="work-orders">
          <Card>
            <CardHeader>
              <CardTitle>Work Orders</CardTitle>
              <CardDescription>
                Work orders scheduled for this site
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Work orders for this site will be shown here.
              </p>
              <Button className="mt-4" onClick={() => navigate(`/operations/work-orders?siteId=${site.id}`)}>
                View All Work Orders
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default SiteDetailsPage
