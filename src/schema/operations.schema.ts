
/**
 * Operations Module Schema
 * 
 * This file defines the data structures for operations-related entities 
 * including clients, sites, contracts and work orders.
 */

/**
 * Client - Represents a client organization that receives services
 */
export interface Client {
  id: string;
  company_name: string;
  billing_address_street: string;
  billing_address_city: string;
  billing_address_state: string;
  billing_address_postcode: string;
  contact_phone: string | null;
  contact_email: string | null;
  payment_terms: string;
  status: 'Active' | 'On Hold';
  industry: string | null;
  notes: string | null;
  business_number: string | null;
  on_hold_reason: string | null;
  created_at: Date;
  updated_at: Date;
}

/**
 * Contact - Represents a contact person at a client organization
 */
export interface Contact {
  id: string;
  client_id: string | null;
  first_name: string;
  last_name: string;
  position: string | null;
  phone: string | null;
  email: string;
  is_primary: boolean | null;
  notes: string | null;
  created_at: Date;
  updated_at: Date;
}

/**
 * Site - Represents a physical location where services are performed
 */
export interface Site {
  id: string;
  client_id: string;
  site_name: string;
  address_street: string;
  address_city: string;
  address_state: string;
  address_postcode: string;
  region: string | null;
  status: 'Active' | 'Inactive' | 'Pending Launch' | 'Suspended';
  service_start_date: Date;
  site_manager_id: string | null;
  site_type: string;
  special_instructions: string | null;
  created_at: Date;
  updated_at: Date;
  
  // Joined fields
  client?: Pick<Client, 'company_name'>;
  site_manager?: Pick<Contact, 'first_name' | 'last_name'>;
}

/**
 * Contract - Represents a service agreement with a client
 */
export interface Contract {
  id: string;
  contract_number: string;
  client_id: string;
  start_date: Date;
  end_date: Date | null;
  billing_frequency: string;
  base_fee: number;
  scope_of_work: string;
  sla_kpi: string | null;
  renewal_terms: string | null;
  contract_type: string;
  status: 'Active' | 'Expiring' | 'Expired' | 'Terminated';
  payment_terms: string | null;
  next_review_date: Date | null;
  under_negotiation: boolean | null;
  created_at: Date;
  updated_at: Date;
  
  // Joined fields
  client?: Pick<Client, 'company_name'>;
  sites?: Array<{
    id: string;
    site: Pick<Site, 'id' | 'site_name'>;
  }>;
}

/**
 * ContractSite - Junction table for contracts and sites
 */
export interface ContractSite {
  id: string;
  contract_id: string;
  site_id: string;
  created_at: Date;
  updated_at: Date;
}

/**
 * ContractChangeLog - Record of changes to contract terms
 */
export interface ContractChangeLog {
  id: string;
  contract_id: string;
  change_type: string;
  old_value: string | null;
  new_value: string | null;
  change_date: Date;
  changed_by: string | null;
  effective_date: Date;
  approval_status: string | null;
  created_at: Date;
  updated_at: Date;
}

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
 * ServiceRequest - Request for ad-hoc services from a client
 */
export interface ServiceRequest {
  id: string;
  client_id: string;
  site_id: string;
  request_date: Date;
  service_details: string;
  preferred_date: Date | null;
  client_notes: string | null;
  status: 'Pending Review' | 'Quoted' | 'Approved' | 'Scheduled' | 'Rejected';
  quote_id: string | null;
  work_order_id: string | null;
  billable: boolean | null;
  reviewed_by: string | null;
  decision_notes: string | null;
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

// Import Employee type for references
import { Employee } from './hr.schema';

// Export schema types
export type {
  Client,
  Contact,
  Site,
  Contract,
  ContractSite,
  ContractChangeLog,
  RecurringTemplate,
  WorkOrder,
  WorkOrderAssignment,
  ServiceRequest,
  AuditChecklistItem
};
