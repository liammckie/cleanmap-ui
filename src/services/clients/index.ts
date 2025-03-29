/**
 * Client services index file
 * Re-exports all client-related service functions
 */

// Re-export all functions from the client services
export * from './clientCoreService'
export * from './clientFilterService'
export * from './clientMetadataService'

// Export the main fetchClients function from clientCoreService as the default client fetch function
export { fetchClients } from './clientCoreService'
