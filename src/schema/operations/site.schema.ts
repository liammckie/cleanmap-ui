import { z } from 'zod'

/**
 * Site Schema
 *
 * This file defines the data structures for site entities.
 */

/**
 * Site - A physical location where cleaning services are performed
 */
export interface Site {
  id: string
  client_id: string
  site_name: string
  site_code: string | null
  street_address: string
  city: string
  state: string
  zip_code: string
  country: string
  contact_name: string | null
  contact_email: string | null
  contact_phone: string | null
  square_footage: number | null
  floors: number | null
  site_type: string | null
  region: string | null
  status: 'Active' | 'Inactive' | 'Pending Launch' | 'Suspended'
  notes: string | null
  created_at: Date
  updated_at: Date
  latitude: number | null
  longitude: number | null
  service_start_date?: Date | null
  service_end_date?: Date | null // Added service_end_date property
  price_per_service?: number | null
  price_frequency?: string | null
  service_type?: 'Internal' | 'Contractor' // Added service_type property
  // Properties to match what Sites.tsx is using
  address_street?: string
  address_city?: string
  address_state?: string
  address_postcode?: string
  // Reference to client object when joined
  client?: {
    company_name: string
  }
}

// Type guard for Site status
export function isSiteStatus(value: string): value is Site['status'] {
  return ['Active', 'Inactive', 'Pending Launch', 'Suspended'].includes(value)
}

// Zod schema for run-time validation
export const siteSchema = z.object({
  id: z.string().optional(),
  client_id: z.string().min(1, 'Client is required'),
  site_name: z.string().min(1, 'Site name is required'),
  site_code: z.string().nullable(),
  street_address: z.string().min(1, 'Street address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zip_code: z.string().min(1, 'ZIP code is required'),
  country: z.string().min(1, 'Country is required'),
  contact_name: z.string().nullable(),
  contact_email: z.string().email('Valid email is required').nullable(),
  contact_phone: z.string().nullable(),
  square_footage: z.number().nullable(),
  floors: z.number().nullable(),
  site_type: z.string().nullable(),
  region: z.string().nullable(),
  status: z.enum(['Active', 'Inactive', 'Pending Launch', 'Suspended']),
  notes: z.string().nullable(),
  latitude: z.number().nullable(),
  longitude: z.number().nullable(),
  service_start_date: z.date().nullable().optional(),
  service_end_date: z.date().nullable().optional(), // Added service_end_date to the schema
  service_type: z.enum(['Internal', 'Contractor']).optional(), // Added service_type to the schema
  price_per_service: z.number().nullable().optional(),
  price_frequency: z.string().nullable().optional(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
})
