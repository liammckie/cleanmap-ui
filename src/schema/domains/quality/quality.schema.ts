
/**
 * Quality Schema
 * 
 * This file defines the data structures for quality control and feedback.
 */

/**
 * Inspections - Quality control checks
 */
export interface Inspection {
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
export interface ClientFeedback {
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
