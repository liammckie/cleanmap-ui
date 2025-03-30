
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface SiteErrorStateProps {
  error: Error | null
}

const SiteErrorState: React.FC<SiteErrorStateProps> = ({ error }) => {
  const navigate = useNavigate()

  return (
    <div className="container mx-auto py-16 flex flex-col items-center justify-center max-w-md text-center">
      <AlertCircle className="h-16 w-16 text-destructive mb-4" />
      <h1 className="text-2xl font-bold mb-2">Unable to load site</h1>
      <p className="text-muted-foreground mb-6">
        {error?.message || "We couldn't find the site you're looking for. It may have been deleted or you may not have permission to view it."}
      </p>
      <div className="flex gap-4">
        <Button variant="outline" onClick={() => navigate(-1)}>
          Go Back
        </Button>
        <Button onClick={() => navigate('/operations/sites')}>
          View All Sites
        </Button>
      </div>
    </div>
  )
}

export default SiteErrorState
