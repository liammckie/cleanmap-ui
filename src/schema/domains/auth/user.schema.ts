/**
 * User Schema
 *
 * This file defines the data structures for User entities.
 */

/**
 * Users - Staff members and administrators
 */
export interface User {
  id: number
  name: string
  email: string
  password: string // Hashed
  role: 'admin' | 'manager' | 'cleaner' | 'supervisor'
  phone: string
  address?: string
  hire_date: Date
  employment_status: 'active' | 'inactive' | 'on_leave'
  hourly_rate?: number
  created_at: Date
  updated_at: Date
}
