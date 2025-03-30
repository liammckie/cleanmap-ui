
import React, { useEffect } from 'react';
import { DocumentationDashboard } from '@/components/documentation/DocumentationDashboard';
import MainLayout from '@/components/Layout/MainLayout';
import { setupAutomatedDocumentation } from '@/services/documentation/documentationService';
import { toast } from '@/hooks/use-toast';

export default function Documentation() {
  useEffect(() => {
    // Set up automated documentation
    setupAutomatedDocumentation();
    
    // Show toast notification
    toast({
      title: "Documentation System Active",
      description: "The automated documentation system is running in the background.",
    });
  }, []);
  
  return (
    <MainLayout>
      <DocumentationDashboard />
    </MainLayout>
  );
}
