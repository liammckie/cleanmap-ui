
import { supabase } from '@/integrations/supabase/client';
import type { ContractSite } from '@/schema/operations/contract.schema';

/**
 * Fetch sites associated with a contract
 */
export async function fetchContractSites(contractId: string) {
  const { data, error } = await supabase
    .from('contract_sites')
    .select(`
      id,
      contract_id,
      site_id,
      site:sites(id, site_name, site_code, street_address, city, state, zip_code, country)
    `)
    .eq('contract_id', contractId);

  if (error) {
    console.error('Error fetching contract sites:', error);
    throw error;
  }

  return data as unknown as ContractSite[];
}

/**
 * Add a site to a contract
 */
export async function addSiteToContract(contractId: string, siteId: string) {
  const { data, error } = await supabase
    .from('contract_sites')
    .insert({
      contract_id: contractId,
      site_id: siteId
    })
    .select();

  if (error) {
    console.error('Error adding site to contract:', error);
    throw error;
  }

  return data[0] as unknown as ContractSite;
}

/**
 * Remove a site from a contract
 */
export async function removeSiteFromContract(contractSiteId: string) {
  const { error } = await supabase
    .from('contract_sites')
    .delete()
    .eq('id', contractSiteId);

  if (error) {
    console.error('Error removing site from contract:', error);
    throw error;
  }

  return true;
}

/**
 * Update the sites associated with a contract
 */
export async function updateContractSites(contractId: string, siteIds: string[]) {
  const { error: deleteError } = await supabase
    .from('contract_sites')
    .delete()
    .eq('contract_id', contractId);

  if (deleteError) {
    console.error('Error deleting existing contract-site relationships:', deleteError);
    throw deleteError;
  }

  if (siteIds.length > 0) {
    const contractSites = siteIds.map(siteId => ({
      contract_id: contractId,
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

  return true;
}
