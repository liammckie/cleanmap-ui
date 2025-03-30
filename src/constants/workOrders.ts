
/**
 * Work order status options
 */
export const WORK_ORDER_STATUSES = [
  'Scheduled', 
  'In Progress', 
  'On Hold', 
  'Completed', 
  'Cancelled', 
  'Overdue'
] as const

/**
 * Work order priority levels
 */
export const WORK_ORDER_PRIORITIES = [
  'Low', 
  'Medium', 
  'High', 
  'Critical'
] as const

/**
 * Work order categories
 */
export const WORK_ORDER_CATEGORIES = [
  'Routine Clean', 
  'Ad-hoc Request', 
  'Audit'
] as const
