
/**
 * Utility functions for handling common database errors
 */

import React from 'react';
import { toast } from '@/components/ui/use-toast';

/**
 * Handles the infinite recursion error that can occur with RLS policies
 * @param error The error object from Supabase
 * @param entityName The name of the entity being accessed (for user-friendly messages)
 * @returns A user-friendly error message
 */
export const handleInfiniteRecursionError = (error: any, entityName: string = 'data'): string => {
  if (error?.code === '42P17' && error?.message?.includes('infinite recursion detected in policy')) {
    console.error(`RLS Policy Recursion Error detected: ${error.message}`);
    
    // Extract the table name from the error message if possible
    const tableMatch = error.message.match(/relation "([^"]+)"/);
    const tableName = tableMatch ? tableMatch[1] : 'unknown table';
    
    const errorMessage = `Database security policy error. Please contact an administrator and reference error code 42P17 on table "${tableName}".`;
    
    // Show a toast with the error
    toast({
      variant: 'destructive',
      title: 'Database Error',
      description: `Unable to load ${entityName} due to a security policy issue.`,
    });
    
    return errorMessage;
  }
  
  // Return a generic error message for other errors
  return `Error loading ${entityName}: ${error?.message || 'Unknown error'}`;
};

/**
 * Creates a fallback UI element with error details
 * @param error The error object
 * @param entityName The name of the entity for the message
 * @returns JSX element with error information
 */
export const createErrorFallbackUI = (error: any, entityName: string = 'data') => {
  const errorMessage = handleInfiniteRecursionError(error, entityName);
  
  return (
    <div className="p-4 border border-red-300 rounded bg-red-50 text-red-800">
      <h3 className="text-lg font-medium mb-2">Error Loading {entityName}</h3>
      <p className="mb-2">{errorMessage}</p>
      <p className="text-sm">
        This might be due to a database configuration issue. Try refreshing the page or contact support if the problem persists.
      </p>
    </div>
  );
};

/**
 * Provides a fallback handler function for useQuery error handling
 * @param entityName The name of the entity being queried
 * @returns A function that can be used in the onError option of useQuery
 */
export const createQueryErrorHandler = (entityName: string = 'data') => {
  return (error: Error) => {
    console.error(`Failed to fetch ${entityName}:`, error);
    
    // Check if this is a Supabase error object
    const supabaseError = (error as any).error || error;
    
    handleInfiniteRecursionError(supabaseError, entityName);
  };
};
