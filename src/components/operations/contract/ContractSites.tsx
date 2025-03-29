
import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { MapPin, Building2 } from 'lucide-react'
import type { Contract } from '@/schema/operations/contract.schema'

interface ContractSitesProps {
  contract: Contract
}

const ContractSites: React.FC<ContractSitesProps> = ({ contract }) => {
  if (!contract.sites || contract.sites.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Service Locations</CardTitle>
          <CardDescription>No sites are associated with this contract.</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Service Locations</CardTitle>
        <CardDescription>Sites covered by this contract</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Site Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contract.sites.map((contractSite) => {
              const site = contractSite.site
              return (
                <TableRow key={contractSite.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      {site?.site_name}
                    </div>
                  </TableCell>
                  <TableCell>{site?.site_type || 'N/A'}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      {site ? (
                        <div>
                          <div>{site.address_street}</div>
                          <div className="text-xs text-muted-foreground">
                            {site.address_city}, {site.address_state} {site.address_postcode}
                          </div>
                        </div>
                      ) : (
                        'N/A'
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium 
                      ${site?.status === 'Active' ? 'bg-green-100 text-green-800' : 
                      site?.status === 'Inactive' ? 'bg-gray-100 text-gray-800' : 
                      'bg-yellow-100 text-yellow-800'}`}>
                      {site?.status || 'N/A'}
                    </span>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

export default ContractSites
