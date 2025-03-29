
import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'
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
import { calculateAllBillingFrequencies } from '@/utils/billingCalculations'
import { contractSchema } from '@/schema/operations/contract.schema'
import { fetchSitesByClientId } from '@/services/sites'

interface ContractFormProps {
  clients: any[]
  existingContract?: any
  onSubmit: (data: any) => void
  onCancel: () => void
  isLoading: boolean
  onSiteSelectionChange: (siteIds: string[]) => void
}

// Create a subset of the schema for form validation
const contractFormSchema = z.object({
  contract_number: z.string().min(1, 'Contract number is required'),
  contract_name: z.string().min(1, 'Contract name is required'),
  client_id: z.string().min(1, 'Client is required'),
  description: z.string().nullable().optional(),
  start_date: z.string().min(1, 'Start date is required'),
  end_date: z.string().min(1, 'End date is required'),
  status: z.string().min(1, 'Status is required'),
  contract_type: z.string().min(1, 'Contract type is required'),
  renewal_terms: z.string().nullable().optional(),
  notice_period_days: z.number().nullable().optional(),
  payment_terms: z.string().nullable().optional(),
  billing_frequency: z.string().min(1, 'Billing frequency is required'),
  base_fee: z.number().min(0, 'Base fee must be a positive number'),
  auto_renew: z.boolean().default(false),
  under_negotiation: z.boolean().default(false),
})

const ContractForm: React.FC<ContractFormProps> = ({
  clients,
  existingContract,
  onSubmit,
  onCancel,
  isLoading,
  onSiteSelectionChange,
}) => {
  const [selectedClientId, setSelectedClientId] = useState<string>(
    existingContract?.client_id || ''
  )
  const [selectedSites, setSelectedSites] = useState<string[]>(
    existingContract?.sites?.map((site: any) => site.site_id) || []
  )

  // Fetch sites for the selected client
  const {
    data: clientSites = [],
    isLoading: sitesLoading,
  } = useQuery({
    queryKey: ['sites', selectedClientId],
    queryFn: () => fetchSitesByClientId(selectedClientId),
    enabled: !!selectedClientId,
  })

  const form = useForm({
    resolver: zodResolver(contractFormSchema),
    defaultValues: existingContract || {
      contract_number: '',
      contract_name: '',
      client_id: '',
      description: '',
      start_date: new Date().toISOString().split('T')[0],
      end_date: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
      status: 'Active',
      contract_type: 'Service',
      renewal_terms: '',
      notice_period_days: 30,
      payment_terms: 'Net 30',
      billing_frequency: 'monthly',
      base_fee: 0,
      auto_renew: false,
      under_negotiation: false,
    },
  })

  // When client selection changes, update the available sites
  useEffect(() => {
    const clientId = form.watch('client_id')
    if (clientId !== selectedClientId) {
      setSelectedClientId(clientId)
      setSelectedSites([])
      onSiteSelectionChange([])
    }
  }, [form.watch('client_id')])

  // When selected sites change, notify parent
  useEffect(() => {
    onSiteSelectionChange(selectedSites)
  }, [selectedSites])

  const handleSiteToggle = (siteId: string) => {
    setSelectedSites(prev => {
      if (prev.includes(siteId)) {
        return prev.filter(id => id !== siteId)
      } else {
        return [...prev, siteId]
      }
    })
  }

  const handleFormSubmit = (data: any) => {
    // Calculate derived values based on base fee and frequency
    const { weekly, monthly, annually } = calculateAllBillingFrequencies(
      data.base_fee,
      data.billing_frequency
    )

    // Add calculated values to form data
    const formData = {
      ...data,
      weekly_value: weekly,
      monthly_value: monthly,
      annual_value: annually,
      start_date: new Date(data.start_date),
      end_date: new Date(data.end_date),
      notice_period_days: data.notice_period_days ? Number(data.notice_period_days) : null,
      base_fee: Number(data.base_fee),
    }

    onSubmit(formData)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="client_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Client</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select client" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.company_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="contract_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contract Number</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Service">Service</SelectItem>
                    <SelectItem value="Recurring">Recurring</SelectItem>
                    <SelectItem value="One-Time">One-Time</SelectItem>
                    <SelectItem value="Project">Project</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
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
                  <Input type="date" {...field} />
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
                  <Input type="date" {...field} />
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
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    value={field.value}
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
            name="auto_renew"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
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

          <FormField
            control={form.control}
            name="under_negotiation"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Under Negotiation</FormLabel>
                  <FormDescription>
                    Mark if this contract is currently being negotiated
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

        {selectedClientId && (
          <div className="border rounded-md p-4">
            <h3 className="text-lg font-medium mb-4">Select Sites</h3>
            {sitesLoading ? (
              <p>Loading sites...</p>
            ) : clientSites.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {clientSites.map((site: any) => (
                  <div key={site.id} className="flex items-start space-x-2">
                    <Checkbox
                      id={`site-${site.id}`}
                      checked={selectedSites.includes(site.id)}
                      onCheckedChange={() => handleSiteToggle(site.id)}
                    />
                    <div className="grid gap-1 leading-none">
                      <label
                        htmlFor={`site-${site.id}`}
                        className="text-sm font-medium leading-none cursor-pointer"
                      >
                        {site.site_name}
                      </label>
                      <p className="text-xs text-muted-foreground">
                        {site.address_street}, {site.address_city}, {site.address_state}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No sites available for the selected client.</p>
            )}
          </div>
        )}

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading || selectedSites.length === 0}>
            {isLoading ? 'Saving...' : 'Create Contract'}
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default ContractForm
