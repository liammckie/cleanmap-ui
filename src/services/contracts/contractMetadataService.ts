
import { supabase } from '@/integrations/supabase/client';
import type { Contract } from '@/schema/operations/contract.schema';

/**
 * Fetch all available contract types
 */
export async function fetchContractTypes() {
  try {
    const { data, error } = await supabase
      .from('contracts')
      .select('contract_type')
      .order('contract_type');

    if (error) {
      console.error('Error fetching contract types:', error);
      throw error;
    }

    const types = [...new Set(data.map(contract => contract.contract_type))].filter(Boolean);
    return types;
  } catch (error) {
    console.error('Error fetching contract types:', error);
    throw error;
  }
}

/**
 * Fetch all available contract statuses
 */
export async function fetchContractStatuses() {
  try {
    const { data, error } = await supabase
      .from('contracts')
      .select('status');

    if (error) {
      console.error('Error fetching contract statuses:', error);
      throw error;
    }

    const statuses = [...new Set(data.map(contract => contract.status))].filter(Boolean);
    return statuses as Contract['status'][];
  } catch (error) {
    console.error('Error fetching contract statuses:', error);
    throw error;
  }
}
