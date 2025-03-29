
import { useState, useEffect } from 'react'
import { useToast } from '@/hooks/use-toast'
import { siteFormTestCases, testSiteFormValidation } from '@/utils/testing/siteFormTesting'
import { fetchSites, fetchSiteById } from '@/services/sites'

export function useSiteTesting() {
  const [isRunningTests, setIsRunningTests] = useState(false)
  const [testResults, setTestResults] = useState<any[]>([])
  const [testErrors, setTestErrors] = useState<string[]>([])
  const { toast } = useToast()

  // Run form validation tests
  const runFormValidationTests = () => {
    try {
      setIsRunningTests(true)
      const results = testSiteFormValidation()
      setTestResults(results)
      
      const errorCount = results.filter(r => !r.passed).length
      
      toast({
        title: errorCount ? `${errorCount} validation tests failed` : "All validation tests passed",
        description: `Completed ${results.length} validation tests`,
        variant: errorCount ? "destructive" : "default"
      })
    } catch (error) {
      console.error('Error running form validation tests:', error)
      setTestErrors(prev => [...prev, `Form validation test error: ${error}`])
      
      toast({
        title: "Test Error",
        description: `Error running validation tests: ${error}`,
        variant: "destructive"
      })
    } finally {
      setIsRunningTests(false)
    }
  }
  
  // Test site data retrieval
  const testSiteRetrieval = async () => {
    try {
      setIsRunningTests(true)
      
      // Test listing all sites
      console.time('fetchSites')
      const sites = await fetchSites()
      console.timeEnd('fetchSites')
      console.log(`Retrieved ${sites.length} sites`)
      
      if (sites.length > 0) {
        // Test retrieving a specific site
        const siteId = sites[0].id
        console.time('fetchSiteById')
        const site = await fetchSiteById(siteId)
        console.timeEnd('fetchSiteById')
        
        console.log('Site details:', site)
        
        if (!site) {
          throw new Error(`Failed to retrieve site with ID: ${siteId}`)
        }
      }
      
      toast({
        title: "Data retrieval tests passed",
        description: `Successfully fetched ${sites.length} sites`,
      })
    } catch (error) {
      console.error('Error testing site retrieval:', error)
      setTestErrors(prev => [...prev, `Site retrieval test error: ${error}`])
      
      toast({
        title: "Data Retrieval Error",
        description: `Error testing site retrieval: ${error}`,
        variant: "destructive"
      })
    } finally {
      setIsRunningTests(false)
    }
  }
  
  // Clear test results
  const clearTestResults = () => {
    setTestResults([])
    setTestErrors([])
  }
  
  return {
    isRunningTests,
    testResults,
    testErrors,
    runFormValidationTests,
    testSiteRetrieval,
    clearTestResults,
    testCases: siteFormTestCases
  }
}
