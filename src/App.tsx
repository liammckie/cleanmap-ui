import { Routes, Route } from 'react-router-dom'
import Index from './pages/Index'
import Dashboard from './pages/Dashboard'
import Reports from './pages/Reports'
import Locations from './pages/Locations'
import Employees from './pages/Employees'
import Clients from './pages/Clients'
import Sites from './pages/Sites'
import SiteDetails from './pages/SiteDetails'
import SiteList from './pages/SiteList'
import CreateSite from './pages/CreateSite'
import WorkOrders from './pages/WorkOrders'
import Contracts from './pages/Contracts'
import ContractDetails from './pages/ContractDetails'
import CreateContract from './pages/CreateContract'
import Leads from './pages/Leads'
import Quotes from './pages/Quotes'
import NotFound from './pages/NotFound'
import CreateClient from './pages/CreateClient'
import { Toaster } from '@/components/ui/toaster'

import Documentation from './pages/Documentation';

function App() {
  return (
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
  );
}

export default App
