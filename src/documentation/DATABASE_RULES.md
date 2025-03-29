# Database Rules and Best Practices

This document outlines the rules and best practices for database schema and query management in the CleanMap application.

## 🔐 Safe Query Patterns

**Rule**: `env.safe-query.limiter`

All database queries must include safety constraints to prevent large result sets:

- Every `.select()` query must include either:
  - `.limit()` with a reasonable number (typically 100 for list views)
  - `.eq()` or other specific filter to narrow results
  - `.single()` for retrieving only one record

**Implementation**:

- All service methods should implement this pattern
- Code reviews must check for this pattern
- Consider adding automated linting rules to enforce this

Example:

```typescript
// GOOD:
const { data } = await supabase.from('clients').select('*').limit(100)

// GOOD:
const { data } = await supabase.from('clients').select('*').eq('id', clientId).single()

// BAD - no limit or filter:
const { data } = await supabase.from('clients').select('*')
```

## 📜 Schema Change Changelog

**Rule**: `schema.breaking-change.audit`

Every database schema change must be documented in the `SCHEMA_CHANGELOG.md` file:

- Document additions, modifications, and removals
- Include date of change
- Group changes logically by related functionality
- Describe the purpose of the change
- Note any migration requirements

**Implementation**:

- Update the changelog before or immediately after schema changes
- Include the changelog update in the same pull request as the schema change
- Use the established format (date, change type, description)

## 📦 Field Origin Metadata

**Rule**: `db.field.origin.meta`

All data access methods should include metadata about field origins:

- Use JSDoc annotations to document field sources
- Mark each field as:
  - `manual` - entered by users
  - `derived` - calculated from other fields
  - `imported` - from external systems or APIs

**Implementation**:

- Add `@origin` JSDoc annotations to all service methods
- Include source, module, and authorship information
- Document data transformations or derivations

Example:

```typescript
/**
 * @function getClientMetadata
 * @description Fetches metadata for a client from the database
 * @origin {source: "internal", module: "clientService", author: "system"}
 */
```

## 🧱 Lock Field Type Drift

**Rule**: `db.field.type-lock`

Critical fields must maintain their data types to prevent inconsistencies:

- Use annotations to mark fields that should never change type
- Ensure validation consistency across frontend and backend
- Run checks before schema migrations to prevent accidental type changes

**Implementation**:

- Add `@field-locked` JSDoc annotations to critical fields
- Include the field name and expected type
- Add clear validation steps before any schema change

Example:

```typescript
/**
 * @function getClient
 * @description Fetches a client by ID
 * @field-locked id:uuid, created_at:timestamp
 */
```

## Integration Recommendations

These rules should be integrated into development workflows:

1. **Pre-commit hooks** - Check for required annotations and changelog updates
2. **Code review checklists** - Include checks for these rules
3. **Schema migration approval process** - Require documentation and validation
4. **Automated testing** - Test for compliance with safe query patterns
5. **Developer training** - Ensure all team members understand these principles
