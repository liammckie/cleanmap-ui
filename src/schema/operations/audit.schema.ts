
import { z } from 'zod';

/**
 * Audit Schema
 * 
 * This file defines the data structures for audit and checklist entities.
 */

/**
 * AuditChecklistItem - An item in a work order audit checklist
 */
export interface AuditChecklistItem {
  id: string;
  work_order_id: string;
  question: string;
  answer: string | null;
  comments: string | null;
  score: number | null;
  created_at: Date;
  updated_at: Date;
}

// Zod schema for run-time validation
export const auditChecklistItemSchema = z.object({
  id: z.string().optional(),
  work_order_id: z.string().min(1, "Work order is required"),
  question: z.string().min(1, "Question is required"),
  answer: z.string().nullable(),
  comments: z.string().nullable(),
  score: z.number().nullable(),
  created_at: z.date().optional(),
  updated_at: z.date().optional()
});
