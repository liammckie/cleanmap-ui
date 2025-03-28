
import { prepareObjectForDb } from '@/utils/dateFormatters';
import { SupabaseClient } from '@supabase/supabase-js';
import { ZodSchema } from 'zod';

/**
 * Typed insert with transformation and error handling
 * Ensures input is shaped correctly, transformed via prepareObjectForDb,
 * and matches the Supabase Insert type.
 */
export async function insertTypedRow<T extends string>(
  supabase: SupabaseClient,
  table: T,
  input: Record<string, any>
) {
  // Prepare the data by converting Date objects to ISO strings
  const prepared = prepareObjectForDb(input);
  
  const { data, error } = await supabase
    .from(table)
    .insert(prepared)
    .select();

  if (error) {
    console.error(`Error inserting into ${table}:`, error);
    throw error;
  }

  if (!data || data.length === 0) {
    throw new Error(`Insert into ${table} returned no rows`);
  }

  return data[0];
}

/**
 * Typed update with transformation and error handling
 * Accepts partial update payload, runs transformations, and returns updated row.
 */
export async function updateTypedRow<T extends string>(
  supabase: SupabaseClient,
  table: T,
  id: string,
  updates: Record<string, any>
) {
  // Prepare the data by converting Date objects to ISO strings
  const prepared = prepareObjectForDb(updates);
  
  const { data, error } = await supabase
    .from(table)
    .update(prepared)
    .eq('id', id)
    .select();

  if (error) {
    console.error(`Error updating ${table}:`, error);
    throw error;
  }

  if (!data || data.length === 0) {
    throw new Error(`Update to ${table} returned no rows`);
  }

  return data[0];
}

/**
 * Typed delete by ID
 * Deletes a row by ID from a typed Supabase table.
 */
export async function deleteTypedRow(
  supabase: SupabaseClient,
  table: string,
  id: string
): Promise<boolean> {
  const { error } = await supabase
    .from(table)
    .delete()
    .eq('id', id);

  if (error) {
    console.error(`Error deleting from ${table}:`, error);
    throw error;
  }

  return true;
}

/**
 * Zod schema validation helper for DB inserts/updates
 * Parses raw data and throws if schema doesn't match.
 */
export function validateWithSchema<T>(data: unknown, schema: ZodSchema<T>): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw result.error;
  }
  return result.data;
}

/**
 * Creates a validated and prepared object for database insertion
 * Combines schema validation with date/null transformations
 */
export function validateAndPrepare<T>(data: unknown, schema: ZodSchema<T>) {
  const validated = validateWithSchema(data, schema);
  return prepareObjectForDb(validated);
}
