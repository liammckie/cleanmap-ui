# Employees Module

This document describes the Employees module, which is part of the Human Resources section of the Cleaning ERP application.

## Purpose

The Employees module manages internal staff information throughout their lifecycle (from onboarding to active employment to termination).

## Data Model

### Primary Fields

| Field               | Type      | Description                                 | Required |
| ------------------- | --------- | ------------------------------------------- | -------- |
| id                  | UUID      | Unique identifier for the employee          | Yes      |
| first_name          | String    | Employee's first name                       | Yes      |
| last_name           | String    | Employee's last name                        | Yes      |
| date_of_birth       | Date      | Birth date for age verification             | Yes      |
| contact_phone       | String    | Phone number                                | Yes      |
| contact_email       | String    | Email address                               | Yes      |
| address_street      | String    | Street address                              | Yes      |
| address_city        | String    | City                                        | Yes      |
| address_state       | String    | State                                       | Yes      |
| address_postcode    | String    | Postal code                                 | Yes      |
| employee_id         | String    | Unique employee code for internal reference | Yes      |
| job_title           | String    | Position or role in the company             | Yes      |
| department          | String    | Department or team                          | Yes      |
| start_date          | Date      | Date of hire                                | Yes      |
| employment_type     | Enum      | Full-time, Part-time, Contractor            | Yes      |
| status              | Enum      | Onboarding, Active, Terminated              | Yes      |
| wage_classification | String    | Award level or labor category               | Yes      |
| pay_rate            | Decimal   | Hourly wage or annual salary                | Yes      |
| pay_cycle           | Enum      | Weekly, Fortnightly, Monthly                | Yes      |
| tax_id              | String    | Tax file number                             | Yes      |
| bank_bsb            | String    | Bank BSB                                    | Yes      |
| bank_account_number | String    | Bank account number                         | Yes      |
| super_fund_name     | String    | Superannuation fund name                    | Yes      |
| super_member_number | String    | Superannuation member number                | Yes      |
| user_account_id     | UUID      | Reference to authentication user record     | No       |
| created_at          | Timestamp | When the record was created                 | Yes      |
| updated_at          | Timestamp | When the record was last updated            | Yes      |

### Relationships

- **User Account**: One-to-one relationship with the authentication user table
- **Compliance Documents**: One-to-many relationship with the Documents table
- **Site Assignments**: Many-to-many relationship with Sites/Contracts (via a join table)
- **Onboarding Tasks**: One-to-many relationship with Onboarding Checklist items
- **Timesheets**: One-to-many relationship with Timesheet entries

## Business Rules

1. An employee's status controls their system access and scheduling eligibility.
2. Compliance items are tracked via related documents with expiry dates.
3. The system flags expired or missing compliance items.
4. New employees with "Onboarding" status automatically generate onboarding checklist tasks.
5. An employee cannot be set to "Active" status until all required onboarding tasks are completed.

## UI Components

- **EmployeesList**: Main listing of all employees with filtering and searching
- **EmployeeForm**: Form for creating and editing employee details
- **EmployeeDetails**: Detailed view of a single employee's information
- **ComplianceStatus**: Component showing compliance status for an employee
- **OnboardingProgress**: Component showing onboarding task completion status

## Permissions

- **View**: HR staff, Managers
- **Create/Edit**: HR staff
- **Delete**: HR Managers
- **View Sensitive Info**: HR staff only (e.g., bank details, tax ID)
