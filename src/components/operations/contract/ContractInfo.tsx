import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDate } from '@/utils/dateFormatters'
import type { Contract } from '@/schema/operations/contract.schema'

interface ContractInfoProps {
  contract: Contract
}

const ContractInfo: React.FC<ContractInfoProps> = ({ contract }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
    }).format(amount)
  }

  const getFrequencyText = (frequency: string) => {
    const frequencies: Record<string, string> = {
      weekly: 'Weekly',
      fortnightly: 'Fortnightly',
      monthly: 'Monthly',
      quarterly: 'Quarterly',
      annually: 'Annually',
    }
    return frequencies[frequency] || frequency
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Contract Details</CardTitle>
          <CardDescription>Contract information and financial terms</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Client</p>
              <p className="text-base">{contract.client?.company_name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Contract Type</p>
              <p className="text-base">{contract.contract_type}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Start Date</p>
              <p className="text-base">{formatDate(contract.start_date)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">End Date</p>
              <p className="text-base">{formatDate(contract.end_date)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Payment Terms</p>
              <p className="text-base">{contract.payment_terms || 'Not specified'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Auto Renew</p>
              <p className="text-base">{contract.auto_renew ? 'Yes' : 'No'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Billing Information</CardTitle>
          <CardDescription>Billing frequency and amounts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Billing Frequency</p>
              <p className="text-base">{getFrequencyText(contract.billing_frequency)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Base Fee ({getFrequencyText(contract.billing_frequency)})
              </p>
              <p className="text-base">{formatCurrency(contract.base_fee)}</p>
            </div>
            {contract.weekly_value !== undefined && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Weekly Value</p>
                <p className="text-base">{formatCurrency(contract.weekly_value)}</p>
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-muted-foreground">Monthly Value</p>
              <p className="text-base">{formatCurrency(contract.monthly_value)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Annual Value</p>
              <p className="text-base">{formatCurrency(contract.annual_value)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  )
}

export default ContractInfo
