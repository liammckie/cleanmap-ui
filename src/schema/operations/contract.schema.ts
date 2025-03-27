
/**
 * Contract Schema
 * 
 * This file defines the data structures for contract-related entities.
 */

// Import references to other schema types
import type { Client } from './client.schema';
import type { Site } from './site.schema';

/**
 * Contract - Represents a service agreement with a client
 */
export interface Contract {
  id: string;
  contract_number: string;
  client_id: string;
  start_date: Date;
  end_date: Date | null;
  billing_frequency: string;
  base_fee: number;
  scope_of_work: string;
  sla_kpi: string | null;
  renewal_terms: string | null;
  contract_type: string;
  status: 'Active' | 'Expiring' | 'Expired' | 'Terminated';
  payment_terms: string | null;
  next_review_date: Date | null;
  under_negotiation: boolean | null;
  created_at: Date;
  updated_at: Date;
  
  // Joined fields
  client?: Pick<Client, 'company_name'>;
  sites?: Array<{
    id: string;
    site: Pick<Site, 'id' | 'site_name'>;
  }>;
}

/**
 * ContractSite - Junction table for contracts and sites
 */
export interface ContractSite {
  id: string;
  contract_id: string;
  site_id: string;
  created_at: Date;
  updated_at: Date;
}

/**
 * ContractChangeLog - Record of changes to contract terms
 */
export interface ContractChangeLog {
  id: string;
  contract_id: string;
  change_type: string;
  old_value: string | null;
  new_value: string | null;
  change_date: Date;
  changed_by: string | null;
  effective_date: Date;
  approval_status: string | null;
  created_at: Date;
  updated_at: Date;
}
