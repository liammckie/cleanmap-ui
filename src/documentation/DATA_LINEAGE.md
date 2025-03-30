
## Reports Module Data Lineage

### Reports Data Sources

| Data Source | Origin | Type | Description |
|------------|--------|------|-------------|
| sites | Internal Operations | Primary | Source for location map data |
| work_orders | Operations Tracking | Metrics | Used for performance calculations |
| employees | HR Module | Performance | Potential source for staff allocation |
| contracts | Billing Module | Financial | Source for revenue calculations |

### Data Flow for Reports

1. **Location Map**
   - Retrieves active site information from `sites` table
   - Uses `sites.coordinates` for map marker placement
   - Joins with `clients` to show client name

2. **Performance Metrics** (Planned)
   - Aggregate data from `work_orders`
   - Calculate:
     - Completion rates
     - Average time to complete
     - Work order status distributions

3. **Financial Reports** (Planned)
   - Derive data from:
     - `contracts.monthly_value`
     - `work_orders.billing_amount`
     - Potential joins with invoice tables

### Data Transformation Notes
- Coordinates are parsed from storage format
- Locations are filtered to show only active sites
- Future implementations will require more complex aggregations

### Potential Data Enrichment
- Add geospatial analysis of site locations
- Performance scoring for employees and sites
- Predictive analytics for service demand
