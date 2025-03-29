/**
 * Temporary debugging utility for employee data issues
 */

import { Employee } from '@/types/employee.types';

/**
 * Mock employee data for debugging
 */
const MOCK_EMPLOYEES: Employee[] = [
  {
    id: "1",
    first_name: "John",
    last_name: "Doe",
    date_of_birth: "1985-05-15",
    contact_phone: "555-123-4567",
    contact_email: "john.doe@example.com",
    address_street: "123 Main St",
    address_city: "Springfield",
    address_state: "IL",
    address_postcode: "62701",
    employee_id: "EMP001",
    job_title: "Senior Cleaner",
    department: "Operations",
    start_date: "2022-01-15",
    employment_type: "Full-time",
    status: "Active",
    wage_classification: "Standard",
    pay_rate: 25.50,
    pay_cycle: "Fortnightly",
    tax_id: "TX123456",
    bank_bsb: "123-456",
    bank_account_number: "12345678",
    super_fund_name: "Super Fund Ltd",
    super_member_number: "SF123456",
    end_of_employment_date: null,
    end_of_employment_reason: null,
    created_at: "2022-01-10T09:00:00Z",
    updated_at: "2022-01-10T09:00:00Z"
  },
  {
    id: "2",
    first_name: "Jane",
    last_name: "Smith",
    date_of_birth: "1990-08-20",
    contact_phone: "555-987-6543",
    contact_email: "jane.smith@example.com",
    address_street: "456 Oak Ave",
    address_city: "Riverdale",
    address_state: "NY",
    address_postcode: "10471",
    employee_id: "EMP002",
    job_title: "Team Leader",
    department: "Operations",
    start_date: "2021-11-01",
    employment_type: "Full-time",
    status: "Active",
    wage_classification: "Leadership",
    pay_rate: 32.00,
    pay_cycle: "Fortnightly",
    tax_id: "TX789012",
    bank_bsb: "789-012",
    bank_account_number: "78901234",
    super_fund_name: "Super Fund Ltd",
    super_member_number: "SF789012",
    end_of_employment_date: null,
    end_of_employment_reason: null,
    created_at: "2021-10-25T10:30:00Z",
    updated_at: "2021-10-25T10:30:00Z"
  },
  {
    id: "3",
    first_name: "Robert",
    last_name: "Johnson",
    date_of_birth: "1978-03-12",
    contact_phone: "555-456-7890",
    contact_email: "robert.johnson@example.com",
    address_street: "789 Pine St",
    address_city: "Portland",
    address_state: "OR",
    address_postcode: "97201",
    employee_id: "EMP003",
    job_title: "Cleaner",
    department: "Operations",
    start_date: "2023-02-15",
    employment_type: "Part-time",
    status: "Onboarding",
    wage_classification: "Standard",
    pay_rate: 22.75,
    pay_cycle: "Weekly",
    tax_id: "TX345678",
    bank_bsb: "345-678",
    bank_account_number: "34567890",
    super_fund_name: "Super Saver Fund",
    super_member_number: "SS345678",
    end_of_employment_date: null,
    end_of_employment_reason: null,
    created_at: "2023-02-10T14:15:00Z",
    updated_at: "2023-02-10T14:15:00Z"
  }
];

/**
 * Validates employee data structure and logs any inconsistencies
 */
export const validateEmployeeData = (data: any): boolean => {
  if (!data) {
    console.error('Employee data is null or undefined');
    return false;
  }
  
  if (!Array.isArray(data)) {
    console.error('Employee data is not an array', data);
    return false;
  }
  
  const issues: string[] = [];
  
  // Check each employee record
  data.forEach((employee, index) => {
    if (!employee) {
      issues.push(`Employee at index ${index} is null or undefined`);
      return;
    }
    
    // Check required fields
    ['id', 'first_name', 'last_name', 'job_title', 'department', 'status'].forEach(field => {
      if (employee[field] === undefined) {
        issues.push(`Employee at index ${index} is missing required field: ${field}`);
      }
    });
    
    // Check date fields
    ['start_date', 'end_of_employment_date'].forEach(dateField => {
      if (employee[dateField] !== undefined && employee[dateField] !== null) {
        try {
          new Date(employee[dateField]);
        } catch (e) {
          issues.push(`Employee at index ${index} has invalid date format for ${dateField}: ${employee[dateField]}`);
        }
      }
    });
  });
  
  if (issues.length > 0) {
    console.error('Employee data validation issues:', issues);
    return false;
  }
  
  console.log('Employee data validation passed for', data.length, 'records');
  return true;
};

/**
 * Attempts to manually fetch employee data for debugging
 */
export const debugEmployeeData = async (): Promise<void> => {
  try {
    console.group('Employee Data Debug');
    
    console.log('Attempting to fetch employee data...');
    
    // First check if we're in the debugging environment
    const isDebugMode = window.location.href.includes('forceHideBadge=true') || 
                         !document.querySelector('script[src="/src/main.tsx"]');
    
    if (isDebugMode) {
      console.log('Debug mode detected, using mock data');
      validateEmployeeData(MOCK_EMPLOYEES);
      return MOCK_EMPLOYEES;
    }
    
    // Otherwise try the actual API
    const response = await fetch('/api/employees');
    console.log('Response status:', response.status);
    
    // Check if we got HTML instead of JSON
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('text/html')) {
      console.error('Received HTML instead of JSON. API endpoint may not exist or server error occurred.');
      console.log('Using mock data instead');
      validateEmployeeData(MOCK_EMPLOYEES);
      return MOCK_EMPLOYEES;
    }
    
    const data = await response.json();
    console.log('Raw employee data:', data);
    
    validateEmployeeData(data);
    console.groupEnd();
    return data;
  } catch (error) {
    console.error('Error debugging employee data:', error);
    console.log('Using mock data due to error');
    validateEmployeeData(MOCK_EMPLOYEES);
    console.groupEnd();
    return MOCK_EMPLOYEES;
  }
};

/**
 * Creates a mock API endpoint for employees in development
 */
export const setupMockEmployeeApi = () => {
  console.log('Setting up mock employee API endpoint');
  
  // Only intercept in development mode or when Vite is disabled
  const shouldMock = process.env.NODE_ENV === 'development' || 
                     !document.querySelector('script[src="/src/main.tsx"]');
  
  if (!shouldMock) {
    console.log('Not in development mode, skipping mock setup');
    return;
  }
  
  // Override fetch only for the employee endpoint
  const originalFetch = window.fetch;
  window.fetch = function(input, init) {
    // Convert input to string if it's a Request object
    const url = typeof input === 'string' ? input : input.url;
    
    if (url === '/api/employees') {
      console.log('Intercepting fetch to /api/employees, returning mock data');
      return Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve(MOCK_EMPLOYEES),
        headers: new Headers({
          'content-type': 'application/json'
        })
      } as Response);
    }
    
    // Otherwise use the original fetch
    return originalFetch.apply(this, [input, init]);
  };
  
  console.log('Mock employee API endpoint setup complete');
};
