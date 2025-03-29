
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface SiteErrorStateProps {
  error: Error | unknown
}

const SiteErrorState: React.FC<SiteErrorStateProps> = ({ error }) => {
  const navigate = useNavigate()

  return (
    <div className="container mx-auto py-6">
      <Button variant="ghost" className="mb-4" onClick={() => navigate(-1)}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Sites
      </Button>
      <Card className="p-6 text-center">
        <div className="flex flex-col items-center justify-center gap-2">
          <h2 className="text-xl font-bold">Error Loading Site</h2>
          <p className="text-muted-foreground">
            {error instanceof Error ? error.message : 'Failed to load site details'}
          </p>
          <Button className="mt-4" onClick={() => navigate('/operations/site-list')}>
            Return to Sites List
          </Button>
        </div>
      </Card>
    </div>
  )
}

export default SiteErrorState
