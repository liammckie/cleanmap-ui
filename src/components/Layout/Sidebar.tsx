
import { 
  LayoutDashboard, 
  Users, 
  Building, 
  ClipboardCheck, 
  FileText, 
  Target, 
  Receipt, 
  UserSquare, 
  Settings,
  MapPin, 
  BarChart, 
  LogOut,
  Brush as CleaningIcon,
  FileSearch
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  text: string;
}

const SidebarLink = ({ to, icon, text }: SidebarLinkProps) => (
  <li>
    <Link
      to={to}
      className="flex items-center space-x-3 rounded-md p-2 text-gray-700 hover:bg-gray-200 hover:text-gray-900"
    >
      {icon}
      <span>{text}</span>
    </Link>
  </li>
);

interface SidebarSectionProps {
  title: string;
  children: React.ReactNode;
}

const SidebarSection = ({ title, children }: SidebarSectionProps) => (
  <div className="mt-4">
    <h3 className="px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
      {title}
    </h3>
    <ul className="mt-2 space-y-1">{children}</ul>
  </div>
);

const Sidebar = () => {
  return (
    <div className="h-screen flex flex-col bg-gray-100 border-r">
      {/* Brand/Logo */}
      <div className="p-4 border-b">
        <Link to="/" className="flex items-center space-x-2">
          <CleaningIcon className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl">CleanMap</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          <SidebarLink to="/dashboard" icon={<LayoutDashboard className="h-5 w-5" />} text="Dashboard" />
          
          {/* Operations Section */}
          <SidebarSection title="Operations">
            <SidebarLink to="/operations/clients" icon={<Users className="h-5 w-5" />} text="Clients" />
            <SidebarLink to="/operations/sites" icon={<Building className="h-5 w-5" />} text="Sites" />
            <SidebarLink to="/operations/work-orders" icon={<ClipboardCheck className="h-5 w-5" />} text="Work Orders" />
            <SidebarLink to="/operations/contracts" icon={<FileText className="h-5 w-5" />} text="Contracts" />
          </SidebarSection>
          
          {/* Sales Section */}
          <SidebarSection title="Sales">
            <SidebarLink to="/sales/leads" icon={<Target className="h-5 w-5" />} text="Leads" />
            <SidebarLink to="/sales/quotes" icon={<Receipt className="h-5 w-5" />} text="Quotes" />
          </SidebarSection>
          
          {/* HR Section */}
          <SidebarSection title="Human Resources">
            <SidebarLink to="/hr/employees" icon={<UserSquare className="h-5 w-5" />} text="Employees" />
          </SidebarSection>
          
          {/* Other Links */}
          <SidebarLink to="/locations" icon={<MapPin className="h-5 w-5" />} text="Locations" />
          <SidebarLink to="/reports" icon={<BarChart className="h-5 w-5" />} text="Reports" />
          <SidebarLink to="/documentation" icon={<FileSearch className="h-5 w-5" />} text="Documentation" />
        </ul>
      </nav>

      {/* User Section */}
      <div className="p-4 border-t">
        <button className="flex items-center space-x-2 w-full rounded hover:bg-gray-200 p-2 transition-colors">
          <Avatar>
            <AvatarImage src="/placeholder.svg" alt="User" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div className="flex-1 text-left">
            <div className="text-sm font-medium">John Doe</div>
            <div className="text-xs text-gray-500">Admin</div>
          </div>
          <LogOut className="h-4 w-4 text-gray-500" />
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
