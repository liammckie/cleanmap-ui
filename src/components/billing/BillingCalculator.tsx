import React, { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  calculateAllBillingFrequencies,
  formatCurrency,
  type BillingFrequency,
} from '@/utils/billingCalculations'

interface BillingCalculatorProps {
  initialAmount?: number
  initialFrequency?: BillingFrequency
  onCalculated?: (values: { weekly: number; monthly: number; annually: number }) => void
  readOnly?: boolean
}

const BillingCalculator: React.FC<BillingCalculatorProps> = ({
  initialAmount = 0,
  initialFrequency = 'monthly',
  onCalculated,
  readOnly = false,
}) => {
  const [amount, setAmount] = useState<number>(initialAmount)
  const [frequency, setFrequency] = useState<BillingFrequency>(initialFrequency)
  const [breakdown, setBreakdown] = useState({
    weekly: 0,
    monthly: 0,
    annually: 0,
  })

  useEffect(() => {
    const calculatedBreakdown = calculateAllBillingFrequencies(amount, frequency)
    setBreakdown(calculatedBreakdown)

    if (onCalculated) {
      onCalculated(calculatedBreakdown)
    }
  }, [amount, frequency, onCalculated])

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Billing Calculator</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {!readOnly && (
            <>
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                  step="0.01"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="frequency">Frequency</Label>
                <Select
                  value={frequency}
                  onValueChange={(value) => setFrequency(value as BillingFrequency)}
                >
                  <SelectTrigger id="frequency">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="fortnightly">Fortnightly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="annually">Annually</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
        </div>

        <div className="grid grid-cols-3 gap-4 bg-muted p-3 rounded-md">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Weekly</p>
            <p className="font-medium">{formatCurrency(breakdown.weekly)}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Monthly</p>
            <p className="font-medium">{formatCurrency(breakdown.monthly)}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Annually</p>
            <p className="font-medium">{formatCurrency(breakdown.annually)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default BillingCalculator
