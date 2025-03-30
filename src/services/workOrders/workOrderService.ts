
/**
 * Work Order Service
 */
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { formatISO } from 'date-fns';
import { 
  WORK_ORDER_PRIORITIES as workOrderPriorities, 
  WORK_ORDER_CATEGORIES as workOrderCategories, 
  WORK_ORDER_STATUSES as workOrderStatuses 
} from '@/constants/workOrders';

// Type for work order creation
export type WorkOrderCreate = {
  site_id: string;
  title: string;
  description: string;
  scheduled_start: string;
  due_date: string;
  priority?: typeof workOrderPriorities[number];
  status?: typeof workOrderStatuses[number];
  category: typeof workOrderCategories[number];
  contract_id?: string;
};

/**
 * Create a new work order
 */
export const createWorkOrder = async (workOrderData: WorkOrderCreate) => {
  try {
    // Ensure title is present
    if (!workOrderData.title) {
      throw new Error('Work order title is required');
    }
    
    // Set default status if not provided
    if (!workOrderData.status) {
      workOrderData.status = 'Scheduled';
    }
    
    // Set default priority if not provided
    if (!workOrderData.priority) {
      workOrderData.priority = 'Medium';
    }
    
    const { data, error } = await supabase
      .from('work_orders')
      .insert({
        id: uuidv4(),
        site_id: workOrderData.site_id,
        title: workOrderData.title,
        description: workOrderData.description,
        scheduled_start: workOrderData.scheduled_start,
        due_date: workOrderData.due_date,
        priority: workOrderData.priority,
        status: workOrderData.status,
        category: workOrderData.category,
        contract_id: workOrderData.contract_id,
        created_at: formatISO(new Date()),
        updated_at: formatISO(new Date())
      })
      .select();
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error creating work order:', error);
    return { data: null, error };
  }
};

// Define the WorkOrder type to match your Supabase table schema
export type WorkOrder = {
  id: string;
  site_id: string;
  title: string;
  description: string;
  scheduled_start: string;
  due_date: string;
  priority: 'Low' | 'Medium' | 'High';  // Changed from workOrderPriorities to fix type error
  status: typeof workOrderStatuses[number];
  category: typeof workOrderCategories[number];
  contract_id?: string;
  created_at: string;
  updated_at: string;
};

/**
 * Fetches all work orders from Supabase
 */
export const getAllWorkOrders = async (): Promise<{ data: WorkOrder[] | null; error: any }> => {
  try {
    const { data, error } = await supabase
      .from('work_orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching work orders:', error);
      return { data: null, error };
    }

    return { data: data as WorkOrder[], error: null };
  } catch (error) {
    console.error('Error fetching work orders:', error);
    return { data: null, error };
  }
};

/**
 * Updates an existing work order
 */
export const updateWorkOrder = async (id: string, updates: Partial<WorkOrder>): Promise<{ data: WorkOrder[] | null; error: any }> => {
  try {
    // Make sure priority is limited to the allowed values
    if (updates.priority && !['Low', 'Medium', 'High'].includes(updates.priority)) {
      throw new Error(`Invalid priority: ${updates.priority}. Must be one of: Low, Medium, High`);
    }
    
    const { data, error } = await supabase
      .from('work_orders')
      .update(updates)
      .eq('id', id)
      .select();

    if (error) {
      console.error(`Error updating work order with id ${id}:`, error);
      return { data: null, error };
    }

    return { data: data as WorkOrder[], error: null };
  } catch (error) {
    console.error(`Error updating work order with id ${id}:`, error);
    return { data: null, error };
  }
};

/**
 * Deletes a work order by ID
 */
export const deleteWorkOrder = async (id: string): Promise<{ data: null; error: any }> => {
  try {
    const { data, error } = await supabase
      .from('work_orders')
      .delete()
      .eq('id', id);

    if (error) {
      console.error(`Error deleting work order with id ${id}:`, error);
      return { data: null, error };
    }

    return { data: null, error: null };
  } catch (error) {
    console.error(`Error deleting work order with id ${id}:`, error);
    return { data: null, error };
  }
};
