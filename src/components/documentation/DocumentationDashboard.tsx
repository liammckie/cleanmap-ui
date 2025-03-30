
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DocumentationStructureView } from "./DocumentationStructureView";
import { DocumentationNode } from "@/utils/documentationManager";

// Sample project structure for demo purposes
const sampleStructure: DocumentationNode[] = [
  {
    name: 'src',
    type: 'directory',
    children: [
      {
        name: 'components',
        type: 'directory',
        children: [
          { name: 'ui', type: 'directory', children: [
            { name: 'button.tsx', type: 'file', isComponent: true },
            { name: 'card.tsx', type: 'file', isComponent: true },
            { name: 'toast.tsx', type: 'file', isComponent: true },
          ]},
          { name: 'layout', type: 'directory', children: [
            { name: 'Header.tsx', type: 'file', isComponent: true },
            { name: 'Sidebar.tsx', type: 'file', isComponent: true },
            { name: 'Footer.tsx', type: 'file', isComponent: true },
          ]},
          { name: 'common', type: 'directory', children: [
            { name: 'DataTable.tsx', type: 'file', isComponent: true },
            { name: 'SearchBar.tsx', type: 'file', isComponent: true },
          ]}
        ]
      },
      {
        name: 'hooks',
        type: 'directory',
        children: [
          { name: 'useAuth.tsx', type: 'file', isHook: true },
          { name: 'useForm.ts', type: 'file', isHook: true },
          { name: 'useQuery.ts', type: 'file', isHook: true },
        ]
      },
      {
        name: 'services',
        type: 'directory',
        children: [
          { name: 'api.ts', type: 'file' },
          { name: 'storage.ts', type: 'file' },
        ]
      },
      { name: 'App.tsx', type: 'file', isComponent: true },
      { name: 'main.tsx', type: 'file' },
    ]
  }
];

export function DocumentationDashboard() {
  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Documentation Overview</CardTitle>
          <CardDescription>
            Key documentation and resources for the application
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="structure">
            <TabsList className="mb-4">
              <TabsTrigger value="structure">Project Structure</TabsTrigger>
              <TabsTrigger value="components">Components</TabsTrigger>
              <TabsTrigger value="guides">Guides</TabsTrigger>
            </TabsList>
            
            <TabsContent value="structure">
              <DocumentationStructureView structure={sampleStructure} />
            </TabsContent>
            
            <TabsContent value="components">
              <div className="grid gap-4">
                <div className="border p-4 rounded-md">
                  <h3 className="font-medium mb-2">UI Components</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Reusable UI components using shadcn/ui
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    <div className="border rounded p-2 text-sm">Button</div>
                    <div className="border rounded p-2 text-sm">Card</div>
                    <div className="border rounded p-2 text-sm">Tabs</div>
                    <div className="border rounded p-2 text-sm">Dialog</div>
                    <div className="border rounded p-2 text-sm">Toast</div>
                    <div className="border rounded p-2 text-sm">Form</div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="guides">
              <div className="space-y-4">
                <div className="border p-4 rounded-md">
                  <h3 className="font-medium mb-2">Getting Started</h3>
                  <p className="text-sm text-muted-foreground">
                    Introduction to the application architecture and setup
                  </p>
                </div>
                <div className="border p-4 rounded-md">
                  <h3 className="font-medium mb-2">Error Handling Guide</h3>
                  <p className="text-sm text-muted-foreground">
                    Best practices for handling and documenting errors
                  </p>
                </div>
                <div className="border p-4 rounded-md">
                  <h3 className="font-medium mb-2">API Integration</h3>
                  <p className="text-sm text-muted-foreground">
                    How to work with the API services
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
