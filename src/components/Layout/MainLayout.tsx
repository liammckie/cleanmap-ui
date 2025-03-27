
import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useIsMobile } from '@/hooks/use-mobile';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';

const MainLayout = () => {
  const isMobile = useIsMobile();
  const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile);
  const [pageTitle, setPageTitle] = useState('Dashboard');
  const location = useLocation();

  useEffect(() => {
    // Close sidebar on mobile when route changes
    if (isMobile) {
      setIsSidebarOpen(false);
    }
    
    // Update page title based on current route
    const path = location.pathname;
    if (path === '/') setPageTitle('Dashboard');
    else if (path.includes('/clients')) setPageTitle('Clients');
    else if (path.includes('/locations')) setPageTitle('Locations');
    else if (path.includes('/schedule')) setPageTitle('Schedule');
    else if (path.includes('/contracts')) setPageTitle('Contracts');
    else if (path.includes('/reports')) setPageTitle('Reports');
    else if (path.includes('/documents')) setPageTitle('Documents');
    else if (path.includes('/settings')) setPageTitle('Settings');
    else setPageTitle('Dashboard');
  }, [location, isMobile]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar 
        isMobile={isMobile} 
        isOpen={isSidebarOpen} 
        toggleSidebar={toggleSidebar} 
      />

      <div className={cn(
        "flex-1 flex flex-col transition-all duration-300",
        !isMobile && isSidebarOpen && "ml-64",
        !isMobile && !isSidebarOpen && "ml-0"
      )}>
        <Header title={pageTitle} />
        
        <main className="flex-1 p-4 md:p-6 animate-fade-in">
          <Outlet />
        </main>
        
        <footer className="py-4 px-6 border-t border-gray-200 dark:border-gray-800 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} CleanERP. All rights reserved.
          </p>
        </footer>
      </div>
      
      <Toaster />
    </div>
  );
};

export default MainLayout;
