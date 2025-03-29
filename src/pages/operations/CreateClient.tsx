import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-react'
import ClientFormStepper from '@/components/operations/ClientForm/ClientFormStepper'

const CreateClientPage: React.FC = () => {
  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild className="flex items-center gap-1 mb-4">
          <Link to="/operations/clients">
            <ChevronLeft className="h-4 w-4" />
            Back to Clients
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Create New Client</h1>
        <p className="text-muted-foreground">Create a new client with sites and services</p>
      </div>

      <ClientFormStepper />
    </div>
  )
}

export default CreateClientPage
