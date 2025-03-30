
# Error Log

This document tracks errors, bugs, and build issues encountered in the application, along with their resolution status and steps taken.

## Active Issues

### TypeScript Errors in Form Schema Validator

**Status:** In Progress  
**First Identified:** 2024-06-19  
**Last Updated:** 2024-06-19  
**Severity:** High  

**Description:**
Type errors in formSchemaValidator.ts preventing successful build.

**Error Messages:**
- `Argument of type 'unknown' is not assignable to parameter of type 'ZodTypeAny'`
- `Type '{}' is missing the following properties from type 'ZodType<any, any, any>': _type, _output, _input, _def, and 32 more.`

**Root Cause Analysis:**
The formSchemaValidator.ts utility is not properly type-casting variables to ZodTypeAny before using them with Zod-specific functions.

**Resolution Steps:**
1. ✅ Add proper type assertions for Zod types
2. ⬜ Review other Zod utilities for similar issues
3. ⬜ Consider refactoring formSchemaValidator.ts into smaller functions

**Related Files:**
- src/utils/formSchemaValidator.ts

---

## Resolved Issues

### Sentry Token Configuration

**Status:** Resolved  
**First Identified:** 2024-06-24  
**Last Updated:** 2024-06-27  
**Resolved On:** 2024-06-27  
**Severity:** Medium  

**Description:**
Issues with Sentry token persistence, authentication, and availability during the build process.

**Error Messages:**
- `401 Unauthorized` when contacting Sentry API
- Missing or invalid Sentry token during build process
- Source maps not being uploaded to Sentry

**Root Cause Analysis:**
1. Incorrect organization and project name configuration in vite.config.ts
2. Authentication token not being properly retrieved or passed to Sentry API
3. Edge function not properly exposing the token from Supabase secrets
4. TypeScript errors in the Sentry configuration preventing proper initialization

**Resolution Steps:**
1. ✅ Updated DSN to use the correct project key
2. ✅ Corrected organization slug and project name in all configurations
3. ✅ Enhanced the edge function with improved error handling and logging
4. ✅ Added better verification and caching for Sentry token
5. ✅ Improved TypeScript typing in vite.config.ts to prevent plugin errors
6. ✅ Updated error boundary component to capture and display Sentry event IDs
7. ✅ Added session replay capabilities to improve error context

**Related Files:**
- src/utils/sentryInit.ts
- supabase/functions/get-sentry-token/index.ts
- vite.config.ts
- src/components/ui/error-boundary.tsx
- src/App.tsx

**Prevention Measures:**
- Added token verification components in development mode
- Implemented better error logging throughout the token retrieval process
- Added documentation on Sentry configuration in the ERROR_LOG.md file

---

### Work Order Form Type Inconsistencies

**Status:** Resolved  
**First Identified:** 2024-06-14  
**Last Updated:** 2024-06-19  
**Resolved On:** 2024-06-19  
**Severity:** High  

**Description:**
Type errors in WorkOrderForm and workOrderService preventing successful build.

**Error Messages:**
- `Property 'isSubmitting' does not exist on type 'IntrinsicAttributes & FormActionsProps'`
- `Property 'description' is optional in type but required in Supabase insert call`
- `Property 'site_id' is optional in type but required in type...`

**Root Cause Analysis:**
- The FormActions component didn't include isSubmitting in its props interface
- The workOrderService.ts insert function requires description and site_id fields but they were being treated as optional in the form schema
- Inconsistency between form schema (optional fields) and database requirements (required fields)

**Resolution Steps:**
1. ✅ Update FormActions component to include isSubmitting prop
2. ✅ Ensure description is properly handled as required in workOrderService.ts
3. ✅ Add validation for site_id before database operation
4. ✅ Explicitly include required fields in prepared data
5. ✅ Add error logging and documentation

**Related Files:**
- src/components/operations/workOrder/form-sections/FormActions.tsx
- src/services/workOrders/workOrderService.ts

**Prevention Measures:**
- Added runtime validation for required fields before database submission
- Enhanced error capture to document similar issues automatically
- Updated Build Error Resolution guide with specific fixes for this pattern

---

## Error Log Maintenance Guidelines

### Adding New Issues

When adding a new issue to the log:

1. Create a descriptive title for the issue
2. Set the status to "Investigating" or "In Progress"
3. Record the date identified
4. Document error messages exactly as they appear
5. List files likely to be involved
6. Create initial resolution steps if known

### Updating Issues

When working on an issue:

1. Update the "Last Updated" date
2. Mark completed steps with ✅
3. Add new information discovered during investigation
4. Refine the root cause analysis as more is learned
5. Add new resolution steps as needed

### Resolving Issues

When an issue is resolved:

1. Change status to "Resolved"
2. Add the resolution date
3. Document the final root cause
4. Document the complete resolution
5. List all affected files
6. Move the issue to the "Resolved Issues" section
7. Add any prevention measures implemented

This log should be updated regularly as part of the development process to maintain an accurate record of issues and their resolutions.
