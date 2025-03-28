import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Activity, Map, Users, Calendar, Files, 
  Clipboard, BarChart3, Settings, Menu, X,
  UserCog, Briefcase // Added HR icon and Briefcase icon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  isMobile: boolean;
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar = ({ isMobile, isOpen, toggleSidebar }: SidebarProps) => {
  const [activeItem, setActiveItem] = useState('dashboard');

  const navItems = [
    { id: 'dashboard', name: 'Dashboard', icon: Activity, path: '/' },
    { id: 'clients', name: 'Clients', icon: Users, path: '/clients' },
    { id: 'locations', name: 'Locations', icon: Map, path: '/locations' },
    { id: 'hr', name: 'HR', icon: UserCog, path: '/hr/employees' },
    { id: 'schedule', name: 'Schedule', icon: Calendar, path: '/schedule' },
    { id: 'contracts', name: 'Contracts', icon: Clipboard, path: '/contracts' },
    { id: 'reports', name: 'Reports', icon: BarChart3, path: '/reports' },
    { id: 'documents', name: 'Documents', icon: Files, path: '/documents' },
    { id: 'settings', name: 'Settings', icon: Settings, path: '/settings' },
    {
      title: "Operations",
      icon: Briefcase,
      items: [
        { title: "Clients", path: "/operations/clients" },
        { title: "Sites", path: "/operations/site-list" },
      ]
    }
  ];

  if (isMobile && !isOpen) {
    return (
      <div className="fixed top-4 left-4 z-50">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={toggleSidebar}
          className="bg-white dark:bg-gray-800 shadow-md"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>
    );
  }

  return (
    <aside 
      className={cn(
        "fixed inset-y-0 left-0 z-50 flex flex-col w-64 bg-white dark:bg-gray-900 shadow-md",
        "transition-transform duration-300 ease-in-out",
        "border-r border-gray-200 dark:border-gray-800",
        isMobile && !isOpen && "-translate-x-full",
        isMobile && isOpen && "translate-x-0"
      )}
    >
      <div className="p-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-brand-blue text-white font-bold">
            CE
          </div>
          <span className="text-lg font-semibold">CleanERP</span>
        </div>
        {isMobile && (
          <Button variant="ghost" size="icon" onClick={toggleSidebar}>
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => {
            if (item.items) {
              return (
                <li key={item.title}>
                  <div className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all">
                    <item.icon className="h-5 w-5" />
                    <span>{item.title}</span>
                  </div>
                  <ul className="space-y-1 px-4">
                    {item.items.map((subItem) => (
                      <li key={subItem.path}>
                        <NavLink
                          to={subItem.path}
                          className={({ isActive }) => cn(
                            "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all",
                            isActive 
                              ? "bg-brand-blue text-white" 
                              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                          )}
                          onClick={() => setActiveItem(subItem.path)}
                        >
                          <item.icon className="h-5 w-5" />
                          <span>{subItem.title}</span>
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </li>
              );
            } else {
              return (
                <li key={item.id}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) => cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all",
                      isActive 
                        ? "bg-brand-blue text-white" 
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    )}
                    onClick={() => setActiveItem(item.id)}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </NavLink>
                </li>
              );
            }
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700"></div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">Admin User</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">admin@cleanerp.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
