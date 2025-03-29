
import React from 'react'
import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useSiteTesting } from '@/hooks/testing/useSiteTesting'

interface SiteTestingPanelProps {
  showTestPanel: boolean
  setShowTestPanel: (show: boolean) => void
}

const SiteTestingPanel: React.FC<SiteTestingPanelProps> = ({ 
  showTestPanel, 
  setShowTestPanel 
}) => {
  const { isRunningTests, testErrors, runFormValidationTests, testSiteRetrieval } = useSiteTesting()

  if (process.env.NODE_ENV === 'production') {
    return null
  }

  return (
    <div className="mt-8">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => setShowTestPanel(!showTestPanel)}
        className="flex items-center gap-2"
      >
        {showTestPanel ? 'Hide' : 'Show'} Testing Panel
      </Button>
      
      {showTestPanel && (
        <div className="mt-4 p-4 border rounded-md bg-muted/20">
          <h3 className="font-medium mb-2">Sites Testing Panel</h3>
          <p className="text-muted-foreground text-sm mb-4">
            Run tests to validate site functionality
          </p>
          
          <div className="flex flex-wrap gap-2">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={runFormValidationTests}
              disabled={isRunningTests}
            >
              Test Form Validation
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={testSiteRetrieval}
              disabled={isRunningTests}
            >
              Test Data Retrieval
            </Button>
          </div>
          
          {testErrors.length > 0 && (
            <div className="mt-4 p-3 bg-destructive/10 border border-destructive rounded text-sm">
              <div className="flex items-center gap-2 font-medium text-destructive mb-1">
                <AlertTriangle className="h-4 w-4" />
                Test Errors
              </div>
              <ul className="list-disc pl-5 space-y-1">
                {testErrors.map((error, i) => (
                  <li key={i}>{error}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default SiteTestingPanel
