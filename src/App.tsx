
import { Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Index from './pages/Index'
import Dashboard from './pages/Dashboard'
import Reports from './pages/Reports'
import Locations from './pages/Locations'
import Employees from '@/pages/hr/Employees'
import Clients from '@/pages/operations/Clients'
import Sites from '@/pages/operations/Sites'
import SiteDetails from '@/pages/operations/SiteDetails'
import SiteList from '@/pages/operations/SiteList'
import CreateSite from '@/pages/operations/CreateSite'
import WorkOrders from '@/pages/operations/WorkOrders'
import Contracts from '@/pages/operations/Contracts'
import ContractDetails from '@/pages/operations/ContractDetails'
import CreateContract from '@/pages/operations/CreateContract'
import Leads from '@/pages/sales/Leads'
import Quotes from '@/pages/sales/Quotes'
import NotFound from './pages/NotFound'
import CreateClient from '@/pages/operations/CreateClient'
import { Toaster } from '@/components/ui/toaster'

import Documentation from './pages/Documentation';

// Create a client
const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="app">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/locations" element={<Locations />} />
          <Route path="/documentation" element={<Documentation />} />
          
          <Route path="/hr">
            <Route path="employees" element={<Employees />} />
          </Route>
          
          <Route path="/operations">
            <Route path="clients" element={<Clients />} />
            <Route path="create-client" element={<CreateClient />} />
            <Route path="sites" element={<Sites />} />
            <Route path="sites/:siteId" element={<SiteDetails />} />
            <Route path="site-list" element={<SiteList />} />
            <Route path="create-site" element={<CreateSite />} />
            <Route path="work-orders" element={<WorkOrders />} />
            <Route path="contracts" element={<Contracts />} />
            <Route path="contracts/:id" element={<ContractDetails />} />
            <Route path="create-contract" element={<CreateContract />} />
          </Route>
          
          <Route path="/sales">
            <Route path="leads" element={<Leads />} />
            <Route path="quotes" element={<Quotes />} />
          </Route>
          
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </div>
    </QueryClientProvider>
  );
}

export default App
