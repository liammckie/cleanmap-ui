
import { SentryErrorBoundary } from "@/components/common/SentryErrorBoundary";
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import PublicRoute from '@/components/auth/PublicRoute';

// Public pages
import LandingPage from './pages/LandingPage';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Protected pages
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
import MainLayout from "@/components/Layout/MainLayout";

function App() {
  return (
    <SentryErrorBoundary>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route element={<PublicRoute />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
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
            </Route>
          </Route>

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </SentryErrorBoundary>
  );
}

export default App;
