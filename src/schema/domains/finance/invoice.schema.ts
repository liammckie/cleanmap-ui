/**
 * Invoice Schema
 *
 * This file defines the data structures for invoices and expenses.
 */

/**
 * Invoices - Billing records for completed services
 */
export interface Invoice {
  id: number
  client_id: number // Foreign key to Client
  contract_id: number // Foreign key to Contract
  invoice_number: string
  issue_date: Date
  due_date: Date
  amount: number
  tax_amount: number
  total_amount: number
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
  payment_date?: Date
  payment_method?: string
  payment_reference?: string
  notes?: string
  created_at: Date
  updated_at: Date
}

/**
 * Invoice_Items - Line items on invoices
 */
export interface InvoiceItem {
  id: number
  invoice_id: number // Foreign key to Invoice
  description: string
  quantity: number
  unit_price: number
  amount: number
  tax_rate: number
  tax_amount: number
  location_id?: number // Foreign key to Location (if applicable)
  schedule_id?: number // Foreign key to Schedule (if applicable)
  created_at: Date
  updated_at: Date
}

/**
 * Expenses - Costs incurred by the business
 */
export interface Expense {
  id: number
  expense_date: Date
  category: string
  amount: number
  description: string
  receipt?: string // File path or URL
  approved: boolean
  approved_by_user_id?: number // Foreign key to User
  paid: boolean
  payment_date?: Date
  payment_method?: string
  payment_reference?: string
  created_by_user_id: number // Foreign key to User
  created_at: Date
  updated_at: Date
}
