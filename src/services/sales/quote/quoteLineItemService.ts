
import { supabase } from '@/integrations/supabase/client'
import { mapToDb } from '@/utils/mappers'

/**
 * Create a new quote line item
 */
export async function createQuoteLineItem(data: {
  quote_id: string
  description: string
  quantity: number
  unit_price: number
}) {
  try {
    // Calculate amount based on quantity and unit price
    const amount = data.quantity * data.unit_price

    const { data: lineItem, error } = await supabase
      .from('quote_line_items')
      .insert({
        ...data,
        amount
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating quote line item:', error)
      throw error
    }

    return lineItem
  } catch (error) {
    console.error('Error creating quote line item:', error)
    throw error
  }
}

/**
 * Fetch quote line items by quote ID
 */
export async function fetchQuoteLineItems(quoteId: string) {
  try {
    const { data, error } = await supabase
      .from('quote_line_items')
      .select('*')
      .eq('quote_id', quoteId)
      .order('created_at')

    if (error) {
      console.error('Error fetching quote line items:', error)
      throw error
    }

    return data
  } catch (error) {
    console.error('Error fetching quote line items:', error)
    throw error
  }
}

/**
 * Delete a quote line item
 */
export async function deleteQuoteLineItem(id: string) {
  try {
    const { error } = await supabase
      .from('quote_line_items')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting quote line item:', error)
      throw error
    }
  } catch (error) {
    console.error('Error deleting quote line item:', error)
    throw error
  }
}

/**
 * Update a quote line item
 */
export async function updateQuoteLineItem(
  id: string,
  data: {
    description?: string
    quantity?: number
    unit_price?: number
  }
) {
  try {
    const updateData: any = { ...data }
    
    // If quantity or unit_price is changed, recalculate amount
    if (data.quantity !== undefined || data.unit_price !== undefined) {
      // First get current item data
      const { data: currentItem, error: fetchError } = await supabase
        .from('quote_line_items')
        .select('quantity, unit_price')
        .eq('id', id)
        .single()
      
      if (fetchError) throw fetchError
      
      const quantity = data.quantity ?? currentItem.quantity
      const unitPrice = data.unit_price ?? currentItem.unit_price
      
      updateData.amount = quantity * unitPrice
    }
    
    const { data: updatedItem, error } = await supabase
      .from('quote_line_items')
      .update(mapToDb({
        ...updateData,
        updated_at: new Date().toISOString()
      }))
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.error('Error updating quote line item:', error)
      throw error
    }
    
    return updatedItem
  } catch (error) {
    console.error('Error updating quote line item:', error)
    throw error
  }
}
