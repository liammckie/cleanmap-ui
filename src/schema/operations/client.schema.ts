
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
  contact_email: string | null;
  contact_phone: string | null;
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
  billing_address_postcode: string;
  payment_terms: string;
  business_number: string | null;
  on_hold_reason: string | null;
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
  contact_email: z.string().email("Valid email is required").nullable(),
  contact_phone: z.string().nullable(),
  billing_address_street: z.string().min(1, "Street address is required"),
  billing_address_city: z.string().min(1, "City is required"),
  billing_address_state: z.string().min(1, "State is required"),
  billing_address_postcode: z.string().min(1, "Postcode is required"),
  payment_terms: z.string().min(1, "Payment terms are required"),
  status: z.enum(['Active', 'On Hold']),
  industry: z.string().nullable(),
  region: z.string().nullable(),
  notes: z.string().nullable(),
  business_number: z.string().nullable(),
  on_hold_reason: z.string().nullable(),
  created_at: z.date().optional(),
  updated_at: z.date().optional()
});
