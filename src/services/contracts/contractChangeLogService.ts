
import { supabase } from '@/integrations/supabase/client';
import type { ContractChangeLog } from '@/schema/operations/contract.schema';

/**
 * Log a change to a contract
 */
export async function logContractChange(
  contractId: string, 
  changes: Record<string, any>, 
  reason: string, 
  changedBy: string
) {
  try {
    const changeLogEntry = {
      contract_id: contractId,
      change_date: new Date().toISOString(),
      changes_json: JSON.stringify(changes),
      change_type: reason,
      changed_by: changedBy,
      effective_date: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('contract_change_logs')
      .insert(changeLogEntry)
      .select();

    if (error) {
      console.error('Error logging contract change:', error);
      throw error;
    }

    return data[0] as unknown as ContractChangeLog;
  } catch (error) {
    console.error('Error logging contract change:', error);
    throw error;
  }
}

/**
 * Fetch changes for a contract
 */
export async function fetchContractChanges(contractId: string) {
  const { data, error } = await supabase
    .from('contract_change_logs')
    .select('*')
    .eq('contract_id', contractId)
    .order('change_date', { ascending: false });

  if (error) {
    console.error('Error fetching contract changes:', error);
    throw error;
  }

  return data as unknown as ContractChangeLog[];
}
