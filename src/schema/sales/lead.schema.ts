
import { z } from 'zod';

/**
 * Lead/Opportunity Schema
 * 
 * This file defines the data structures for leads and opportunities
 * in the sales pipeline.
 */

/**
 * Lead/Opportunity stages in the sales pipeline
 */
export type LeadStage = 
  | 'Discovery' 
  | 'Proposal' 
  | 'Negotiation' 
  | 'Won' 
  | 'Lost';

/**
 * Lead/Opportunity source types
 */
export type LeadSource = 
  | 'Referral' 
  | 'Website' 
  | 'Cold Call' 
  | 'Event' 
  | 'Partner' 
  | 'Other';

/**
 * Lead status types
 */
export type LeadStatus = 
  | 'Open' 
  | 'Closed-Won' 
  | 'Closed-Lost';

/**
 * Lead/Opportunity - A potential client or deal in the sales pipeline
 */
export interface Lead {
  id: string;
  lead_name: string;
  company_name: string;
  contact_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  potential_value: number;
  stage: LeadStage;
  status: LeadStatus;
  next_action: string | null;
  next_action_date: Date | null;
  notes: string | null;
  created_by: string;
  created_at: Date;
  updated_at: Date;
  source: LeadSource | null;
  converted_client_id: string | null;
  converted_quote_id: string | null;
}

// Type guards for runtime type checking
export function isLeadStage(value: string): value is LeadStage {
  return ['Discovery', 'Proposal', 'Negotiation', 'Won', 'Lost'].includes(value);
}

export function isLeadStatus(value: string): value is LeadStatus {
  return ['Open', 'Closed-Won', 'Closed-Lost'].includes(value);
}

export function isLeadSource(value: string): value is LeadSource {
  return ['Referral', 'Website', 'Cold Call', 'Event', 'Partner', 'Other'].includes(value);
}

// Zod schema for runtime validation
export const leadSchema = z.object({
  id: z.string().optional(),
  lead_name: z.string().min(1, "Lead name is required"),
  company_name: z.string().min(1, "Company name is required"),
  contact_name: z.string().nullable(),
  contact_email: z.string().email("Valid email is required").nullable(),
  contact_phone: z.string().nullable(),
  potential_value: z.number().nonnegative("Value must be a positive number"),
  stage: z.enum(['Discovery', 'Proposal', 'Negotiation', 'Won', 'Lost']),
  status: z.enum(['Open', 'Closed-Won', 'Closed-Lost']),
  next_action: z.string().nullable(),
  next_action_date: z.date().nullable(),
  notes: z.string().nullable(),
  created_by: z.string(),
  source: z.enum(['Referral', 'Website', 'Cold Call', 'Event', 'Partner', 'Other']).nullable(),
  converted_client_id: z.string().nullable(),
  converted_quote_id: z.string().nullable(),
  created_at: z.date().optional(),
  updated_at: z.date().optional()
});
