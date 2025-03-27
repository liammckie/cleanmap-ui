
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "@/components/Layout/MainLayout";
import Dashboard from "@/pages/Dashboard";
import Locations from "@/pages/Locations";
import EmployeesPage from "@/pages/hr/Employees";
import ClientsPage from "@/pages/operations/Clients";
import SitesPage from "@/pages/operations/Sites";
import ContractsPage from "@/pages/operations/Contracts";
import WorkOrdersPage from "@/pages/operations/WorkOrders";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

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
            <Route path="/hr/employees" element={<EmployeesPage />} />
            <Route path="/operations/clients" element={<ClientsPage />} />
            <Route path="/operations/sites" element={<SitesPage />} />
            <Route path="/operations/contracts" element={<ContractsPage />} />
            <Route path="/operations/work-orders" element={<WorkOrdersPage />} />
            {/* Add more routes as you build more pages */}
          </Route>
          {/* Pages outside the main layout (like auth pages) would go here */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
