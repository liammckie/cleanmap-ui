import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { z } from 'zod'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { useToast } from '@/hooks/use-toast'
import { updateContract } from '@/services/contracts/contractCrudService'
import { Contract, isContractStatus, contractSchema } from '@/schema/operations/contract.schema'
import { calculateAllBillingFrequencies } from '@/utils/billingCalculations'

interface ContractEditFormProps {
  contract: Contract
  onSaved: () => void
  onCancel: () => void
}

const ContractEditForm: React.FC<ContractEditFormProps> = ({ contract, onSaved, onCancel }) => {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  // Create a subset of the schema for editing purposes
  const contractEditSchema = z.object({
    contract_name: z.string().min(1, 'Contract name is required'),
    description: z.string().nullable(),
    status: z
      .string()
      .refine((val) => isContractStatus(val), { message: 'Invalid contract status' }),
    contract_type: z.string().min(1, 'Contract type is required'),
    start_date: z.date(),
    end_date: z.date(),
    payment_terms: z.string().nullable(),
    billing_frequency: z.enum(['weekly', 'fortnightly', 'monthly', 'quarterly', 'annually']),
    base_fee: z.number().min(0, 'Base fee must be a positive number'),
    auto_renew: z.boolean(),
    renewal_terms: z.string().nullable(),
    under_negotiation: z.boolean().optional(),
    notes: z.string().nullable(),
  })

  type FormValues = z.infer<typeof contractEditSchema>

  const form = useForm<FormValues>({
    resolver: zodResolver(contractEditSchema),
    defaultValues: {
      contract_name: contract.contract_name,
      description: contract.description || null,
      status: contract.status,
      contract_type: contract.contract_type,
      start_date: new Date(contract.start_date),
      end_date: new Date(contract.end_date),
      payment_terms: contract.payment_terms || null,
      billing_frequency: contract.billing_frequency,
      base_fee: contract.base_fee,
      auto_renew: contract.auto_renew,
      renewal_terms: contract.renewal_terms || null,
      under_negotiation: contract.under_negotiation || false,
      notes: contract.notes || null,
    },
  })

  const updateMutation = useMutation({
    mutationFn: (data: Partial<Contract>) => updateContract(contract.id, data),
    onSuccess: () => {
      toast({
        title: 'Contract updated',
        description: 'The contract details have been updated successfully.',
      })
      queryClient.invalidateQueries({ queryKey: ['contract', contract.id] })
      queryClient.invalidateQueries({ queryKey: ['contracts'] })
      onSaved()
    },
    onError: (error) => {
      console.error('Error updating contract:', error)
      toast({
        variant: 'destructive',
        title: 'Update failed',
        description: 'There was a problem updating the contract. Please try again.',
      })
    },
  })

  const onSubmit = (data: FormValues) => {
    const baseAmount = data.base_fee
    const frequency = data.billing_frequency

    // Calculate billing values
    const { weekly, monthly, annually } = calculateAllBillingFrequencies(baseAmount, frequency)

    // Prepare the update data
    const updateData = {
      ...data,
      weekly_value: weekly,
      monthly_value: monthly,
      annual_value: annually,
    }

    updateMutation.mutate(updateData)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Contract</CardTitle>
        <CardDescription>Update the contract details</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="contract_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contract Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contract_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contract Type</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Expiring">Expiring</SelectItem>
                        <SelectItem value="Expired">Expired</SelectItem>
                        <SelectItem value="Terminated">Terminated</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="under_negotiation"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Under Negotiation</FormLabel>
                      <FormDescription>
                        Mark if this contract is currently being renegotiated
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="start_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        value={field.value ? new Date(field.value).toISOString().split('T')[0] : ''}
                        onChange={(e) => field.onChange(new Date(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="end_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        value={field.value ? new Date(field.value).toISOString().split('T')[0] : ''}
                        onChange={(e) => field.onChange(new Date(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="billing_frequency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Billing Frequency</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="fortnightly">Fortnightly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                        <SelectItem value="annually">Annually</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="base_fee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Base Fee</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>
                      Amount per {form.watch('billing_frequency')} billing cycle
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="payment_terms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Terms</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value || ''} />
                    </FormControl>
                    <FormDescription>E.g., Net 30, Due on Receipt</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="auto_renew"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Auto Renew</FormLabel>
                      <FormDescription>
                        Automatically renew this contract when it expires
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="renewal_terms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Renewal Terms</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      value={field.value || ''}
                      placeholder="Specify any special terms for contract renewal"
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      value={field.value || ''}
                      placeholder="Enter contract description"
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      value={field.value || ''}
                      placeholder="Additional notes about this contract"
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit" disabled={updateMutation.isPending}>
                {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default ContractEditForm
