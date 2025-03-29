
import React from 'react'
import { AlertCircle } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

/**
 * Creates an error handler function for React Query
 * @param resourceName The name of the resource being fetched (for display purposes)
 */
export function createQueryErrorHandler(resourceName: string) {
  return (error: unknown) => {
    console.error(`Error fetching ${resourceName}:`, error)
    
    // You can add additional error handling here like notifications
    // For example, using a toast notification system
    toast({
      variant: "destructive",
      title: `Error loading ${resourceName}`,
      description: error instanceof Error ? error.message : 'An unknown error occurred',
    })
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

/**
 * Safely executes a database query with error handling
 * @param queryFn Function that performs the database query
 * @param resourceName Name of the resource being queried (for error reporting)
 * @returns The result of the query function
 */
export async function safelyExecuteQuery<T>(
  queryFn: () => Promise<T>,
  resourceName: string
): Promise<T> {
  try {
    return await queryFn();
  } catch (error) {
    console.error(`Error executing query for ${resourceName}:`, error);
    
    // Check for specific database error types
    if (error instanceof Error) {
      // Handle common database errors
      if (error.message.includes('timeout')) {
        throw new Error(`Database timeout while querying ${resourceName}. Please try again later.`);
      }
      
      if (error.message.includes('permission denied') || error.message.includes('access denied')) {
        throw new Error(`Permission denied while accessing ${resourceName}. Please check your credentials.`);
      }
    }
    
    // Re-throw the original error
    throw error;
  }
}

/**
 * Handles infinite recursion errors that can occur in RLS policies
 * @param error The error object
 * @param context Context information for error reporting
 */
export function handleInfiniteRecursionError(error: any, context: string) {
  console.error(`Infinite recursion detected in ${context}:`, error);
  
  // Log additional details for debugging
  console.error('Error code:', error.code);
  console.error('Error hint:', error.hint);
  
  // Show a user-friendly toast notification
  toast({
    variant: "destructive",
    title: "Database Policy Error",
    description: `A security policy error occurred while accessing ${context}. Please contact an administrator.`,
  });
}
