
import { supabase } from '@/integrations/supabase/client';
import type { Contract } from '@/schema/operations/contract.schema';
import { isContractStatus } from '@/schema/operations/contract.schema';

/**
 * Fetch contracts with optional filtering
 */
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

  if (searchTerm) {
    query = query.or(
      `contract_name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,contract_number.ilike.%${searchTerm}%`
    );
  }

  if (filters) {
    if (filters.clientId) {
      query = query.eq('client_id', filters.clientId);
    }
    if (filters.status && typeof filters.status === 'string') {
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

  return data as unknown as Contract[];
}

/**
 * Fetch a single contract by ID
 */
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

  return data as unknown as Contract;
}
