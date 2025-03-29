
import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { MapPin } from 'lucide-react'
import type { Contract } from '@/schema/operations/contract.schema'

interface ContractSitesProps {
  contract: Contract
}

interface ContractSite {
  id: string;
  site?: {
    site_name?: string;
    address_city?: string;
    address_state?: string;
  };
}

const ContractSites: React.FC<ContractSitesProps> = ({ contract }) => {
  if (!contract.sites || contract.sites.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Service Locations</CardTitle>
          <CardDescription>No sites associated with this contract</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            No service locations have been added to this contract.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Service Locations</CardTitle>
        <CardDescription>Sites covered under this contract</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Site Name</TableHead>
              <TableHead>Location</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contract.sites.map((contractSite: ContractSite) => (
              <TableRow key={contractSite.id}>
                <TableCell className="font-medium">
                  {contractSite.site?.site_name || 'Unnamed Site'}
                </TableCell>
                <TableCell className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                  {contractSite.site && 'address_city' in contractSite.site ? 
                    `${contractSite.site.address_city || 'Unknown City'}, ${contractSite.site.address_state || 'Unknown State'}` : 
                    'Unknown Location'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

export default ContractSites
