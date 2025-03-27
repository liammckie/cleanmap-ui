
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { useQuery } from '@tanstack/react-query';
import { fetchQuotes } from '@/services/sales';

const QuotesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data: quotes, isLoading, error } = useQuery({
    queryKey: ['quotes', searchTerm],
    queryFn: () => fetchQuotes(searchTerm),
  });

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Quotes</h1>
        <Button>New Quote</Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Service Quotations</CardTitle>
          <CardDescription>
            Create and manage price quotes for prospects and existing clients.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading quotes data...</p>
          ) : error ? (
            <p className="text-sm text-red-500">Error loading quotes: {(error as Error).message}</p>
          ) : quotes && quotes.length > 0 ? (
            <div className="text-sm">
              <p className="font-medium">Found {quotes.length} quotes in the system</p>
              <p className="text-muted-foreground">
                This page will display a list of quotes with their status (Draft, Sent, Accepted, Rejected).
                You will be able to create new quotes with line items, send them to clients,
                and convert accepted quotes to contracts or work orders.
              </p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No quotes found. Create your first quote to start tracking client proposals.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default QuotesPage;
