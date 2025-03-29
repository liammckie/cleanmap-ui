
import camelcaseKeys from 'camelcase-keys'
import snakecaseKeys from 'snakecase-keys'
import { prepareObjectForDb } from './dateFormatters'

/**
 * Transforms a camelCase object to snake_case for database operations
 */
export function mapToDb<T extends Record<string, any>>(data: T): Record<string, any> {
  if (!data) {
    console.warn('mapToDb received null or undefined data')
    return {}
  }
  
  // Convert to snake_case
  return snakecaseKeys(data, { deep: true })
}

/**
 * Transforms a snake_case object from the database to camelCase for UI
 */
export function mapFromDb<T extends Record<string, any>>(data: T): Record<string, any> {
  if (!data) {
    console.warn('mapFromDb received null or undefined data')
    return {}
  }
  
  return camelcaseKeys(data, { deep: true })
}

/**
 * Type-safe version of mapToDb that ensures the result matches a specific DB type
 */
export function mapTypedToDb<T extends Record<string, any>, R>(data: T): R {
  return mapToDb(data) as R
}

/**
 * Type-safe version of mapFromDb that ensures the result matches a specific UI type
 */
export function mapTypedFromDb<T extends Record<string, any>, R>(data: T): R {
  return mapFromDb(data) as R
}
