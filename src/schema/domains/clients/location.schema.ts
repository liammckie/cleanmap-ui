/**
 * Location Schema
 *
 * This file defines the data structures for Location entities.
 */

/**
 * Locations - Physical places where cleaning services are performed
 */
export interface Location {
  id: number
  client_id: number // Foreign key to Client
  name: string
  address: string
  city: string
  state: string
  postal_code: string
  country: string
  type: string // Office, Retail, Medical, Industrial, etc.
  size_sqm: number
  floors: number
  access_instructions?: string
  special_requirements?: string
  has_alarm_system: boolean
  contact_person?: string
  contact_phone?: string
  status: 'active' | 'inactive'
  created_at: Date
  updated_at: Date
}
