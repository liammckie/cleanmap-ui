
/**
 * Client Schema
 * 
 * This file defines the data structures for Client entities.
 */

/**
 * Clients - Organizations that contract cleaning services
 */
export interface Client {
  id: number;
  company_name: string;
  contact_person: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  industry: string;
  notes?: string;
  status: 'active' | 'inactive' | 'prospect';
  created_at: Date;
  updated_at: Date;
}
