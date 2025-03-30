
# API Services Reference

This document provides comprehensive documentation for all API service functions, data flow patterns, and service integrations within the application.

## Core Service Pattern

All services in the application follow a consistent pattern:

1. **Service Creation**: Services are organized by domain/entity
2. **API Integration**: Services abstract Supabase API calls
3. **Error Handling**: Consistent error capture and reporting
4. **Type Safety**: Strong typing for parameters and return values
5. **Transformation**: Data formatting for UI/database compatibility

## Work Order Services

### Service: workOrderService

**File Location**: `src/services/workOrders/workOrderService.ts`

**Purpose**: Manage work order CRUD operations

**Functions**:

#### fetchWorkOrders

```typescript
/**
 * Fetches all work orders with related site information
 * @returns {Promise<WorkOrder[]>} Array of work orders with site data
 */
export async function fetchWorkOrders(): Promise<WorkOrder[]> {
  const { data, error } = await supabase
    .from('work_orders')
    .select(`
      *,
      site:site_id(id, site_name, client_id, client:client_id(company_name))
    `)
    .order('created_at', { ascending: false });

  if (error) throw new Error(`Error fetching work orders: ${error.message}`);
  return data || [];
}
```

#### fetchWorkOrderById

```typescript
/**
 * Fetches a specific work order by ID
 * @param {string} id - The work order ID
 * @returns {Promise<WorkOrder | null>} Work order object or null if not found
 */
export async function fetchWorkOrderById(id: string): Promise<WorkOrder | null> {
  const { data, error } = await supabase
    .from('work_orders')
    .select(`
      *,
      site:site_id(id, site_name, client_id, client:client_id(company_name))
    `)
    .eq('id', id)
    .single();

  if (error) throw new Error(`Error fetching work order: ${error.message}`);
  return data;
}
```

#### createWorkOrder

```typescript
/**
 * Creates a new work order
 * @param {WorkOrderFormValues} workOrder - Work order data
 * @returns {Promise<WorkOrder>} Created work order
 */
export async function createWorkOrder(workOrder: WorkOrderFormValues): Promise<WorkOrder> {
  // Transform dates to ISO strings for database storage
  const preparedData = {
    ...workOrder,
    scheduled_start: formatDateForDb(workOrder.scheduled_start),
    due_date: formatDateForDb(workOrder.due_date),
    category: workOrder.category || 'Routine Clean' // Ensure category is always set
  };

  const { data, error } = await supabase
    .from('work_orders')
    .insert([preparedData])
    .select()
    .single();

  if (error) throw new Error(`Error creating work order: ${error.message}`);
  return data;
}
```

#### updateWorkOrder

```typescript
/**
 * Updates an existing work order
 * @param {string} id - Work order ID to update
 * @param {Partial<WorkOrderFormValues>} workOrder - Fields to update
 * @returns {Promise<WorkOrder>} Updated work order
 */
export async function updateWorkOrder(
  id: string, 
  workOrder: Partial<WorkOrderFormValues>
): Promise<WorkOrder> {
  // Transform dates to ISO strings if present
  const preparedData: Record<string, any> = { ...workOrder };
  
  if (workOrder.scheduled_start) {
    preparedData.scheduled_start = formatDateForDb(workOrder.scheduled_start);
  }
  
  if (workOrder.due_date) {
    preparedData.due_date = formatDateForDb(workOrder.due_date);
  }
  
  // Ensure category is included if provided
  if (workOrder.category) {
    preparedData.category = workOrder.category;
  }

  const { data, error } = await supabase
    .from('work_orders')
    .update(preparedData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(`Error updating work order: ${error.message}`);
  return data;
}
```

#### deleteWorkOrder

```typescript
/**
 * Deletes a work order
 * @param {string} id - Work order ID to delete
 * @returns {Promise<void>}
 */
export async function deleteWorkOrder(id: string): Promise<void> {
  const { error } = await supabase
    .from('work_orders')
    .delete()
    .eq('id', id);

  if (error) throw new Error(`Error deleting work order: ${error.message}`);
}
```

## Client Services

### Service: clientService

**File Location**: `src/services/clients/clientService.ts`

**Purpose**: Manage client CRUD operations

**Functions**:

#### fetchClients

```typescript
/**
 * Fetches all clients
 * @returns {Promise<Client[]>} Array of clients
 */
export async function fetchClients(): Promise<Client[]> {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .order('company_name');

  if (error) throw new Error(`Error fetching clients: ${error.message}`);
  return data || [];
}
```

#### fetchClientById

```typescript
/**
 * Fetches a client by ID with related sites
 * @param {string} id - Client ID
 * @returns {Promise<ClientWithSites | null>} Client with sites or null
 */
export async function fetchClientById(id: string): Promise<ClientWithSites | null> {
  // First fetch the client
  const { data: client, error: clientError } = await supabase
    .from('clients')
    .select('*')
    .eq('id', id)
    .single();

  if (clientError) throw new Error(`Error fetching client: ${clientError.message}`);
  if (!client) return null;

  // Then fetch the sites
  const { data: sites, error: sitesError } = await supabase
    .from('sites')
    .select('*')
    .eq('client_id', id);

  if (sitesError) throw new Error(`Error fetching client sites: ${sitesError.message}`);

  return {
    ...client,
    sites: sites || []
  };
}
```

#### createClient

```typescript
/**
 * Creates a new client
 * @param {ClientFormValues} client - Client data
 * @returns {Promise<Client>} Created client
 */
export async function createClient(client: ClientFormValues): Promise<Client> {
  const { data, error } = await supabase
    .from('clients')
    .insert([client])
    .select()
    .single();

  if (error) throw new Error(`Error creating client: ${error.message}`);
  return data;
}
```

#### createClientWithSites

```typescript
/**
 * Creates a client with multiple sites in a transaction
 * @param {ClientWithSites} clientData - Client data with sites
 * @returns {Promise<ClientWithSites>} Created client with sites
 */
export async function createClientWithSites(clientData: ClientWithSites): Promise<ClientWithSites> {
  // Extract client and sites data
  const { sites, ...clientOnly } = clientData;
  
  // Start a transaction
  const { data: client, error: clientError } = await supabase
    .from('clients')
    .insert([clientOnly])
    .select()
    .single();

  if (clientError) throw new Error(`Error creating client: ${clientError.message}`);
  
  // Add client_id to each site
  const sitesWithClientId = sites.map(site => ({
    ...site,
    client_id: client.id
  }));
  
  // Insert sites
  const { data: createdSites, error: sitesError } = await supabase
    .from('sites')
    .insert(sitesWithClientId)
    .select();

  if (sitesError) throw new Error(`Error creating sites: ${sitesError.message}`);
  
  return {
    ...client,
    sites: createdSites || []
  };
}
```

#### updateClient

```typescript
/**
 * Updates a client
 * @param {string} id - Client ID
 * @param {Partial<ClientFormValues>} client - Fields to update
 * @returns {Promise<Client>} Updated client
 */
export async function updateClient(
  id: string, 
  client: Partial<ClientFormValues>
): Promise<Client> {
  const { data, error } = await supabase
    .from('clients')
    .update(client)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(`Error updating client: ${error.message}`);
  return data;
}
```

#### deleteClient

```typescript
/**
 * Deletes a client
 * @param {string} id - Client ID
 * @returns {Promise<void>}
 */
export async function deleteClient(id: string): Promise<void> {
  const { error } = await supabase
    .from('clients')
    .delete()
    .eq('id', id);

  if (error) throw new Error(`Error deleting client: ${error.message}`);
}
```

## Site Services

### Service: siteService

**File Location**: `src/services/sites/siteService.ts`

**Purpose**: Manage site CRUD operations

**Functions**:

#### fetchSites

```typescript
/**
 * Fetches all sites with client information
 * @returns {Promise<Site[]>} Array of sites with client data
 */
export async function fetchSites(): Promise<Site[]> {
  const { data, error } = await supabase
    .from('sites')
    .select(`
      *,
      client:client_id(id, company_name)
    `)
    .order('site_name');

  if (error) throw new Error(`Error fetching sites: ${error.message}`);
  return data || [];
}
```

#### fetchSitesByClient

```typescript
/**
 * Fetches sites for a specific client
 * @param {string} clientId - Client ID
 * @returns {Promise<Site[]>} Array of sites for the client
 */
export async function fetchSitesByClient(clientId: string): Promise<Site[]> {
  const { data, error } = await supabase
    .from('sites')
    .select('*')
    .eq('client_id', clientId)
    .order('site_name');

  if (error) throw new Error(`Error fetching client sites: ${error.message}`);
  return data || [];
}
```

#### createSite

```typescript
/**
 * Creates a new site
 * @param {SiteFormValues} site - Site data
 * @returns {Promise<Site>} Created site
 */
export async function createSite(site: SiteFormValues): Promise<Site> {
  // Transform dates if present
  const preparedData = {
    ...site,
    service_start_date: site.service_start_date ? 
      formatDateForDb(site.service_start_date) : null,
    service_end_date: site.service_end_date ? 
      formatDateForDb(site.service_end_date) : null
  };

  const { data, error } = await supabase
    .from('sites')
    .insert([preparedData])
    .select()
    .single();

  if (error) throw new Error(`Error creating site: ${error.message}`);
  return data;
}
```

#### updateSite

```typescript
/**
 * Updates a site
 * @param {string} id - Site ID
 * @param {Partial<SiteFormValues>} site - Fields to update
 * @returns {Promise<Site>} Updated site
 */
export async function updateSite(
  id: string, 
  site: Partial<SiteFormValues>
): Promise<Site> {
  // Transform dates if present
  const preparedData: Record<string, any> = { ...site };
  
  if (site.service_start_date) {
    preparedData.service_start_date = formatDateForDb(site.service_start_date);
  }
  
  if (site.service_end_date) {
    preparedData.service_end_date = formatDateForDb(site.service_end_date);
  }

  const { data, error } = await supabase
    .from('sites')
    .update(preparedData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(`Error updating site: ${error.message}`);
  return data;
}
```

#### deleteSite

```typescript
/**
 * Deletes a site
 * @param {string} id - Site ID
 * @returns {Promise<void>}
 */
export async function deleteSite(id: string): Promise<void> {
  const { error } = await supabase
    .from('sites')
    .delete()
    .eq('id', id);

  if (error) throw new Error(`Error deleting site: ${error.message}`);
}
```

## Employee Services

### Service: employeeService

**File Location**: `src/services/employeeService.ts`

**Purpose**: Manage employee CRUD operations

**Functions**:

#### fetchEmployees

```typescript
/**
 * Fetches all employees
 * @returns {Promise<Employee[]>} Array of employees
 */
export async function fetchEmployees(): Promise<Employee[]> {
  const { data, error } = await supabase
    .from('employees')
    .select('*')
    .order('last_name');

  if (error) throw new Error(`Error fetching employees: ${error.message}`);
  return data || [];
}
```

#### fetchEmployeeById

```typescript
/**
 * Fetches an employee by ID
 * @param {string} id - Employee ID
 * @returns {Promise<Employee | null>} Employee or null
 */
export async function fetchEmployeeById(id: string): Promise<Employee | null> {
  const { data, error } = await supabase
    .from('employees')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw new Error(`Error fetching employee: ${error.message}`);
  return data;
}
```

#### createEmployee

```typescript
/**
 * Creates a new employee
 * @param {Employee} employee - Employee data
 * @returns {Promise<Employee>} Created employee
 */
export async function createEmployee(employee: Employee): Promise<Employee> {
  // Transform date fields for DB
  const preparedData = {
    ...employee,
    date_of_birth: formatDateForDb(employee.date_of_birth),
    start_date: formatDateForDb(employee.start_date),
    end_of_employment_date: employee.end_of_employment_date ? 
      formatDateForDb(employee.end_of_employment_date) : null
  };

  const { data, error } = await supabase
    .from('employees')
    .insert([preparedData])
    .select()
    .single();

  if (error) throw new Error(`Error creating employee: ${error.message}`);
  return data;
}
```

#### updateEmployee

```typescript
/**
 * Updates an employee
 * @param {string} id - Employee ID
 * @param {Partial<Employee>} employee - Fields to update
 * @returns {Promise<Employee>} Updated employee
 */
export async function updateEmployee(
  id: string, 
  employee: Partial<Employee>
): Promise<Employee> {
  // Transform date fields if present
  const preparedData: Record<string, any> = { ...employee };
  
  if (employee.date_of_birth) {
    preparedData.date_of_birth = formatDateForDb(employee.date_of_birth);
  }
  
  if (employee.start_date) {
    preparedData.start_date = formatDateForDb(employee.start_date);
  }
  
  if (employee.end_of_employment_date) {
    preparedData.end_of_employment_date = formatDateForDb(employee.end_of_employment_date);
  }

  const { data, error } = await supabase
    .from('employees')
    .update(preparedData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(`Error updating employee: ${error.message}`);
  return data;
}
```

#### terminateEmployee

```typescript
/**
 * Terminates an employee's employment
 * @param {string} id - Employee ID
 * @param {string} reason - Termination reason
 * @param {Date} date - Termination date
 * @returns {Promise<Employee>} Updated employee
 */
export async function terminateEmployee(
  id: string, 
  reason: string, 
  date: Date
): Promise<Employee> {
  const { data, error } = await supabase
    .from('employees')
    .update({
      status: 'Terminated',
      end_of_employment_date: formatDateForDb(date),
      end_of_employment_reason: reason
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(`Error terminating employee: ${error.message}`);
  return data;
}
```

#### fetchEmploymentTerminationReasons

```typescript
/**
 * Fetches employment termination reasons
 * @returns {Promise<string[]>} Array of termination reasons
 */
export async function fetchEmploymentTerminationReasons(): Promise<string[]> {
  // This could be fetched from a DB table or hardcoded
  return [
    'Resignation',
    'Contract End',
    'Termination',
    'Retirement',
    'Other'
  ];
}
```

## Utility Functions

### Date Formatting

**File Location**: `src/utils/dateUtils.ts`

```typescript
/**
 * Formats a date for database storage (ISO string)
 * @param {Date} date - Date to format
 * @returns {string} ISO formatted date string
 */
export function formatDateForDb(date: Date): string {
  return date.toISOString();
}

/**
 * Formats a date for display
 * @param {Date | string} date - Date to format
 * @returns {string} Formatted date string
 */
export function formatDateForDisplay(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, 'dd MMM yyyy');
}

/**
 * Formats a datetime for display
 * @param {Date | string} datetime - Datetime to format
 * @returns {string} Formatted datetime string
 */
export function formatDateTimeForDisplay(datetime: Date | string): string {
  const dateObj = typeof datetime === 'string' ? new Date(datetime) : datetime;
  return format(dateObj, 'dd MMM yyyy h:mm a');
}
```

### Data Transformations

**File Location**: `src/utils/dataTransformations.ts`

```typescript
/**
 * Converts snake_case keys to camelCase
 * @param {Record<string, any>} obj - Object with snake_case keys
 * @returns {Record<string, any>} Object with camelCase keys
 */
export function snakeToCamel(obj: Record<string, any>): Record<string, any> {
  if (obj === null || typeof obj !== 'object') return obj;
  
  const camelObj: Record<string, any> = {};
  
  Object.keys(obj).forEach(key => {
    const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    camelObj[camelKey] = obj[key];
  });
  
  return camelObj;
}

/**
 * Converts camelCase keys to snake_case
 * @param {Record<string, any>} obj - Object with camelCase keys
 * @returns {Record<string, any>} Object with snake_case keys
 */
export function camelToSnake(obj: Record<string, any>): Record<string, any> {
  if (obj === null || typeof obj !== 'object') return obj;
  
  const snakeObj: Record<string, any> = {};
  
  Object.keys(obj).forEach(key => {
    const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    snakeObj[snakeKey] = obj[key];
  });
  
  return snakeObj;
}
```

## API Integration

### Supabase Setup

**File Location**: `src/lib/supabase.ts`

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### React Query Integration

**File Location**: `src/hooks/queries/useWorkOrders.ts`

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchWorkOrders, createWorkOrder, updateWorkOrder, deleteWorkOrder } from '@/services/workOrders/workOrderService';
import { WorkOrderFormValues } from '@/schema/operations/workOrder.schema';

export function useWorkOrders() {
  const queryClient = useQueryClient();

  // Fetch all work orders
  const { data: workOrders, isLoading, error } = useQuery({
    queryKey: ['workOrders'],
    queryFn: fetchWorkOrders
  });

  // Create a new work order
  const createMutation = useMutation({
    mutationFn: (data: WorkOrderFormValues) => createWorkOrder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workOrders'] });
    }
  });

  // Update an existing work order
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<WorkOrderFormValues> }) => 
      updateWorkOrder(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workOrders'] });
    }
  });

  // Delete a work order
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteWorkOrder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workOrders'] });
    }
  });

  return {
    workOrders,
    isLoading,
    error,
    createWorkOrder: createMutation.mutate,
    isCreating: createMutation.isPending,
    updateWorkOrder: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    deleteWorkOrder: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending
  };
}
```

## Error Handling

### Service Error Handling

All services implement a consistent error handling pattern:

1. **Supabase Error Capture**
   ```typescript
   const { data, error } = await supabase...
   if (error) throw new Error(`Error fetching data: ${error.message}`);
   ```

2. **Specific Error Messages**
   Each error includes context about the operation that failed

3. **Propagation to UI**
   Errors are caught in hooks/components and displayed with toast notifications

### Hook-Level Error Handling

React Query provides consistent error handling:

```typescript
const { isError, error } = useQuery(...);

// Display error to user
useEffect(() => {
  if (isError && error) {
    toast({
      title: "An error occurred",
      description: error.message,
      variant: "destructive"
    });
  }
}, [isError, error]);
```

## Data Fetching Patterns

The application implements several data fetching patterns:

1. **Basic Fetching**
   ```typescript
   const { data } = await supabase.from('table').select('*');
   ```

2. **Relational Data**
   ```typescript
   const { data } = await supabase
     .from('table')
     .select(`
       *,
       related:foreign_key(id, name)
     `);
   ```

3. **Filtered Queries**
   ```typescript
   const { data } = await supabase
     .from('table')
     .select('*')
     .eq('status', 'Active');
   ```

4. **Ordered Results**
   ```typescript
   const { data } = await supabase
     .from('table')
     .select('*')
     .order('created_at', { ascending: false });
   ```

5. **Pagination**
   ```typescript
   const { data } = await supabase
     .from('table')
     .select('*')
     .range(0, 9); // First 10 results
   ```

## Database Schema Integration

The application's services are designed to work with the following database schema:

### Work Orders Table

```sql
CREATE TABLE work_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  site_id UUID NOT NULL REFERENCES sites(id),
  category WORK_ORDER_CATEGORY NOT NULL,
  priority WORK_ORDER_PRIORITY NOT NULL DEFAULT 'Medium',
  status WORK_ORDER_STATUS NOT NULL DEFAULT 'Scheduled',
  scheduled_start TIMESTAMPTZ NOT NULL,
  due_date TIMESTAMPTZ NOT NULL,
  outcome_notes TEXT,
  actual_duration INTEGER,
  completed_by UUID REFERENCES employees(id),
  completion_timestamp TIMESTAMPTZ,
  client_signoff BOOLEAN,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### Clients Table

```sql
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL,
  primary_contact TEXT NOT NULL,
  contact_name TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  billing_address_street TEXT NOT NULL,
  billing_address_city TEXT NOT NULL,
  billing_address_state TEXT NOT NULL,
  billing_address_postcode TEXT NOT NULL,
  industry TEXT,
  payment_terms TEXT NOT NULL,
  business_number TEXT,
  status CLIENT_STATUS NOT NULL DEFAULT 'Active',
  on_hold_reason TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### Sites Table

```sql
CREATE TABLE sites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id),
  site_name TEXT NOT NULL,
  site_type TEXT NOT NULL,
  address_street TEXT NOT NULL,
  address_city TEXT NOT NULL,
  address_state TEXT NOT NULL,
  address_postcode TEXT NOT NULL,
  region TEXT,
  service_start_date DATE NOT NULL,
  special_instructions TEXT,
  status SITE_STATUS NOT NULL DEFAULT 'Active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### Employees Table

```sql
CREATE TABLE employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  contact_phone TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  address_street TEXT NOT NULL,
  address_city TEXT NOT NULL,
  address_state TEXT NOT NULL,
  address_postcode TEXT NOT NULL,
  employee_id TEXT NOT NULL,
  job_title TEXT NOT NULL,
  department TEXT NOT NULL,
  start_date DATE NOT NULL,
  employment_type EMPLOYMENT_TYPE NOT NULL,
  status EMPLOYEE_STATUS NOT NULL DEFAULT 'Onboarding',
  wage_classification TEXT NOT NULL,
  pay_rate NUMERIC NOT NULL,
  pay_cycle PAY_CYCLE NOT NULL,
  tax_id TEXT NOT NULL,
  bank_bsb TEXT NOT NULL,
  bank_account_number TEXT NOT NULL,
  super_fund_name TEXT NOT NULL,
  super_member_number TEXT NOT NULL,
  end_of_employment_date DATE,
  end_of_employment_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```
