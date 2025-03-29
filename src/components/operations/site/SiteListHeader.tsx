
import React from 'react'
import { PlusCircle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface SiteListHeaderProps {
  onRefresh: () => void
  onCreateSite: () => void
}

const SiteListHeader: React.FC<SiteListHeaderProps> = ({ onRefresh, onCreateSite }) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-3xl font-bold">Sites</h1>
        <p className="text-muted-foreground">Manage service locations</p>
      </div>
      <div className="flex gap-2">
        <Button onClick={onRefresh} variant="outline" size="icon" title="Refresh data">
          <RefreshCw className="h-4 w-4" />
        </Button>
        <Button className="flex items-center gap-2" onClick={onCreateSite}>
          <PlusCircle className="h-4 w-4" />
          New Site
        </Button>
      </div>
    </div>
  )
}

export default SiteListHeader
