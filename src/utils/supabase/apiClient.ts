
/**
 * 🧠 Supabase API Client
 * - High-level, convenient DB interaction methods
 * - Combines core helpers with validation
 */

import { SupabaseClient } from '@supabase/supabase-js'
import { ZodSchema } from 'zod'
import { Database } from '@/integrations/supabase/types'
import { 
  insertTypedRow, 
  updateTypedRow,
  deleteTypedRow,
  selectTypedRow,
  queryTypedRows
} from './core'
import { validateForDb } from './validation'

/**
 * 🧠 Client abstraction that uses helpers with validation
 */
export const apiClient = {
  async create<
    T extends keyof Database['public']['Tables'],
    R = Database['public']['Tables'][T]['Row'],
  >(
    supabase: SupabaseClient,
    table: T,
    data: unknown,
    schema: ZodSchema<any>,
    selectFields?: string,
  ): Promise<R> {
    // Validate using the provided schema
    const validated = validateForDb(data, schema)

    // Insert and return a single row
    const result = await insertTypedRow<T, R>(supabase, table, validated, selectFields)

    // Ensure we return a single row (not an array)
    return Array.isArray(result) ? result[0] : result
  },

  async update<
    T extends keyof Database['public']['Tables'],
    R = Database['public']['Tables'][T]['Row'],
  >(
    supabase: SupabaseClient,
    table: T,
    id: string,
    updates: Partial<Database['public']['Tables'][T]['Update']>,
    selectFields?: string,
  ): Promise<R> {
    return updateTypedRow<T, R>(supabase, table, id, updates, selectFields)
  },

  async delete<T extends keyof Database['public']['Tables']>(
    supabase: SupabaseClient,
    table: T,
    id: string,
  ): Promise<boolean> {
    return deleteTypedRow(supabase, table, id)
  },

  async getById<
    T extends keyof Database['public']['Tables'],
    R = Database['public']['Tables'][T]['Row'],
  >(supabase: SupabaseClient, table: T, id: string, selectFields?: string): Promise<R> {
    return selectTypedRow<T, R>(supabase, table, id, selectFields)
  },

  async query<
    T extends keyof Database['public']['Tables'],
    R = Database['public']['Tables'][T]['Row'],
  >(
    supabase: SupabaseClient,
    table: T,
    filters: { [key: string]: any },
    selectFields?: string,
    options?: {
      limit?: number
      orderBy?: string
      orderDirection?: 'asc' | 'desc'
      range?: [number, number]
      like?: { [key: string]: string }
      or?: string
      in?: { [key: string]: any[] }
    },
  ): Promise<R[]> {
    return queryTypedRows<T, R>(supabase, table, filters, selectFields, options)
  },
}
