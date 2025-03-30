
# CleanMap Application Architecture

## Overview

CleanMap is a comprehensive ERP system for cleaning businesses, built with a modern React frontend and Supabase backend. The application follows domain-driven design principles with a modular architecture organized by business domains.

## System Architecture

```
CleanMap
├── Frontend (React/TypeScript)
│   ├── Components (UI)
│   ├── Services (API/Data)
│   ├── Hooks (Shared Logic)
│   ├── Types (Type Definitions)
│   └── Utilities (Helper Functions)
└── Backend (Supabase)
    ├── Database (PostgreSQL)
    ├── Storage (Files)
    ├── Functions (Edge Functions)
    └── Authentication (Auth)
```

## Domain Structure

The application is organized into the following domains:

- **Operations**: Core business operations (clients, sites, work orders, contracts)
- **HR**: Employee management and scheduling
- **Sales**: Lead management, quoting, and sales pipeline
- **Finance**: Billing, invoicing, and financial reporting
- **Admin**: Application settings and configuration

## Frontend Architecture

### Component Structure

Components are organized by domain and feature:

```
src/
├── components/
│   ├── common/          # Shared components
│   ├── layout/          # Layout components
│   ├── operations/      # Operations domain components
│   │   ├── client/      # Client-related components
│   │   ├── site/        # Site-related components
│   │   ├── workOrder/   # Work order components
│   │   └── contract/    # Contract components
│   ├── hr/              # HR domain components
│   ├── sales/           # Sales domain components
│   └── ui/              # UI library components
├── pages/               # Page components
```

### Service Layer

Services are organized by domain and resource:

```
src/
├── services/
│   ├── clients/         # Client services
│   │   ├── clientCrudService.ts
│   │   └── clientQueryService.ts
│   ├── sites/           # Site services
│   ├── workOrders/      # Work order services
│   ├── contracts/       # Contract services
│   ├── employees/       # Employee services
│   └── sales/           # Sales services
```

### Type System

Types are organized by domain or shared:

```
src/
├── types/
│   ├── api.ts           # API response types
│   ├── db.ts            # Database entity types
│   ├── operations.ts    # Operations domain types
│   ├── hr.ts            # HR domain types
│   └── sales.ts         # Sales domain types
```

### Schema Validation

Form and data validation schemas are organized by domain:

```
src/
├── schema/
│   ├── operations/      # Operations domain schemas
│   │   ├── client.schema.ts
│   │   ├── site.schema.ts
│   │   ├── workOrder.schema.ts
│   │   └── contract.schema.ts
│   ├── hr.schema.ts     # HR domain schemas
│   └── sales.schema.ts  # Sales domain schemas
```

## Data Flow

1. **User Interaction**: Components trigger actions
2. **Form Validation**: Zod schemas validate user input
3. **Service Layer**: Services process data and interact with API
4. **Database Operations**: Supabase handles database operations
5. **Response Handling**: Services transform API responses
6. **State Updates**: Components receive updated data
7. **Rendering**: UI reflects the updated state

## Error Handling

The application implements a comprehensive error handling system:

1. **Client-side Validation**: Form schemas prevent invalid data
2. **Service Layer Validation**: Services validate data before API calls
3. **API Error Handling**: Centralized error handling for API responses
4. **Error Documentation**: Automated documentation of errors
5. **Error Recovery**: Graceful recovery from errors when possible

## Documentation System

The documentation system is integrated with the development workflow:

1. **Automated Error Tracking**: Runtime and build errors are automatically documented
2. **Documentation Dashboard**: Central place to view all documentation
3. **Type Safety Validation**: Validation between form schemas and database schemas
4. **Schema Change Tracking**: Changes to database schema are documented

## Technology Stack

- **Frontend**: React, TypeScript, Tailwind CSS, shadcn/ui
- **Form Handling**: Zod, React Hook Form
- **Data Fetching**: Tanstack Query (React Query)
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Deployment**: Vercel

