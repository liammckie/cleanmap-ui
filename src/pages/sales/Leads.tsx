import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useQuery } from '@tanstack/react-query'
import { fetchLeads } from '@/services/sales'

const LeadsPage = () => {
  const [searchTerm, setSearchTerm] = useState('')

  const {
    data: leads,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['leads', searchTerm],
    queryFn: () => fetchLeads(searchTerm),
  })

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Sales Pipeline</h1>
        <Button>New Lead</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Leads & Opportunities</CardTitle>
          <CardDescription>
            Manage your sales pipeline and track potential clients through the sales process.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading leads data...</p>
          ) : error ? (
            <p className="text-sm text-red-500">Error loading leads: {(error as Error).message}</p>
          ) : leads && leads.length > 0 ? (
            <div className="text-sm">
              <p className="font-medium">Found {leads.length} leads in the system</p>
              <p className="text-muted-foreground">
                This page will display a Kanban board or table view of leads by stage. You will be
                able to drag and drop leads between stages (Discovery, Proposal, Negotiation, etc.)
                and filter by various criteria.
              </p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No leads found. Create your first lead to get started with the sales pipeline.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default LeadsPage
