
import React, { useEffect, useState } from 'react';
import { DocumentationDashboard } from '@/components/documentation/DocumentationDashboard';
import MainLayout from '@/components/Layout/MainLayout';
import { setupAutomatedDocumentation } from '@/services/documentation/documentationService';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { simulateBuildErrorCapture } from '@/utils/buildErrorCapture';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Check } from 'lucide-react';

export default function Documentation() {
  const [isTestingErrors, setIsTestingErrors] = useState(false);
  
  useEffect(() => {
    // Set up automated documentation
    setupAutomatedDocumentation();
    
    // Show toast notification
    toast({
      title: "Documentation System Active",
      description: "The automated documentation system is running in the background.",
    });
  }, []);
  
  const handleTestErrorCapture = () => {
    setIsTestingErrors(true);
    
    // Simulate TypeScript build errors
    simulateBuildErrorCapture([
      'src/utils/formSchemaValidator.ts:42:5: error TS2345: Argument of type \'unknown\' is not assignable to parameter of type \'ZodTypeAny\'.',
      'src/components/operations/workOrder/WorkOrderForm.tsx:128:23: Type \'Date | undefined\' is not assignable to type \'Date\'.',
      'src/services/workOrders/workOrderService.ts:56:18: Property \'site_id\' is optional in type but required in type.',
      'src/components/hr/EmployeeForm.tsx:89:12: Cannot find name \'EmployeeFormValues\'.'
    ]);
    
    // Show success toast
    toast({
      title: "Error Capture Test",
      description: "Successfully simulated build errors. Check documentation for details.",
    });
    
    // Reset state after a delay
    setTimeout(() => {
      setIsTestingErrors(false);
    }, 3000);
  };
  
  return (
    <MainLayout>
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Documentation Center</h1>
          <Button 
            onClick={handleTestErrorCapture} 
            disabled={isTestingErrors}
            variant="outline"
          >
            {isTestingErrors ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Testing Error Capture
              </>
            ) : (
              'Test Error Capture'
            )}
          </Button>
        </div>
        
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Automatic Error Documentation</AlertTitle>
          <AlertDescription>
            The system now automatically captures and documents TypeScript errors during build and runtime.
            Use the "Test Error Capture" button to simulate build errors and see how they are documented.
          </AlertDescription>
        </Alert>
      </div>
      
      <DocumentationDashboard />
    </MainLayout>
  );
}
