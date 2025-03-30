
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { 
  getMostCommonErrors, 
  getMostErrorProneFiles, 
  getErrorTrendData,
  runAllTests
} from '@/utils/errorAnalytics';
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

export function ErrorAnalytics() {
  const [commonErrors, setCommonErrors] = useState<Array<{pattern: string; count: number}>>([]);
  const [errorProneFiles, setErrorProneFiles] = useState<Array<{filePath: string; errorCount: number}>>([]);
  const [trendData, setTrendData] = useState<Array<{date: string; count: number}>>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Load error analytics data
    setCommonErrors(getMostCommonErrors());
    setErrorProneFiles(getMostErrorProneFiles());
    setTrendData(getErrorTrendData());
    setLoading(false);
  }, []);
  
  const handleRunTests = () => {
    runAllTests();
    
    // Refresh the analytics data
    setCommonErrors(getMostCommonErrors());
    setErrorProneFiles(getMostErrorProneFiles());
    setTrendData(getErrorTrendData());
  };
  
  if (loading) {
    return <div className="flex justify-center p-4">Loading error analytics...</div>;
  }
  
  // If no error data is available
  if (commonErrors.length === 0 && errorProneFiles.length === 0) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>No Error Data Available</AlertTitle>
        <AlertDescription>
          No build errors have been captured yet. Run tests to simulate error data for analysis.
        </AlertDescription>
      </Alert>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Most Common Errors */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Most Common Error Types</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {commonErrors.slice(0, 5).map((error, index) => (
              <div key={index} className="flex justify-between items-center">
                <div className="text-sm font-medium">{error.pattern}</div>
                <Badge variant="outline">{error.count}</Badge>
              </div>
            ))}
            {commonErrors.length === 0 && (
              <div className="text-sm text-muted-foreground">No common errors detected</div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Error-Prone Files */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Most Error-Prone Files</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {errorProneFiles.slice(0, 5).map((file, index) => (
              <div key={index} className="flex justify-between items-center">
                <div className="text-sm font-medium truncate max-w-[250px]" title={file.filePath}>
                  {file.filePath.split('/').pop()}
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-sm text-muted-foreground">{file.filePath}</div>
                  <Badge variant="outline">{file.errorCount}</Badge>
                </div>
              </div>
            ))}
            {errorProneFiles.length === 0 && (
              <div className="text-sm text-muted-foreground">No error-prone files detected</div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Error Trend Chart */}
      {trendData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Error Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8884d8" name="Errors" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
