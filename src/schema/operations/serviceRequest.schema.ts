/**
 * Service Request Schema
 *
 * This file defines the data structures for service request entities.
 */

/**
 * ServiceRequest - Request for ad-hoc services from a client
 */
export interface ServiceRequest {
  id: string
  client_id: string
  site_id: string
  request_date: Date
  service_details: string
  preferred_date: Date | null
  client_notes: string | null
  status: 'Pending Review' | 'Quoted' | 'Approved' | 'Scheduled' | 'Rejected'
  quote_id: string | null
  work_order_id: string | null
  billable: boolean | null
  reviewed_by: string | null
  decision_notes: string | null
  created_at: Date
  updated_at: Date
}

// Type guards for runtime type checking
export function isServiceRequestStatus(value: string): value is ServiceRequest['status'] {
  return ['Pending Review', 'Quoted', 'Approved', 'Scheduled', 'Rejected'].includes(value)
}
