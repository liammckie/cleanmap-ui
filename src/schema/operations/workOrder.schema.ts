
import { z } from 'zod'

/**
 * Work Order Schema
 *
 * This file defines the data structures and validation for work order entities.
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
  scheduled_start: Date | string
  scheduled_end?: Date | string | null
  due_date: Date | string
  actual_duration: number | null
  completion_timestamp: Date | string | null
  outcome_notes: string | null
  created_by: string | null
  created_at: Date | string
  updated_at: Date | string
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

/**
 * WorkOrderNote - Notes associated with a work order
 */
export interface WorkOrderNote {
  id: string
  work_order_id: string
  note: string
  author_id: string | null
  visibility: 'Internal' | 'Client Visible'
  created_at: Date | string
  updated_at: Date | string
}

// Type guards for runtime type checking
export function isWorkOrderStatus(value: string): value is WorkOrder['status'] {
  return ['Scheduled', 'In Progress', 'Completed', 'Cancelled', 'Overdue', 'On Hold'].includes(
    value,
  )
}

export function isWorkOrderPriority(value: string): value is WorkOrder['priority'] {
  return ['Low', 'Medium', 'High'].includes(value)
}

export function isWorkOrderCategory(value: string): value is WorkOrder['category'] {
  return ['Routine Clean', 'Ad-hoc Request', 'Audit'].includes(value)
}

// Constants for enum values to avoid hardcoding throughout the application
export const WORK_ORDER_STATUSES = [
  'Scheduled', 
  'In Progress', 
  'Completed', 
  'Cancelled', 
  'Overdue', 
  'On Hold'
] as const

export const WORK_ORDER_PRIORITIES = ['Low', 'Medium', 'High'] as const

export const WORK_ORDER_CATEGORIES = ['Routine Clean', 'Ad-hoc Request', 'Audit'] as const

// Zod schema for run-time validation of complete work order entity
export const workOrderSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  site_id: z.string().min(1, 'Site is required'),
  status: z.enum(WORK_ORDER_STATUSES),
  priority: z.enum(WORK_ORDER_PRIORITIES),
  category: z.enum(WORK_ORDER_CATEGORIES),
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

// Zod schema for work order form input - used with react-hook-form
export const workOrderFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  site_id: z.string().min(1, 'Site is required'),
  client_id: z.string().optional(),
  status: z.enum(WORK_ORDER_STATUSES),
  priority: z.enum(WORK_ORDER_PRIORITIES),
  category: z.enum(WORK_ORDER_CATEGORIES),
  scheduled_start: z.date({ required_error: 'Scheduled start date is required' }),
  due_date: z.date({ required_error: 'Due date is required' }),
  actual_duration: z.number().nullable().optional(),
  outcome_notes: z.string().nullable().optional(),
})

// Type for the form values derived from the schema
export type WorkOrderFormValues = z.infer<typeof workOrderFormSchema>

// Schema for database operations (create/update)
export const workOrderDbSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  site_id: z.string().min(1, 'Site is required'),
  status: z.enum(WORK_ORDER_STATUSES),
  priority: z.enum(WORK_ORDER_PRIORITIES),
  category: z.enum(WORK_ORDER_CATEGORIES),
  scheduled_start: z.string(), // ISO date string for DB
  scheduled_end: z.string().nullable().optional(),
  due_date: z.string(), // ISO date string for DB
  actual_duration: z.number().nullable().optional(),
  completion_timestamp: z.string().nullable().optional(),
  outcome_notes: z.string().nullable().optional(),
  created_by: z.string().nullable().optional(),
  created_at: z.string().optional(), // ISO date string for DB
  updated_at: z.string().optional(), // ISO date string for DB
})

// Schema for work order notes
export const workOrderNoteSchema = z.object({
  id: z.string().optional(),
  work_order_id: z.string(),
  note: z.string().min(1, 'Note is required'),
  author_id: z.string().nullable(),
  visibility: z.enum(['Internal', 'Client Visible']),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
})
