
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Edit, Save, FileClock } from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { fetchContractById } from '@/services/contracts/contractQueryService';
import ContractStatusBadge from '@/components/operations/contract/ContractStatusBadge';
import ContractDetailsSkeleton from '@/components/operations/contract/ContractDetailsSkeleton';
import ContractInfo from '@/components/operations/contract/ContractInfo';
import ContractSites from '@/components/operations/contract/ContractSites';
import ContractEditForm from '@/components/operations/contract/ContractEditForm';

const ContractDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);

  const { data: contract, isLoading, error } = useQuery({
    queryKey: ['contract', id],
    queryFn: () => fetchContractById(id || ''),
    meta: {
      onSettled: (_data, error) => {
        if (error) {
          console.error('Failed to fetch contract:', error);
          toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Failed to load contract details. Please try again.',
          });
        }
      }
    },
    enabled: !!id
  });

  const handleGoBack = () => {
    navigate('/operations/contracts');
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  if (isLoading) {
    return <ContractDetailsSkeleton />;
  }

  if (error || !contract) {
    return (
      <div className="container mx-auto py-6 max-w-5xl">
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={handleGoBack} className="mr-2">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Contracts
          </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>
              Failed to load contract details. The contract may not exist or there was a problem connecting to the server.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleGoBack}>Return to Contracts List</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 max-w-5xl">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Button variant="ghost" onClick={handleGoBack} className="mr-2">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Contracts
          </Button>
        </div>
        <div className="flex items-center gap-2">
          {!isEditing ? (
            <Button onClick={toggleEdit} className="flex items-center gap-2">
              <Edit className="h-4 w-4" />
              Edit Contract
            </Button>
          ) : (
            <Button onClick={toggleEdit} variant="outline" className="flex items-center gap-2">
              <FileClock className="h-4 w-4" />
              Cancel Editing
            </Button>
          )}
        </div>
      </div>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-2xl font-bold">
                Contract #{contract.contract_number}
              </CardTitle>
              <CardDescription>
                {contract.contract_name}
              </CardDescription>
            </div>
            <ContractStatusBadge 
              status={contract.status} 
              underNegotiation={contract.under_negotiation}
            />
          </CardHeader>
        </Card>
        
        {isEditing ? (
          <ContractEditForm 
            contract={contract} 
            onSaved={() => setIsEditing(false)} 
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <>
            <ContractInfo contract={contract} />
            <ContractSites contract={contract} />
          </>
        )}
      </div>
    </div>
  );
};

export default ContractDetails;
