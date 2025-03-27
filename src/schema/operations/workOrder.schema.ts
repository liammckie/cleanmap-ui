
/**
 * Work Order Schema
 * 
 * This file defines the data structures for work order-related entities.
 */

// Import references to other schema types
import type { Site } from './site.schema';
import type { Client } from './client.schema';
import type { Contract } from './contract.schema';
import type { Employee } from '../hr.schema';

/**
 * RecurringTemplate - Template for generating recurring work orders
 */
export interface RecurringTemplate {
  id: string;
  site_id: string;
  task_description: string;
  recurrence_rule: string;
  preferred_time: string | null;
  default_assignee: string | null;
  next_occurrence_date: Date;
  created_at: Date;
  updated_at: Date;
}

/**
 * WorkOrder - A scheduled job or task to be performed
 */
export interface WorkOrder {
  id: string;
  site_id: string;
  contract_id: string | null;
  title: string;
  description: string;
  category: 'Routine Clean' | 'Ad-hoc Request' | 'Audit';
  scheduled_start: Date;
  due_date: Date;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Overdue' | 'Cancelled';
  recurring_template_id: string | null;
  completed_by: string | null;
  completion_timestamp: Date | null;
  actual_duration: number | null;
  outcome_notes: string | null;
  client_signoff: boolean | null;
  completion_status: string | null;
  audit_score: number | null;
  audit_followup_required: boolean | null;
  created_at: Date;
  updated_at: Date;
  
  // Joined fields
  site?: Pick<Site, 'site_name' | 'client_id'> & {
    client?: Pick<Client, 'company_name'>
  };
  contract?: Pick<Contract, 'contract_number'>;
  completed_by_employee?: Pick<Employee, 'first_name' | 'last_name'>;
  assignments?: Array<WorkOrderAssignment & {
    employee: Pick<Employee, 'id' | 'first_name' | 'last_name'>;
  }>;
  checklist_items?: AuditChecklistItem[];
}

/**
 * WorkOrderAssignment - Assignment of an employee to a work order
 */
export interface WorkOrderAssignment {
  id: string;
  work_order_id: string;
  employee_id: string;
  assignment_type: string;
  created_at: Date;
  updated_at: Date;
}

/**
 * AuditChecklistItem - Item in an audit checklist for quality control
 */
export interface AuditChecklistItem {
  id: string;
  work_order_id: string;
  question: string;
  answer: string | null;
  score: number | null;
  comments: string | null;
  created_at: Date;
  updated_at: Date;
}
