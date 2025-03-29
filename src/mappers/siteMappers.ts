/**
 * Site Data Mappers
 * 
 * These mappers handle transformations between database representation 
 * and UI representation of Site data.
 */
import { Site, SiteInsert, SiteUpdate } from '@/schema/operations/site.schema'
import { mapFromDb, mapToDb } from '@/utils/mappers'
import { prepareObjectForDb } from '@/utils/dateFormatters'

/**
 * Maps a database site record to the UI representation
 */
export function mapSiteFromDb(dbSite: any): Site {
  if (!dbSite) {
    console.warn('Received null or undefined site data in mapSiteFromDb')
    throw new Error('Invalid site data received from database')
  }

  // Convert snake_case to camelCase and handle other transformations
  const mappedSite = mapFromDb(dbSite) as Site
  
  // Handle coordinates parsing if needed
  if (mappedSite.coordinates && typeof mappedSite.coordinates === 'string') {
    try {
      // Keep the string format but validate it
      const [lat, lng] = mappedSite.coordinates.split(',').map(Number)
      if (isNaN(lat) || isNaN(lng)) {
        console.warn(`Invalid coordinates format for site ${mappedSite.id}: ${mappedSite.coordinates}`)
      }
    } catch (error) {
      console.error('Error parsing coordinates:', error)
    }
  }
  
  return mappedSite
}

/**
 * Maps an array of database site records to UI representation
 */
export function mapSitesFromDb(dbSites: any[]): Site[] {
  if (!dbSites || !Array.isArray(dbSites)) {
    console.warn('mapSitesFromDb received invalid data:', dbSites)
    return []
  }

  return dbSites
    .map(dbSite => {
      try {
        return mapSiteFromDb(dbSite)
      } catch (error) {
        console.error('Error mapping site from DB:', error, dbSite)
        return null
      }
    })
    .filter(Boolean) as Site[] // Filter out null values
}

/**
 * Maps a UI site object to database representation for insert/update
 * Ensures all fields are properly formatted and validated
 */
export function mapSiteToDb(site: Partial<Site>): Record<string, any> {
  // First handle any UI-specific field transformations
  const preparedSite = {
    ...site,
    // Any additional field transformations can be done here
  }
  
  // Then convert to snake_case
  const snakeCaseSite = mapToDb(preparedSite)
  
  // Finally, ensure dates are properly formatted for database
  return prepareObjectForDb(snakeCaseSite)
}

/**
 * Maps a site for insertion with type safety
 */
export function mapSiteForInsert(site: Partial<Site>): SiteInsert {
  return mapSiteToDb(site) as SiteInsert
}

/**
 * Maps a site for update with type safety
 */
export function mapSiteForUpdate(site: Partial<Site>): SiteUpdate {
  return mapSiteToDb(site) as SiteUpdate
}
