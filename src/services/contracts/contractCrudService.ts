import { supabase } from '@/integrations/supabase/client'
import type { Contract } from '@/schema/operations/contract.schema'
import { prepareObjectForDb } from '@/utils/dateFormatters'
import { calculateAllBillingFrequencies, type BillingFrequency } from '@/utils/billingCalculations'

/**
 * Create a new contract
 */
export async function createContract(
  contract: Omit<Contract, 'id' | 'created_at' | 'updated_at'>,
  siteIds: string[],
) {
  if (
    contract.base_fee &&
    contract.billing_frequency &&
    (!contract.weekly_value || !contract.monthly_value || !contract.annual_value)
  ) {
    const { weekly, monthly, annually } = calculateAllBillingFrequencies(
      contract.base_fee,
      contract.billing_frequency as BillingFrequency,
    )

    contract.weekly_value = weekly
    contract.monthly_value = monthly
    contract.annual_value = annually
  }

  const dbContract = prepareObjectForDb(contract)

  const { data, error } = await supabase
    .from('contracts')
    .insert(dbContract as any)
    .select()

  if (error) {
    console.error('Error creating contract:', error)
    throw error
  }

  if (siteIds.length > 0) {
    const contractSites = siteIds.map((siteId) => ({
      contract_id: data[0].id,
      site_id: siteId,
    }))

    const { error: relationshipError } = await supabase.from('contract_sites').insert(contractSites)

    if (relationshipError) {
      console.error('Error creating contract-site relationships:', relationshipError)
      throw relationshipError
    }
  }

  return data[0] as unknown as Contract
}

/**
 * Update an existing contract
 */
export async function updateContract(id: string, updates: Partial<Contract>, siteIds?: string[]) {
  if (
    (updates.base_fee !== undefined || updates.billing_frequency !== undefined) &&
    (updates.base_fee || updates.billing_frequency)
  ) {
    let currentContract: Contract | null = null
    if (updates.base_fee === undefined || updates.billing_frequency === undefined) {
      const { data } = await supabase
        .from('contracts')
        .select('base_fee, billing_frequency')
        .eq('id', id)
        .single()
      currentContract = data as unknown as Contract
    }

    const baseAmount = updates.base_fee ?? currentContract?.base_fee ?? 0
    const frequency =
      updates.billing_frequency ??
      (currentContract?.billing_frequency as BillingFrequency) ??
      'monthly'

    const { weekly, monthly, annually } = calculateAllBillingFrequencies(baseAmount, frequency)

    updates.weekly_value = weekly
    updates.monthly_value = monthly
    updates.annual_value = annually
  }

  const dbUpdates = prepareObjectForDb(updates)

  const { data, error } = await supabase
    .from('contracts')
    .update(dbUpdates as any)
    .eq('id', id)
    .select()

  if (error) {
    console.error('Error updating contract:', error)
    throw error
  }

  return data[0] as unknown as Contract
}

/**
 * Delete a contract
 */
export async function deleteContract(id: string) {
  const { error } = await supabase.from('contracts').delete().eq('id', id)

  if (error) {
    console.error('Error deleting contract:', error)
    throw error
  }

  return true
}
