
/**
 * Schedule Schema
 * 
 * This file defines the data structures for schedules and staff assignments.
 */

/**
 * Schedules - Planned cleaning services
 */
export interface Schedule {
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
export interface StaffAssignment {
  id: number;
  schedule_id: number; // Foreign key to Schedule
  user_id: number; // Foreign key to User
  role_in_assignment: 'lead' | 'support';
  status: 'assigned' | 'confirmed' | 'completed' | 'absent';
  hours_worked?: number;
  created_at: Date;
  updated_at: Date;
}
