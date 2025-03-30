
// Export work order services with renamed exports to avoid conflicts
import * as workOrderServiceModule from './workOrderService'
import * as workOrderQueryServiceModule from './workOrderQueryService'
export * from './workOrderAssignmentService'
export * from './workOrderChecklistService'

// Re-export from workOrderService with original names
export const {
  createWorkOrder,
  updateWorkOrder,
  deleteWorkOrder,
} = workOrderServiceModule

// Re-export from workOrderQueryService with original names
export const {
  fetchWorkOrders,
  fetchWorkOrderById,
  fetchWorkOrdersBySiteId,
  fetchWorkOrdersByClientId,
  fetchWorkOrderStatusesFromDb,
  fetchWorkOrderCategoriesFromDb,
  fetchWorkOrderPrioritiesFromDb,
} = workOrderQueryServiceModule

// Add convenience aliases for backwards compatibility
export const fetchWorkOrderStatuses = fetchWorkOrderStatusesFromDb
export const fetchWorkOrderCategories = fetchWorkOrderCategoriesFromDb
export const fetchWorkOrderPriorities = fetchWorkOrderPrioritiesFromDb
