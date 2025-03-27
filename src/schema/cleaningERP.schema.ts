
/**
 * Database Schema for Contract Cleaning ERP
 * 
 * This file outlines the data structure but doesn't implement actual database connections.
 * When integrating with Laravel, these would be converted to migrations and models.
 */

/**
 * Users - Staff members and administrators
 */
interface User {
  id: number;
  name: string;
  email: string;
  password: string; // Hashed
  role: 'admin' | 'manager' | 'cleaner' | 'supervisor';
  phone: string;
  address?: string;
  hire_date: Date;
  employment_status: 'active' | 'inactive' | 'on_leave';
  hourly_rate?: number;
  created_at: Date;
  updated_at: Date;
}

/**
 * Clients - Organizations that contract cleaning services
 */
interface Client {
  id: number;
  company_name: string;
  contact_person: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  industry: string;
  notes?: string;
  status: 'active' | 'inactive' | 'prospect';
  created_at: Date;
  updated_at: Date;
}

/**
 * Locations - Physical places where cleaning services are performed
 */
interface Location {
  id: number;
  client_id: number; // Foreign key to Client
  name: string;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  type: string; // Office, Retail, Medical, Industrial, etc.
  size_sqm: number;
  floors: number;
  access_instructions?: string;
  special_requirements?: string;
  has_alarm_system: boolean;
  contact_person?: string;
  contact_phone?: string;
  status: 'active' | 'inactive';
  created_at: Date;
  updated_at: Date;
}

/**
 * Contracts - Agreements between the company and clients
 */
interface Contract {
  id: number;
  client_id: number; // Foreign key to Client
  contract_number: string;
  title: string;
  start_date: Date;
  end_date: Date;
  renewal_date?: Date;
  total_value: number;
  billing_frequency: 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'annually';
  payment_terms: string;
  status: 'draft' | 'pending' | 'active' | 'completed' | 'terminated' | 'renewal';
  termination_notice_days: number;
  notes?: string;
  created_at: Date;
  updated_at: Date;
}

/**
 * Contract_Locations - Junction table for contracts and locations
 */
interface ContractLocation {
  id: number;
  contract_id: number; // Foreign key to Contract
  location_id: number; // Foreign key to Location
  cleaning_frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'custom';
  custom_frequency?: string;
  price_per_service: number;
  created_at: Date;
  updated_at: Date;
}

/**
 * Cleaning_Tasks - Standard cleaning tasks that can be assigned
 */
interface CleaningTask {
  id: number;
  name: string;
  description: string;
  estimated_duration_minutes: number;
  category: 'general' | 'floor' | 'bathroom' | 'kitchen' | 'window' | 'special';
  requires_equipment: boolean;
  created_at: Date;
  updated_at: Date;
}

/**
 * Location_Tasks - Specific tasks for a location
 */
interface LocationTask {
  id: number;
  location_id: number; // Foreign key to Location
  task_id: number; // Foreign key to CleaningTask
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'custom';
  custom_frequency?: string;
  notes?: string;
  created_at: Date;
  updated_at: Date;
}

/**
 * Schedules - Planned cleaning services
 */
interface Schedule {
  id: number;
  contract_location_id: number; // Foreign key to ContractLocation
  scheduled_date: Date;
  start_time: Date;
  end_time: Date;
  status: 'scheduled' | 'in_progress' | 'completed' | 'missed' | 'rescheduled';
  notes?: string;
  created_at: Date;
  updated_at: Date;
}

/**
 * Staff_Assignments - Assigning staff to schedules
 */
interface StaffAssignment {
  id: number;
  schedule_id: number; // Foreign key to Schedule
  user_id: number; // Foreign key to User
  role_in_assignment: 'lead' | 'support';
  status: 'assigned' | 'confirmed' | 'completed' | 'absent';
  hours_worked?: number;
  created_at: Date;
  updated_at: Date;
}

/**
 * Cleaning_Reports - Documentation of completed services
 */
interface CleaningReport {
  id: number;
  schedule_id: number; // Foreign key to Schedule
  completed_by_user_id: number; // Foreign key to User (who completed the report)
  completion_date: Date;
  start_time: Date;
  end_time: Date;
  notes?: string;
  client_signature?: string;
  issues_reported?: string;
  created_at: Date;
  updated_at: Date;
}

/**
 * Task_Completions - Individual tasks completed during a service
 */
interface TaskCompletion {
  id: number;
  cleaning_report_id: number; // Foreign key to CleaningReport
  location_task_id: number; // Foreign key to LocationTask
  status: 'completed' | 'partially_completed' | 'not_completed';
  notes?: string;
  created_at: Date;
  updated_at: Date;
}

/**
 * Inventory_Items - Cleaning supplies and equipment
 */
interface InventoryItem {
  id: number;
  name: string;
  description?: string;
  category: 'cleaning_supply' | 'equipment' | 'tool' | 'uniform' | 'other';
  unit: string; // bottle, box, each, etc.
  quantity_in_stock: number;
  minimum_stock_level: number;
  cost_per_unit: number;
  supplier?: string;
  created_at: Date;
  updated_at: Date;
}

/**
 * Inventory_Transactions - Movement of inventory items
 */
interface InventoryTransaction {
  id: number;
  inventory_item_id: number; // Foreign key to InventoryItem
  transaction_type: 'purchase' | 'use' | 'return' | 'adjustment';
  quantity: number;
  transaction_date: Date;
  user_id: number; // Foreign key to User (who recorded the transaction)
  notes?: string;
  location_id?: number; // Foreign key to Location (if applicable)
  created_at: Date;
  updated_at: Date;
}

/**
 * Invoices - Billing records for completed services
 */
interface Invoice {
  id: number;
  client_id: number; // Foreign key to Client
  contract_id: number; // Foreign key to Contract
  invoice_number: string;
  issue_date: Date;
  due_date: Date;
  amount: number;
  tax_amount: number;
  total_amount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  payment_date?: Date;
  payment_method?: string;
  payment_reference?: string;
  notes?: string;
  created_at: Date;
  updated_at: Date;
}

/**
 * Invoice_Items - Line items on invoices
 */
interface InvoiceItem {
  id: number;
  invoice_id: number; // Foreign key to Invoice
  description: string;
  quantity: number;
  unit_price: number;
  amount: number;
  tax_rate: number;
  tax_amount: number;
  location_id?: number; // Foreign key to Location (if applicable)
  schedule_id?: number; // Foreign key to Schedule (if applicable)
  created_at: Date;
  updated_at: Date;
}

/**
 * Expenses - Costs incurred by the business
 */
interface Expense {
  id: number;
  expense_date: Date;
  category: string;
  amount: number;
  description: string;
  receipt?: string; // File path or URL
  approved: boolean;
  approved_by_user_id?: number; // Foreign key to User
  paid: boolean;
  payment_date?: Date;
  payment_method?: string;
  payment_reference?: string;
  created_by_user_id: number; // Foreign key to User
  created_at: Date;
  updated_at: Date;
}

/**
 * Inspections - Quality control checks
 */
interface Inspection {
  id: number;
  location_id: number; // Foreign key to Location
  schedule_id?: number; // Foreign key to Schedule (if related to a specific service)
  inspector_user_id: number; // Foreign key to User
  inspection_date: Date;
  overall_rating: number; // e.g., 1-5
  notes?: string;
  issues_found?: string;
  actions_required?: string;
  follow_up_date?: Date;
  status: 'pending' | 'completed' | 'requires_action' | 'resolved';
  created_at: Date;
  updated_at: Date;
}

/**
 * Client_Feedback - Feedback from clients about services
 */
interface ClientFeedback {
  id: number;
  client_id: number; // Foreign key to Client
  location_id?: number; // Foreign key to Location
  schedule_id?: number; // Foreign key to Schedule
  feedback_date: Date;
  rating: number; // e.g., 1-5
  comments?: string;
  submitted_by?: string;
  responded: boolean;
  response?: string;
  responded_by_user_id?: number; // Foreign key to User
  response_date?: Date;
  created_at: Date;
  updated_at: Date;
}

/**
 * Notifications - System notifications for users
 */
interface Notification {
  id: number;
  user_id: number; // Foreign key to User
  title: string;
  message: string;
  type: 'info' | 'warning' | 'alert' | 'success';
  read: boolean;
  read_at?: Date;
  link?: string;
  created_at: Date;
  updated_at: Date;
}

// Export schema types
export type {
  User,
  Client,
  Location,
  Contract,
  ContractLocation,
  CleaningTask,
  LocationTask,
  Schedule,
  StaffAssignment,
  CleaningReport,
  TaskCompletion,
  InventoryItem,
  InventoryTransaction,
  Invoice,
  InvoiceItem,
  Expense,
  Inspection,
  ClientFeedback,
  Notification,
};
