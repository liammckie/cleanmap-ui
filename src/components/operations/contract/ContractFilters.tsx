
import React, { useState, useEffect } from 'react'
import { Search, FilterX, Calendar } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { fetchClients } from '@/services/clients'
import { fetchContractTypes, fetchContractStatuses } from '@/services/contracts'
import { useQuery } from '@tanstack/react-query'

interface ContractFiltersProps {
  searchTerm: string
  setSearchTerm: (term: string) => void
  filters: {
    clientId: string
    status: string
    contractType: string
  }
  setFilters: (filters: any) => void
  clearFilters: () => void
}

const ContractFilters: React.FC<ContractFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  filters,
  setFilters,
  clearFilters,
}) => {
  // Fetch clients for dropdown
  const { data: clients = [] } = useQuery({
    queryKey: ['clients'],
    queryFn: () => fetchClients(),
  })

  // Fetch contract types for dropdown
  const { data: contractTypes = [] } = useQuery({
    queryKey: ['contractTypes'],
    queryFn: fetchContractTypes,
  })

  // Fetch contract statuses for dropdown
  const { data: contractStatuses = [] } = useQuery({
    queryKey: ['contractStatuses'],
    queryFn: fetchContractStatuses,
  })

  const handleFilterChange = (key: string, value: string) => {
    setFilters({ ...filters, [key]: value })
  }

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <CardTitle>Search & Filter</CardTitle>
        <CardDescription>Find contracts by number, client, or status</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search contracts..."
              className="pl-8 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <Select
                value={filters.clientId}
                onValueChange={(value) => handleFilterChange('clientId', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by client" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Clients</SelectItem>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.company_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Select
                value={filters.status}
                onValueChange={(value) => handleFilterChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {contractStatuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Select
                value={filters.contractType}
                onValueChange={(value) => handleFilterChange('contractType', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {contractTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button variant="outline" className="flex items-center gap-2" onClick={clearFilters}>
              <FilterX className="h-4 w-4" />
              Clear Filters
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default ContractFilters
