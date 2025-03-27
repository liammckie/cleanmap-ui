import { supabase } from '@/integrations/supabase/client';

export async function fetchWorkOrders(
  searchTerm?: string,
  filters?: {
    clientId?: string;
    siteId?: string;
    status?: string;
    category?: string;
    priority?: string;
    startDate?: Date;
    endDate?: Date;
  }
) {
  let query = supabase
    .from('work_orders')
    .select(`
      *,
      site:sites(
        site_name,
        client_id,
        client:clients(company_name)
      )
    `);

  // Apply search if provided
  if (searchTerm) {
    query = query.or(
      `description.ilike.%${searchTerm}%,work_order_number.ilike.%${searchTerm}%`
    );
  }

  // Apply filters if provided
  if (filters) {
    if (filters.siteId) {
      query = query.eq('site_id', filters.siteId);
    }
    if (filters.status) {
      // Type safe casting for enum values
      query = query.eq('status', filters.status as any);
    }
    if (filters.category) {
      query = query.eq('category', filters.category as any);
    }
    if (filters.priority) {
      query = query.eq('priority', filters.priority as any);
    }
    if (filters.startDate) {
      query = query.gte('scheduled_start', filters.startDate.toISOString());
    }
    if (filters.endDate) {
      query = query.lte('scheduled_end', filters.endDate.toISOString());
    }
    // If clientId is provided, we need to filter through the site's client_id
    if (filters.clientId) {
      // This requires a more complex query - first get all sites for this client
      const { data: sitesData } = await supabase
        .from('sites')
        .select('id')
        .eq('client_id', filters.clientId);
      
      if (sitesData && sitesData.length > 0) {
        const siteIds = sitesData.map(site => site.id);
        query = query.in('site_id', siteIds);
      } else {
        // If no sites found for this client, return empty result
        return [];
      }
    }
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching work orders:', error);
    throw error;
  }

  return data;
}

export async function fetchWorkOrderById(id: string) {
  const { data, error } = await supabase
    .from('work_orders')
    .select(`
      *,
      site:sites(
        site_name,
        client_id,
        client:clients(company_name)
      )
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching work order:', error);
    throw error;
  }

  return data;
}

export async function fetchWorkOrdersBySiteId(siteId: string) {
  const { data, error } = await supabase
    .from('work_orders')
    .select(`
      *,
      site:sites(
        site_name,
        client_id,
        client:clients(company_name)
      )
    `)
    .eq('site_id', siteId);

  if (error) {
    console.error('Error fetching work orders by site ID:', error);
    throw error;
  }

  return data;
}

export async function fetchWorkOrdersByClientId(clientId: string) {
  // This requires a more complex query - first get all sites for this client
  const { data: sitesData, error: sitesError } = await supabase
    .from('sites')
    .select('id')
    .eq('client_id', clientId);

  if (sitesError) {
    console.error('Error fetching sites for client:', sitesError);
    return [];
  }
  
  if (sitesData && sitesData.length > 0) {
    const siteIds = sitesData.map(site => site.id);

    const { data, error } = await supabase
      .from('work_orders')
      .select(`
        *,
        site:sites(
          site_name,
          client_id,
          client:clients(company_name)
        )
      `)
      .in('site_id', siteIds);

    if (error) {
      console.error('Error fetching work orders for sites:', error);
      throw error;
    }

    return data;
  } else {
    // If no sites found for this client, return empty result
    return [];
  }
}
