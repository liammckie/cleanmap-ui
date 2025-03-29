
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { ArrowLeft } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { fetchClients } from '@/services/clients'
import { createContract } from '@/services/contracts'
import { contractSchema } from '@/schema/operations/contract.schema'
import ContractForm from '@/components/operations/contract/ContractForm'

const CreateContractPage = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [selectedSiteIds, setSelectedSiteIds] = useState<string[]>([])
  
  // Fetch clients for dropdown
  const { data: clients = [] } = useQuery({
    queryKey: ['clients'],
    queryFn: () => fetchClients(),
  })

  const createMutation = useMutation({
    mutationFn: (data: any) => {
      return createContract(data, selectedSiteIds)
    },
    onSuccess: (data) => {
      toast({
        title: 'Contract created',
        description: 'The contract has been created successfully.',
      })
      navigate(`/operations/contracts/${data.id}`)
    },
    onError: (error) => {
      console.error('Error creating contract:', error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'There was a problem creating the contract. Please try again.',
      })
    },
  })

  const handleCancel = () => {
    navigate('/operations/contracts')
  }

  const handleSubmit = (data: any) => {
    createMutation.mutate(data)
  }

  return (
    <div className="container mx-auto py-6 max-w-5xl">
      <div className="flex justify-between items-center mb-6">
        <Button variant="ghost" onClick={handleCancel} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Contracts
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create New Contract</CardTitle>
          <CardDescription>Enter contract details to create a new service agreement</CardDescription>
        </CardHeader>
        <CardContent>
          <ContractForm 
            clients={clients}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={createMutation.isPending}
            onSiteSelectionChange={setSelectedSiteIds}
          />
        </CardContent>
      </Card>
    </div>
  )
}

export default CreateContractPage
