
/**
 * Site Schema
 * 
 * This file defines the data structures for site-related entities.
 */

// Import references to other schema types
import type { Client } from './client.schema';
import type { Contact } from './client.schema';

/**
 * Site - Represents a physical location where services are performed
 */
export interface Site {
  id: string;
  client_id: string;
  site_name: string;
  address_street: string;
  address_city: string;
  address_state: string;
  address_postcode: string;
  region: string | null;
  status: 'Active' | 'Inactive' | 'Pending Launch' | 'Suspended';
  service_start_date: Date;
  site_manager_id: string | null;
  site_type: string;
  special_instructions: string | null;
  created_at: Date;
  updated_at: Date;
  
  // Joined fields
  client?: Pick<Client, 'company_name'>;
  site_manager?: Pick<Contact, 'first_name' | 'last_name'>;
}
