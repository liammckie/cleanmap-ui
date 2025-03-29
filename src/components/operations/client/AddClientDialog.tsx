
import React from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useClientDialog } from './useClientDialog'
import BusinessDetailsSection from './form-sections/BusinessDetailsSection'
import AddressSection from './form-sections/AddressSection'
import CompanyContactSection from './form-sections/CompanyContactSection'

interface AddClientDialogProps {
  onClientAdded?: () => void
}

const AddClientDialog: React.FC<AddClientDialogProps> = ({ onClientAdded }) => {
  const { 
    open, 
    setOpen, 
    loading, 
    formData, 
    handleChange, 
    handleSubmit 
  } = useClientDialog({ onClientAdded })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Quick Add Client</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Client</DialogTitle>
            <DialogDescription>
              Add a new client organization to your system. Add site details later.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-5 py-4">
            <CompanyContactSection 
              formData={formData} 
              onChange={handleChange} 
              loading={loading} 
            />
            
            <AddressSection 
              formData={formData} 
              onChange={handleChange} 
              loading={loading} 
            />
            
            <BusinessDetailsSection 
              formData={formData} 
              onChange={handleChange} 
              loading={loading} 
            />
            
            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes || ''}
                onChange={(e) => handleChange('notes', e.target.value)}
                disabled={loading}
                placeholder="Any additional notes about this client"
                className="min-h-[80px]"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Client'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default AddClientDialog
