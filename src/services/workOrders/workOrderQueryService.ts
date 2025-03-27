
import { supabase } from '@/integrations/supabase/client';

/**
 * Fetch work orders with optional filtering and search
 */
export async function fetchWorkOrders(
  searchTerm?: string,
  filters?: {
    siteId?: string;
    contractId?: string;
    status?: string;
    category?: string;
    priority?: string;
    assignedTo?: string;
    fromDate?: string;
    toDate?: string;
  }
) {
  let query = supabase
    .from('work_orders')
    .select(`
      *,
      site:sites(site_name, client_id, client:clients(company_name)),
      contract:contracts(contract_number),
      assignments:work_order_assignments(
        employee:employees(id, first_name, last_name)
      )
    `);

  // Apply search if provided
  if (searchTerm) {
    query = query.or(
      `title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`
    );
  }

  // Apply filters if provided
  if (filters) {
    if (filters.siteId) {
      query = query.eq('site_id', filters.siteId);
    }
    if (filters.contractId) {
      query = query.eq('contract_id', filters.contractId);
    }
    if (filters.status) {
      query = query.eq('status', filters.status);
    }
    if (filters.category) {
      query = query.eq('category', filters.category);
    }
    if (filters.priority) {
      query = query.eq('priority', filters.priority);
    }
    if (filters.fromDate) {
      query = query.gte('scheduled_start', filters.fromDate);
    }
    if (filters.toDate) {
      query = query.lte('scheduled_start', filters.toDate);
    }
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching work orders:', error);
    throw error;
  }

  // Filter by assignedTo if necessary (client-side filtering for this relationship)
  if (filters?.assignedTo && data) {
    return data.filter(workOrder =>
      workOrder.assignments.some(assignment =>
        assignment.employee.id === filters.assignedTo
      )
    );
  }

  return data;
}

/**
 * Fetch work order status options for filters
 */
export async function fetchWorkOrderStatuses() {
  const { data, error } = await supabase
    .from('work_orders')
    .select('status');

  if (error) {
    console.error('Error fetching work order statuses:', error);
    throw error;
  }

  // Extract unique statuses
  const statuses = [...new Set(data.map(item => item.status))];
  return statuses;
}

/**
 * Fetch work order categories for filters
 */
export async function fetchWorkOrderCategories() {
  const { data, error } = await supabase
    .from('work_orders')
    .select('category');

  if (error) {
    console.error('Error fetching work order categories:', error);
    throw error;
  }

  // Extract unique categories
  const categories = [...new Set(data.map(item => item.category))];
  return categories;
}

/**
 * Fetch work order priorities for filters
 */
export async function fetchWorkOrderPriorities() {
  const { data, error } = await supabase
    .from('work_orders')
    .select('priority');

  if (error) {
    console.error('Error fetching work order priorities:', error);
    throw error;
  }

  // Extract unique priorities
  const priorities = [...new Set(data.map(item => item.priority))];
  return priorities;
}
