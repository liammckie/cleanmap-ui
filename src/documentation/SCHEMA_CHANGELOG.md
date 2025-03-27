
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

