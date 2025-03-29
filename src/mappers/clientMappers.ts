
import { mapToDb, mapFromDb } from '@/utils/mappers'
import type { ClientFormData } from '@/components/operations/client/types'
import type { ClientInsert } from '@/schema/operations/client.schema'

/**
 * Maps client form data to database structure
 */
export function mapClientFormToDb(formData: ClientFormData): ClientInsert {
  return {
    company_name: formData.companyName,
    contact_name: formData.contactName,
    contact_email: formData.contactEmail || null,
    contact_phone: formData.contactPhone || null,
    billing_address_street: formData.street,
    billing_address_city: formData.city,
    billing_address_state: formData.state,
    billing_address_postcode: formData.postcode,
    payment_terms: formData.paymentTerms,
    industry: formData.industry || null,
    status: formData.status as 'Active' | 'On Hold',
    business_number: formData.businessNumber || null,
    region: formData.region || null,
    notes: formData.notes || null,
    on_hold_reason: formData.status === 'On Hold' ? formData.onHoldReason : null,
  }
}

/**
 * Maps database client data to form structure
 */
export function mapDbToClientForm(dbClient: any): ClientFormData {
  return {
    companyName: dbClient.company_name,
    contactName: dbClient.contact_name,
    contactEmail: dbClient.contact_email || '',
    contactPhone: dbClient.contact_phone || '',
    street: dbClient.billing_address_street,
    city: dbClient.billing_address_city,
    state: dbClient.billing_address_state,
    postcode: dbClient.billing_address_postcode,
    paymentTerms: dbClient.payment_terms,
    industry: dbClient.industry || '',
    status: dbClient.status,
    businessNumber: dbClient.business_number || '',
    region: dbClient.region || '',
    notes: dbClient.notes || '',
    onHoldReason: dbClient.on_hold_reason || '',
  }
}
