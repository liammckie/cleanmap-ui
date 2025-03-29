/**
 * Human Resources Schema
 *
 * This file defines the data structures for HR-related entities
 * including employees, onboarding, timesheets, and training.
 */

/**
 * Employee - Represents a staff member in the organization
 */
interface Employee {
  id: string
  first_name: string
  last_name: string
  date_of_birth: Date
  contact_phone: string
  contact_email: string
  address_street: string
  address_city: string
  address_state: string
  address_postcode: string
  employee_id: string // Internal reference code
  job_title: string
  department: string
  start_date: Date
  employment_type: 'Full-time' | 'Part-time' | 'Contractor'
  status: 'Onboarding' | 'Active' | 'Terminated'
  wage_classification: string
  pay_rate: number
  pay_cycle: 'Weekly' | 'Fortnightly' | 'Monthly'
  tax_id: string // Tax file number
  bank_bsb: string
  bank_account_number: string
  super_fund_name: string
  super_member_number: string
  user_account_id?: string // Link to authentication user record
  created_at: Date
  updated_at: Date
}

/**
 * OnboardingTask - Task in the employee onboarding process
 */
interface OnboardingTask {
  id: string
  employee_id: string // Reference to the Employee
  task_description: string
  assigned_to: string // Department or specific user
  due_date: Date
  status: 'Pending' | 'In Progress' | 'Completed'
  completed_date?: Date
  created_by: string
  approval_needed: boolean
  created_at: Date
  updated_at: Date
}

/**
 * Timesheet - Record of hours worked by an employee
 */
interface Timesheet {
  id: string
  employee_id: string
  date: Date
  start_time: Date
  end_time: Date
  break_duration: number // In minutes
  site_id?: string // Reference to the Site
  work_order_id?: string // Reference to specific Work Order
  hours_worked: number // Calculated field
  status: 'Pending Approval' | 'Approved' | 'Rejected'
  approved_by?: string
  payroll_processed: boolean
  created_at: Date
  updated_at: Date
}

/**
 * PerformanceReview - Employee performance evaluation
 */
interface PerformanceReview {
  id: string
  employee_id: string
  review_date: Date
  reviewer_id: string // Employee ID of the reviewer
  rating: number // Numeric rating (e.g., 1-5)
  comments: string
  goals: string
  review_type: 'Probation' | 'Quarterly' | 'Annual' | 'Special'
  created_at: Date
  updated_at: Date
}

/**
 * TrainingRecord - Record of employee training or certification
 */
interface TrainingRecord {
  id: string
  employee_id: string
  training_name: string
  completion_date: Date
  expiry_date?: Date // For certifications that expire
  score?: number
  provider: string
  certificate_id?: string
  document_id?: string // Reference to stored certificate document
  created_at: Date
  updated_at: Date
}

// Export schema types
export type { Employee, OnboardingTask, Timesheet, PerformanceReview, TrainingRecord }
