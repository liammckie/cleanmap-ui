
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getMostCommonErrors, getMostErrorProneFiles, getErrorTrendData } from '@/utils/errorAnalytics';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function ErrorAnalytics() {
  const commonErrors = getMostCommonErrors();
  const errorProneFiles = getMostErrorProneFiles();
  const trendData = getErrorTrendData();
  
  return (
    <Tabs defaultValue="trends" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="trends">Error Trends</TabsTrigger>
        <TabsTrigger value="files">Error-Prone Files</TabsTrigger>
        <TabsTrigger value="patterns">Common Patterns</TabsTrigger>
      </TabsList>
      
      <TabsContent value="trends">
        <Card>
          <CardHeader>
            <CardTitle>Error Trends Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            {trendData.length > 0 ? (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-center py-10 text-muted-foreground">
                No error trend data available yet. Run builds to collect data.
              </p>
            )}
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="files">
        <Card>
          <CardHeader>
            <CardTitle>Most Error-Prone Files</CardTitle>
          </CardHeader>
          <CardContent>
            {errorProneFiles.length > 0 ? (
              <ul className="space-y-3">
                {errorProneFiles.slice(0, 10).map((file, index) => (
                  <li key={index} className="flex justify-between items-center border-b pb-2">
                    <span className="font-mono text-sm truncate">{file.filePath}</span>
                    <Badge variant="destructive">{file.errorCount} errors</Badge>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center py-10 text-muted-foreground">
                No error data collected yet. Run builds to collect data.
              </p>
            )}
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="patterns">
        <Card>
          <CardHeader>
            <CardTitle>Common Error Patterns</CardTitle>
          </CardHeader>
          <CardContent>
            {commonErrors.length > 0 ? (
              <ul className="space-y-3">
                {commonErrors.slice(0, 10).map((error, index) => (
                  <li key={index} className="flex justify-between items-center border-b pb-2">
                    <span>{error.pattern}</span>
                    <Badge variant="outline">{error.count} occurrences</Badge>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center py-10 text-muted-foreground">
                No error pattern data collected yet. Run builds to collect data.
              </p>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
