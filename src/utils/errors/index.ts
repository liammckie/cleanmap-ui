
/**
 * Error Handling Module
 * 
 * This module provides utilities for capturing, reporting, and handling errors
 * throughout the application.
 */

import * as Sentry from "@sentry/react";
import { toast } from "@/components/ui/use-toast";

/**
 * Capture an error for reporting to Sentry
 * 
 * @param error - The error object to capture
 * @param context - Optional additional context information
 */
export const captureError = (
  error: Error | unknown, 
  context?: Record<string, any>
): string => {
  // Generate a unique event ID
  const eventId = Sentry.captureException(error, { 
    extra: context 
  });
  
  // Log to console in development
  if (import.meta.env.DEV) {
    console.error("Captured error:", error);
    if (context) {
      console.error("Error context:", context);
    }
  }
  
  return eventId;
};

/**
 * Report an error with a user-visible toast notification
 * 
 * @param error - The error that occurred
 * @param title - The title for the error toast
 * @param context - Optional additional context information
 */
export const reportError = (
  error: Error | unknown,
  title: string = "An error occurred",
  context?: Record<string, any>
): string => {
  const eventId = captureError(error, context);
  
  // Show a toast notification
  toast({
    title,
    description: error instanceof Error ? error.message : "Please try again or contact support.",
    variant: "destructive",
  });
  
  return eventId;
};

/**
 * Execute a function with error handling
 * 
 * @param fn - The function to execute
 * @param errorTitle - Title for error toast if the function fails
 * @returns A promise that resolves to the function result or rejects with the error
 */
export const withErrorHandling = async <T>(
  fn: () => Promise<T>,
  errorTitle?: string
): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    reportError(error, errorTitle);
    throw error;
  }
};
