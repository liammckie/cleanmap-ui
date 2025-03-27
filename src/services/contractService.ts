
import { supabase } from '@/integrations/supabase/client';
import type { Contract } from '@/schema/operations/contract.schema';
import { prepareObjectForDb } from '@/utils/dateFormatters';
import { isContractStatus } from '@/schema/operations/contract.schema';

export async function fetchContracts(
  searchTerm?: string,
  filters?: {
    clientId?: string;
    status?: string;
    contractType?: string;
    fromDate?: string;
    toDate?: string;
  }
) {
  let query = supabase
    .from('contracts')
    .select(`
      *,
      client:client_id (
        company_name
      )
    `);

  // Apply search if provided
  if (searchTerm) {
    query = query.or(
      `contract_name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,contract_number.ilike.%${searchTerm}%`
    );
  }

  // Apply filters if provided
  if (filters) {
    if (filters.clientId) {
      query = query.eq('client_id', filters.clientId);
    }
    if (filters.status && typeof filters.status === 'string') {
      // Validate the status if it's a string
      if (isContractStatus(filters.status)) {
        query = query.eq('status', filters.status);
      }
    }
    if (filters.contractType) {
      query = query.eq('contract_type', filters.contractType);
    }
    if (filters.fromDate) {
      query = query.gte('start_date', filters.fromDate);
    }
    if (filters.toDate) {
      query = query.lte('end_date', filters.toDate);
    }
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching contracts:', error);
    throw error;
  }

  return data;
}

export async function fetchContractById(id: string) {
  const { data, error } = await supabase
    .from('contracts')
    .select(`
      *,
      client:clients(id, company_name),
      sites:contract_sites(
        id,
        site:sites(id, site_name)
      )
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching contract:', error);
    throw error;
  }

  return data;
}

export async function createContract(contract: Omit<Contract, 'id' | 'created_at' | 'updated_at'>, siteIds: string[]) {
  // Convert Date objects to ISO strings for Supabase
  const dbContract = prepareObjectForDb(contract);
  
  // Start a transaction
  const { data, error } = await supabase
    .from('contracts')
    .insert(dbContract as any)
    .select();

  if (error) {
    console.error('Error creating contract:', error);
    throw error;
  }

  // Now create contract_sites relationships
  if (siteIds.length > 0) {
    const contractSites = siteIds.map(siteId => ({
      contract_id: data[0].id,
      site_id: siteId
    }));

    const { error: relationshipError } = await supabase
      .from('contract_sites')
      .insert(contractSites);

    if (relationshipError) {
      console.error('Error creating contract-site relationships:', relationshipError);
      throw relationshipError;
    }
  }

  return data[0];
}

export async function updateContract(id: string, updates: Partial<Contract>, siteIds?: string[]) {
  // Convert Date objects to ISO strings for Supabase
  const dbUpdates = prepareObjectForDb(updates);
  
  const { data, error } = await supabase
    .from('contracts')
    .update(dbUpdates as any)
    .eq('id', id)
    .select();

  if (error) {
    console.error('Error updating contract:', error);
    throw error;
  }

  // If siteIds are provided, update contract_sites relationships
  if (siteIds) {
    // First delete existing relationships
    const { error: deleteError } = await supabase
      .from('contract_sites')
      .delete()
      .eq('contract_id', id);

    if (deleteError) {
      console.error('Error deleting existing contract-site relationships:', deleteError);
      throw deleteError;
    }

    // Then create new relationships
    if (siteIds.length > 0) {
      const contractSites = siteIds.map(siteId => ({
        contract_id: id,
        site_id: siteId
      }));

      const { error: insertError } = await supabase
        .from('contract_sites')
        .insert(contractSites);

      if (insertError) {
        console.error('Error creating new contract-site relationships:', insertError);
        throw insertError;
      }
    }
  }

  return data[0];
}

export async function deleteContract(id: string) {
  const { error } = await supabase
    .from('contracts')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting contract:', error);
    throw error;
  }

  return true;
}

// Log a contract change
export async function logContractChange(
  contractId: string, 
  changes: Record<string, any>, 
  reason: string, 
  changedBy: string
) {
  try {
    // Prepare data for database - convert Date objects to ISO strings
    const changeLogEntry = {
      contract_id: contractId,
      change_date: new Date().toISOString(), // Convert to string format for Supabase
      changes_json: JSON.stringify(changes),
      change_type: reason,
      changed_by: changedBy,
      effective_date: new Date().toISOString() // Convert to string format for Supabase
    };

    const { data, error } = await supabase
      .from('contract_change_logs')
      .insert(changeLogEntry)
      .select();

    if (error) {
      console.error('Error logging contract change:', error);
      throw error;
    }

    return data[0];
  } catch (error) {
    console.error('Error logging contract change:', error);
    throw error;
  }
}

// Fetch contract types for filters
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

    // Extract unique contract types
    const types = [...new Set(data.map(contract => contract.contract_type))].filter(Boolean);
    return types;
  } catch (error) {
    console.error('Error fetching contract types:', error);
    throw error;
  }
}

// Fetch contract statuses for filters
export async function fetchContractStatuses() {
  try {
    const { data, error } = await supabase
      .from('contracts')
      .select('status');

    if (error) {
      console.error('Error fetching contract statuses:', error);
      throw error;
    }

    // Extract unique statuses
    const statuses = [...new Set(data.map(contract => contract.status))].filter(Boolean);
    return statuses as Contract['status'][];
  } catch (error) {
    console.error('Error fetching contract statuses:', error);
    throw error;
  }
}
