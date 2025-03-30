
import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MapIcon, BarChart3, PieChart, AlertTriangle } from 'lucide-react'
import ReportsMap from '@/components/reports/ReportsMap'
import { ErrorAnalytics } from '@/components/documentation/ErrorAnalytics'

const Reports = () => {
  const [activeTab, setActiveTab] = useState<string>('locations')

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Reports Dashboard</h1>
        <p className="text-muted-foreground">
          View analytics and insights about your cleaning operations
        </p>
      </div>

      <Tabs defaultValue="locations" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="locations" className="flex items-center gap-2">
            <MapIcon className="h-4 w-4" />
            <span>Locations Map</span>
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span>Performance</span>
          </TabsTrigger>
          <TabsTrigger value="financial" className="flex items-center gap-2">
            <PieChart className="h-4 w-4" />
            <span>Financial</span>
          </TabsTrigger>
          <TabsTrigger value="errors" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            <span>Error Analytics</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="locations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cleaning Locations Overview</CardTitle>
              <CardDescription>
                Interactive map showing all active cleaning locations and staff allocation
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <ReportsMap />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>
                Charts and analytics about your operation performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                Performance charts coming soon
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financial" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Financial Reports</CardTitle>
              <CardDescription>Revenue, costs and profitability reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                Financial charts coming soon
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="errors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Build Error Analytics</CardTitle>
              <CardDescription>
                Track and analyze TypeScript errors to improve code quality
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ErrorAnalytics />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Reports
