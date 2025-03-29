/**
 * Inventory Schema
 *
 * This file defines the data structures for inventory and transactions.
 */

/**
 * Inventory_Items - Cleaning supplies and equipment
 */
export interface InventoryItem {
  id: number
  name: string
  description?: string
  category: 'cleaning_supply' | 'equipment' | 'tool' | 'uniform' | 'other'
  unit: string // bottle, box, each, etc.
  quantity_in_stock: number
  minimum_stock_level: number
  cost_per_unit: number
  supplier?: string
  created_at: Date
  updated_at: Date
}

/**
 * Inventory_Transactions - Movement of inventory items
 */
export interface InventoryTransaction {
  id: number
  inventory_item_id: number // Foreign key to InventoryItem
  transaction_type: 'purchase' | 'use' | 'return' | 'adjustment'
  quantity: number
  transaction_date: Date
  user_id: number // Foreign key to User (who recorded the transaction)
  notes?: string
  location_id?: number // Foreign key to Location (if applicable)
  created_at: Date
  updated_at: Date
}
