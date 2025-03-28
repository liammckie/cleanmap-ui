
/**
 * 📘 Supabase Helper Layer
 * - Fully typed insert/update/delete/query helpers
 * - Zod schema validation + transformation
 * - Built for scalability, safety, and DX
 *
 * ✅ Use `apiClient` for safe, consistent DB interaction
 * ✅ Helpers return proper types and transform dates before insert
 * ✅ Optional support for pagination, filters, full query customization
 */

import { prepareObjectForDb } from '@/utils/dateFormatters';
import { Database } from '@/integrations/supabase/types';
import { SupabaseClient } from '@supabase/supabase-js';
import { ZodSchema } from 'zod';

/**
 * ✅ Typed insert with transformation and flexible return type
 * Accepts optional field selection and supports bulk inserts.
 */
export async function insertTypedRow<T extends keyof Database['public']['Tables'], R = Database['public']['Tables'][T]['Row']>(
  supabase: SupabaseClient,
  table: T,
  input: Database['public']['Tables'][T]['Insert'] | Database['public']['Tables'][T]['Insert'][],
  selectFields: string = '*'
): Promise<R | R[]> {
  const prepped = Array.isArray(input) ? input.map(prepareObjectForDb) : prepareObjectForDb(input);
  const query = supabase.from(table).insert(prepped).select(selectFields);
  const { data, error } = Array.isArray(input) ? await query : await query.single();
  if (error || !data) throw error ?? new Error('Insert failed');
  return data as R | R[];
}

/**
 * ✏️ Typed update with transformation and flexible return
 */
export async function updateTypedRow<T extends keyof Database['public']['Tables'], R = Database['public']['Tables'][T]['Row']>(
  supabase: SupabaseClient,
  table: T,
  id: string,
  updates: Partial<Database['public']['Tables'][T]['Update']>,
  selectFields: string = '*'
): Promise<R> {
  const prepared = prepareObjectForDb(updates);
  const { data, error } = await supabase.from(table).update(prepared).eq('id', id).select(selectFields).maybeSingle();
  if (error || !data) throw error ?? new Error('Update failed');
  return data as R;
}

/**
 * 🗑️ Typed delete by ID
 */
export async function deleteTypedRow<T extends keyof Database['public']['Tables']>(
  supabase: SupabaseClient,
  table: T,
  id: string
): Promise<boolean> {
  const { error } = await supabase.from(table).delete().eq('id', id);
  if (error) throw error;
  return true;
}

/**
 * 🔍 Typed row selection by ID
 */
export async function selectTypedRow<T extends keyof Database['public']['Tables'], R = Database['public']['Tables'][T]['Row']>(
  supabase: SupabaseClient,
  table: T,
  id: string,
  selectFields: string = '*'
): Promise<R> {
  const { data, error } = await supabase.from(table).select(selectFields).eq('id', id).maybeSingle();
  if (error || !data) throw error ?? new Error('Select by ID failed');
  return data as R;
}

/**
 * 🔎 Flexible multi-row query w/ optional filters, limit, ordering, and advanced clauses
 */
export async function queryTypedRows<T extends keyof Database['public']['Tables'], R = Database['public']['Tables'][T]['Row']>(
  supabase: SupabaseClient,
  table: T,
  filters: { [key: string]: any } = {},
  selectFields: string = '*',
  options: {
    limit?: number;
    orderBy?: string;
    orderDirection?: 'asc' | 'desc';
    range?: [number, number];
    like?: { [key: string]: string };
    or?: string;
    in?: { [key: string]: any[] };
  } = {}
): Promise<R[]> {
  let query = supabase.from(table).select(selectFields);

  for (const key in filters) {
    query = query.eq(key, filters[key]);
  }

  if (options.like) {
    for (const key in options.like) {
      query = query.like(key, options.like[key]);
    }
  }

  if (options.in) {
    for (const key in options.in) {
      query = query.in(key, options.in[key]);
    }
  }

  if (options.or) {
    query = query.or(options.or);
  }

  if (options.orderBy) query = query.order(options.orderBy, { ascending: options.orderDirection !== 'desc' });
  if (options.limit) query = query.limit(options.limit);
  if (options.range) query = query.range(options.range[0], options.range[1]);

  const { data, error } = await query;
  if (error || !data) throw error ?? new Error('Query failed');
  return data as R[];
}

/**
 * 🛡️ Zod schema validation helper
 */
export function validateInsert<T>(data: unknown, schema: ZodSchema<T>): T {
  const result = schema.safeParse(data);
  if (!result.success) throw result.error;
  return result.data;
}

/**
 * For backward compatibility - alias to validateInsert
 * @deprecated Use validateInsert instead
 */
export function validateWithSchema<T>(data: unknown, schema: ZodSchema<T>): T {
  return validateInsert(data, schema);
}

/**
 * 🧠 Client abstraction that uses helpers with validation
 */
export const apiClient = {
  async create<T extends keyof Database['public']['Tables'], R = Database['public']['Tables'][T]['Row']>(
    supabase: SupabaseClient,
    table: T,
    data: unknown,
    schema: ZodSchema<Database['public']['Tables'][T]['Insert']>,
    selectFields?: string
  ) {
    const safe = validateInsert(data, schema);
    return insertTypedRow<T, R>(supabase, table, safe, selectFields);
  },

  async update<T extends keyof Database['public']['Tables'], R = Database['public']['Tables'][T]['Row']>(
    supabase: SupabaseClient,
    table: T,
    id: string,
    updates: Partial<Database['public']['Tables'][T]['Update']>,
    selectFields?: string
  ) {
    return updateTypedRow<T, R>(supabase, table, id, updates, selectFields);
  },

  async delete<T extends keyof Database['public']['Tables']>(
    supabase: SupabaseClient,
    table: T,
    id: string
  ) {
    return deleteTypedRow(supabase, table, id);
  },

  async getById<T extends keyof Database['public']['Tables'], R = Database['public']['Tables'][T]['Row']>(
    supabase: SupabaseClient,
    table: T,
    id: string,
    selectFields?: string
  ) {
    return selectTypedRow<T, R>(supabase, table, id, selectFields);
  },

  async query<T extends keyof Database['public']['Tables'], R = Database['public']['Tables'][T]['Row']>(
    supabase: SupabaseClient,
    table: T,
    filters: { [key: string]: any },
    selectFields?: string,
    options?: {
      limit?: number;
      orderBy?: string;
      orderDirection?: 'asc' | 'desc';
      range?: [number, number];
      like?: { [key: string]: string };
      or?: string;
      in?: { [key: string]: any[] };
    }
  ) {
    return queryTypedRows<T, R>(supabase, table, filters, selectFields, options);
  }
};

/**
 * 📌 Usage Example
 * const safeData = validateInsert(payload, leadSchema);
 * const lead = await apiClient.create(supabase, 'leads', payload, leadSchema);
 */
