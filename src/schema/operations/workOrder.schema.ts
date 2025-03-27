
import { z } from 'zod';

/**
 * Work Order Schema
 * 
 * This file defines the data structures for work order entities.
 */

/**
 * WorkOrder - A scheduled task or job for a site
 */
export interface WorkOrder {
  id: string;
  work_order_number: string;
  title: string;
  description: string;
  site_id: string;
  client_id: string;
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled' | 'Overdue' | 'On Hold';
  priority: 'Low' | 'Medium' | 'High';
  category: string;
  scheduled_start: Date;
  scheduled_end: Date | null;
  due_date: Date;
  estimated_hours: number | null;
  actual_hours: number | null;
  completion_date: Date | null;
  notes: string | null;
  created_by: string | null;
  created_at: Date;
  updated_at: Date;
}

// Type guard for WorkOrder status
export function isWorkOrderStatus(value: string): value is WorkOrder['status'] {
  return ['Scheduled', 'In Progress', 'Completed', 'Cancelled', 'Overdue', 'On Hold'].includes(value);
}

// Type guard for WorkOrder priority
export function isWorkOrderPriority(value: string): value is WorkOrder['priority'] {
  return ['Low', 'Medium', 'High'].includes(value);
}

// Zod schema for run-time validation
export const workOrderSchema = z.object({
  id: z.string().optional(),
  work_order_number: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  site_id: z.string().min(1, "Site is required"),
  client_id: z.string().min(1, "Client is required"),
  status: z.enum(['Scheduled', 'In Progress', 'Completed', 'Cancelled', 'Overdue', 'On Hold']),
  priority: z.enum(['Low', 'Medium', 'High']),
  category: z.string().min(1, "Category is required"),
  scheduled_start: z.date(),
  scheduled_end: z.date().nullable(),
  due_date: z.date(),
  estimated_hours: z.number().nullable(),
  actual_hours: z.number().nullable(),
  completion_date: z.date().nullable(),
  notes: z.string().nullable(),
  created_by: z.string().nullable(),
  created_at: z.date().optional(),
  updated_at: z.date().optional()
});
