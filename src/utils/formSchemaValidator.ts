
/**
 * Form Schema Validator Utility
 * 
 * Provides functionality to validate form schemas against database schemas
 * to catch type inconsistencies early in the development process.
 */

import { z } from 'zod';

/**
 * Interface for a schema validation result
 */
export interface SchemaValidationResult {
  valid: boolean;
  mismatches: Array<{
    field: string;
    formType: string;
    dbType: string;
    critical: boolean;
    suggestion: string;
  }>;
}

/**
 * Compares a form schema with a database schema to catch type mismatches
 * @param formSchema Zod schema for form validation
 * @param dbSchema Zod schema for database operations
 * @returns Validation result with any mismatches
 */
export function validateSchemaConsistency(
  formSchema: z.ZodObject<any>,
  dbSchema: z.ZodObject<any>
): SchemaValidationResult {
  const mismatches: Array<{
    field: string;
    formType: string;
    dbType: string;
    critical: boolean;
    suggestion: string;
  }> = [];
  
  // Get the shape of both schemas
  const formShape = formSchema._def.shape();
  const dbShape = dbSchema._def.shape();
  
  // Check form fields against db fields
  for (const [fieldName, formField] of Object.entries(formShape)) {
    const dbField = dbShape[fieldName];
    
    // Skip if field doesn't exist in db schema
    if (!dbField) {
      continue;
    }
    
    // Check for type mismatches
    if (getZodTypeName(formField as z.ZodTypeAny) !== getZodTypeName(dbField as z.ZodTypeAny)) {
      const formType = getZodTypeName(formField as z.ZodTypeAny);
      const dbType = getZodTypeName(dbField as z.ZodTypeAny);
      
      // Special check for date vs string
      const isDateStringMismatch = 
        (formType === 'date' && dbType === 'string') || 
        (formType === 'string' && dbType === 'date');
      
      mismatches.push({
        field: fieldName,
        formType,
        dbType,
        critical: !isDateStringMismatch, // Date/string mismatches are common and can be handled
        suggestion: isDateStringMismatch
          ? `Use a date transformation function like formatDateForDb() when submitting to database`
          : `Align the types: change ${formType} to ${dbType} or vice versa`
      });
    }
    
    // Check for required vs optional mismatches
    const formRequired = !isZodOptional(formField as z.ZodTypeAny);
    const dbRequired = !isZodOptional(dbField as z.ZodTypeAny);
    
    if (formRequired !== dbRequired) {
      mismatches.push({
        field: fieldName,
        formType: formRequired ? 'required' : 'optional',
        dbType: dbRequired ? 'required' : 'optional',
        critical: !formRequired && dbRequired, // Critical if field is optional in form but required in DB
        suggestion: dbRequired
          ? `Make ${fieldName} required in form schema or add validation before database submission`
          : `Make ${fieldName} optional in form schema to match database`
      });
    }
  }
  
  // Check for required db fields missing from form
  for (const [fieldName, dbField] of Object.entries(dbShape)) {
    if (!formShape[fieldName] && !isZodOptional(dbField as z.ZodTypeAny)) {
      mismatches.push({
        field: fieldName,
        formType: 'missing',
        dbType: 'required',
        critical: true,
        suggestion: `Add the required field ${fieldName} to form schema or handle it before database submission`
      });
    }
  }
  
  return {
    valid: mismatches.length === 0,
    mismatches
  };
}

/**
 * Gets a human-readable type name from a Zod schema
 * @param schema Zod schema to get type from
 * @returns Type name as string
 */
function getZodTypeName(schema: z.ZodTypeAny): string {
  if (schema instanceof z.ZodString) return 'string';
  if (schema instanceof z.ZodNumber) return 'number';
  if (schema instanceof z.ZodBoolean) return 'boolean';
  if (schema instanceof z.ZodDate) return 'date';
  if (schema instanceof z.ZodArray) return 'array';
  if (schema instanceof z.ZodObject) return 'object';
  if (schema instanceof z.ZodEnum) return 'enum';
  if (schema instanceof z.ZodNullable) {
    const innerType = getZodTypeName(schema._def.innerType);
    return `${innerType}|null`;
  }
  if (schema instanceof z.ZodOptional) {
    return getZodTypeName(schema._def.innerType);
  }
  return 'unknown';
}

/**
 * Checks if a Zod schema is optional
 * @param schema Zod schema to check
 * @returns Whether the schema is optional
 */
function isZodOptional(schema: z.ZodTypeAny): boolean {
  if (schema instanceof z.ZodOptional) return true;
  if (schema instanceof z.ZodNullable && schema._def.innerType instanceof z.ZodOptional) return true;
  return false;
}

/**
 * Validates a form schema against database requirements and logs the results
 * @param formSchema Form validation schema
 * @param dbSchema Database schema
 * @param schemaName Name of the schema being validated (for logging)
 */
export function validateAndLogSchema(
  formSchema: z.ZodObject<any>,
  dbSchema: z.ZodObject<any>,
  schemaName: string
): void {
  console.group(`Validating schema: ${schemaName}`);
  
  const validationResult = validateSchemaConsistency(formSchema, dbSchema);
  
  if (validationResult.valid) {
    console.log('✅ Schema validation passed - form and DB schemas are compatible');
  } else {
    console.warn(`❌ Schema validation failed - found ${validationResult.mismatches.length} mismatches:`);
    
    // Log critical mismatches first
    const criticalMismatches = validationResult.mismatches.filter(m => m.critical);
    if (criticalMismatches.length > 0) {
      console.error('CRITICAL MISMATCHES:');
      criticalMismatches.forEach(mismatch => {
        console.error(`Field: ${mismatch.field}, Form: ${mismatch.formType}, DB: ${mismatch.dbType}`);
        console.error(`  Suggestion: ${mismatch.suggestion}`);
      });
    }
    
    // Log non-critical mismatches
    const nonCriticalMismatches = validationResult.mismatches.filter(m => !m.critical);
    if (nonCriticalMismatches.length > 0) {
      console.warn('NON-CRITICAL MISMATCHES:');
      nonCriticalMismatches.forEach(mismatch => {
        console.warn(`Field: ${mismatch.field}, Form: ${mismatch.formType}, DB: ${mismatch.dbType}`);
        console.warn(`  Suggestion: ${mismatch.suggestion}`);
      });
    }
    
    // Generate example code for fixing issues
    if (criticalMismatches.length > 0) {
      console.info('SUGGESTED FIXES:');
      
      for (const mismatch of criticalMismatches) {
        if (mismatch.field === 'description' && mismatch.dbType === 'required' && mismatch.formType === 'optional') {
          console.info(`
// Add validation before database submission:
if (!workOrder.description) {
  throw new Error('Work order description is required');
}
          `);
        } else if (mismatch.dbType === 'string' && mismatch.formType === 'date') {
          console.info(`
// Convert date to string before database submission:
const preparedData = {
  ...formData,
  ${mismatch.field}: formatDateForDb(formData.${mismatch.field})
};
          `);
        }
      }
    }
  }
  
  console.groupEnd();
}
