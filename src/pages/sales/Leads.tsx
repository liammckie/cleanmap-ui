
import React from 'react';
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";

const LeadsPage = () => {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Sales Pipeline</h1>
        <Button>New Lead</Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Leads & Opportunities</CardTitle>
          <CardDescription>
            Manage your sales pipeline and track potential clients through the sales process.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            This page will display a Kanban board or table view of leads by stage.
            You will be able to drag and drop leads between stages (Discovery, Proposal, Negotiation, etc.)
            and filter by various criteria.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default LeadsPage;
