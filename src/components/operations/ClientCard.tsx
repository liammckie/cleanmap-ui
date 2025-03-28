
import { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Building2, 
  MapPin, 
  Mail, 
  Phone, 
  Tag, 
  Calendar, 
  DollarSign, 
  AlertCircle 
} from 'lucide-react';
import type { Client } from '@/schema/operations';
import { cn } from '@/lib/utils';

interface ClientCardProps {
  client: Client;
  onClick?: () => void;
}

export const ClientCard = ({ client, onClick }: ClientCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Format payment terms for display
  const paymentTerms = client.payment_terms || 'N/A';
  
  // Calculate annual value (placeholder - this would be based on actual contracts)
  const annualValue = Math.floor(Math.random() * 100000) + 10000; // Just for demo purposes
  
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'on hold':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card 
      className={cn(
        "overflow-hidden transition-all duration-300",
        isHovered ? "shadow-lg transform translate-y-[-4px]" : "shadow-sm"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <div className="relative">
        {/* Annual value bubble */}
        <div className="absolute right-4 top-4 flex items-center justify-center rounded-full bg-brand-blue text-white p-3 shadow-md font-semibold">
          <DollarSign className="h-3.5 w-3.5 mr-0.5" />
          {annualValue.toLocaleString('en-AU', { 
            style: 'currency', 
            currency: 'AUD',
            maximumFractionDigits: 0
          })}
        </div>
        
        <CardHeader>
          <div className="space-y-1">
            <CardTitle className="text-xl font-semibold flex items-center">
              <Building2 className="h-5 w-5 mr-2 text-brand-blue" />
              {client.company_name}
            </CardTitle>
            <Badge className={getStatusColor(client.status)}>
              {client.status}
            </Badge>
          </div>
          {client.industry && (
            <CardDescription className="flex items-center mt-1">
              <Tag className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
              {client.industry}
            </CardDescription>
          )}
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-3">
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <div>{client.billing_address_street}</div>
                <div className="text-muted-foreground">
                  {client.billing_address_city}, {client.billing_address_state} {client.billing_address_postcode}
                </div>
              </div>
            </div>
            
            {client.contact_email && (
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-500 flex-shrink-0" />
                <span className="text-sm truncate">{client.contact_email}</span>
              </div>
            )}
            
            {client.contact_phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-500 flex-shrink-0" />
                <span className="text-sm">{client.contact_phone}</span>
              </div>
            )}
            
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500 flex-shrink-0" />
              <span className="text-sm">Terms: {paymentTerms}</span>
            </div>
          </div>
          
          {client.on_hold_reason && (
            <div className="flex items-start mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-md">
              <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" />
              <p className="text-xs text-yellow-800">{client.on_hold_reason}</p>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="bg-gray-50 dark:bg-gray-800/50 pt-3 pb-3 px-6 border-t">
          <Button variant="ghost" className="text-brand-blue" size="sm">
            View Details
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
};
