
/**
 * Error caching functionality
 * 
 * Manages caching of documented errors to avoid duplicates
 */
import { writeToStorage, readFromStorage } from '@/utils/localStorageManager';

// Store for errors that have already been documented
const ERROR_CACHE_KEY = 'error_cache';

// Initialize the cache from local storage
export const documentedErrors = new Set<string>(
  JSON.parse(readFromStorage(ERROR_CACHE_KEY) || '[]')
);

/**
 * Updates the error cache in local storage
 */
export const updateErrorCache = (): void => {
  writeToStorage(ERROR_CACHE_KEY, JSON.stringify(Array.from(documentedErrors)));
};

/**
 * Checks if an error has already been documented
 * @param errorKey Unique key for the error
 * @returns Whether the error has been documented
 */
export const isErrorDocumented = (errorKey: string): boolean => {
  return documentedErrors.has(errorKey);
};

/**
 * Adds an error to the documented errors cache
 * @param errorKey Unique key for the error
 */
export const addToDocumentedErrors = (errorKey: string): void => {
  documentedErrors.add(errorKey);
  updateErrorCache();
};
