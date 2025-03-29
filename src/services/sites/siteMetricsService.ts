
import { supabase } from '@/integrations/supabase/client'

/**
 * Get site counts by region or status for reporting
 */
export async function getSiteCounts(groupBy: 'region' | 'status'): Promise<{ label: string; count: number }[]> {
  try {
    // Execute RPC to database function
    const { data, error } = await supabase
      .rpc('get_site_counts', { group_field: groupBy })
      
    if (error) {
      console.error(`Error getting site counts by ${groupBy}:`, error)
      throw error
    }

    // Transform the data to match the expected return type
    if (data && Array.isArray(data)) {
      return data.map(item => ({
        label: String(item.group_value) || 'Unknown',
        count: Number(item.count)
      }))
    }
    
    return []
  } catch (error) {
    console.error(`Error in getSiteCounts by ${groupBy}:`, error)
    return []
  }
}
