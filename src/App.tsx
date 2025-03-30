
import { SentryErrorBoundary } from "@/components/common/SentryErrorBoundary";
import { Routes, Route } from 'react-router-dom';

import Index from './pages/Index';
import Dashboard from './pages/Dashboard';
import Reports from './pages/Reports';
import Locations from './pages/Locations';
import Employees from '@/pages/hr/Employees';
import Clients from '@/pages/operations/Clients';
import Sites from '@/pages/operations/Sites';
import SiteDetails from '@/pages/operations/SiteDetails';
import SiteList from '@/pages/operations/SiteList';
import CreateSite from '@/pages/operations/CreateSite';
import WorkOrders from '@/pages/operations/WorkOrders';
import Contracts from '@/pages/operations/Contracts';

function App() {
  return (
    <SentryErrorBoundary>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/locations" element={<Locations />} />
        <Route path="/employees" element={<Employees />} />
        <Route path="/clients" element={<Clients />} />
        <Route path="/sites" element={<Sites />} />
        <Route path="/sites/:id" element={<SiteDetails />} />
        <Route path="/site-list" element={<SiteList />} />
        <Route path="/create-site" element={<CreateSite />} />
        <Route path="/work-orders" element={<WorkOrders />} />
        <Route path="/contracts" element={<Contracts />} />
      </Routes>
    </SentryErrorBoundary>
  );
}

export default App;
