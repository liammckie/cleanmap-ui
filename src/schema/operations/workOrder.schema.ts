
import { z } from 'zod'

/**
 * Work Order Schema
 *
 * This file defines the data structures for work order entities.
 */

/**
 * WorkOrder - A scheduled task or job for a site
 */
export interface WorkOrder {
  id: string
  title: string
  description: string
  site_id: string
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled' | 'Overdue' | 'On Hold'
  priority: 'Low' | 'Medium' | 'High'
  category: 'Routine Clean' | 'Ad-hoc Request' | 'Audit'
  scheduled_start: Date
  scheduled_end?: Date | null
  due_date: Date
  actual_duration: number | null
  completion_timestamp: Date | null
  outcome_notes: string | null
  created_by: string | null
  created_at: Date
  updated_at: Date
  site?: {
    site_name: string
    client_id: string
    client?: {
      company_name: string
    }
  }
  assignments?: Array<{
    id: string
    employee?: {
      id: string
      first_name: string
      last_name: string
    }
    assignment_type: string
  }>
}

// Type guard for WorkOrder status
export function isWorkOrderStatus(value: string): value is WorkOrder['status'] {
  return ['Scheduled', 'In Progress', 'Completed', 'Cancelled', 'Overdue', 'On Hold'].includes(
    value,
  )
}

// Type guard for WorkOrder priority
export function isWorkOrderPriority(value: string): value is WorkOrder['priority'] {
  return ['Low', 'Medium', 'High'].includes(value)
}

// Type guard for WorkOrder category
export function isWorkOrderCategory(value: string): value is WorkOrder['category'] {
  return ['Routine Clean', 'Ad-hoc Request', 'Audit'].includes(value)
}

// Zod schema for run-time validation
export const workOrderSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  site_id: z.string().min(1, 'Site is required'),
  status: z.enum(['Scheduled', 'In Progress', 'Completed', 'Cancelled', 'Overdue', 'On Hold']),
  priority: z.enum(['Low', 'Medium', 'High']),
  category: z.enum(['Routine Clean', 'Ad-hoc Request', 'Audit']),
  scheduled_start: z.date(),
  scheduled_end: z.date().nullable().optional(),
  due_date: z.date(),
  actual_duration: z.number().nullable().optional(),
  completion_timestamp: z.date().nullable().optional(),
  outcome_notes: z.string().nullable().optional(),
  created_by: z.string().nullable().optional(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
})

// Zod schema for work order creation/updates
export const workOrderFormSchema = workOrderSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
  created_by: true,
  scheduled_end: true,
  completion_timestamp: true,
})
