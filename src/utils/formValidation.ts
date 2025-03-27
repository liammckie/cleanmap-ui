import { z } from 'zod';

/**
 * Create a validation schema for a form field
 * @param field Field configuration object
 * @returns Zod schema for the field
 */
export function createFieldSchema(field: {
  type: 'string' | 'number' | 'date' | 'email' | 'phone' | 'select';
  required?: boolean;
  min?: number;
  max?: number;
  options?: string[];
  pattern?: RegExp;
  errorMessage?: string;
}): z.ZodType<any> {
  let schema: z.ZodType<any>;

  // Create base schema based on type
  switch (field.type) {
    case 'string':
      schema = z.string();
      if (field.min !== undefined) {
        schema = schema as z.ZodString;
        schema = schema.min(field.min, `Must be at least ${field.min} characters`);
      }
      if (field.max !== undefined) {
        schema = schema as z.ZodString;
        schema = schema.max(field.max, `Must be at most ${field.max} characters`);
      }
      break;
    case 'number':
      schema = z.number();
      if (field.min !== undefined) {
        schema = schema as z.ZodNumber;
        schema = schema.min(field.min, `Must be at least ${field.min}`);
      }
      if (field.max !== undefined) {
        schema = schema as z.ZodNumber;
        schema = schema.max(field.max, `Must be at most ${field.max}`);
      }
      break;
    case 'date':
      schema = z.date();
      break;
    case 'email':
      schema = z.string().email(field.errorMessage || 'Invalid email address');
      if (field.min !== undefined) {
        schema = schema as z.ZodString;
        schema = schema.min(field.min, `Must be at least ${field.min} characters`);
      }
      if (field.max !== undefined) {
        schema = schema as z.ZodString;
        schema = schema.max(field.max, `Must be at most ${field.max} characters`);
      }
      break;
    case 'phone':
      schema = z.string().regex(
        field.pattern || /^[0-9\s\+\-\(\)]{8,15}$/,
        field.errorMessage || 'Invalid phone number'
      );
      if (field.min !== undefined) {
        schema = schema as z.ZodString;
        schema = schema.min(field.min, `Must be at least ${field.min} characters`);
      }
      if (field.max !== undefined) {
        schema = schema as z.ZodString;
        schema = schema.max(field.max, `Must be at most ${field.max} characters`);
      }
      break;
    case 'select':
      if (field.options && field.options.length > 0) {
        schema = z.enum([...field.options as [string, ...string[]]]);
      } else {
        schema = z.string();
      }
      break;
    default:
      schema = z.string();
  }

  // Make optional if not required
  if (!field.required) {
    schema = schema.optional();
  }

  return schema;
}

/**
 * Generate a Zod schema from a configuration object
 * @param config Schema configuration object
 * @returns Zod schema for form validation
 */
export function createFormSchema<T extends Record<string, any>>(config: Record<keyof T, {
  type: 'string' | 'number' | 'date' | 'email' | 'phone' | 'select';
  required?: boolean;
  min?: number;
  max?: number;
  options?: string[];
  pattern?: RegExp;
  errorMessage?: string;
}>): z.ZodObject<any> {
  const shape: Record<string, z.ZodType<any>> = {};

  for (const [key, field] of Object.entries(config)) {
    shape[key] = createFieldSchema(field);
  }

  return z.object(shape);
}

/**
 * Creates field validation errors from Zod validation errors
 */
export function parseZodErrors(error: z.ZodError) {
  const fieldErrors: Record<string, string> = {};
  
  for (const issue of error.errors) {
    if (issue.path.length > 0) {
      const path = issue.path.join('.');
      fieldErrors[path] = issue.message;
    }
  }
  
  return fieldErrors;
}

/**
 * Generate proper error message for string validation errors
 */
export function stringValidationMessages(
  fieldName: string, 
  schema: z.ZodType<any>,
  options?: { 
    required?: boolean,
    minLength?: number,
    maxLength?: number
  }
) {
  const meta = (schema as any)._def?.typeName === 'ZodString' ? (schema as any)._def : null;
  
  if (options?.required || (meta && meta.checks && meta.checks.some((c: any) => c.kind === 'min'))) {
    return `${fieldName} is required`;
  }
  
  if (meta && meta.checks) {
    const minCheck = meta.checks.find((c: any) => c.kind === 'min');
    if (minCheck) {
      return `${fieldName} must be at least ${minCheck.value} characters`;
    }
    
    const maxCheck = meta.checks.find((c: any) => c.kind === 'max');
    if (maxCheck) {
      return `${fieldName} cannot exceed ${maxCheck.value} characters`;
    }
  }
  
  return `${fieldName} is invalid`;
}

/**
 * Generate proper error message for number validation errors
 */
export function numberValidationMessages(
  fieldName: string, 
  schema: z.ZodType<any>,
  options?: {
    required?: boolean,
    min?: number,
    max?: number
  }
) {
  const meta = (schema as any)._def?.typeName === 'ZodNumber' ? (schema as any)._def : null;
  
  if (options?.required) {
    return `${fieldName} is required`;
  }
  
  if (meta && meta.checks) {
    const minCheck = meta.checks.find((c: any) => c.kind === 'min');
    if (minCheck) {
      return `${fieldName} must be at least ${minCheck.value}`;
    }
    
    const maxCheck = meta.checks.find((c: any) => c.kind === 'max');
    if (maxCheck) {
      return `${fieldName} cannot exceed ${maxCheck.value}`;
    }
  }
  
  return `${fieldName} is invalid`;
}

/**
 * Common validation patterns
 */
export const ValidationPatterns = {
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  PHONE: /^[0-9\s\+\-\(\)]{8,15}$/,
  POSTAL_CODE: /^\d{4,5}$/,
  TAX_ID: /^\d{9}$/,
  BSB: /^\d{3}-\d{3}$/,
  BANK_ACCOUNT: /^\d{6,10}$/,
};

/**
 * Common error messages
 */
export const ErrorMessages = {
  REQUIRED: 'This field is required',
  EMAIL: 'Please enter a valid email address',
  PHONE: 'Please enter a valid phone number',
  POSTAL_CODE: 'Please enter a valid postal code',
  TAX_ID: 'Please enter a valid tax ID',
  BSB: 'Please enter a valid BSB (format: XXX-XXX)',
  BANK_ACCOUNT: 'Please enter a valid bank account number',
};
