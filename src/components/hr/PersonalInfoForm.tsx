
import React from 'react'
import { format } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'

interface PersonalInfoFormProps {
  formData: {
    first_name: string
    last_name: string
    date_of_birth: Date
    contact_phone: string
    contact_email: string
    address_street: string
    address_city: string
    address_state: string
    address_postcode: string
  }
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleDateChange: (name: string, date: Date | undefined) => void
  dobCalendarOpen: boolean
  setDobCalendarOpen: (open: boolean) => void
}

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({
  formData,
  handleInputChange,
  handleDateChange,
  dobCalendarOpen,
  setDobCalendarOpen,
}) => {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-md border-b pb-2">Personal Information</h3>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="first_name">First Name*</Label>
          <Input
            id="first_name"
            name="first_name"
            value={formData.first_name}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="last_name">Last Name*</Label>
          <Input
            id="last_name"
            name="last_name"
            value={formData.last_name}
            onChange={handleInputChange}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="date_of_birth">Date of Birth*</Label>
        <Popover open={dobCalendarOpen} onOpenChange={setDobCalendarOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-left font-normal"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {formData.date_of_birth
                ? format(formData.date_of_birth as Date, 'dd MMM yyyy')
                : 'Select Date'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={formData.date_of_birth as Date}
              onSelect={(date) => {
                handleDateChange('date_of_birth', date)
                setDobCalendarOpen(false)
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        <Label htmlFor="contact_phone">Phone Number*</Label>
        <Input
          id="contact_phone"
          name="contact_phone"
          value={formData.contact_phone}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="contact_email">Email Address*</Label>
        <Input
          id="contact_email"
          name="contact_email"
          type="email"
          value={formData.contact_email}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="address_street">Street Address*</Label>
        <Input
          id="address_street"
          name="address_street"
          value={formData.address_street}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="address_city">City*</Label>
          <Input
            id="address_city"
            name="address_city"
            value={formData.address_city}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="address_state">State*</Label>
          <Input
            id="address_state"
            name="address_state"
            value={formData.address_state}
            onChange={handleInputChange}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address_postcode">Postcode*</Label>
        <Input
          id="address_postcode"
          name="address_postcode"
          value={formData.address_postcode}
          onChange={handleInputChange}
          required
        />
      </div>
    </div>
  )
}

export default PersonalInfoForm
