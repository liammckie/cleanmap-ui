# Page Layouts Reference

This document provides detailed information about all page layouts, navigation structure, and UI components used throughout the application.

## Navigation Structure

The application is organized into several main sections:

1. **Dashboard** - Overview and summary statistics
2. **Operations** - Work orders, clients, sites management
3. **HR** - Employee management and payroll
4. **Finance** - Invoicing and financial reports
5. **Settings** - Application configuration

### Main Navigation

The primary navigation is implemented using a sidebar with:
- Section headers
- Icon + text links
- Collapsible sections
- Active state indicators

## Dashboard Page

**Route**: `/`

**Purpose**: Provide overview of key business metrics and activity

**Layout Components**:
- Stats cards (4-column grid)
- Recent work orders (table)
- Upcoming work (calendar view)
- Client activity (chart)

**Key Data Points**:
- Work orders by status
- Work orders by priority
- Revenue metrics
- Employee statistics

## Operations Pages

### Work Orders List

**Route**: `/operations/work-orders`

**Purpose**: View, filter, and manage all work orders

**Layout Components**:
- Data table with:
  - ID and title
  - Site and client
  - Status with color indicators
  - Date information
  - Priority level
  - Action buttons
- Filter controls:
  - Status filter
  - Date range picker
  - Search box
  - Client/site selector
- Action buttons:
  - Create work order
  - Export
  - Bulk actions

**Components Used**:
- DataTable with column customization
- DateRangePicker for filtering
- Status badges with color-coding
- Action dropdown menus

### Work Order Details

**Route**: `/operations/work-orders/:id`

**Purpose**: View and edit detailed work order information

**Layout Components**:
- Header with:
  - Title and ID
  - Status indicator
  - Action buttons
- Info card with:
  - Core details (dates, site, priority)
  - Description
  - Client information
- Tabs for:
  - Details
  - Activity
  - Notes
  - Attachments
- Timeline of status changes
- Completion form (when relevant)

**Components Used**:
- Tabs with content switching
- InfoCard for data display
- StatusBadge for visual status
- ActivityTimeline for history
- WorkOrderForm for editing

### Clients List

**Route**: `/operations/clients`

**Purpose**: Manage client organizations

**Layout Components**:
- Data table with:
  - Company name
  - Contact information
  - Status
  - Site count
  - Action menu
- Search and filter controls
- Quick add client button
- Status filter tabs

**Components Used**:
- ClientTable with sorting
- SearchInput for filtering
- TabFilter for status filtering
- AddClientDialog for quick creation

### Client Details

**Route**: `/operations/clients/:id`

**Purpose**: View and manage client information

**Layout Components**:
- Header with:
  - Company name
  - Status indicator
  - Action buttons
- Information cards:
  - Contact information
  - Billing details
  - Additional information
- Sites tab:
  - List of client sites
  - Map view toggle
  - Add site button
- Contracts tab:
  - Active contracts
  - Contract history
- Work orders tab:
  - Work orders for this client
  - Filtering by site

**Components Used**:
- Tabs with content switching
- InfoCards for data display
- SiteList with map integration
- ContractsList with status indicators
- ClientWorkOrdersTable

### Sites List

**Route**: `/operations/sites`

**Purpose**: View and manage service locations

**Layout Components**:
- Data table with:
  - Site name and type
  - Address
  - Client
  - Service details
  - Status
  - Actions
- Map view toggle
- Filter controls
- Add site button

**Components Used**:
- SitesTable with sorting
- MapView with location pins
- SearchInput and filters
- AddSiteDialog

### Site Details

**Route**: `/operations/sites/:id`

**Purpose**: View and manage site details

**Layout Components**:
- Header with:
  - Site name and type
  - Client name
  - Status indicator
  - Action buttons
- Information cards:
  - Location details
  - Service information
  - Special instructions
- Map location
- Work orders tab:
  - Work history
  - Scheduled work
- Assets tab (if applicable)

**Components Used**:
- InfoCards with edit capability
- MapEmbed with location pin
- SiteWorkOrdersTable
- AssetsTable (conditional)

## HR Pages

### Employees List

**Route**: `/hr/employees`

**Purpose**: Manage employee records

**Layout Components**:
- Data table with:
  - Employee name
  - Position
  - Department
  - Status
  - Start date
  - Actions
- Filter controls:
  - Department filter
  - Status filter
  - Search box
- Add employee button

**Components Used**:
- EmployeesTable with sorting
- FilterGroup for department/status
- SearchInput for filtering
- AddEmployeeDialog for creation

### Employee Details

**Route**: `/hr/employees/:id`

**Purpose**: View and manage employee information

**Layout Components**:
- Header with:
  - Employee name
  - Position
  - Status indicator
  - Action buttons
- Tabs for:
  - Personal details
  - Employment information
  - Payroll details
  - Documents
  - Performance
- Edit mode toggle
- End employment action (with confirmation)

**Components Used**:
- Tabs with content switching
- EmployeeDetailsForm with edit capability
- ConfirmDialog for sensitive actions
- DocumentsList for attachments
- PerformanceReviewTable

### Timesheets

**Route**: `/hr/timesheets`

**Purpose**: Manage employee time tracking

**Layout Components**:
- Data table with:
  - Employee name
  - Date
  - Hours
  - Work order reference
  - Status
  - Actions
- Date range filter
- Employee filter
- Approval actions
- Add timesheet button

**Components Used**:
- TimesheetsTable with sorting
- DateRangePicker for filtering
- EmployeeSelector for filtering
- AddTimesheetDialog
- BulkApprovalAction

## Form Layouts

### Work Order Form

**Purpose**: Create and edit work orders

**Layout**:
- Two-column layout for basic info
- Single column for description
- Action buttons at bottom
- Optional sections based on work type

**Sections**:
1. **Basic Info**:
   - Title input
   - Site selector
   - Category dropdown
   - Priority dropdown
   - Status selector
   - Duration estimate

2. **Scheduling**:
   - Start date picker
   - Due date picker
   - Time selection (optional)

3. **Description**:
   - Main description textarea
   - Additional notes textarea

4. **Form Actions**:
   - Cancel button
   - Submit button (context-aware text)

**Responsive Behavior**:
- Single column layout on mobile
- Fixed position actions on small screens
- Scrollable content with sticky header

### Client Form (Multi-step)

**Purpose**: Complete client creation process

**Layout**:
- Step indicator at top
- Content area for current step
- Navigation buttons at bottom

**Steps**:
1. **Client Details**:
   - Company information
   - Contact details
   - Billing address
   - Business information

2. **Sites**:
   - Add multiple sites
   - Collapsible site cards
   - Each site with multiple sections:
     - Basic details
     - Address
     - Service details
     - Pricing
     - Special instructions

3. **Review**:
   - Summary of all information
   - Client details recap
   - Sites overview
   - Final confirmation

**Components Used**:
- StepperHeader for navigation
- ClientDetailsForm for step 1
- ClientSitesList for step 2
- ReviewStep for step 3
- Wizard navigation controls

### Employee Form

**Purpose**: Add and edit employee records

**Layout**:
- Two-column layout on large screens
- Personal info in left column
- Employment details in right column
- Payroll details below
- Action buttons at bottom

**Sections**:
1. **Personal Information**:
   - Name fields
   - Date of birth
   - Contact details
   - Address information

2. **Employment Details**:
   - Employee ID
   - Job information
   - Department selector
   - Start date
   - Employment type
   - Status
   - Compensation details

3. **Payroll Details**:
   - Pay cycle
   - Tax information
   - Banking details
   - Superannuation information

**Components Used**:
- PersonalInfoForm
- EmploymentDetailsForm
- PayrollDetailsForm
- DatePickers for dates
- Select dropdowns for categorical data

## Common Layout Patterns

### Data Table Pattern

Used across the application for listing items:

**Components**:
- Table header with column titles
- Sortable columns with indicators
- Row highlighting for status
- Action menu in last column
- Pagination controls
- Items per page selector
- Row selection (when applicable)

**Implementation**:
```tsx
<Table>
  <TableHeader>
    <TableRow>
      <TableHead sortable onSort={handleSort}>ID</TableHead>
      <TableHead sortable onSort={handleSort}>Name</TableHead>
      {/* Other headers */}
      <TableHead>Actions</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {items.map(item => (
      <TableRow key={item.id} className={getRowClass(item.status)}>
        <TableCell>{item.id}</TableCell>
        <TableCell>{item.name}</TableCell>
        {/* Other cells */}
        <TableCell>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onSelect={() => onView(item.id)}>
                View
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => onEdit(item.id)}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => onDelete(item.id)}
                className="text-destructive"
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

### Card Layout Pattern

Used for displaying related information:

**Components**:
- Card with header, content, and footer
- Header with title and optional actions
- Content with structured data display
- Footer with related actions

**Implementation**:
```tsx
<Card>
  <CardHeader className="flex flex-row items-center justify-between">
    <div>
      <CardTitle>{title}</CardTitle>
      <CardDescription>{subtitle}</CardDescription>
    </div>
    <Button variant="ghost" size="sm" onClick={onAction}>
      <PencilIcon className="h-4 w-4 mr-2" />
      Edit
    </Button>
  </CardHeader>
  <CardContent>
    <div className="grid grid-cols-2 gap-4">
      <div>
        <p className="text-sm font-medium">Field Name</p>
        <p className="text-sm">{value}</p>
      </div>
      {/* Additional field pairs */}
    </div>
  </CardContent>
  <CardFooter>
    <Button variant="outline" size="sm" onClick={onSecondaryAction}>
      View Details
    </Button>
  </CardFooter>
</Card>
```

### Dialog Pattern

Used for modal interfaces:

**Components**:
- Dialog with overlay
- Header with title and description
- Content with form or information
- Footer with action buttons

**Implementation**:
```tsx
<Dialog open={open} onOpenChange={setOpen}>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent className="sm:max-w-[600px]">
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
      <DialogDescription>
        Description text explaining the purpose of this dialog.
      </DialogDescription>
    </DialogHeader>
    <div className="grid gap-4 py-4">
      {/* Dialog content here */}
    </div>
    <DialogFooter>
      <Button variant="outline" onClick={() => setOpen(false)}>
        Cancel
      </Button>
      <Button onClick={handleAction}>
        Confirm
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

## Responsive Design Patterns

The application implements responsive design with:

### 1. Mobile-First Grid Layout

- Use of grid with responsive columns
```css
.grid-layout {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1rem;
}

@media (min-width: 640px) {
  .grid-layout {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .grid-layout {
    grid-template-columns: repeat(4, 1fr);
  }
}
```

### 2. Responsive Tables

- Full table on desktop
- Card view on mobile
- Essential content prioritization

### 3. Side Panel Pattern

- Full-width sidebar on large screens
- Collapsible/modal drawer on small screens
- Toggle control for visibility

### 4. Stack/Split Pattern

- Side-by-side layout on desktop
- Stacked layout on mobile
- Preserved content hierarchy

## Color System

The application uses a consistent color system:

### Status Colors

- Success: Green (#10b981)
- Warning: Amber (#f59e0b)
- Error: Red (#ef4444)
- Info: Blue (#3b82f6)
- Neutral: Gray (#6b7280)

### Priority Colors

- Critical: Red (#ef4444)
- High: Orange (#f97316)
- Medium: Yellow (#eab308)
- Low: Blue (#3b82f6)

### Category Colors

- Routine: Green (#10b981)
- Ad-hoc: Purple (#8b5cf6)
- Audit: Blue (#3b82f6)

These colors are applied consistently across:
- Status badges
- Priority indicators
- Charts and visualizations
- Interactive elements

## Reports Page

**Route**: `/reports`

**Purpose**: Provide comprehensive analytics and insights about cleaning operations

**Layout Components**:
- Tabbed interface with three main sections:
  1. Locations Map
  2. Performance Metrics
  3. Financial Reports

### Locations Map Tab
- Interactive map showing cleaning locations
- Displays site locations with markers
- Potential future enhancements:
  - Staff allocation visualization
  - Site density indicators
  - Filtering capabilities

### Performance Tab
- Currently a placeholder for future performance charts
- Intended to show:
  - Work order completion rates
  - Service quality metrics
  - Employee performance indicators

### Financial Tab
- Currently a placeholder for future financial reporting
- Planned to include:
  - Revenue breakdown
  - Cost analysis
  - Profitability metrics

**Key Components Used**:
- Tabs component from shadcn/ui
- Card components for structured layout
- Map integration for location visualization
- Lucide icons for tab navigation

**Responsive Behavior**:
- Tabs collapse into dropdown on mobile
- Map and chart areas adjust to screen size
- Mobile-friendly navigation

**Tech Stack**:
- React hooks for state management
- React Query for potential data fetching
- Recharts library for future chart implementations

**Future Roadmap**:
- Implement actual charts in Performance tab
- Add real financial reporting data
- Enhance map with more interactive features
- Add filtering and drill-down capabilities
