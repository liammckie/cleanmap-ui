
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { fetchClients, deleteClient } from '@/services/clients'
import { formatDate } from '@/utils/dateFormatters'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Plus, Edit, Trash2, AlertCircle } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { confirm } from '@/components/ui/confirm'
import AddClientDialog from '@/components/operations/client/AddClientDialog'
import { useMutation, useQueryClient } from '@tanstack/react-query'

interface Client {
  id: string;
  company_name: string;
  contact_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  status: string;
}

const ClientsPage: React.FC = () => {
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState({})
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const {
    data: clients,
    isLoading,
    error,
    refetch: refetchClients,
  } = useQuery({
    queryKey: ['clients', search, filters],
    queryFn: () => fetchClients({ search, filters }),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteClient(id),
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Client deleted successfully',
      })
      queryClient.invalidateQueries({ queryKey: ['clients'] })
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to delete client. Please try again.',
      })
    },
  })

  const handleDelete = async (clientId: string) => {
    const confirmed = await confirm({
      title: 'Delete Client',
      description: 'Are you sure you want to delete this client? This action cannot be undone.',
    })

    if (confirmed) {
      deleteMutation.mutate(clientId)
    }
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Clients</h1>
          <CardDescription>Manage client organizations and their details</CardDescription>
        </div>

        <div className="flex items-center gap-3">
          <AddClientDialog onClientAdded={() => refetchClients()} />
          <Button asChild>
            <Link to="/operations/clients/create">Add with Sites</Link>
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Search and Filter</CardTitle>
          <CardDescription>Find clients by name or filter by status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
            <div>
              <Label htmlFor="search">Search</Label>
              <Input
                type="search"
                id="search"
                placeholder="Search by company name"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Client List</CardTitle>
          <CardDescription>View and manage existing clients</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Loading clients...</p>
          ) : error ? (
            <div className="flex flex-col items-center justify-center gap-2">
              <AlertCircle className="h-10 w-10 text-destructive" />
              <h2 className="text-xl font-bold">Error Loading Clients</h2>
              <p className="text-muted-foreground">
                {error instanceof Error ? error.message : 'An unexpected error occurred.'}
              </p>
            </div>
          ) : clients && clients.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clients.map((client: Client) => (
                  <TableRow key={client.id}>
                    <TableCell className="font-medium">{client.company_name}</TableCell>
                    <TableCell>{client.contact_name}</TableCell>
                    <TableCell>{client.contact_email}</TableCell>
                    <TableCell>{client.contact_phone}</TableCell>
                    <TableCell>{client.status}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" asChild>
                          <Link to={`/operations/clients/${client.id}`}>
                            <Edit className="h-4 w-4 mr-2" />
                            View
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive/90"
                          onClick={() => handleDelete(client.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p>No clients found.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default ClientsPage
