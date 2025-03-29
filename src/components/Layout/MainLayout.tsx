import { useState, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { useIsMobile } from '@/hooks/use-mobile'
import { Toaster } from '@/components/ui/toaster'
import { cn } from '@/lib/utils'
import Header from './Header'
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
} from '@/components/ui/sidebar'
import {
  Activity,
  Map,
  Users,
  Calendar,
  Files,
  Clipboard,
  BarChart3,
  Settings,
  UserCog,
} from 'lucide-react'

const MainLayout = () => {
  const isMobile = useIsMobile()
  const [pageTitle, setPageTitle] = useState('Dashboard')
  const location = useLocation()

  useEffect(() => {
    // Update page title based on current route
    const path = location.pathname
    if (path === '/') setPageTitle('Dashboard')
    else if (path.includes('/clients')) setPageTitle('Clients')
    else if (path.includes('/locations')) setPageTitle('Locations')
    else if (path.includes('/schedule')) setPageTitle('Schedule')
    else if (path.includes('/contracts')) setPageTitle('Contracts')
    else if (path.includes('/reports')) setPageTitle('Reports')
    else if (path.includes('/documents')) setPageTitle('Documents')
    else if (path.includes('/settings')) setPageTitle('Settings')
    else if (path.includes('/hr')) setPageTitle('HR')
    else setPageTitle('Dashboard')
  }, [location])

  // Menu items configuration
  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: Activity, path: '/' },
    { id: 'clients', name: 'Clients', icon: Users, path: '/operations/clients' },
    { id: 'locations', name: 'Locations', icon: Map, path: '/locations' },
    { id: 'hr', name: 'HR', icon: UserCog, path: '/hr/employees' },
    { id: 'schedule', name: 'Schedule', icon: Calendar, path: '/schedule' },
    { id: 'contracts', name: 'Contracts', icon: Clipboard, path: '/operations/contracts' },
    { id: 'reports', name: 'Reports', icon: BarChart3, path: '/reports' },
    { id: 'documents', name: 'Documents', icon: Files, path: '/documents' },
    { id: 'settings', name: 'Settings', icon: Settings, path: '/settings' },
  ]

  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="flex min-h-screen w-full bg-gray-50 dark:bg-gray-900">
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center gap-2 p-2">
              <div className="flex h-8 w-8 items-center justify-center rounded bg-brand-blue text-white font-bold">
                CE
              </div>
              <span className="text-lg font-semibold">CleanERP</span>
            </div>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarMenu>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.name}
                      isActive={
                        location.pathname === item.path ||
                        (item.path !== '/' && location.pathname.includes(item.path))
                      }
                    >
                      <a href={item.path}>
                        <item.icon />
                        <span>{item.name}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter>
            <div className="flex items-center gap-3 px-2 py-2">
              <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700"></div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">Admin User</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  admin@cleanerp.com
                </p>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>

        <div className="flex-1 flex flex-col">
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
    </SidebarProvider>
  )
}

export default MainLayout
