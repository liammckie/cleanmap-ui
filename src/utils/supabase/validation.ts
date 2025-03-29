
/**
 * 🛡️ Supabase Data Validation Utilities
 * - Zod schema validation helpers
 * - Type transformation utilities
 */

import { prepareObjectForDb } from '@/utils/dateFormatters'
import { ZodSchema } from 'zod'

/**
 * 🛡️ Zod schema validation helper
 */
export function validateInsert<T>(data: unknown, schema: ZodSchema<T>): T {
  const result = schema.safeParse(data)
  if (!result.success) throw result.error
  return result.data
}

/**
 * 🛡️ Validate data and prepare it for DB operations
 * This handles Date to ISO string conversion before validation
 */
export function validateForDb<T>(data: unknown, schema: ZodSchema<T>): T {
  // First prepare the data (convert Date objects to ISO strings)
  const prepared = prepareObjectForDb(data)

  // Then validate using the DB schema (which expects strings for dates)
  const result = schema.safeParse(prepared)
  if (!result.success) {
    // Enhance error message with context
    const errorMsg = `DB schema validation failed: ${result.error.message}`
    console.error(errorMsg, result.error)
    throw new Error(errorMsg)
  }

  return result.data
}

/**
 * For backward compatibility - alias to validateInsert
 * @deprecated Use validateInsert instead
 */
export function validateWithSchema<T>(data: unknown, schema: ZodSchema<T>): T {
  return validateInsert(data, schema)
}
