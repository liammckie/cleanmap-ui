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
import { FilePlus, Search, FilterX } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { fetchContracts } from '@/services/contractService';
import { format } from 'date-fns';
import type { Contract } from '@/schema/operations';

const StatusBadge = ({ status }: { status: string }) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'expiring':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'expired':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'terminated':
        return 'bg-red-100 text-red-800 border-red-200';
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

const ContractsPage = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<{
    clientId: string;
    status: string;
    contractType: string;
  }>({
    clientId: '',
    status: '',
    contractType: ''
  });

  const { data: contracts, isLoading, error } = useQuery({
    queryKey: ['contracts', searchTerm, filters],
    queryFn: () => fetchContracts(searchTerm, filters),
    meta: {
      onError: (err: Error) => {
        console.error('Failed to fetch contracts:', err);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to load contracts data. Please try again.',
        });
      }
    }
  });

  const clearFilters = () => {
    setFilters({
      clientId: '',
      status: '',
      contractType: ''
    });
    setSearchTerm('');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
    }).format(amount);
  };

  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Contracts</h1>
          <p className="text-muted-foreground">Manage service agreements with clients</p>
        </div>
        <Button className="flex items-center gap-2">
          <FilePlus className="h-4 w-4" />
          New Contract
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle>Search & Filter</CardTitle>
          <CardDescription>Find contracts by number, client, or status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search contracts..."
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
          <CardTitle>Contracts</CardTitle>
          <CardDescription>
            {isLoading ? 'Loading...' : `${contracts?.length || 0} contracts found`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="text-center py-4 text-red-500">
              Failed to load contracts data. Please try again.
            </div>
          ) : isLoading ? (
            <div className="text-center py-4">Loading contract data...</div>
          ) : contracts?.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              No contracts found. Try adjusting your search or filters.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Contract #</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Term</TableHead>
                  <TableHead>Contract Type</TableHead>
                  <TableHead>Billing</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contracts?.map((contract) => (
                  <TableRow key={contract.id} className="cursor-pointer hover:bg-muted">
                    <TableCell className="font-medium">
                      {contract.contract_number}
                    </TableCell>
                    <TableCell>{contract.client?.company_name}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>From: {format(new Date(contract.start_date), 'PP')}</div>
                        {contract.end_date && (
                          <div className="text-muted-foreground">
                            To: {format(new Date(contract.end_date), 'PP')}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{contract.contract_type}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{formatCurrency(contract.base_fee)}</div>
                        <div className="text-muted-foreground">{contract.billing_frequency}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={contract.status} />
                      {contract.under_negotiation && (
                        <div className="text-xs text-blue-600 mt-1">Under Negotiation</div>
                      )}
                    </TableCell>
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

export default ContractsPage;
