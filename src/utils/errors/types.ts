
/**
 * Error handling type definitions
 */
import { ErrorEntry } from '@/utils/documentationManager';

/**
 * Interface for error context information
 */
export interface ErrorContext {
  component?: string;
  operation?: string;
  additionalInfo?: Record<string, any>;
}

/**
 * Interface for build error information
 */
export interface BuildErrorInfo {
  file: string;
  line: number;
  column: number;
  message: string;
  originalMessage: string;
}
