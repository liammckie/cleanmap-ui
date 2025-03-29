
/**
 * Site Query Service
 * 
 * This is a barrel file that re-exports all site query functions
 * from the more specialized service files for backwards compatibility.
 */

// Re-export from more specialized services
export { fetchSites, fetchSitesCount } from './siteSearchService'
export { fetchSiteById, querySitesByClientId } from './siteRetrievalService'
export { getSiteCounts } from './siteMetricsService'
