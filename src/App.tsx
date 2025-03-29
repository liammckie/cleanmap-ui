
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { Toaster } from '@/components/ui/toaster'
import MainLayout from '@/components/Layout/MainLayout'
import { Routes, Route } from 'react-router-dom'

// Page imports
import Dashboard from '@/pages/Dashboard'
import Locations from '@/pages/Locations'
import Employees from '@/pages/hr/Employees'
import Clients from '@/pages/operations/Clients'
import CreateClient from '@/pages/operations/CreateClient'
import Sites from '@/pages/operations/Sites'
import SiteList from '@/pages/operations/SiteList'
import CreateSite from '@/pages/operations/CreateSite'
import SiteDetails from '@/pages/operations/SiteDetails'
import Contracts from '@/pages/operations/Contracts'
import CreateContract from '@/pages/operations/CreateContract'
import ContractDetails from '@/pages/operations/ContractDetails'
import WorkOrders from '@/pages/operations/WorkOrders'
import Leads from '@/pages/sales/Leads'
import Quotes from '@/pages/sales/Quotes'
import Reports from '@/pages/Reports'
import NotFound from '@/pages/NotFound'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          
          {/* Locations */}
          <Route path="locations" element={<Locations />} />
          
          {/* HR Routes */}
          <Route path="hr/employees" element={<Employees />} />
          
          {/* Operations Routes */}
          <Route path="operations/clients" element={<Clients />} />
          <Route path="operations/clients/create" element={<CreateClient />} />
          <Route path="operations/sites" element={<Sites />} />
          <Route path="operations/sites/create" element={<CreateSite />} />
          <Route path="operations/sites/:siteId" element={<SiteDetails />} />
          <Route path="operations/contracts" element={<Contracts />} />
          <Route path="operations/contracts/create" element={<CreateContract />} />
          <Route path="operations/contracts/:id" element={<ContractDetails />} />
          <Route path="operations/work-orders" element={<WorkOrders />} />
          
          {/* Sales Routes */}
          <Route path="sales/leads" element={<Leads />} />
          <Route path="sales/quotes" element={<Quotes />} />
          
          {/* Reports */}
          <Route path="reports" element={<Reports />} />
          
          {/* Not Found */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App
