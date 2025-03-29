import { z } from 'zod'

/**
 * Quote Schema
 *
 * This file defines the data structures for quotes provided to prospects or clients.
 */

/**
 * Quote status types
 */
export type QuoteStatus = 'Draft' | 'Sent' | 'Accepted' | 'Rejected'

/**
 * Quote line item - A single line in a quote
 */
export interface QuoteLineItem {
  id: string
  quote_id: string
  description: string
  quantity: number
  unit_price: number
  amount: number
  created_at: Date
  updated_at: Date
}

/**
 * Quote - A formal price offer for services
 */
export interface Quote {
  id: string
  quote_number: string
  client_id: string | null // Null if for a prospect
  lead_id: string | null // Null if for existing client
  issue_date: Date
  valid_until: Date
  status: QuoteStatus
  service_description: string
  total_amount: number
  internal_cost_estimate: number | null
  notes: string | null
  service_request_id: string | null // If quote is for an extra work request
  converted_contract_id: string | null
  converted_work_order_id: string | null
  created_by: string
  created_at: Date
  updated_at: Date
}

// Type guard for runtime type checking
export function isQuoteStatus(value: string): value is QuoteStatus {
  return ['Draft', 'Sent', 'Accepted', 'Rejected'].includes(value)
}

// Zod schema for UI validation - uses Date objects
export const quoteSchema = z.object({
  id: z.string().optional(),
  quote_number: z.string().min(1, 'Quote number is required'),
  client_id: z.string().nullable(),
  lead_id: z.string().nullable(),
  issue_date: z.date(),
  valid_until: z.date(),
  status: z.enum(['Draft', 'Sent', 'Accepted', 'Rejected']),
  service_description: z.string().min(1, 'Service description is required'),
  total_amount: z.number().nonnegative('Amount must be a positive number'),
  internal_cost_estimate: z
    .number()
    .nonnegative('Cost estimate must be a positive number')
    .nullable(),
  notes: z.string().nullable(),
  service_request_id: z.string().nullable(),
  converted_contract_id: z.string().nullable(),
  converted_work_order_id: z.string().nullable(),
  created_by: z.string(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
})

// Separate schema for DB operations - uses strings for dates
export const quoteDbSchema = z.object({
  id: z.string().optional(),
  quote_number: z.string().min(1, 'Quote number is required'),
  client_id: z.string().nullable(),
  lead_id: z.string().nullable(),
  issue_date: z.string(), // ISO string format for DB
  valid_until: z.string(), // ISO string format for DB
  status: z.enum(['Draft', 'Sent', 'Accepted', 'Rejected']),
  service_description: z.string().min(1, 'Service description is required'),
  total_amount: z.number().nonnegative('Amount must be a positive number'),
  internal_cost_estimate: z
    .number()
    .nonnegative('Cost estimate must be a positive number')
    .nullable(),
  notes: z.string().nullable(),
  service_request_id: z.string().nullable(),
  converted_contract_id: z.string().nullable(),
  converted_work_order_id: z.string().nullable(),
  created_by: z.string(),
  created_at: z.string().optional(), // ISO string format for DB
  updated_at: z.string().optional(), // ISO string format for DB
})

// Zod schema for quote line items - UI version
export const quoteLineItemSchema = z.object({
  id: z.string().optional(),
  quote_id: z.string(),
  description: z.string().min(1, 'Description is required'),
  quantity: z.number().positive('Quantity must be a positive number'),
  unit_price: z.number().nonnegative('Unit price must be a positive number'),
  amount: z.number().nonnegative('Amount must be a positive number'),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
})

// Separate schema for DB operations - uses strings for dates
export const quoteLineItemDbSchema = z.object({
  id: z.string().optional(),
  quote_id: z.string(),
  description: z.string().min(1, 'Description is required'),
  quantity: z.number().positive('Quantity must be a positive number'),
  unit_price: z.number().nonnegative('Unit price must be a positive number'),
  amount: z.number().nonnegative('Amount must be a positive number'),
  created_at: z.string().optional(), // ISO string format for DB
  updated_at: z.string().optional(), // ISO string format for DB
})
