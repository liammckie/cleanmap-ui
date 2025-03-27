
import { z } from 'zod';

/**
 * Common validation error messages
 */
export const ValidationErrors = {
  REQUIRED: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  INVALID_PHONE: 'Please enter a valid phone number',
  INVALID_DATE: 'Please enter a valid date',
  MIN_LENGTH: (min: number) => `Must be at least ${min} characters`,
  MAX_LENGTH: (max: number) => `Must be at most ${max} characters`,
  MIN_VALUE: (min: number) => `Must be at least ${min}`,
  MAX_VALUE: (max: number) => `Must be at most ${max}`,
  FUTURE_DATE: 'Date must be in the future',
  PAST_DATE: 'Date must be in the past',
  PASSWORDS_MATCH: 'Passwords must match',
  INVALID_URL: 'Please enter a valid URL',
  INVALID_ZIP: 'Please enter a valid ZIP code',
  INVALID_CURRENCY: 'Please enter a valid amount',
};

/**
 * Parse validation error message from the schema
 */
export function parseValidationError(error: z.ZodIssue) {
  if (error.code === 'too_small' && 'minimum' in error) {
    if (error.type === 'string') {
      return ValidationErrors.MIN_LENGTH(error.minimum);
    } else {
      return ValidationErrors.MIN_VALUE(error.minimum);
    }
  }
  
  if (error.code === 'too_big' && 'maximum' in error) {
    if (error.type === 'string') {
      return ValidationErrors.MAX_LENGTH(error.maximum);
    } else {
      return ValidationErrors.MAX_VALUE(error.maximum);
    }
  }
  
  return error.message;
}

/**
 * String validation schema builder
 */
export function createStringSchema(options: {
  min?: number;
  max?: number;
  required?: boolean;
  email?: boolean;
  url?: boolean;
  regex?: RegExp;
  customError?: string;
}) {
  let schema = z.string();
  
  if (options.min !== undefined) {
    schema = schema.min(options.min, ValidationErrors.MIN_LENGTH(options.min));
  }
  
  if (options.max !== undefined) {
    schema = schema.max(options.max, ValidationErrors.MAX_LENGTH(options.max));
  }
  
  if (options.email) {
    schema = schema.email(ValidationErrors.INVALID_EMAIL);
  }
  
  if (options.url) {
    schema = schema.url(ValidationErrors.INVALID_URL);
  }
  
  if (options.regex) {
    schema = schema.regex(options.regex, options.customError || 'Invalid format');
  }
  
  if (options.required === false) {
    schema = schema.optional();
  } else {
    schema = schema.min(1, ValidationErrors.REQUIRED);
  }
  
  return schema;
}

/**
 * Number validation schema builder
 */
export function createNumberSchema(options: {
  min?: number;
  max?: number;
  required?: boolean;
  integer?: boolean;
  positive?: boolean;
}) {
  let schema = options.integer ? z.number().int() : z.number();
  
  if (options.min !== undefined) {
    schema = schema.min(options.min, ValidationErrors.MIN_VALUE(options.min));
  }
  
  if (options.max !== undefined) {
    schema = schema.max(options.max, ValidationErrors.MAX_VALUE(options.max));
  }
  
  if (options.positive) {
    schema = schema.positive(ValidationErrors.MIN_VALUE(0));
  }
  
  if (options.required === false) {
    schema = schema.optional();
  }
  
  return schema;
}

/**
 * Date validation schema builder
 */
export function createDateSchema(options: {
  min?: Date;
  max?: Date;
  required?: boolean;
  future?: boolean;
  past?: boolean;
}) {
  let schema = z.date();
  
  if (options.min) {
    schema = schema.min(options.min, `Date must be after ${options.min.toLocaleDateString()}`);
  }
  
  if (options.max) {
    schema = schema.max(options.max, `Date must be before ${options.max.toLocaleDateString()}`);
  }
  
  if (options.future) {
    schema = schema.min(new Date(), ValidationErrors.FUTURE_DATE);
  }
  
  if (options.past) {
    schema = schema.max(new Date(), ValidationErrors.PAST_DATE);
  }
  
  if (options.required === false) {
    schema = schema.optional();
  }
  
  return schema;
}
