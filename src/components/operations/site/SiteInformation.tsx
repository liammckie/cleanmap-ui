
import React from 'react'
import { format } from 'date-fns'
import { Building, MapPin, Calendar, Clock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { StatusBadge, ServiceTypeBadge } from './StatusBadges'
import { Site } from '@/schema/operations'

interface SiteInformationProps {
  site: Site
}

const SiteInformation: React.FC<SiteInformationProps> = ({ site }) => {
  const serviceType = site?.service_type || 'Internal'

  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <CardTitle>Site Information</CardTitle>
        <CardDescription>
          Details about this service location
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center mb-4">
          <StatusBadge status={site?.status || 'Active'} />
          {serviceType && <ServiceTypeBadge type={serviceType} />}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-md font-semibold mb-4">Location Details</h3>
            
            <div className="space-y-3">
              <div className="flex items-start">
                <Building className="h-4 w-4 mt-1 mr-2 text-muted-foreground" />
                <div>
                  <div className="font-medium">Site Type</div>
                  <div className="text-muted-foreground">{site?.site_type}</div>
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
                    {site?.service_frequency ? 
                      `${site.service_frequency.charAt(0).toUpperCase()}${site.service_frequency.slice(1)} service` : 
                      site?.custom_frequency ? site.custom_frequency : 'Not specified'}
                  </div>
                </div>
              </div>
              
              <div className="flex items-start">
                <Clock className="h-4 w-4 mt-1 mr-2 text-muted-foreground" />
                <div>
                  <div className="font-medium">Service Period</div>
                  <div className="text-muted-foreground">
                    Start: {site?.service_start_date ? format(new Date(site.service_start_date), 'PPP') : 'Not set'}<br />
                    End: {site?.service_end_date ? format(new Date(site.service_end_date), 'PPP') : 'Ongoing'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        {site?.special_instructions && (
          <div>
            <h3 className="text-md font-semibold mb-2">Special Instructions</h3>
            <div className="text-muted-foreground bg-muted/30 p-3 rounded-md">
              {site.special_instructions}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default SiteInformation
