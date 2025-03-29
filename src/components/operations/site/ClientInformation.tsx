
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Phone, Mail } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Site } from '@/schema/operations'

interface ClientInformationProps {
  site: Site
}

const ClientInformation: React.FC<ClientInformationProps> = ({ site }) => {
  const navigate = useNavigate()

  return (
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
            <div className="font-semibold text-lg">{site?.client?.company_name || 'Unknown Client'}</div>
            <Button 
              variant="link" 
              className="p-0 h-auto text-sm"
              onClick={() => navigate(`/operations/clients/${site?.client_id}`)}
            >
              View Client Details
            </Button>
          </div>

          {site?.primary_contact && (
            <div>
              <div className="font-medium">Site Contact</div>
              <div className="text-muted-foreground">
                {site.primary_contact}
              </div>
              
              {site.contact_phone && (
                <div className="flex items-center text-xs text-muted-foreground mt-1">
                  <Phone className="h-3 w-3 mr-1" />
                  <span>{site.contact_phone}</span>
                </div>
              )}
              
              {site.contact_email && (
                <div className="flex items-center text-xs text-muted-foreground mt-1">
                  <Mail className="h-3 w-3 mr-1" />
                  <span>{site.contact_email}</span>
                </div>
              )}
            </div>
          )}

          <div>
            <div className="font-medium">Pricing</div>
            <div className="text-muted-foreground">
              {site?.price_per_week ? (
                <div className="flex items-center">
                  <span>${site.price_per_week}</span>
                  <span className="text-xs text-muted-foreground ml-1">
                    /{site.price_frequency || 'week'}
                  </span>
                </div>
              ) : (
                'No pricing information available'
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default ClientInformation
