import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from '@/components/ui/table';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { UserPlus, Search, FilterX } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { fetchClients } from '@/services/clients';
import type { Client } from '@/schema/operations';

const StatusBadge = ({ status }: { status: string }) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'on hold':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Badge className={`${getStatusColor(status)}`}>
      {status}
    </Badge>
  );
};

const ClientsPage = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<{
    status: string;
    industry: string;
  }>({
    status: '',
    industry: ''
  });

  const { data: clients, isLoading, error } = useQuery({
    queryKey: ['clients', searchTerm, filters],
    queryFn: () => fetchClients(searchTerm, filters),
    meta: {
      onError: (err: Error) => {
        console.error('Failed to fetch clients:', err);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to load clients data. Please try again.',
        });
      }
    }
  });

  const clearFilters = () => {
    setFilters({
      status: '',
      industry: ''
    });
    setSearchTerm('');
  };

  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Clients</h1>
          <p className="text-muted-foreground">Manage your client organizations</p>
        </div>
        <Button className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          Add Client
        </Button>
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
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={clearFilters}
            >
              <FilterX className="h-4 w-4" />
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Client Directory</CardTitle>
          <CardDescription>
            {isLoading ? 'Loading...' : `${clients?.length || 0} clients found`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="text-center py-4 text-red-500">
              Failed to load clients data. Please try again.
            </div>
          ) : isLoading ? (
            <div className="text-center py-4">Loading client data...</div>
          ) : clients?.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              No clients found. Try adjusting your search or filters.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
                  <TableHead>Billing Address</TableHead>
                  <TableHead>Contact Info</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment Terms</TableHead>
                  <TableHead>Industry</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clients?.map((client) => (
                  <TableRow key={client.id} className="cursor-pointer hover:bg-muted">
                    <TableCell className="font-medium">
                      {client.company_name}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{client.billing_address_street}</div>
                        <div className="text-muted-foreground">
                          {client.billing_address_city}, {client.billing_address_state} {client.billing_address_postcode}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {client.contact_email && <div>{client.contact_email}</div>}
                        {client.contact_phone && <div className="text-muted-foreground">{client.contact_phone}</div>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={client.status} />
                      {client.on_hold_reason && (
                        <div className="text-xs text-muted-foreground mt-1">{client.on_hold_reason}</div>
                      )}
                    </TableCell>
                    <TableCell>{client.payment_terms}</TableCell>
                    <TableCell>{client.industry || '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientsPage;
