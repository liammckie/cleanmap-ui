/**
 * Utility functions for generating unique identifiers for various entities
 */

/**
 * Generates a unique work order number with format WO-YYYY-MM-XXXXX
 * where XXXXX is a 5-digit sequential number
 */
export async function generateWorkOrderNumber(): Promise<string> {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')

  // In a real implementation, this would query the database for the latest number
  // and increment it. For now, we'll generate a random 5-digit number
  const randomNum = Math.floor(10000 + Math.random() * 90000)

  return `WO-${year}-${month}-${randomNum}`
}
