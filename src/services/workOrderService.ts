
import { supabase } from '@/integrations/supabase/client';
import type { WorkOrder, WorkOrderAssignment, AuditChecklistItem } from '@/schema/operations.schema';
import { prepareObjectForDb } from '@/utils/dateFormatters';

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
      // Type casting for enums
      query = query.eq('status', filters.status as 'Scheduled' | 'In Progress' | 'Completed' | 'Overdue' | 'Cancelled');
    }
    if (filters.category) {
      // Type casting for enums
      query = query.eq('category', filters.category as 'Routine Clean' | 'Ad-hoc Request' | 'Audit');
    }
    if (filters.priority) {
      // Type casting for enums
      query = query.eq('priority', filters.priority as 'Low' | 'Medium' | 'High');
    }
    if (filters.fromDate) {
      query = query.gte('scheduled_start', filters.fromDate);
    }
    if (filters.toDate) {
      query = query.lte('scheduled_start', filters.toDate);
    }
    // For assigned to, we need to handle this differently as it's in the related table
    // This would require a more complex query or post-filtering
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

export async function fetchWorkOrderById(id: string) {
  const { data, error } = await supabase
    .from('work_orders')
    .select(`
      *,
      site:sites(id, site_name, client_id, client:clients(company_name)),
      contract:contracts(id, contract_number),
      completed_by_employee:employees(id, first_name, last_name),
      assignments:work_order_assignments(
        id, 
        employee_id, 
        assignment_type,
        employee:employees(id, first_name, last_name)
      ),
      checklist_items:audit_checklist_items(*)
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching work order:', error);
    throw error;
  }

  return data;
}

export async function createWorkOrder(
  workOrder: Omit<WorkOrder, 'id' | 'created_at' | 'updated_at'>,
  assignments: Omit<WorkOrderAssignment, 'id' | 'work_order_id' | 'created_at' | 'updated_at'>[],
  checklistItems?: Omit<AuditChecklistItem, 'id' | 'work_order_id' | 'created_at' | 'updated_at'>[]
) {
  // Convert Date objects to ISO strings for Supabase
  const dbWorkOrder = prepareObjectForDb(workOrder);
  
  // Create the work order
  const { data, error } = await supabase
    .from('work_orders')
    .insert(dbWorkOrder)
    .select();

  if (error) {
    console.error('Error creating work order:', error);
    throw error;
  }

  const workOrderId = data[0].id;

  // Create assignments
  if (assignments.length > 0) {
    const assignmentsWithWorkOrderId = assignments.map(assignment => ({
      ...assignment,
      work_order_id: workOrderId
    }));

    const { error: assignmentError } = await supabase
      .from('work_order_assignments')
      .insert(assignmentsWithWorkOrderId);

    if (assignmentError) {
      console.error('Error creating work order assignments:', assignmentError);
      throw assignmentError;
    }
  }

  // Create checklist items if provided (for audit work orders)
  if (checklistItems && checklistItems.length > 0) {
    const checklistWithWorkOrderId = checklistItems.map(item => ({
      ...item,
      work_order_id: workOrderId
    }));

    const { error: checklistError } = await supabase
      .from('audit_checklist_items')
      .insert(checklistWithWorkOrderId);

    if (checklistError) {
      console.error('Error creating audit checklist items:', checklistError);
      throw checklistError;
    }
  }

  return data[0];
}

export async function updateWorkOrder(
  id: string,
  updates: Partial<WorkOrder>,
  assignments?: Omit<WorkOrderAssignment, 'id' | 'work_order_id' | 'created_at' | 'updated_at'>[],
  checklistItems?: Omit<AuditChecklistItem, 'id' | 'work_order_id' | 'created_at' | 'updated_at'>[]
) {
  // Convert Date objects to ISO strings for Supabase
  const dbUpdates = prepareObjectForDb(updates);
  
  // Update the work order
  const { data, error } = await supabase
    .from('work_orders')
    .update(dbUpdates)
    .eq('id', id)
    .select();

  if (error) {
    console.error('Error updating work order:', error);
    throw error;
  }

  // Update assignments if provided
  if (assignments) {
    // First delete existing assignments
    const { error: deleteError } = await supabase
      .from('work_order_assignments')
      .delete()
      .eq('work_order_id', id);

    if (deleteError) {
      console.error('Error deleting existing work order assignments:', deleteError);
      throw deleteError;
    }

    // Then create new assignments
    if (assignments.length > 0) {
      const assignmentsWithWorkOrderId = assignments.map(assignment => ({
        ...assignment,
        work_order_id: id
      }));

      const { error: assignmentError } = await supabase
        .from('work_order_assignments')
        .insert(assignmentsWithWorkOrderId);

      if (assignmentError) {
        console.error('Error creating new work order assignments:', assignmentError);
        throw assignmentError;
      }
    }
  }

  // Update checklist items if provided
  if (checklistItems) {
    // First delete existing checklist items
    const { error: deleteError } = await supabase
      .from('audit_checklist_items')
      .delete()
      .eq('work_order_id', id);

    if (deleteError) {
      console.error('Error deleting existing audit checklist items:', deleteError);
      throw deleteError;
    }

    // Then create new checklist items
    if (checklistItems.length > 0) {
      const checklistWithWorkOrderId = checklistItems.map(item => ({
        ...item,
        work_order_id: id
      }));

      const { error: checklistError } = await supabase
        .from('audit_checklist_items')
        .insert(checklistWithWorkOrderId);

      if (checklistError) {
        console.error('Error creating new audit checklist items:', checklistError);
        throw checklistError;
      }
    }
  }

  return data[0];
}

export async function deleteWorkOrder(id: string) {
  const { error } = await supabase
    .from('work_orders')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting work order:', error);
    throw error;
  }

  return true;
}

// Fetch work order status options for filters
export async function fetchWorkOrderStatuses() {
  // Use a direct query instead of rpc to get enum values
  const { data, error } = await supabase
    .from('work_orders')
    .select('status')
    .distinct();

  if (error) {
    console.error('Error fetching work order statuses:', error);
    throw error;
  }

  return data.map(item => item.status);
}

// Fetch work order categories for filters
export async function fetchWorkOrderCategories() {
  // Use a direct query instead of rpc to get enum values
  const { data, error } = await supabase
    .from('work_orders')
    .select('category')
    .distinct();

  if (error) {
    console.error('Error fetching work order categories:', error);
    throw error;
  }

  return data.map(item => item.category);
}

// Fetch work order priorities for filters
export async function fetchWorkOrderPriorities() {
  // Use a direct query instead of rpc to get enum values
  const { data, error } = await supabase
    .from('work_orders')
    .select('priority')
    .distinct();

  if (error) {
    console.error('Error fetching work order priorities:', error);
    throw error;
  }

  return data.map(item => item.priority);
}
