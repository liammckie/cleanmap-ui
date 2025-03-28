
/**
 * Contract Schema
 * 
 * This file defines the data structures for Contract entities.
 */

/**
 * Contracts - Agreements between the company and clients
 */
export interface Contract {
  id: number;
  client_id: number; // Foreign key to Client
  contract_number: string;
  title: string;
  start_date: Date;
  end_date: Date;
  renewal_date?: Date;
  total_value: number;
  billing_frequency: 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'annually';
  payment_terms: string;
  status: 'draft' | 'pending' | 'active' | 'completed' | 'terminated' | 'renewal';
  termination_notice_days: number;
  notes?: string;
  created_at: Date;
  updated_at: Date;
}

/**
 * Contract_Locations - Junction table for contracts and locations
 */
export interface ContractLocation {
  id: number;
  contract_id: number; // Foreign key to Contract
  location_id: number; // Foreign key to Location
  cleaning_frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'custom';
  custom_frequency?: string;
  price_per_service: number;
  created_at: Date;
  updated_at: Date;
}
