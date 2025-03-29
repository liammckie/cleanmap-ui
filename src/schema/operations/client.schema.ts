
import { z } from 'zod'

/**
 * Client Schema
 *
 * This file defines the data structures for client entities.
 */

/**
 * Client - A business that purchases cleaning services
 */
export interface Client {
  id: string
  company_name: string
  contact_name: string
  contact_email: string | null
  contact_phone: string | null
  billing_address_street: string
  billing_address_city: string
  billing_address_state: string
  billing_address_postcode: string
  payment_terms: string
  status: 'Active' | 'On Hold'
  industry: string | null
  region: string | null
  notes: string | null
  business_number: string | null
  on_hold_reason: string | null
  created_at: string
  updated_at: string
  // Adding coordinates which may exist in the DB schema
  latitude?: number | null
  longitude?: number | null
}

// Type guard for client status
export function isClientStatus(value: string): value is Client['status'] {
  return ['Active', 'On Hold'].includes(value)
}

// Zod schema for run-time validation
export const clientSchema = z.object({
  id: z.string().optional(),
  company_name: z.string().min(1, 'Company name is required'),
  contact_name: z.string().min(1, 'Contact name is required'),
  contact_email: z.string().email('Invalid email address').nullable().optional(),
  contact_phone: z.string().nullable().optional(),
  billing_address_street: z.string().min(1, 'Street address is required'),
  billing_address_city: z.string().min(1, 'City is required'),
  billing_address_state: z.string().min(1, 'State is required'),
  billing_address_postcode: z.string().min(1, 'Postcode is required'),
  payment_terms: z.string().min(1, 'Payment terms are required'),
  status: z.enum(['Active', 'On Hold']),
  industry: z.string().nullable().optional(),
  region: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  business_number: z.string().nullable().optional(),
  on_hold_reason: z.string().nullable().optional(),
  latitude: z.number().nullable().optional(),
  longitude: z.number().nullable().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
})

/**
 * Types for database operations
 *
 * ClientInsert - Used when creating a new client (omits auto-generated fields)
 * ClientUpdate - Used when updating an existing client (all fields optional)
 */
// Define the shape expected by Supabase when inserting a new client
export type ClientInsert = {
  company_name: string
  contact_name: string
  contact_email?: string | null
  contact_phone?: string | null
  billing_address_street: string
  billing_address_city: string
  billing_address_state: string
  billing_address_postcode: string
  payment_terms: string
  status: 'Active' | 'On Hold'
  industry?: string | null
  region?: string | null
  notes?: string | null
  business_number?: string | null
  on_hold_reason?: string | null
  latitude?: number | null
  longitude?: number | null
}

// Define the shape expected by Supabase when updating an existing client
export type ClientUpdate = Partial<ClientInsert>
