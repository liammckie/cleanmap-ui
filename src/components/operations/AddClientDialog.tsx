import React, { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { createClient } from '@/services/clientService';

interface AddClientDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onClientCreated?: () => void;
}

const AddClientDialog: React.FC<AddClientDialogProps> = ({ open, setOpen, onClientCreated }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postcode, setPostcode] = useState('');
  const [paymentTerms, setPaymentTerms] = useState('');
  const [industry, setIndustry] = useState('');
  const [status, setStatus] = useState('Active');
  const [businessNumber, setBusinessNumber] = useState('');
  const [region, setRegion] = useState('');
  const [notes, setNotes] = useState('');
  const [onHoldReason, setOnHoldReason] = useState('');

  const resetForm = () => {
    setCompanyName('');
    setContactName('');
    setContactEmail('');
    setContactPhone('');
    setStreet('');
    setCity('');
    setState('');
    setPostcode('');
    setPaymentTerms('');
    setIndustry('');
    setStatus('Active');
    setBusinessNumber('');
    setRegion('');
    setNotes('');
    setOnHoldReason('');
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  try {
    setLoading(true);
    
    // Validate form data
    const formData = {
      company_name: companyName,
      contact_name: contactName,
      contact_email: contactEmail,
      contact_phone: contactPhone,
      billing_address_street: street,
      billing_address_city: city,
      billing_address_state: state,
      billing_address_postcode: postcode,
      billing_address_country: 'Australia', // Default
      payment_terms: paymentTerms,
      industry: industry,
      status: status as 'Active' | 'On Hold',
      business_number: businessNumber,
      region: region,
      notes: notes,
      on_hold_reason: status === 'On Hold' ? onHoldReason : null,
      // Add default null values for GPS coordinates
      latitude: null,
      longitude: null
    };
    
    // Create client in database
    await createClient(formData);
    
    // Show success toast
    toast({
      title: "Success",
      description: "Client has been created successfully.",
    });
    
    // Close dialog and reset form
    setOpen(false);
    resetForm();
    
    // Refresh client list if a callback was provided
    if (onClientCreated) {
      onClientCreated();
    }
  } catch (error) {
    console.error('Error creating client:', error);
    toast({
      variant: "destructive",
      title: "Error",
      description: "Failed to create client. Please try again.",
    });
  } finally {
    setLoading(false);
  }
};

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button>Add Client</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Add New Client</AlertDialogTitle>
          <AlertDialogDescription>
            Enter the details for the new client.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="companyName" className="text-right">
              Company Name
            </Label>
            <Input
              type="text"
              id="companyName"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="contactName" className="text-right">
              Contact Name
            </Label>
            <Input
              type="text"
              id="contactName"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="contactEmail" className="text-right">
              Contact Email
            </Label>
            <Input
              type="email"
              id="contactEmail"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="contactPhone" className="text-right">
              Contact Phone
            </Label>
            <Input
              type="tel"
              id="contactPhone"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="street" className="text-right">
              Street Address
            </Label>
            <Input
              type="text"
              id="street"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="city" className="text-right">
              City
            </Label>
            <Input
              type="text"
              id="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="state" className="text-right">
              State
            </Label>
            <Input
              type="text"
              id="state"
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="postcode" className="text-right">
              Postcode
            </Label>
            <Input
              type="text"
              id="postcode"
              value={postcode}
              onChange={(e) => setPostcode(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="paymentTerms" className="text-right">
              Payment Terms
            </Label>
            <Input
              type="text"
              id="paymentTerms"
              value={paymentTerms}
              onChange={(e) => setPaymentTerms(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="industry" className="text-right">
              Industry
            </Label>
            <Input
              type="text"
              id="industry"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">
              Status
            </Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="On Hold">On Hold</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {status === 'On Hold' && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="onHoldReason" className="text-right">
                On Hold Reason
              </Label>
              <Input
                type="text"
                id="onHoldReason"
                value={onHoldReason}
                onChange={(e) => setOnHoldReason(e.target.value)}
                className="col-span-3"
              />
            </div>
          )}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="businessNumber" className="text-right">
              Business Number
            </Label>
            <Input
              type="text"
              id="businessNumber"
              value={businessNumber}
              onChange={(e) => setBusinessNumber(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="region" className="text-right">
              Region
            </Label>
            <Input
              type="text"
              id="region"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="notes" className="text-right mt-2">
              Notes
            </Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="col-span-3"
            />
          </div>
        </form>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction disabled={loading}>
            {loading ? 'Creating...' : 'Create'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AddClientDialog;
