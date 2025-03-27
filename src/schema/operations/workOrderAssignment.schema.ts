
import { z } from 'zod';

/**
 * Work Order Assignment Schema
 * 
 * This file defines the data structures for work order assignment entities.
 */

/**
 * WorkOrderAssignment - An assignment of an employee to a work order
 */
export interface WorkOrderAssignment {
  id: string;
  work_order_id: string;
  employee_id: string;
  assignment_type: string;
  created_at: Date;
  updated_at: Date;
}

// Zod schema for run-time validation
export const workOrderAssignmentSchema = z.object({
  id: z.string().optional(),
  work_order_id: z.string().min(1, "Work order is required"),
  employee_id: z.string().min(1, "Employee is required"),
  assignment_type: z.string().min(1, "Assignment type is required"),
  created_at: z.date().optional(),
  updated_at: z.date().optional()
});
