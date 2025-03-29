
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Site } from '@/schema/operations'
import SiteInformation from './SiteInformation'
import ClientInformation from './ClientInformation'
import SiteLocation from './SiteLocation'

interface DetailTabsProps {
  site: Site
}

const DetailTabs: React.FC<DetailTabsProps> = ({ site }) => {
  const navigate = useNavigate()

  return (
    <Tabs defaultValue="details" className="w-full">
      <TabsList className="mb-6">
        <TabsTrigger value="details">Site Details</TabsTrigger>
        <TabsTrigger value="contracts">Contracts</TabsTrigger>
        <TabsTrigger value="work-orders">Work Orders</TabsTrigger>
      </TabsList>

      <TabsContent value="details" className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SiteInformation site={site} />
          <ClientInformation site={site} />
        </div>

        <SiteLocation site={site} />
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
  )
}

export default DetailTabs
