/**
 * Schema Index
 *
 * This file exports all schema types from their respective domain files.
 */

// Auth Domain
export * from './domains/auth/user.schema'

// Client Domain
export * from './domains/clients/client.schema'
export * from './domains/clients/location.schema'

// Contract Domain
export * from './domains/contracts/contract.schema'

// Operations Domain
export * from './domains/operations/cleaning.schema'
export * from './domains/operations/schedule.schema'

// Reports Domain
export * from './domains/reports/cleaning-report.schema'

// Inventory Domain
export * from './domains/inventory/inventory.schema'

// Finance Domain
export * from './domains/finance/invoice.schema'

// Quality Domain
export * from './domains/quality/quality.schema'

// Communications Domain
export * from './domains/communications/notification.schema'
