
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const SiteLoadingSkeleton: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <div className="flex items-center mb-6">
        <Button variant="ghost" className="mr-4" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Loading site...</h1>
        </div>
      </div>
      <div className="grid gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <div className="h-full w-full bg-muted/20 animate-pulse rounded-md p-8"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default SiteLoadingSkeleton
