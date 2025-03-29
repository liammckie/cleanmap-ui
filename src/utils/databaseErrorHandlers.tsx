
import React from 'react'
import { AlertCircle } from 'lucide-react'

/**
 * Creates an error handler function for React Query
 * @param resourceName The name of the resource being fetched (for display purposes)
 */
export function createQueryErrorHandler(resourceName: string) {
  return (error: unknown) => {
    console.error(`Error fetching ${resourceName}:`, error)
    
    // You can add additional error handling here like notifications
    // For example, using a toast notification system
  }
}

/**
 * Creates a UI component to display database errors in a user-friendly way
 * @param error The error object
 * @param resourceName The name of the resource that failed to load
 */
export function createErrorFallbackUI(error: unknown, resourceName: string) {
  const errorMessage = error instanceof Error ? error.message : String(error)
  
  return (
    <div className="text-center py-8 px-4">
      <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
      <h3 className="text-lg font-semibold mb-2">Unable to load {resourceName}</h3>
      <p className="text-sm text-muted-foreground mb-4">
        There was a problem connecting to the database. Please try again later.
      </p>
      <div className="bg-red-50 border border-red-200 rounded-md p-3 max-w-md mx-auto">
        <p className="text-xs text-red-500 font-mono">{errorMessage}</p>
      </div>
    </div>
  )
}
