
import React, { useEffect, useState } from 'react';
import { DOCUMENTATION_PATHS } from '@/utils/documentationManager';
import { readFromStorage } from '@/utils/localStorageManager';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from '@/hooks/use-toast';

export function DocumentationDashboard() {
  const [activeTab, setActiveTab] = useState('errors');
  const [errorLog, setErrorLog] = useState<string>('');
  const [typeInconsistencies, setTypeInconsistencies] = useState<string>('');
  const [buildErrors, setBuildErrors] = useState<string>('');
  const [schemaChangelog, setSchemaChangelog] = useState<string>('');
  const [activeErrors, setActiveErrors] = useState<Array<{title: string, status: string}>>([]);
  const [resolvedErrors, setResolvedErrors] = useState<Array<{title: string, date: string}>>([]);
  
  // Load documentation from localStorage
  useEffect(() => {
    const errorLogContent = readFromStorage(DOCUMENTATION_PATHS.ERROR_LOG) || '';
    const typeContent = readFromStorage(DOCUMENTATION_PATHS.TYPE_INCONSISTENCIES) || '';
    const buildContent = readFromStorage(DOCUMENTATION_PATHS.BUILD_ERROR_RESOLUTION) || '';
    const schemaContent = readFromStorage(DOCUMENTATION_PATHS.SCHEMA_CHANGELOG) || '';
    
    setErrorLog(errorLogContent);
    setTypeInconsistencies(typeContent);
    setBuildErrors(buildContent);
    setSchemaChangelog(schemaContent);
    
    // Parse active errors
    const activeMatches = errorLogContent.matchAll(/### (.+?)\n\n\*\*Status:\*\* (Investigating|In Progress)/g);
    const active = Array.from(activeMatches).map(match => ({
      title: match[1],
      status: match[2]
    }));
    setActiveErrors(active);
    
    // Parse resolved errors
    const resolvedMatches = errorLogContent.matchAll(/### (.+?)\n\n\*\*Status:\*\* Resolved[\s\S]+?\*\*Resolved On:\*\* (.+?)\n/g);
    const resolved = Array.from(resolvedMatches).map(match => ({
      title: match[1],
      date: match[2]
    }));
    setResolvedErrors(resolved);
  }, []);
  
  // Force reload documentation
  const reloadDocumentation = () => {
    window.location.reload();
    toast({
      title: "Reloading Documentation",
      description: "Refreshing all documentation data...",
    });
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Documentation Dashboard</h1>
        <Button onClick={reloadDocumentation}>Reload Documentation</Button>
      </div>
      
      <Tabs defaultValue="errors" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="errors">
            Error Log
            {activeErrors.length > 0 && (
              <Badge className="ml-2 bg-red-500" variant="secondary">
                {activeErrors.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="types">Type Inconsistencies</TabsTrigger>
          <TabsTrigger value="build">Build Error Resolution</TabsTrigger>
          <TabsTrigger value="schema">Schema Changelog</TabsTrigger>
        </TabsList>
        
        <TabsContent value="errors">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Active Issues</CardTitle>
              </CardHeader>
              <CardContent>
                {activeErrors.length === 0 ? (
                  <p className="text-muted-foreground">No active issues 🎉</p>
                ) : (
                  <ul className="space-y-2">
                    {activeErrors.map((error, index) => (
                      <li key={index} className="flex items-center justify-between">
                        <span>{error.title}</span>
                        <Badge 
                          variant="outline"
                          className={
                            error.status === 'Investigating' 
                              ? 'bg-yellow-100 text-yellow-800' 
                              : 'bg-blue-100 text-blue-800'
                          }
                        >
                          {error.status}
                        </Badge>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
            
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Recently Resolved</CardTitle>
              </CardHeader>
              <CardContent>
                {resolvedErrors.length === 0 ? (
                  <p className="text-muted-foreground">No resolved issues yet</p>
                ) : (
                  <ul className="space-y-2">
                    {resolvedErrors.slice(0, 5).map((error, index) => (
                      <li key={index} className="flex items-center justify-between">
                        <span>{error.title}</span>
                        <Badge variant="outline" className="bg-green-100 text-green-800">
                          {error.date}
                        </Badge>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
            
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Documentation Status</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center justify-between">
                    <span>Error Log</span>
                    <Badge variant="outline" className="bg-green-100 text-green-800">
                      {errorLog ? 'Available' : 'Missing'}
                    </Badge>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>Type Inconsistencies</span>
                    <Badge variant="outline" className="bg-green-100 text-green-800">
                      {typeInconsistencies ? 'Available' : 'Missing'}
                    </Badge>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>Build Error Resolution</span>
                    <Badge variant="outline" className="bg-green-100 text-green-800">
                      {buildErrors ? 'Available' : 'Missing'}
                    </Badge>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>Schema Changelog</span>
                    <Badge variant="outline" className="bg-green-100 text-green-800">
                      {schemaChangelog ? 'Available' : 'Missing'}
                    </Badge>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
          
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Full Error Log</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                <pre className="text-sm whitespace-pre-wrap">{errorLog}</pre>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="types">
          <Card>
            <CardHeader>
              <CardTitle>Type Inconsistencies Documentation</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px] w-full rounded-md border p-4">
                <pre className="text-sm whitespace-pre-wrap">{typeInconsistencies}</pre>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="build">
          <Card>
            <CardHeader>
              <CardTitle>Build Error Resolution Guide</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px] w-full rounded-md border p-4">
                <pre className="text-sm whitespace-pre-wrap">{buildErrors}</pre>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="schema">
          <Card>
            <CardHeader>
              <CardTitle>Schema Changelog</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px] w-full rounded-md border p-4">
                <pre className="text-sm whitespace-pre-wrap">{schemaChangelog}</pre>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
