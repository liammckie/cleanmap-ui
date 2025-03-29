
import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { fetchClients } from '@/services/clients'
import { Search, FilterX, UserPlus } from 'lucide-react'
import { ClientCard } from '@/components/operations/ClientCard'
import AddClientDialog from '@/components/operations/client/AddClientDialog'
import type { Client } from '@/schema/operations/client.schema'
import { Link } from 'react-router-dom'

const ClientsPage = () => {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState<{
    status: 'Active' | 'On Hold' | '';
    industry: string;
  }>({
    status: '',
    industry: '',
  })

  const {
    data: clients,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['clients', searchTerm, filters],
    queryFn: () => fetchClients({ 
      search: searchTerm, 
      filters: {
        status: filters.status as 'Active' | 'On Hold' || undefined,
        industry: filters.industry || undefined
      }
    }),
  })

  const clearFilters = () => {
    setFilters({
      status: '',
      industry: '',
    })
    setSearchTerm('')
  }

  const handleClientAdded = () => {
    // Refetch clients data when a new client is added
    refetch()
    toast({
      title: 'Client list updated',
      description: 'The client list has been refreshed with the new client.',
    })
  }

  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Clients</h1>
          <p className="text-muted-foreground">Manage your client organizations</p>
        </div>
        <div className="flex gap-2">
          <AddClientDialog onClientAdded={handleClientAdded}>
            <Button variant="outline" className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Quick Add
            </Button>
          </AddClientDialog>
          <Button className="flex items-center gap-2" asChild>
            <Link to="/operations/clients/create">
              <UserPlus className="h-4 w-4" />
              Add with Sites
            </Link>
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle>Search & Filter</CardTitle>
          <CardDescription>Find clients by name, contact info, or other criteria</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search clients..."
                className="pl-8 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" className="flex items-center gap-2" onClick={clearFilters}>
              <FilterX className="h-4 w-4" />
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="mb-4">
        {isLoading ? (
          <p className="text-center text-muted-foreground">Loading clients...</p>
        ) : error ? (
          <p className="text-center text-red-500">Error loading clients. Please try again.</p>
        ) : clients?.length === 0 ? (
          <p className="text-center text-muted-foreground">
            No clients found. Try adjusting your search or add a new client.
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">{clients?.length} clients found</p>
        )}
      </div>

      {!isLoading && !error && clients && clients.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clients.map((client) => (
            <ClientCard
              key={client.id}
              client={client as Client}
              onClick={() => {
                console.log('Clicked client:', client.id)
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default ClientsPage
