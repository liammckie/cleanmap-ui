# Form Components Reference

This document provides a detailed reference for all form components in the application, including their structure, supported fields, and validation rules.

## Work Order Forms

### WorkOrderForm

**File Location**: `src/components/operations/workOrder/WorkOrderForm.tsx`

**Purpose**: Create and edit work orders

**Component Structure**:
```
WorkOrderForm
├── BasicInfoSection
│   ├── Title Input
│   ├── Site Select
│   ├── Category Select
│   ├── Priority Select
│   ├── Status Select
│   └── Estimated Hours Input
├── SchedulingSection
│   ├── Scheduled Start Date Picker
│   └── Due Date Picker
├── DescriptionSection
│   ├── Description Textarea
│   └── Notes Textarea
└── FormActions
    ├── Cancel Button
    └── Submit Button
```

**Key Props**:
- `initialData?: Partial<WorkOrder>` - Pre-populated data for editing
- `onSuccess: () => void` - Callback after successful submission
- `onCancel: () => void` - Callback when cancellation requested

**Hook Integration**: Uses `useWorkOrderForm` hook that provides:
- Form state management through React Hook Form
- Form validation through Zod schema
- Reference data (sites, statuses, categories, priorities)
- Submission logic for create/update operations

**Validation Rules**:
- Title: Required string
- Site ID: Required UUID
- Category: Required enum value
- Description: Required string
- Scheduled Start: Required date
- Due Date: Required date

**Form Sections**:

1. **BasicInfoSection**:
   - Props: 
     - `sites: any[]` - Available sites for selection
     - `categories: string[]` - Work order categories
     - `priorities: string[]` - Priority levels
     - `statuses: string[]` - Status options
   - Fields:
     - `title`: Text input for work order title
     - `site_id`: Select input for client site
     - `category`: Select input for work category
     - `priority`: Select input for urgency level
     - `status`: Select input for current status
     - `actual_duration`: Number input for estimated hours

2. **SchedulingSection**:
   - Fields:
     - `scheduled_start`: Date picker for work start
     - `due_date`: Date picker for completion deadline
   - Features:
     - Uses Popover and Calendar components
     - Format dates using date-fns

3. **DescriptionSection**:
   - Fields:
     - `description`: Textarea for detailed work description
     - `outcome_notes`: Optional textarea for completion notes
   - Features:
     - Min-height styling for better UX
     - FormDescription for helper text

4. **FormActions**:
   - Props:
     - `onCancel: () => void` - Cancel handler
     - `isEditing: boolean` - Determines button text
   - Buttons:
     - Cancel (outline variant)
     - Submit (primary variant, context-aware text)

## Client Forms

### ClientForm

**File Location**: `src/components/operations/client/ClientForm.tsx`

**Purpose**: Capture and edit client information

**Component Structure**:
```
ClientForm
├── CompanyContactSection
├── AddressSection
├── BusinessDetailsSection
└── AdditionalInfoSection
```

**Key Props**:
- `formData: ClientFormData` - Current form state
- `onChange: (field: keyof ClientFormData, value: string) => void` - Change handler
- `loading?: boolean` - Optional loading state

**Form Sections**:

1. **CompanyContactSection**:
   - Fields:
     - Company name
     - Primary contact
     - Alternative contact
     - Contact email
     - Contact phone
   - Validation: Company name and primary contact required

2. **AddressSection**:
   - Fields:
     - Street address
     - City
     - State
     - Postcode
   - Validation: All address fields required

3. **BusinessDetailsSection**:
   - Fields:
     - Industry
     - Payment terms
     - Business number
     - Status (Active/On Hold)
   - Features:
     - Conditional field for on-hold reason

4. **AdditionalInfoSection**:
   - Fields:
     - Notes (textarea)
   - Features:
     - Optional supplementary information

### ClientFormStepper

**File Location**: `src/components/operations/ClientForm/ClientFormStepper.tsx`

**Purpose**: Multi-step client creation process

**Component Structure**:
```
ClientFormStepper
├── StepperHeader (navigation indicators)
├── Step Content (conditional based on current step)
│   ├── Step 1: ClientDetailsForm
│   ├── Step 2: ClientSitesList
│   └── Step 3: ReviewStep
└── Navigation Buttons
```

**Hook Integration**: Uses `useClientForm` hook that provides:
- Step management (current step, navigation)
- Form submission logic
- Loading state management

**Form Flow**:
1. **Client Details**: Basic client information
2. **Sites**: Add one or more service locations
3. **Review**: Confirm all information before submission

### ClientSiteForm

**File Location**: `src/components/operations/ClientForm/ClientSiteForm.tsx`

**Purpose**: Add and edit site information for a client

**Component Structure**:
```
ClientSiteForm
├── Card Header (collapsible)
├── SiteBasicDetails
├── SiteAddressFields
├── SiteServiceDetails
├── SitePricingDetails
└── SiteSpecialInstructions
```

**Key Props**:
- `form: UseFormReturn<any>` - Parent form control
- `index: number` - Site index in array
- `onRemove: () => void` - Handler to remove site

**Hook Integration**: Uses `useClientSiteForm` hook that provides:
- Price calculations and breakdowns
- Form field access helpers

**Key Components**:

1. **SiteBasicDetails**:
   - Site name and type
   - Contact information
   - Option to copy from client

2. **SiteAddressFields**:
   - Address components
   - Option to use client billing address

3. **SiteServiceDetails**:
   - Service type (Internal/Contractor)
   - Service frequency
   - Start/end dates

4. **SitePricingDetails**:
   - Base price and billing frequency
   - Service items with individual pricing
   - Price calculations and summaries

5. **SiteSpecialInstructions**:
   - Special instructions or notes textarea

## HR Forms

### AddEmployeeDialog

**File Location**: `src/components/hr/AddEmployeeDialog.tsx`

**Purpose**: Create new employee records

**Component Structure**:
```
AddEmployeeDialog
├── Dialog Header
├── Form
│   ├── Personal Information
│   │   └── PersonalInfoForm
│   ├── Employment Details
│   │   └── EmploymentDetailsForm
│   └── Payroll Details
│       └── PayrollDetailsForm
└── Dialog Footer (actions)
```

**Key Props**:
- `isOpen: boolean` - Dialog open state
- `onOpenChange: (open: boolean) => void` - Open state handler
- `departments: string[]` - Available departments
- `employeeStatuses: string[]` - Status options
- `employmentTypes: string[]` - Employment type options
- `onEmployeeAdded: () => void` - Success callback

**Form Sections**:

1. **PersonalInfoForm**:
   - Personal details (name, DOB)
   - Contact information
   - Address details
   - Uses date picker for date fields

2. **EmploymentDetailsForm**:
   - Employee ID and job information
   - Department and type selection
   - Status and classification
   - Pay rate information

3. **PayrollDetailsForm**:
   - Pay cycle selection
   - Tax information
   - Banking details
   - Superannuation information

### EmployeeDetailsDialog

**File Location**: `src/components/hr/EmployeeDetailsDialog.tsx`

**Purpose**: View and edit employee information

**Component Structure**:
```
EmployeeDetailsDialog
├── Dialog Header
├── Tabs Navigation
│   ├── Details Tab
│   │   └── EmployeePersonalInfoTab
│   └── Employment Tab
│       └── EmployeeEmploymentTab
└── Dialog Footer (actions)
```

**Key Props**:
- `employee: Employee | null` - Employee data
- `isOpen: boolean` - Dialog open state
- `onOpenChange: (open: boolean) => void` - Open state handler

**Hook Integration**: Uses `useEmployeeDetails` hook that provides:
- Edit mode toggling
- Form state management
- Submission handling

## Common Form Components

### AddressForm

**File Location**: `src/components/hr/AddressForm.tsx`

**Purpose**: Reusable address entry component

**Key Props**:
- `form: any` - Parent form control
- `streetName: string` - Field name for street
- `cityName: string` - Field name for city
- `stateName: string` - Field name for state
- `postcodeName: string` - Field name for postcode

**Features**:
- Address lookup integration
- Consistent field layout
- Responsive grid design

### AddressAutocomplete

**File Location**: `src/components/common/AddressAutocomplete.tsx`

**Purpose**: Address search and autocomplete

**Key Props**:
- `onAddressSelected: (address: Address) => void` - Selection handler
- `placeholder: string` - Input placeholder
- `className: string` - Optional styling
- `id: string` - Element ID

**Features**:
- Geocoding API integration
- Address normalization
- Type-ahead suggestions

## Validation Schemas

### Work Order Schema

**File Location**: `src/schema/operations/workOrder.schema.ts`

```typescript
export const workOrderSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1, "Title is required"),
  site_id: z.string().uuid("Site is required"),
  category: z.enum(["Routine Clean", "Ad-hoc Request", "Audit"]),
  priority: z.enum(["Low", "Medium", "High", "Critical"]).default("Medium"),
  status: z.enum(["Scheduled", "In Progress", "On Hold", "Completed", "Cancelled", "Overdue"]).default("Scheduled"),
  scheduled_start: z.date({required_error: "Start date is required"}),
  due_date: z.date({required_error: "Due date is required"}),
  description: z.string().min(1, "Description is required"),
  outcome_notes: z.string().optional().nullable(),
  actual_duration: z.number().nullable().optional(),
});
```

### Client Schema

**File Location**: `src/schema/operations/client.schema.ts`

```typescript
export const clientSchema = z.object({
  id: z.string().uuid().optional(),
  company_name: z.string().min(1, "Company name is required"),
  primary_contact: z.string().min(1, "Primary contact is required"),
  status: z.enum(["Active", "On Hold"]).default("Active"),
  // ... additional fields
});

export const clientSiteSchema = z.object({
  site_name: z.string().min(1, "Site name is required"),
  site_type: z.string().min(1, "Site type is required"),
  // ... address and service fields
});
```

### Employee Schema

**File Location**: `src/schema/hr/employee.schema.ts`

```typescript
export const employeeSchema = z.object({
  id: z.string().uuid().optional(),
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  date_of_birth: z.date({required_error: "Date of birth is required"}),
  // ... additional personal, employment and payroll fields
});
```

## Form Hooks Implementation

### useWorkOrderForm

**File Location**: `src/components/operations/workOrder/hooks/useWorkOrderForm.ts`

**Purpose**: Manage work order form state and submission

**Key Features**:
- Initialize form with default values or edit data
- Fetch reference data (sites, statuses, etc.)
- Handle form submission with create/update logic
- Track editing state

**Implementation Details**:
```typescript
export function useWorkOrderForm({
  initialData,
  onSuccess
}: WorkOrderFormProps) {
  const isEditing = !!initialData?.id;
  
  // Form initialization with react-hook-form + zod
  const form = useForm<WorkOrderFormValues>({
    resolver: zodResolver(workOrderSchema),
    defaultValues: {
      title: initialData?.title || '',
      site_id: initialData?.site_id || '',
      // ... other defaults
    }
  });

  // Data fetching with react-query
  const { data: sites } = useQuery({ queryKey: ['sites'], queryFn: fetchSites });
  
  // Form submission handler
  const onSubmit = async (data: WorkOrderFormValues) => {
    try {
      if (isEditing) {
        await updateWorkOrder(initialData.id!, data);
      } else {
        await createWorkOrder(data);
      }
      onSuccess();
    } catch (error) {
      // Error handling
    }
  };

  return {
    form,
    sites,
    statuses: WORK_ORDER_STATUSES,
    categories: WORK_ORDER_CATEGORIES,
    priorities: WORK_ORDER_PRIORITIES,
    onSubmit,
    isEditing
  };
}
```

### useClientForm

**File Location**: `src/hooks/operations/useClientForm.ts`

**Purpose**: Manage multi-step client form process

**Key Features**:
- Track current step in wizard
- Navigation between steps
- Form submission with validation per step
- Loading state management

### useEmployeeDetails

**File Location**: `src/hooks/hr/useEmployeeDetails.ts`

**Purpose**: Manage employee details viewing and editing

**Key Features**:
- Toggle between view and edit modes
- Track form changes
- Handle specialized input types (dates, selects)
- Submit updates to API

## Field Validation Patterns

The application uses consistent patterns for field validation:

1. **Required Fields**:
   - Text fields: `z.string().min(1, "Field is required")`
   - Select fields: `z.enum([...values], {required_error: "Selection required"})`
   - Date fields: `z.date({required_error: "Date is required"})`

2. **Optional Fields**:
   - Nullable: `z.string().nullable().optional()`
   - With default: `z.string().default("value")`

3. **Specialized Validation**:
   - Email: `z.string().email("Valid email is required")`
   - UUID: `z.string().uuid("Valid ID required")`
   - Numbers: `z.number().min(0, "Must be positive")`

## Error Handling Patterns

Forms implement consistent error handling:

1. **Client-Side Validation**:
   - Zod schema validation via react-hook-form
   - FormMessage components display field-specific errors
   - Highlighting invalid fields with error styling

2. **Server-Side Errors**:
   - API error capture in submission handlers
   - Toast notifications for user feedback
   - Form reset or maintenance depending on error type

3. **Error Recovery**:
   - Cancel buttons to abort operations
   - Form state preservation during validation errors
   - Clear error paths for retry
