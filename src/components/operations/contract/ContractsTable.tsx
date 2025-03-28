
import React from 'react';
import { format } from 'date-fns';
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from '@/components/ui/table';
import ContractStatusBadge from './ContractStatusBadge';
import type { Contract } from '@/schema/operations/contract.schema';

interface ContractsTableProps {
  contracts: Contract[] | null;
  isLoading: boolean;
  error: Error | null;
}

const ContractsTable: React.FC<ContractsTableProps> = ({
  contracts,
  isLoading,
  error
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
    }).format(amount);
  };

  if (error) {
    return (
      <div className="text-center py-4 text-red-500">
        Failed to load contracts data. Please try again.
      </div>
    );
  }

  if (isLoading) {
    return <div className="text-center py-4">Loading contract data...</div>;
  }

  if (!contracts || contracts.length === 0) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        No contracts found. Try adjusting your search or filters.
      </div>
    );
  }

  return (
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
        {contracts.map((contract) => (
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
              <ContractStatusBadge 
                status={contract.status} 
                underNegotiation={contract.under_negotiation} 
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ContractsTable;
