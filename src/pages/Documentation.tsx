
/**
 * Documentation Page
 */
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DocumentationDashboard } from "@/components/documentation/DocumentationDashboard";
import { DocumentationStructureView } from "@/components/documentation/DocumentationStructureView";
import { ErrorAnalytics } from "@/components/documentation/ErrorAnalytics";
import { DocumentationNode } from "@/utils/documentationManager";

// Mock structure for demo purposes - fixed with correct type literals
const mockStructure: DocumentationNode[] = [
  {
    name: 'src',
    type: 'directory',
    children: [
      {
        name: 'components',
        type: 'directory',
        children: [
          { name: 'Button.tsx', type: 'file', isComponent: true },
          { name: 'Card.tsx', type: 'file', isComponent: true }
        ]
      },
      {
        name: 'hooks',
        type: 'directory',
        children: [
          { name: 'useAuth.tsx', type: 'file', isHook: true },
          { name: 'useForm.ts', type: 'file', isHook: true }
        ]
      },
      { name: 'App.tsx', type: 'file', isComponent: true }
    ]
  }
];

export default function Documentation() {
  const [activeTab, setActiveTab] = useState('overview');
  
  return (
    <div className="container py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Documentation</h1>
        <p className="text-muted-foreground mt-2">
          Technical documentation and error analytics for the application
        </p>
      </div>
      
      <Tabs defaultValue="overview" onValueChange={setActiveTab}>
        <TabsList className="mb-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="structure">Structure</TabsTrigger>
          <TabsTrigger value="errors">Error Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <DocumentationDashboard />
        </TabsContent>
        
        <TabsContent value="structure">
          <DocumentationStructureView structure={mockStructure} />
        </TabsContent>
        
        <TabsContent value="errors">
          <Card>
            <CardHeader>
              <CardTitle>Error Analytics</CardTitle>
              <CardDescription>
                Track and analyze errors to improve application quality
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ErrorAnalytics />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
