
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
  site_type: string
  address_street: string
  address_city: string
  address_state: string
  address_postcode: string
  region: string | null
  service_start_date: Date | null
  service_end_date: Date | null
  special_instructions: string | null
  status: 'Active' | 'Inactive' | 'Pending Launch' | 'Suspended'
  site_manager_id: string | null
  created_at: Date
  updated_at: Date
  
  // Contact information
  primary_contact: string | null
  contact_phone: string | null
  contact_email: string | null
  
  // Service details
  service_frequency: string | null
  custom_frequency: string | null
  service_type: 'Internal' | 'Contractor'
  
  // Pricing information
  price_per_service: number | null
  price_frequency: string | null
  service_items: Array<{id: number, description: string, amount: number}> | null
  
  // UI-specific fields (not in database)
  street_address?: string
  city?: string
  state?: string
  zip_code?: string
  
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
  site_type: z.string().min(1, 'Site type is required'),
  address_street: z.string().min(1, 'Street address is required'),
  address_city: z.string().min(1, 'City is required'),
  address_state: z.string().min(1, 'State is required'),
  address_postcode: z.string().min(1, 'Postcode is required'),
  region: z.string().nullable().optional(),
  site_manager_id: z.string().nullable().optional(),
  service_start_date: z.date().nullable().optional(),
  service_end_date: z.date().nullable().optional(),
  
  // Contact information
  primary_contact: z.string().nullable().optional(),
  contact_phone: z.string().nullable().optional(),
  contact_email: z.string().email('Invalid email').nullable().optional(),
  
  // Service details
  service_frequency: z.string().nullable().optional(),
  custom_frequency: z.string().nullable().optional(),
  service_type: z.enum(['Internal', 'Contractor']).default('Internal'),
  
  // Pricing information
  price_per_service: z.number().nullable().optional(),
  price_frequency: z.string().nullable().optional(),
  service_items: z.array(
    z.object({
      id: z.number(),
      description: z.string(),
      amount: z.number()
    })
  ).nullable().optional(),
  
  special_instructions: z.string().nullable().optional(),
  status: z.enum(['Active', 'Inactive', 'Pending Launch', 'Suspended']).default('Active'),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
})

// Define types for DB operations
export type SiteInsert = {
  client_id: string
  site_name: string
  site_type: string
  address_street: string
  address_city: string
  address_state: string
  address_postcode: string
  region?: string | null
  service_start_date?: Date | null
  service_end_date?: Date | null
  special_instructions?: string | null
  status: 'Active' | 'Inactive' | 'Pending Launch' | 'Suspended'
  site_manager_id?: string | null
  
  // Contact information
  primary_contact?: string | null
  contact_phone?: string | null
  contact_email?: string | null
  
  // Service details
  service_frequency?: string | null
  custom_frequency?: string | null
  service_type?: 'Internal' | 'Contractor'
  
  // Pricing information
  price_per_service?: number | null
  price_frequency?: string | null
  service_items?: Array<{id: number, description: string, amount: number}> | null
}

export type SiteUpdate = Partial<SiteInsert>
