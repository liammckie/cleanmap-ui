
/**
 * Client Schema
 * 
 * This file defines the data structures for client-related entities
 * including clients and contacts.
 */

/**
 * Client - Represents a client organization that receives services
 */
export interface Client {
  id: string;
  company_name: string;
  billing_address_street: string;
  billing_address_city: string;
  billing_address_state: string;
  billing_address_postcode: string;
  contact_phone: string | null;
  contact_email: string | null;
  payment_terms: string;
  status: 'Active' | 'On Hold';
  industry: string | null;
  notes: string | null;
  business_number: string | null;
  on_hold_reason: string | null;
  created_at: Date;
  updated_at: Date;
}

/**
 * Contact - Represents a contact person at a client organization
 */
export interface Contact {
  id: string;
  client_id: string | null;
  first_name: string;
  last_name: string;
  position: string | null;
  phone: string | null;
  email: string;
  is_primary: boolean | null;
  notes: string | null;
  created_at: Date;
  updated_at: Date;
}
