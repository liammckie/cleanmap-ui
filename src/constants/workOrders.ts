
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
 * Note: Only using Low, Medium, High to match database constraints
 */
export const WORK_ORDER_PRIORITIES = [
  'Low', 
  'Medium', 
  'High'
] as const

/**
 * Work order categories
 */
export const WORK_ORDER_CATEGORIES = [
  'Routine Clean', 
  'Ad-hoc Request', 
  'Audit'
] as const
