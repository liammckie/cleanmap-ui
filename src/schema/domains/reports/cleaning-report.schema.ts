/**
 * Cleaning Report Schema
 *
 * This file defines the data structures for cleaning reports and task completions.
 */

/**
 * Cleaning_Reports - Documentation of completed services
 */
export interface CleaningReport {
  id: number
  schedule_id: number // Foreign key to Schedule
  completed_by_user_id: number // Foreign key to User (who completed the report)
  completion_date: Date
  start_time: Date
  end_time: Date
  notes?: string
  client_signature?: string
  issues_reported?: string
  created_at: Date
  updated_at: Date
}

/**
 * Task_Completions - Individual tasks completed during a service
 */
export interface TaskCompletion {
  id: number
  cleaning_report_id: number // Foreign key to CleaningReport
  location_task_id: number // Foreign key to LocationTask
  status: 'completed' | 'partially_completed' | 'not_completed'
  notes?: string
  created_at: Date
  updated_at: Date
}
