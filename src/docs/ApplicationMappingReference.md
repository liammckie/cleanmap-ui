
# CleanMap Application Reference Documentation

This document serves as a comprehensive reference for all major components, layouts, forms, fields, and functions within the CleanMap application. Use this as a guide for understanding the application structure, available fields, and component relationships.

## Table of Contents

1. [Domain Overview](#domain-overview)
2. [Form Components](#form-components)
3. [Page Layouts](#page-layouts)
4. [Common Components](#common-components)
5. [Data Models & Fields](#data-models--fields)
6. [Services & Functions](#services--functions)
7. [Hook Reference](#hook-reference)

## Domain Overview

The application is organized into several key domains:

- **Operations**: Managing work orders, clients, and service delivery
- **HR**: Employee management, onboarding, and payroll
- **Finance**: Billing, invoicing, and financial reporting
- **Inventory**: Equipment and supply management

Each domain has its own set of pages, components, and services that work together.

## Form Components

### Work Order Forms

#### WorkOrderForm
**Location**: `src/components/operations/workOrder/WorkOrderForm.tsx`
**Purpose**: Create and edit work orders
**Key Props**:
- `initialData`: Optional partial WorkOrder data for editing
- `onSuccess`: Callback function after successful submission
- `onCancel`: Callback function to cancel form

**Component Structure**:
- Uses React Hook Form with Zod validation
- Divided into sections:
  - BasicInfoSection: Core work order details
  - SchedulingSection: Date and time planning
  - DescriptionSection: Detailed work descriptions
  - FormActions: Submission and cancellation buttons

**Fields Reference**:

1. **BasicInfoSection**:
   - `title`: Text - Work order title
   - `site_id`: Select - Site where work will be performed  
   - `category`: Select - "Routine Clean", "Ad-hoc Request", "Audit"
   - `priority`: Select - "Low", "Medium", "High", "Critical"
   - `status`: Select - "Scheduled", "In Progress", "On Hold", "Completed", "Cancelled", "Overdue"
   - `actual_duration`: Number - Estimated hours

2. **SchedulingSection**:
   - `scheduled_start`: Date - When work should begin
   - `due_date`: Date - When work should be completed

3. **DescriptionSection**:
   - `description`: Textarea - Detailed work order description
   - `outcome_notes`: Textarea - Notes on completion/results

#### Form Data Flow:
- `useWorkOrderForm` hook manages form state and submission logic
- Form data is validated against WorkOrder schema
- On submission, data is processed by workOrderService

### Client Forms

#### ClientForm
**Location**: `src/components/operations/client/ClientForm.tsx`
**Purpose**: Manage client information
**Key Props**:
- `formData`: Client data object
- `onChange`: Handler for field changes
- `loading`: Optional boolean for loading state

**Component Structure**:
- Divided into sections:
  - CompanyContactSection: Basic client information
  - AddressSection: Client address details
  - BusinessDetailsSection: Business-specific information
  - AdditionalInfoSection: Notes and other details

**Fields Reference**:
- Company details: `company_name`, `primary_contact`, `contact_name`, `contact_email`, `contact_phone`
- Address fields: `billing_address_street`, `billing_address_city`, `billing_address_state`, `billing_address_postcode`
- Business details: `industry`, `payment_terms`, `business_number`, `status`
- Additional: `notes`, `on_hold_reason` (conditional)

#### ClientFormStepper
**Location**: `src/components/operations/ClientForm/ClientFormStepper.tsx`
**Purpose**: Multi-step client creation with sites
**Component Structure**:
- StepperHeader: Navigation indicators
- Three-step process:
  1. ClientDetailsForm: Client information
  2. ClientSitesList: Add/manage multiple sites
  3. ReviewStep: Review all information before submission

#### ClientSiteForm
**Location**: `src/components/operations/ClientForm/ClientSiteForm.tsx`
**Purpose**: Manage site information within client form
**Key Sections**:
- SiteBasicDetails: Name, type, contact information
- SiteAddressFields: Site location details
- SiteServiceDetails: Service frequency and dates
- SitePricingDetails: Pricing structure and items
- SiteSpecialInstructions: Additional notes

### HR Forms

#### AddEmployeeDialog
**Location**: `src/components/hr/AddEmployeeDialog.tsx`
**Purpose**: Create new employee records
**Key Sections**:
- PersonalInfoForm: Name, contact, and address details
- EmploymentDetailsForm: Job role, department, employment type
- PayrollDetailsForm: Payment and financial information

**Fields Reference**:
- Personal: `first_name`, `last_name`, `date_of_birth`, `contact_phone`, `contact_email`, `address_*`
- Employment: `employee_id`, `job_title`, `department`, `start_date`, `employment_type`, `status`, `wage_classification`, `pay_rate`
- Payroll: `pay_cycle`, `tax_id`, `bank_*`, `super_*`

#### EmployeeFormAddressSection
**Location**: `src/components/hr/EmployeeFormAddressSection.tsx`
**Purpose**: Reusable address form component
**Key Fields**: Uses AddressForm with field name mapping

## Page Layouts

### Operations Pages

1. **Work Orders Page**
   - WorkOrderTable: Lists all work orders with filtering
   - WorkOrderForm: Creates/edits work orders (modal)
   - Stats cards: Summary metrics

2. **Clients Page**
   - ClientTable: Lists all clients
   - ClientForm: Creates/edits clients (modal)
   - ClientDetailView: Expanded client information

3. **Sites Page**
   - SiteTable: Lists all client sites
   - SiteForm: Creates/edits sites
   - Map visualization (optional)

### HR Pages

1. **Employees Page**
   - EmployeeTable: Lists all employees
   - AddEmployeeDialog: Creates new employees
   - EmployeeDetailsDialog: Views/edits employee details

2. **Timesheets Page**
   - TimesheetTable: Lists all timesheet entries
   - TimesheetForm: Creates/edits timesheets
   - ApprovalQueue: For managers

## Data Models & Fields

### Work Order Schema
**Location**: `src/schema/operations/workOrder.schema.ts`

```typescript
// Core fields
id: z.string().uuid().optional()
title: z.string().min(1, "Title is required")
site_id: z.string().uuid("Site is required")
category: z.enum(["Routine Clean", "Ad-hoc Request", "Audit"])
priority: z.enum(["Low", "Medium", "High", "Critical"]).default("Medium")
status: z.enum(["Scheduled", "In Progress", "On Hold", "Completed", "Cancelled", "Overdue"]).default("Scheduled")

// Scheduling
scheduled_start: z.date({required_error: "Start date is required"})
due_date: z.date({required_error: "Due date is required"})

// Details
description: z.string().min(1, "Description is required")
outcome_notes: z.string().optional().nullable()
actual_duration: z.number().nullable().optional()

// Relationship fields
contract_id: z.string().uuid().optional().nullable()
completed_by: z.string().uuid().optional().nullable()
```

### Client Schema
**Location**: `src/schema/operations/client.schema.ts`

```typescript
// Core fields
id: z.string().uuid().optional()
company_name: z.string().min(1, "Company name is required")
primary_contact: z.string().min(1, "Primary contact is required")
status: z.enum(["Active", "On Hold"]).default("Active")

// Contact information
contact_name: z.string().nullable().optional()
contact_email: z.string().email("Valid email is required").nullable().optional()
contact_phone: z.string().nullable().optional()

// Address fields
billing_address_street: z.string().min(1, "Street address is required")
billing_address_city: z.string().min(1, "City is required")
billing_address_state: z.string().min(1, "State is required")
billing_address_postcode: z.string().min(1, "Postcode is required")

// Business details
payment_terms: z.string().min(1, "Payment terms are required")
industry: z.string().nullable().optional()
business_number: z.string().nullable().optional()
on_hold_reason: z.string().nullable().optional()
notes: z.string().nullable().optional()
```

### Employee Schema
**Location**: `src/schema/hr/employee.schema.ts`

```typescript
// Personal information
id: z.string().uuid().optional()
first_name: z.string().min(1, "First name is required")
last_name: z.string().min(1, "Last name is required")
date_of_birth: z.date({required_error: "Date of birth is required"})
contact_phone: z.string().min(1, "Phone number is required")
contact_email: z.string().email("Valid email is required")

// Address
address_street: z.string().min(1, "Street address is required")
address_city: z.string().min(1, "City is required")
address_state: z.string().min(1, "State is required")
address_postcode: z.string().min(1, "Postcode is required")

// Employment details
employee_id: z.string().min(1, "Employee ID is required")
job_title: z.string().min(1, "Job title is required")
department: z.string().min(1, "Department is required")
start_date: z.date({required_error: "Start date is required"})
employment_type: z.enum(["Full-time", "Part-time", "Casual", "Contract"])
status: z.enum(["Onboarding", "Active", "On Leave", "Terminated"])
wage_classification: z.string().min(1, "Wage classification is required")
pay_rate: z.number().min(0, "Pay rate must be 0 or greater")

// Payroll details
pay_cycle: z.enum(["Weekly", "Fortnightly", "Monthly"])
tax_id: z.string().min(1, "Tax file number is required")
bank_bsb: z.string().min(1, "BSB is required")
bank_account_number: z.string().min(1, "Account number is required")
super_fund_name: z.string().min(1, "Super fund name is required")
super_member_number: z.string().min(1, "Super member number is required")

// Termination details (optional)
end_of_employment_date: z.date().nullable().optional()
end_of_employment_reason: z.string().nullable().optional()
```

## Services & Functions

### Work Order Service
**Location**: `src/services/workOrders/workOrderService.ts`

**Key Functions**:
- `fetchWorkOrders()`: Gets all work orders
- `fetchWorkOrderById(id: string)`: Gets specific work order
- `createWorkOrder(data: WorkOrderFormValues)`: Creates new work order
- `updateWorkOrder(id: string, data: Partial<WorkOrderFormValues>)`: Updates work order
- `deleteWorkOrder(id: string)`: Removes work order

### Client Service
**Location**: `src/services/clients/clientService.ts`

**Key Functions**:
- `fetchClients()`: Gets all clients
- `fetchClientById(id: string)`: Gets specific client
- `createClient(data: ClientFormValues)`: Creates new client
- `updateClient(id: string, data: Partial<ClientFormValues>)`: Updates client
- `deleteClient(id: string)`: Removes client

### Employee Service
**Location**: `src/services/hr/employeeService.ts`

**Key Functions**:
- `fetchEmployees()`: Gets all employees
- `fetchEmployeeById(id: string)`: Gets specific employee
- `createEmployee(data: Employee)`: Creates new employee
- `updateEmployee(id: string, data: Partial<Employee>)`: Updates employee
- `terminateEmployee(id: string, reason: string, date: Date)`: Handles employee termination

## Hook Reference

### Form Hooks

#### useWorkOrderForm
**Location**: `src/components/operations/workOrder/hooks/useWorkOrderForm.ts`
**Purpose**: Manages work order form state and submission logic
**Key Features**:
- Initializes form with default values or edit data
- Handles data validation
- Manages form submission
- Fetches reference data (sites, statuses, etc.)

#### useClientForm
**Location**: `src/hooks/operations/useClientForm.ts`
**Purpose**: Manages multi-step client form flow
**Key Features**:
- Tracks current step in form process
- Handles validation and data aggregation
- Manages form submission
- Provides navigation between steps

#### useClientSiteForm
**Location**: `src/hooks/operations/useClientSiteForm.ts`
**Purpose**: Handles site-specific form logic within client forms
**Key Features**:
- Calculates pricing breakdowns
- Manages service item collection
- Provides convenience methods for form manipulation

### Data Hooks

#### useWorkOrders
**Location**: `src/hooks/operations/useWorkOrders.ts`
**Purpose**: Provides work order data access with React Query
**Key Features**:
- Fetches work order data
- Provides loading and error states
- Handles cache management
- Includes mutation functions

#### useClients
**Location**: `src/hooks/operations/useClients.ts`
**Purpose**: Provides client data access with React Query
**Key Features**:
- Fetches client data
- Provides loading and error states
- Handles cache management
- Includes mutation functions

#### useEmployees
**Location**: `src/hooks/hr/useEmployees.ts`
**Purpose**: Provides employee data access with React Query
**Key Features**:
- Fetches employee data
- Provides loading and error states
- Handles cache management
- Includes mutation functions

## UI Component Reference

### Form UI Components

- **Form**: Base form component from shadcn/ui
- **FormField**: Field wrapper with validation display
- **FormItem**: Container for form elements
- **FormLabel**: Text label for form inputs
- **FormControl**: Wrapper for form control elements
- **FormDescription**: Helper text for form fields
- **FormMessage**: Validation error messages

### Input Components

- **Input**: Text input component
- **Textarea**: Multi-line text input
- **Select/SelectTrigger/SelectContent/SelectItem**: Dropdown selection
- **Checkbox**: Boolean input
- **RadioGroup/RadioGroupItem**: Option selection
- **Button**: Action triggers
- **Calendar**: Date picker foundation
- **Popover**: Container for floating UI elements

### Layout Components

- **Card/CardHeader/CardContent/CardFooter**: Contained content sections
- **Dialog/DialogContent/DialogHeader/DialogTitle/DialogFooter**: Modal containers
- **Tabs/TabsContent/TabsList/TabsTrigger**: Tabbed interface
- **Table/TableHeader/TableBody/TableRow/TableCell**: Data tables

## Appendix: Field Cross-References

This section maps database fields to UI components and shows which forms use specific fields.

### Work Order Fields Cross-Reference

| Database Field      | UI Component    | Used In                               |
|---------------------|-----------------|---------------------------------------|
| title               | Input           | WorkOrderForm > BasicInfoSection      |
| site_id             | Select          | WorkOrderForm > BasicInfoSection      |
| category            | Select          | WorkOrderForm > BasicInfoSection      |
| priority            | Select          | WorkOrderForm > BasicInfoSection      |
| status              | Select          | WorkOrderForm > BasicInfoSection      |
| scheduled_start     | Calendar        | WorkOrderForm > SchedulingSection     |
| due_date            | Calendar        | WorkOrderForm > SchedulingSection     |
| description         | Textarea        | WorkOrderForm > DescriptionSection    |
| outcome_notes       | Textarea        | WorkOrderForm > DescriptionSection    |
| actual_duration     | Input (number)  | WorkOrderForm > BasicInfoSection      |

### Client Fields Cross-Reference

| Database Field            | UI Component    | Used In                                |
|---------------------------|-----------------|----------------------------------------|
| company_name              | Input           | ClientForm > CompanyContactSection     |
| primary_contact           | Input           | ClientForm > CompanyContactSection     |
| contact_name              | Input           | ClientForm > CompanyContactSection     |
| contact_email             | Input           | ClientForm > CompanyContactSection     |
| contact_phone             | Input           | ClientForm > CompanyContactSection     |
| billing_address_street    | Input           | ClientForm > AddressSection            |
| billing_address_city      | Input           | ClientForm > AddressSection            |
| billing_address_state     | Input           | ClientForm > AddressSection            |
| billing_address_postcode  | Input           | ClientForm > AddressSection            |
| industry                  | Input           | ClientForm > BusinessDetailsSection    |
| payment_terms             | Input           | ClientForm > BusinessDetailsSection    |
| business_number           | Input           | ClientForm > BusinessDetailsSection    |
| status                    | Select          | ClientForm > BusinessDetailsSection    |
| notes                     | Textarea        | ClientForm > AdditionalInfoSection     |
| on_hold_reason            | Textarea        | ClientForm > AdditionalInfoSection     |

### Site Fields Cross-Reference

| Database Field        | UI Component    | Used In                                 |
|-----------------------|-----------------|---------------------------------------|
| site_name             | Input           | ClientSiteForm > SiteBasicDetails      |
| site_type             | Input           | ClientSiteForm > SiteBasicDetails      |
| address_street        | Input           | ClientSiteForm > SiteAddressFields     |
| address_city          | Input           | ClientSiteForm > SiteAddressFields     |
| address_state         | Input           | ClientSiteForm > SiteAddressFields     |
| address_postcode      | Input           | ClientSiteForm > SiteAddressFields     |
| service_start_date    | Calendar        | ClientSiteForm > SiteServiceDetails    |
| service_end_date      | Calendar        | ClientSiteForm > SiteServiceDetails    |
| service_type          | RadioGroup      | ClientSiteForm > SiteServiceDetails    |
| service_frequency     | Select          | ClientSiteForm > SiteServiceDetails    |
| special_instructions  | Textarea        | ClientSiteForm > SiteSpecialInstructions |

### Employee Fields Cross-Reference

| Database Field            | UI Component    | Used In                                  |
|---------------------------|-----------------|------------------------------------------|
| first_name                | Input           | AddEmployeeDialog > PersonalInfoForm     |
| last_name                 | Input           | AddEmployeeDialog > PersonalInfoForm     |
| date_of_birth             | Calendar        | AddEmployeeDialog > PersonalInfoForm     |
| contact_phone             | Input           | AddEmployeeDialog > PersonalInfoForm     |
| contact_email             | Input           | AddEmployeeDialog > PersonalInfoForm     |
| address_street            | Input           | AddEmployeeDialog > PersonalInfoForm     |
| address_city              | Input           | AddEmployeeDialog > PersonalInfoForm     |
| address_state             | Input           | AddEmployeeDialog > PersonalInfoForm     |
| address_postcode          | Input           | AddEmployeeDialog > PersonalInfoForm     |
| employee_id               | Input           | AddEmployeeDialog > EmploymentDetailsForm|
| job_title                 | Input           | AddEmployeeDialog > EmploymentDetailsForm|
| department                | Select          | AddEmployeeDialog > EmploymentDetailsForm|
| start_date                | Calendar        | AddEmployeeDialog > EmploymentDetailsForm|
| employment_type           | Select          | AddEmployeeDialog > EmploymentDetailsForm|
| status                    | Select          | AddEmployeeDialog > EmploymentDetailsForm|
| wage_classification       | Input           | AddEmployeeDialog > EmploymentDetailsForm|
| pay_rate                  | Input (number)  | AddEmployeeDialog > EmploymentDetailsForm|
| pay_cycle                 | Select          | AddEmployeeDialog > PayrollDetailsForm   |
| tax_id                    | Input           | AddEmployeeDialog > PayrollDetailsForm   |
| bank_bsb                  | Input           | AddEmployeeDialog > PayrollDetailsForm   |
| bank_account_number       | Input           | AddEmployeeDialog > PayrollDetailsForm   |
| super_fund_name           | Input           | AddEmployeeDialog > PayrollDetailsForm   |
| super_member_number       | Input           | AddEmployeeDialog > PayrollDetailsForm   |
