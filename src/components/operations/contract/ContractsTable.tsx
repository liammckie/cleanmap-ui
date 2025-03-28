
import React from 'react';
import { Link } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, AlertCircle } from 'lucide-react';
import { formatDate } from '@/utils/dateFormatters';
import ContractStatusBadge from './ContractStatusBadge';
import type { Contract } from '@/schema/operations/contract.schema';

interface ContractsTableProps {
  contracts?: Contract[];
  isLoading: boolean;
  error?: Error;
}

const ContractsTable: React.FC<ContractsTableProps> = ({ 
  contracts, 
  isLoading,
  error
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-pulse text-center">
          <p className="text-muted-foreground">Loading contracts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8 text-center">
        <div className="flex flex-col items-center">
          <AlertCircle className="h-10 w-10 text-destructive mb-2" />
          <h3 className="font-semibold text-lg">Error loading contracts</h3>
          <p className="text-muted-foreground mt-1">
            {error.message || 'An unexpected error occurred. Please try again.'}
          </p>
        </div>
      </div>
    );
  }

  if (!contracts || contracts.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground">No contracts found.</p>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD'
    }).format(amount);
  };

  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Contract #</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
            <TableHead className="text-right">Monthly Value</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contracts.map((contract) => (
            <TableRow key={contract.id}>
              <TableCell className="font-medium">{contract.contract_number}</TableCell>
              <TableCell>{contract.client?.company_name}</TableCell>
              <TableCell>
                <ContractStatusBadge 
                  status={contract.status} 
                  underNegotiation={contract.under_negotiation}
                />
              </TableCell>
              <TableCell>{formatDate(contract.start_date)}</TableCell>
              <TableCell>{formatDate(contract.end_date)}</TableCell>
              <TableCell className="text-right">
                {formatCurrency(contract.monthly_value)}
              </TableCell>
              <TableCell className="text-center">
                <Button
                  variant="ghost" 
                  size="sm"
                  asChild
                >
                  <Link to={`/operations/contracts/${contract.id}`}>
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ContractsTable;
