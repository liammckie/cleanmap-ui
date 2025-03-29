
/**
 * 📘 Supabase Helper Layer
 * - Re-exports from modularized files
 * - Maintained for backward compatibility
 */

// Re-export everything from the new modular files
export * from './supabase/core'
export * from './supabase/validation'
export { apiClient } from './supabase/apiClient'

/**
 * 📌 Usage Example
 * const safeData = validateForDb(payload, leadDbSchema);
 * const lead = await apiClient.create(supabase, 'leads', payload, leadDbSchema);
 */
