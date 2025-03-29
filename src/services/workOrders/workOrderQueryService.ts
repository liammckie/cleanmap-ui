
import { supabase } from '@/integrations/supabase/client'
import { isWorkOrderStatus, isWorkOrderPriority, isWorkOrderCategory } from '@/schema/operations/workOrder.schema'
import { handleInfiniteRecursionError } from '@/utils/databaseErrorHandlers'

/**
 * Safely executes a Supabase query with error handling for common database issues
 * @param queryFn Function that builds and executes the Supabase query
 * @param errorContext Context information for error reporting
 */
async function safeExecuteQuery(queryFn, errorContext = 'query') {
  try {
    const result = await queryFn();
    
    if (result.error) {
      // Check for infinite recursion errors
      if (result.error.code === '42P17') {
        console.error(`Infinite recursion detected in ${errorContext}:`, result.error.message);
        handleInfiniteRecursionError(result.error, errorContext);
        throw {
          ...result.error,
          userMessage: `Database security policy error in ${errorContext}. Please contact an administrator.`
        };
      }
      
      // For other errors
      console.error(`Error in ${errorContext}:`, result.error);
      throw result.error;
    }
    
    return result.data;
  } catch (error) {
    console.error(`Exception in ${errorContext}:`, error);
    throw error;
  }
}

export async function fetchWorkOrders(
  searchTerm?: string,
  filters?: {
    clientId?: string
    siteId?: string
    status?: string
    category?: string
    priority?: string
    fromDate?: string
    toDate?: string
  },
) {
  let query = supabase.from('work_orders').select(`
      *,
      site:sites(
        site_name,
        client_id,
        client:clients(company_name)
      ),
      assignments:work_order_assignments(
        id,
        assignment_type,
        employee:employees(id, first_name, last_name)
      )
    `)

  if (searchTerm) {
    query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
  }

  if (filters) {
    if (filters.siteId && filters.siteId !== '' && filters.siteId !== 'all-sites') {
      query = query.eq('site_id', filters.siteId)
    }
    if (filters.status && filters.status !== '' && filters.status !== 'all-statuses') {
      if (isWorkOrderStatus(filters.status)) {
        query = query.eq('status', filters.status)
      }
    }
    if (filters.category && filters.category !== '' && filters.category !== 'all-categories') {
      if (isWorkOrderCategory(filters.category)) {
        query = query.eq('category', filters.category)
      }
    }
    if (filters.priority && filters.priority !== '' && filters.priority !== 'all-priorities') {
      if (isWorkOrderPriority(filters.priority)) {
        query = query.eq('priority', filters.priority)
      }
    }
    if (filters.fromDate && filters.fromDate !== '') {
      query = query.gte('scheduled_start', filters.fromDate)
    }
    if (filters.toDate && filters.toDate !== '') {
      query = query.lte('due_date', filters.toDate)
    }
    if (filters.clientId && filters.clientId !== '' && filters.clientId !== 'all-clients') {
      const { data: sitesData } = await supabase
        .from('sites')
        .select('id')
        .eq('client_id', filters.clientId)

      if (sitesData && sitesData.length > 0) {
        const siteIds = sitesData.map((site) => site.id)
        query = query.in('site_id', siteIds)
      } else {
        return []
      }
    }
  }

  query = query.order('scheduled_start', { ascending: false })

  return safeExecuteQuery(() => query, 'fetchWorkOrders');
}

export async function fetchWorkOrderById(id: string) {
  const { data, error } = await supabase
    .from('work_orders')
    .select(
      `
      *,
      site:sites(
        site_name,
        client_id,
        client:clients(company_name)
      ),
      assignments:work_order_assignments(
        id,
        assignment_type,
        employee:employees(id, first_name, last_name)
      )
    `,
    )
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching work order:', error)
    throw error
  }

  return data
}

export async function fetchWorkOrdersBySiteId(siteId: string) {
  const { data, error } = await supabase
    .from('work_orders')
    .select(
      `
      *,
      site:sites(
        site_name,
        client_id,
        client:clients(company_name)
      ),
      assignments:work_order_assignments(
        id,
        assignment_type,
        employee:employees(id, first_name, last_name)
      )
    `,
    )
    .eq('site_id', siteId)
    .order('scheduled_start', { ascending: false })

  if (error) {
    console.error('Error fetching work orders by site ID:', error)
    throw error
  }

  return data
}

export async function fetchWorkOrdersByClientId(clientId: string) {
  const { data: sitesData, error: sitesError } = await supabase
    .from('sites')
    .select('id')
    .eq('client_id', clientId)

  if (sitesError) {
    console.error('Error fetching sites for client:', sitesError)
    return []
  }

  if (sitesData && sitesData.length > 0) {
    const siteIds = sitesData.map((site) => site.id)

    const { data, error } = await supabase
      .from('work_orders')
      .select(
        `
        *,
        site:sites(
          site_name,
          client_id,
          client:clients(company_name)
        ),
        assignments:work_order_assignments(
          id,
          assignment_type,
          employee:employees(id, first_name, last_name)
        )
      `,
      )
      .in('site_id', siteIds)
      .order('scheduled_start', { ascending: false })

    if (error) {
      console.error('Error fetching work orders for sites:', error)
      throw error
    }

    return data
  } else {
    return []
  }
}

export async function fetchWorkOrderStatusesFromDb() {
  return safeExecuteQuery(
    () => supabase.rpc('get_work_order_status_enum' as EnumFunction),
    'fetchWorkOrderStatuses'
  );
}

export async function fetchWorkOrderCategoriesFromDb() {
  return safeExecuteQuery(
    () => supabase.rpc('get_work_order_category_enum' as EnumFunction),
    'fetchWorkOrderCategories'
  );
}

export async function fetchWorkOrderPrioritiesFromDb() {
  return safeExecuteQuery(
    () => supabase.rpc('get_work_order_priority_enum' as EnumFunction),
    'fetchWorkOrderPriorities'
  );
}

// Re-adding this from the original file
type EnumFunction = 'get_employee_status_enum' | 
  'get_employment_type_enum' | 
  'get_lead_source_enum' | 
  'get_lead_stage_enum' | 
  'get_lead_status_enum' | 
  'get_quote_status_enum' | 
  'get_work_order_status_enum' | 
  'get_work_order_category_enum' | 
  'get_work_order_priority_enum'
