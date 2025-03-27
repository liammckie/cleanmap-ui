
import { z } from 'zod';

/**
 * Contract Schema
 * 
 * This file defines the data structures for contract entities.
 */

/**
 * Contract - A formal agreement between the company and a client
 */
export interface Contract {
  id: string;
  contract_number: string;
  contract_name: string;
  client_id: string;
  description: string | null;
  start_date: Date;
  end_date: Date;
  status: 'Active' | 'Expiring' | 'Expired' | 'Terminated';
  contract_type: string;
  renewal_terms: string | null;
  notice_period_days: number | null;
  payment_terms: string | null;
  monthly_value: number;
  annual_value: number;
  auto_renew: boolean;
  documents_url: string | null;
  notes: string | null;
  created_at: Date;
  updated_at: Date;
}

// Type guard for Contract status
export function isContractStatus(value: string): value is Contract['status'] {
  return ['Active', 'Expiring', 'Expired', 'Terminated'].includes(value);
}

// Zod schema for run-time validation
export const contractSchema = z.object({
  id: z.string().optional(),
  contract_number: z.string().min(1, "Contract number is required"),
  contract_name: z.string().min(1, "Contract name is required"),
  client_id: z.string().min(1, "Client is required"),
  description: z.string().nullable(),
  start_date: z.date(),
  end_date: z.date(),
  status: z.enum(['Active', 'Expiring', 'Expired', 'Terminated']),
  contract_type: z.string().min(1, "Contract type is required"),
  renewal_terms: z.string().nullable(),
  notice_period_days: z.number().nullable(),
  payment_terms: z.string().nullable(),
  monthly_value: z.number(),
  annual_value: z.number(),
  auto_renew: z.boolean(),
  documents_url: z.string().nullable(),
  notes: z.string().nullable(),
  created_at: z.date().optional(),
  updated_at: z.date().optional()
});
