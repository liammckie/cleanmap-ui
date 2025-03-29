
import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FilePlus } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast' 
import { fetchContracts } from '@/services/contracts'
import ContractFilters from '@/components/operations/contract/ContractFilters'
import ContractsTable from '@/components/operations/contract/ContractsTable'

const ContractsPage = () => {
  const { toast } = useToast()
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState<{
    clientId: string
    status: string
    contractType: string
  }>({
    clientId: 'all',
    status: 'all',
    contractType: 'all',
  })

  const {
    data: contracts,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['contracts', searchTerm, filters],
    queryFn: () => fetchContracts(searchTerm, filters),
    onError: (err: Error) => {
      console.error('Failed to fetch contracts:', err)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load contracts data. Please try again.',
      })
    },
  })

  const clearFilters = () => {
    setFilters({
      clientId: 'all',
      status: 'all',
      contractType: 'all',
    })
    setSearchTerm('')
  }

  const handleCreateContract = () => {
    navigate('/operations/contracts/create')
  }

  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Contracts</h1>
          <p className="text-muted-foreground">Manage service agreements with clients</p>
        </div>
        <Button className="flex items-center gap-2" onClick={handleCreateContract}>
          <FilePlus className="h-4 w-4" />
          New Contract
        </Button>
      </div>

      <ContractFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filters={filters}
        setFilters={setFilters}
        clearFilters={clearFilters}
      />

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Contracts</CardTitle>
          <CardDescription>
            {isLoading ? 'Loading...' : `${contracts?.length || 0} contracts found`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ContractsTable contracts={contracts} isLoading={isLoading} error={error as Error} />
        </CardContent>
      </Card>
    </div>
  )
}

export default ContractsPage
