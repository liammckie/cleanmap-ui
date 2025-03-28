
# Schema Change Log

This file tracks significant schema changes that may impact application functionality.

## 2023-10-15

### Added
- Created initial clients table structure
- Added basic client fields (company_name, contact_name, address fields, etc.)

## 2023-10-30 

### Modified
- Added industry field to clients table
- Added status field to clients table with enum values 'Active' and 'On Hold'

## 2023-11-15

### Modified
- Added on_hold_reason field to clients table

## 2023-12-01

### Fixed
- Modified billing_address_postcode field type to ensure consistency with validation
- Added payment_terms field as required for billing processes

## 2024-06-04

### Added
- Added sales module tables
- Created leads table for tracking sales pipeline
- Created quotes table for service quotations
- Created quote_line_items table for detailed quote pricing
- Created quote_sites junction table for associating quotes with multiple sites
- Added four new enums: lead_stage, lead_source, lead_status, and quote_status
- Added helper functions for retrieving enum values

## 2024-06-05

### Added
- Implemented field origin metadata annotations in services
- Added @origin and @field-locked annotations to services
- Created utility functions to enforce safe query patterns
- Improved error handling to prevent field type drift

## 2024-06-06

### Fixed
- Updated TypeScript interfaces for Quote schema to match database structure
- Fixed type inconsistencies between frontend models and database tables
- Improved Date handling in service functions to properly convert between Date objects and ISO strings
- Fixed CRUD operations to respect required fields in the database

## 2024-06-07

### Fixed
- Ensured type safety in Lead and Quote services by validating required fields
- Fixed issue with Date handling by consistently using prepareObjectForDb utility
- Enforced required fields validation for better error handling and database integrity
- Removed site_ids field from Quote interface to match database structure

## 2024-06-08

### Fixed
- Fixed type errors in leadService.ts and quoteService.ts
- Improved type safety when using prepareObjectForDb utility
- Added proper type assertions to ensure insert operations have all required fields
- Enhanced error handling during database operations

## 2024-06-09

### Refactored
- Restructured lead services into smaller, more focused files
- Split leadService.ts into leadCrudService.ts, leadQueryService.ts, and leadEnumService.ts
- Improved modularity and maintainability without changing functionality
- Enhanced type safety with more specific return types

## 2024-06-10

### Refactored
- Restructured quote services into smaller, more focused files
- Split quoteService.ts into quoteCrudService.ts, quoteQueryService.ts, quoteLineItemService.ts, and quoteEnumService.ts
- Improved code organization and maintainability without changing functionality
- Matched the pattern used for lead services to ensure consistency
