
/**
 * Client form data types
 */
export interface ClientFormData {
  companyName: string
  contactName: string
  contactEmail: string
  contactPhone: string
  street: string
  city: string
  state: string
  postcode: string
  paymentTerms: string
  industry: string
  status: 'Active' | 'On Hold'
  businessNumber: string
  region: string
  notes: string
  onHoldReason: string
}
