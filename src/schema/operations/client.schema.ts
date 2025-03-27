
import { z } from 'zod';

/**
 * Client Schema
 * 
 * This file defines the data structures for client entities.
 */

/**
 * Client - A customer organization that contracts cleaning services
 */
export interface Client {
  id: string;
  company_name: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  billing_address_street: string;
  billing_address_city: string;
  billing_address_state: string;
  billing_address_zip: string;
  billing_address_country: string;
  status: 'Active' | 'On Hold';
  industry: string | null;
  region: string | null;
  notes: string | null;
  created_at: Date;
  updated_at: Date;
}

// Type guard for Client status
export function isClientStatus(value: string): value is Client['status'] {
  return ['Active', 'On Hold'].includes(value);
}

// Zod schema for run-time validation
export const clientSchema = z.object({
  id: z.string().optional(),
  company_name: z.string().min(1, "Company name is required"),
  contact_name: z.string().min(1, "Contact name is required"),
  contact_email: z.string().email("Valid email is required"),
  contact_phone: z.string().min(1, "Contact phone is required"),
  billing_address_street: z.string().min(1, "Street address is required"),
  billing_address_city: z.string().min(1, "City is required"),
  billing_address_state: z.string().min(1, "State is required"),
  billing_address_zip: z.string().min(1, "ZIP code is required"),
  billing_address_country: z.string().min(1, "Country is required"),
  status: z.enum(['Active', 'On Hold']),
  industry: z.string().nullable(),
  region: z.string().nullable(),
  notes: z.string().nullable(),
  created_at: z.date().optional(),
  updated_at: z.date().optional()
});
