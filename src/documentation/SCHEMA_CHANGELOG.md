
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
