
import { z } from 'zod'
import { BillingFrequency } from '@/utils/billingCalculations'

/**
 * Contract Schema
 *
 * This file defines the data structures for contract entities.
 */

/**
 * Contract - A formal agreement between the company and a client
 */
export interface Contract {
  id: string
  contract_number: string
  contract_name: string
  client_id: string
  description: string | null
  start_date: Date
  end_date: Date | null
  status: 'Active' | 'Expiring' | 'Expired' | 'Terminated'
  contract_type: string
  renewal_terms: string | null
  notice_period_days: number | null
  payment_terms: string | null
  monthly_value?: number
  annual_value?: number
  auto_renew?: boolean
  documents_url: string | null
  notes: string | null
  created_at: Date
  updated_at: Date
  // Billing fields
  billing_frequency: BillingFrequency
  base_fee: number // Base fee in the specified billing frequency
  weekly_value?: number // Calculated weekly value
  under_negotiation?: boolean
  // Reference to client object when joined
  client?: {
    company_name: string
  }
  // Reference to contract sites
  sites?: ContractSite[]
}

/**
 * ContractSite - Junction table linking contracts to sites
 */
export interface ContractSite {
  id: string
  contract_id: string
  site_id: string
  created_at: Date
  updated_at: Date
  site?: {
    id: string
    site_name: string
    site_type: string
    site_code?: string
    address_street: string
    address_city: string
    address_state: string
    address_postcode: string
    status: string
    country?: string
  }
}

/**
 * ContractChangeLog - Tracks changes to contracts
 */
export interface ContractChangeLog {
  id: string
  contract_id: string
  change_date: Date
  change_type: string
  old_value: string | null
  new_value: string | null
  effective_date: Date
  changed_by: string
  approval_status: string | null
  created_at: Date
  updated_at: Date
}

// Type guard for Contract status
export function isContractStatus(value: string): value is Contract['status'] {
  return ['Active', 'Expiring', 'Expired', 'Terminated'].includes(value)
}

// Zod schema for run-time validation
export const contractSchema = z.object({
  id: z.string().optional(),
  contract_number: z.string().min(1, 'Contract number is required'),
  contract_name: z.string().min(1, 'Contract name is required'),
  client_id: z.string().min(1, 'Client is required'),
  description: z.string().nullable(),
  start_date: z.date(),
  end_date: z.date().nullable(),
  status: z.enum(['Active', 'Expiring', 'Expired', 'Terminated']),
  contract_type: z.string().min(1, 'Contract type is required'),
  renewal_terms: z.string().nullable(),
  notice_period_days: z.number().nullable(),
  payment_terms: z.string().nullable(),
  billing_frequency: z.enum(['weekly', 'fortnightly', 'monthly', 'quarterly', 'annually']),
  base_fee: z.number().min(0, 'Base fee must be a positive number'),
  weekly_value: z.number().optional(),
  monthly_value: z.number().optional(),
  annual_value: z.number().optional(),
  auto_renew: z.boolean().optional(),
  documents_url: z.string().nullable(),
  notes: z.string().nullable(),
  under_negotiation: z.boolean().optional(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
})

// Schema for contract site junction table
export const contractSiteSchema = z.object({
  id: z.string().optional(),
  contract_id: z.string().min(1, 'Contract ID is required'),
  site_id: z.string().min(1, 'Site ID is required'),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
})

// Schema for contract change log
export const contractChangeLogSchema = z.object({
  id: z.string().optional(),
  contract_id: z.string().min(1, 'Contract ID is required'),
  change_date: z.date(),
  change_type: z.string().min(1, 'Change type is required'),
  old_value: z.string().nullable(),
  new_value: z.string().nullable(),
  effective_date: z.date(),
  changed_by: z.string().min(1, 'Changed by is required'),
  approval_status: z.string().nullable(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
})
