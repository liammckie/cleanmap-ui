
import React from 'react'
import { format } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { cn } from '@/lib/utils'

interface EndOfEmploymentSectionProps {
  endDate: Date | null
  endReason: string | null
  terminationReasons: string[]
  onEndDateChange: (date: Date | undefined) => void
  onEndReasonChange: (reason: string) => void
  isEditable: boolean
}

const EndOfEmploymentSection: React.FC<EndOfEmploymentSectionProps> = ({
  endDate,
  endReason,
  terminationReasons,
  onEndDateChange,
  onEndReasonChange,
  isEditable,
}) => {
  const [open, setOpen] = React.useState(false)

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">End of Employment</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="end_of_employment_date">End Date</Label>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                id="end_of_employment_date"
                variant={'outline'}
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !endDate && 'text-muted-foreground'
                )}
                disabled={!isEditable}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? format(endDate, 'PPP') : <span>Select date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={endDate || undefined}
                onSelect={(date) => {
                  onEndDateChange(date)
                  setOpen(false)
                }}
                disabled={(date) => date > new Date()}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label htmlFor="end_of_employment_reason">Reason</Label>
          <Select 
            value={endReason || ''} 
            onValueChange={onEndReasonChange}
            disabled={!isEditable}
          >
            <SelectTrigger id="end_of_employment_reason">
              <SelectValue placeholder="Select reason" />
            </SelectTrigger>
            <SelectContent>
              {terminationReasons.map((reason) => (
                <SelectItem key={reason} value={reason}>
                  {reason}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}

export default EndOfEmploymentSection
