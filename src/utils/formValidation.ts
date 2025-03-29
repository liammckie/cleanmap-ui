import { z } from 'zod'

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
}

/**
 * Parse validation error message from the schema
 */
export function parseValidationError(error: z.ZodIssue) {
  if (error.code === 'too_small' && 'minimum' in error) {
    if (error.type === 'string') {
      return ValidationErrors.MIN_LENGTH(Number(error.minimum))
    } else {
      return ValidationErrors.MIN_VALUE(Number(error.minimum))
    }
  }

  if (error.code === 'too_big' && 'maximum' in error) {
    if (error.type === 'string') {
      return ValidationErrors.MAX_LENGTH(Number(error.maximum))
    } else {
      return ValidationErrors.MAX_VALUE(Number(error.maximum))
    }
  }

  return error.message
}

/**
 * String validation schema builder
 */
export function createStringSchema(options: {
  min?: number
  max?: number
  required?: boolean
  email?: boolean
  url?: boolean
  regex?: RegExp
  customError?: string
}): z.ZodString | z.ZodOptional<z.ZodString> {
  let schema: z.ZodString = z.string()

  if (options.min !== undefined) {
    schema = schema.min(options.min, ValidationErrors.MIN_LENGTH(options.min))
  }

  if (options.max !== undefined) {
    schema = schema.max(options.max, ValidationErrors.MAX_LENGTH(options.max))
  }

  if (options.email) {
    schema = schema.email(ValidationErrors.INVALID_EMAIL)
  }

  if (options.url) {
    schema = schema.url(ValidationErrors.INVALID_URL)
  }

  if (options.regex) {
    schema = schema.regex(options.regex, options.customError || 'Invalid format')
  }

  if (options.required === false) {
    return schema.optional()
  } else {
    return schema.min(1, ValidationErrors.REQUIRED)
  }
}

/**
 * Number validation schema builder
 */
export function createNumberSchema(options: {
  min?: number
  max?: number
  required?: boolean
  integer?: boolean
  positive?: boolean
}): z.ZodNumber | z.ZodOptional<z.ZodNumber> {
  let schema: z.ZodNumber = options.integer ? z.number().int() : z.number()

  if (options.min !== undefined) {
    schema = schema.min(options.min, ValidationErrors.MIN_VALUE(options.min))
  }

  if (options.max !== undefined) {
    schema = schema.max(options.max, ValidationErrors.MAX_VALUE(options.max))
  }

  if (options.positive) {
    schema = schema.positive(ValidationErrors.MIN_VALUE(0))
  }

  if (options.required === false) {
    return schema.optional()
  }

  return schema
}

/**
 * Date validation schema builder
 */
export function createDateSchema(options: {
  min?: Date
  max?: Date
  required?: boolean
  future?: boolean
  past?: boolean
}): z.ZodDate | z.ZodOptional<z.ZodDate> {
  let schema: z.ZodDate = z.date()

  if (options.min) {
    schema = schema.min(options.min, `Date must be after ${options.min.toLocaleDateString()}`)
  }

  if (options.max) {
    schema = schema.max(options.max, `Date must be before ${options.max.toLocaleDateString()}`)
  }

  if (options.future) {
    schema = schema.min(new Date(), ValidationErrors.FUTURE_DATE)
  }

  if (options.past) {
    schema = schema.max(new Date(), ValidationErrors.PAST_DATE)
  }

  if (options.required === false) {
    return schema.optional()
  }

  return schema
}

// Add these pattern constants and error messages for the client validation
export const ValidationPatterns = {
  POSTAL_CODE: /^\d{4,5}(-\d{4})?$/,
  PHONE: /^(\+\d{1,3}[ -]?)?\(?\d{3}\)?[ -]?\d{3}[ -]?\d{4}$/,
  EMAIL: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
}

export const ErrorMessages = {
  PHONE: 'Please enter a valid phone number',
  EMAIL: 'Please enter a valid email address',
}

// Generic form schema builder
export function createFormSchema<T extends Record<string, any>>(
  config: Record<string, any>,
): z.ZodObject<any> {
  const schemaObj: Record<string, any> = {}

  for (const [field, fieldConfig] of Object.entries(config)) {
    switch (fieldConfig.type) {
      case 'string':
        schemaObj[field] = createStringSchema({
          min: fieldConfig.min,
          max: fieldConfig.max,
          required: fieldConfig.required,
          regex: fieldConfig.pattern,
          customError: fieldConfig.errorMessage,
        })
        break
      case 'email':
        schemaObj[field] = createStringSchema({
          required: fieldConfig.required,
          email: true,
          customError: fieldConfig.errorMessage,
        })
        break
      case 'phone':
        schemaObj[field] = createStringSchema({
          required: fieldConfig.required,
          regex: fieldConfig.pattern || ValidationPatterns.PHONE,
          customError: fieldConfig.errorMessage,
        })
        break
      case 'select':
        if (fieldConfig.options) {
          schemaObj[field] = z.enum(fieldConfig.options as [string, ...string[]])
          if (!fieldConfig.required) {
            schemaObj[field] = schemaObj[field].optional()
          }
        }
        break
      default:
        schemaObj[field] = z.string()
        if (!fieldConfig.required) {
          schemaObj[field] = schemaObj[field].optional()
        }
    }
  }

  return z.object(schemaObj)
}
