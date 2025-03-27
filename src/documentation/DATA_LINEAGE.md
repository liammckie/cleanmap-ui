
# Data Lineage Documentation

This file tracks the origin and source of data in the database schema.

## Clients Table

### Origin: Internal Operations Module
### Source Type: Internal User Input

| Field                    | Origin                      | Source Type     | Notes                                     |
|--------------------------|-----------------------------|-----------------|--------------------------------------------|
| id                       | System Generated            | UUID            | Primary key, auto-generated               |
| company_name             | Manual Input                | Internal User   | Required field                            |
| contact_name             | Manual Input                | Internal User   | Required field                            |
| contact_email            | Manual Input                | Internal User   | Optional field                            |
| contact_phone            | Manual Input                | Internal User   | Optional field                            |
| billing_address_street   | Manual Input                | Internal User   | Required field                            |
| billing_address_city     | Manual Input                | Internal User   | Required field                            |
| billing_address_state    | Manual Input                | Internal User   | Required field                            |
| billing_address_postcode | Manual Input                | Internal User   | Required field                            |
| status                   | Manual Input                | Internal User   | Required field, enum: Active, On Hold     |
| industry                 | Manual Input                | Internal User   | Optional field                            |
| region                   | Manual Input                | Internal User   | Optional field                            |
| notes                    | Manual Input                | Internal User   | Optional field                            |
| payment_terms            | Manual Input                | Internal User   | Required field                            |
| business_number          | Manual Input                | Internal User   | Optional field                            |
| on_hold_reason           | Manual Input                | Internal User   | Optional field, required if status="On Hold" |
| created_at               | System Generated            | Timestamp       | Auto-generated                            |
| updated_at               | System Generated            | Timestamp       | Auto-updated via trigger                  |

## Type Locked Fields

The following fields have locked types to prevent accidental schema changes:

| Table    | Field       | Type      | Justification                                |
|----------|-------------|-----------|----------------------------------------------|
| clients  | id          | uuid      | Primary key used in relationships            |
| clients  | status      | enum      | Used in business logic for client handling   |
| clients  | created_at  | timestamp | Used for audit trails and sorting            |
| clients  | updated_at  | timestamp | Used for change tracking                     |

