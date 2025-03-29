/**
 * Cleaning Schema
 *
 * This file defines the data structures for cleaning tasks and schedules.
 */

/**
 * Cleaning_Tasks - Standard cleaning tasks that can be assigned
 */
export interface CleaningTask {
  id: number
  name: string
  description: string
  estimated_duration_minutes: number
  category: 'general' | 'floor' | 'bathroom' | 'kitchen' | 'window' | 'special'
  requires_equipment: boolean
  created_at: Date
  updated_at: Date
}

/**
 * Location_Tasks - Specific tasks for a location
 */
export interface LocationTask {
  id: number
  location_id: number // Foreign key to Location
  task_id: number // Foreign key to CleaningTask
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'custom'
  custom_frequency?: string
  notes?: string
  created_at: Date
  updated_at: Date
}
