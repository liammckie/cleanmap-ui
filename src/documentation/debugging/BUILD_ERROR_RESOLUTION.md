
# Build Error Resolution Guide

This document provides strategies for resolving common build errors in the application.

## TypeScript Errors

### Type Incompatibility

**Example Error:**
```
Type 'X' is not assignable to type 'Y'
```

**Resolution Steps:**
1. **Identify the exact type mismatch**:
   - Look at the full type error message to understand what properties are incompatible
   - Use TypeScript's hover information in your IDE to inspect expected types

2. **Check for optional vs. required properties**:
   - Missing required properties often cause errors
   - Add missing required properties or make them optional in the interface

3. **Handle date conversions properly**:
   - Convert string dates to Date objects when needed
   - Use proper date formatting utilities for DB operations

4. **Use type assertions when necessary**:
   - Use `as` syntax when you know more about the type than TypeScript does
   - Example: `(data as WorkOrder).id`

### Property Does Not Exist on Type

**Example Error:**
```
Property 'X' does not exist on type 'Y'
```

**Resolution Steps:**
1. Check the interface definition to see if the property is actually missing
2. Add the property to the interface if it should exist
3. Use optional chaining (`?.`) to safely access potentially undefined properties
4. Use type guards to narrow types before accessing properties:
   ```typescript
   if ('id' in initialData) {
     const id = initialData.id;
   }
   ```

## Supabase Query Errors

### Insert/Update Type Errors

**Example Error:**
```
No overload matches this call.
```

**Resolution Steps:**
1. Check the schema of the table you're inserting into
2. Ensure all required fields are present in your data object
3. Make sure array vs. single object usage matches the method expectation:
   - `.insert(data)` vs `.insert([data])`
4. Prepare data objects to match exactly what the API expects:
   ```typescript
   const preparedData = {
     ...workOrder,
     scheduled_start: formatDateForDb(workOrder.scheduled_start),
     due_date: formatDateForDb(workOrder.due_date)
   };
   ```

## React Component Errors

### Props Type Errors

**Example Error:**
```
Type '{ prop: X }' is not assignable to type '{ prop: Y }'
```

**Resolution Steps:**
1. Check the component's props interface
2. Ensure you're passing the correct prop types
3. Convert prop values to the expected type before passing:
   ```typescript
   <Component 
     value={typeof value === 'string' ? new Date(value) : value} 
   />
   ```

### Hook Dependencies

**Example Error:**
```
React Hook useEffect has a missing dependency: 'X'
```

**Resolution Steps:**
1. Add the missing dependency to the dependency array
2. Consider memoizing objects/functions with useCallback/useMemo
3. Extract state-setting logic to a separate useEffect if needed

## Debugging Tools

### Console Logging

Add structured console logs to track data flow:

```typescript
console.log('WorkOrder before submission:', {
  workOrder,
  schedStartType: typeof workOrder.scheduled_start,
  dueDateType: typeof workOrder.due_date
});
```

### Type Checking Functions

Create utility functions to verify types at runtime:

```typescript
function logTypeInfo(value: any, name: string): void {
  console.log(`${name} type info:`, {
    typeof: typeof value,
    isArray: Array.isArray(value),
    isDate: value instanceof Date,
    value: value
  });
}
```

### React DevTools

Use React DevTools to inspect component props and state at runtime.

## Prevention Strategies

1. **Type Guards**: Create custom type guards for complex types
2. **Zod Validation**: Use Zod schemas to validate data at runtime
3. **Interface Documentation**: Add JSDoc comments to interfaces explaining field requirements
4. **Consistent Naming**: Use consistent naming patterns for similar concepts

By following these guidelines, you can systematically resolve build errors and prevent them in future development.
