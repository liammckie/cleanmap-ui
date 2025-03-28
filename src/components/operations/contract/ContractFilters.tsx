
import React from 'react';
import { Search, FilterX } from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ContractFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  clearFilters: () => void;
}

const ContractFilters: React.FC<ContractFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  clearFilters
}) => {
  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <CardTitle>Search & Filter</CardTitle>
        <CardDescription>Find contracts by number, client, or status</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search contracts..."
              className="pl-8 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={clearFilters}
          >
            <FilterX className="h-4 w-4" />
            Clear
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContractFilters;
