
import React from 'react';
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";

const QuotesPage = () => {
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
          <p className="text-sm text-muted-foreground">
            This page will display a list of quotes with their status (Draft, Sent, Accepted, Rejected).
            You will be able to create new quotes with line items, send them to clients,
            and convert accepted quotes to contracts or work orders.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuotesPage;
