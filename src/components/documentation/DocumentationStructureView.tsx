
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { validateDocumentationPaths, suggestCorrectPath, filePathExists } from '@/utils/documentationPathValidator';
import { Button } from '@/components/ui/button';
import { Check, AlertTriangle, FileWarning, FolderTree } from 'lucide-react';

export function DocumentationStructureView() {
  const [validationReport, setValidationReport] = useState<Map<string, string[]> | null>(null);
  
  const runPathValidation = () => {
    const results = validateDocumentationPaths();
    setValidationReport(results);
  };
  
  const getStructureTree = () => {
    // This would ideally come from a build-time generation
    // For now we're using a static representation
    return [
      {
        name: 'src',
        type: 'folder',
        children: [
          {
            name: 'components',
            type: 'folder',
            children: [
              { name: 'common', type: 'folder' },
              { name: 'documentation', type: 'folder' },
              { name: 'hr', type: 'folder' },
              { name: 'layout', type: 'folder' },
              { name: 'operations', type: 'folder' },
              { name: 'ui', type: 'folder' }
            ]
          },
          {
            name: 'documentation',
            type: 'folder',
            children: [
              { name: 'DOCUMENTATION_REVIEW_PROCESS.md', type: 'file' },
              { name: 'ERROR_LOG.md', type: 'file' },
              { name: 'README.md', type: 'file' },
              { name: 'SCHEMA_CHANGELOG.md', type: 'file' },
              { name: 'architecture.md', type: 'file' },
              { name: 'conventions.md', type: 'file' },
              { 
                name: 'debugging', 
                type: 'folder',
                children: [
                  { name: 'BUILD_ERROR_RESOLUTION.md', type: 'file' },
                  { name: 'TYPE_INCONSISTENCIES.md', type: 'file' }
                ]
              }
            ]
          },
          {
            name: 'pages',
            type: 'folder',
            children: [
              { name: 'Dashboard.tsx', type: 'file' },
              { name: 'Documentation.tsx', type: 'file' },
              { name: 'Employees.tsx', type: 'file' },
              { name: 'Index.tsx', type: 'file' }
            ]
          },
          {
            name: 'schema',
            type: 'folder',
            children: [
              { 
                name: 'operations', 
                type: 'folder',
                children: [
                  { name: 'client.schema.ts', type: 'file' },
                  { name: 'contract.schema.ts', type: 'file' },
                  { name: 'site.schema.ts', type: 'file' },
                  { name: 'workOrder.schema.ts', type: 'file' }
                ]
              },
              { name: 'hr.schema.ts', type: 'file' },
              { name: 'sales.schema.ts', type: 'file' }
            ]
          },
          {
            name: 'services',
            type: 'folder',
            children: [
              { name: 'clients', type: 'folder' },
              { name: 'contracts', type: 'folder' },
              { name: 'documentation', type: 'folder' },
              { name: 'employees', type: 'folder' },
              { name: 'sites', type: 'folder' },
              { name: 'workOrders', type: 'folder' },
              { name: 'employeeService.ts', type: 'file' }
            ]
          },
          {
            name: 'utils',
            type: 'folder',
            children: [
              { name: 'documentationManager.ts', type: 'file' },
              { name: 'documentationPathValidator.ts', type: 'file' },
              { name: 'errorCapture.ts', type: 'file' },
              { name: 'formSchemaValidator.ts', type: 'file' },
              { name: 'localStorageManager.ts', type: 'file' }
            ]
          }
        ]
      }
    ];
  };
  
  const renderTree = (items: any[], depth = 0) => {
    return (
      <ul className={`pl-${depth * 4}`}>
        {items.map((item, index) => (
          <li key={index} className="py-1">
            <div className="flex items-center">
              {item.type === 'folder' ? (
                <FolderTree className="h-4 w-4 mr-2 text-blue-500" />
              ) : (
                <FileWarning className="h-4 w-4 mr-2 text-green-500" />
              )}
              <span>{item.name}</span>
              {item.type === 'file' && 
                <Badge className="ml-2" variant={filePathExists(`src/${item.name}`) ? "success" : "destructive"}>
                  {filePathExists(`src/${item.name}`) ? "Valid" : "Invalid"}
                </Badge>
              }
            </div>
            {item.children && renderTree(item.children, depth + 1)}
          </li>
        ))}
      </ul>
    );
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Documentation Structure</h2>
        <Button onClick={runPathValidation}>
          Validate File Paths
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Code Structure</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px]">
              {renderTree(getStructureTree())}
            </ScrollArea>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Path Validation Results</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px]">
              {!validationReport ? (
                <div className="text-center text-muted-foreground">
                  <p>Click "Validate File Paths" to check if all documented paths exist</p>
                </div>
              ) : validationReport.size === 0 ? (
                <div className="flex items-center justify-center p-4 text-green-600">
                  <Check className="h-6 w-6 mr-2" />
                  <span>All documented paths are valid</span>
                </div>
              ) : (
                <Accordion type="multiple" className="w-full">
                  {Array.from(validationReport.entries()).map(([docFile, paths], index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger>
                        <div className="flex items-center">
                          <AlertTriangle className="h-4 w-4 mr-2 text-amber-500" />
                          <span>{docFile.split('/').pop()}</span>
                          <Badge className="ml-2 bg-amber-100 text-amber-800" variant="outline">
                            {paths.length} invalid paths
                          </Badge>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <ul className="space-y-2">
                          {paths.map((path, idx) => (
                            <li key={idx} className="border-l-2 border-red-300 pl-3">
                              <div className="text-red-600">{path}</div>
                              {suggestCorrectPath(path) && (
                                <div className="text-sm text-green-600 mt-1">
                                  Suggested: {suggestCorrectPath(path)}
                                </div>
                              )}
                            </li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
