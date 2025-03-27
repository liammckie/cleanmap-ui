
# Naming Conventions and Style Guidelines

This document outlines the naming conventions and style guidelines for the Cleaning ERP application.

## File and Directory Naming

- **React Components**: PascalCase (e.g., `EmployeeForm.tsx`)
- **Utility Files**: camelCase (e.g., `formatDate.ts`)
- **Documentation Files**: kebab-case (e.g., `employee-module.md`)
- **Page Components**: PascalCase (e.g., `EmployeesPage.tsx`)

## Code Conventions

### Components
- Use functional components with hooks
- Separate presentational and container components when possible
- Keep components focused and small (under 200 lines if possible)

### TypeScript
- Define interfaces for all props and state
- Use proper typing for all variables and function parameters/returns
- Avoid `any` type unless absolutely necessary

### CSS/Styling
- Use Tailwind CSS classes for styling
- For complex components, consider using composition with smaller components
- Follow mobile-first responsive design principles

## Database Conventions

### Tables
- Use snake_case for table names (e.g., `employee_timesheets`)
- Every table should have an `id` primary key
- Include `created_at` and `updated_at` timestamp fields on all tables

### Fields
- Use snake_case for field names (e.g., `first_name`)
- Use appropriate data types (e.g., `VARCHAR` for text, `TIMESTAMP` for dates)
- Add proper constraints (NOT NULL, UNIQUE, etc.) where appropriate

## API Conventions

### Endpoints
- Use RESTful conventions for API endpoints
- Endpoints should be plural nouns (e.g., `/api/employees`)
- Use HTTP methods appropriately (GET, POST, PUT, DELETE)

### Response Format
- Always return consistent JSON structures
- Include status, message, and data properties in all responses
- Handle errors with appropriate HTTP status codes and error messages
