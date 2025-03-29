
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MainLayout from '@/components/Layout/MainLayout'
import Dashboard from '@/pages/Dashboard'
import Locations from '@/pages/Locations'
import Reports from '@/pages/Reports'
import EmployeesPage from '@/pages/hr/Employees'
import ClientsPage from '@/pages/operations/Clients'
import SitesPage from '@/pages/operations/Sites'
import SiteListPage from '@/pages/operations/SiteList'
import SiteDetailsPage from '@/pages/operations/SiteDetails'
import CreateClientPage from '@/pages/operations/CreateClient'
import CreateSitePage from '@/pages/operations/CreateSite'
import ContractsPage from '@/pages/operations/Contracts'
import ContractDetailsPage from '@/pages/operations/ContractDetails'
import WorkOrdersPage from '@/pages/operations/WorkOrders'
import LeadsPage from '@/pages/sales/Leads'
import QuotesPage from '@/pages/sales/Quotes'
import NotFound from '@/pages/NotFound'

const queryClient = new QueryClient()

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/locations" element={<Locations />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/hr/employees" element={<EmployeesPage />} />
            <Route path="/operations/clients" element={<ClientsPage />} />
            <Route path="/operations/clients/create" element={<CreateClientPage />} />
            <Route path="/operations/sites" element={<SitesPage />} />
            <Route path="/operations/site-list" element={<SiteListPage />} />
            <Route path="/operations/sites/:siteId" element={<SiteDetailsPage />} />
            <Route path="/operations/sites/create" element={<CreateSitePage />} />
            <Route path="/operations/sites/edit/:siteId" element={<SiteDetailsPage />} />
            <Route path="/operations/contracts" element={<ContractsPage />} />
            <Route path="/operations/contracts/:id" element={<ContractDetailsPage />} />
            <Route path="/operations/work-orders" element={<WorkOrdersPage />} />
            <Route path="/sales/leads" element={<LeadsPage />} />
            <Route path="/sales/quotes" element={<QuotesPage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
)

export default App
