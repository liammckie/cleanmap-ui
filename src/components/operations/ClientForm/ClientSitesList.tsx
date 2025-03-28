
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import ClientSiteForm from './ClientSiteForm';

interface ClientSitesListProps {
  form: UseFormReturn<any>;
}

const ClientSitesList: React.FC<ClientSitesListProps> = ({ form }) => {
  const sites = form.watch('sites') || [];

  const addSite = () => {
    const currentSites = form.getValues('sites') || [];
    form.setValue('sites', [
      ...currentSites,
      {
        site_name: '',
        site_type: '',
        address_street: '',
        address_city: '',
        address_state: '',
        address_postcode: '',
        region: '',
        service_start_date: null,
        price_per_service: 0,
        price_frequency: 'monthly',
        special_instructions: ''
      }
    ]);
  };

  const removeSite = (index: number) => {
    const currentSites = form.getValues('sites');
    // Don't allow removing the last site
    if (currentSites.length <= 1) {
      return;
    }
    
    const updatedSites = [...currentSites];
    updatedSites.splice(index, 1);
    form.setValue('sites', updatedSites);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Sites</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addSite}
          className="flex items-center gap-1"
        >
          <PlusCircle className="h-4 w-4" />
          Add Site
        </Button>
      </div>

      <div className="space-y-6">
        {sites.map((_, index) => (
          <ClientSiteForm
            key={index}
            form={form}
            index={index}
            onRemove={() => removeSite(index)}
          />
        ))}
      </div>

      {sites.length === 0 && (
        <div className="text-center py-6 border rounded-md bg-muted/20">
          <p className="text-muted-foreground">No sites added yet.</p>
          <Button
            type="button"
            variant="outline"
            className="mt-2"
            onClick={addSite}
          >
            Add Site
          </Button>
        </div>
      )}
    </div>
  );
};

export default ClientSitesList;
