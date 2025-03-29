
/**
 * Sites Service index
 * 
 * Re-export all site service functions for easy import
 */

// Export from siteQueryService
export { 
  fetchSites, 
  fetchSiteById, 
  querySitesByClientId, 
  getSiteCounts,
  fetchSitesCount
} from './siteQueryService'

// Export from siteCrudService
export {
  createSite,
  updateSite,
  deleteSite,
  bulkUpdateSitesStatus
} from './siteCrudService'

// Export from sitesByClientService
export { 
  fetchSitesByClientId 
} from './sitesByClientService'
