
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Eye, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react'
import { formatDate } from '@/utils/dateFormatters'
import ContractStatusBadge from './ContractStatusBadge'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import type { Contract } from '@/schema/operations/contract.schema'
import { createErrorFallbackUI } from '@/utils/databaseErrorHandlers'

interface ContractsTableProps {
  contracts?: Contract[]
  isLoading: boolean
  error?: Error
}

const ITEMS_PER_PAGE = 10

const ContractsTable: React.FC<ContractsTableProps> = ({ contracts, isLoading, error }) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [sortField, setSortField] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  // Handle database errors (like RLS policy infinite recursion)
  if (error) {
    const supabaseError = (error as any).error || error;
    
    if (supabaseError?.code === '42P17' || 
        supabaseError?.message?.includes('infinite recursion')) {
      return createErrorFallbackUI(supabaseError, 'contracts');
    }
    
    return (
      <div className="flex items-center justify-center p-8 text-center">
        <div className="flex flex-col items-center">
          <AlertCircle className="h-10 w-10 text-destructive mb-2" />
          <h3 className="font-semibold text-lg">Error loading contracts</h3>
          <p className="text-muted-foreground mt-1">
            {error.message || 'An unexpected error occurred. Please try again.'}
          </p>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-pulse text-center">
          <p className="text-muted-foreground">Loading contracts...</p>
        </div>
      </div>
    )
  }

  if (!contracts || contracts.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground">No contracts found.</p>
      </div>
    )
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
    }).format(amount)
  }

  // Sort the contracts
  const sortedContracts = [...contracts]
  if (sortField) {
    sortedContracts.sort((a: any, b: any) => {
      let compareA = a[sortField]
      let compareB = b[sortField]
      
      // Handle special cases
      if (sortField === 'client') {
        compareA = a.client?.company_name || ''
        compareB = b.client?.company_name || ''
      }
      
      // Compare based on type
      if (typeof compareA === 'string') {
        return sortDirection === 'asc'
          ? compareA.localeCompare(compareB)
          : compareB.localeCompare(compareA)
      } else {
        return sortDirection === 'asc'
          ? compareA - compareB
          : compareB - compareA
      }
    })
  }

  // Implement pagination
  const totalPages = Math.ceil(sortedContracts.length / ITEMS_PER_PAGE)
  const paginatedContracts = sortedContracts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const renderSortIcon = (field: string) => {
    if (sortField !== field) return null
    return sortDirection === 'asc' ? (
      <ChevronUp className="h-4 w-4 inline ml-1" />
    ) : (
      <ChevronDown className="h-4 w-4 inline ml-1" />
    )
  }

  return (
    <div>
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead 
                className="cursor-pointer" 
                onClick={() => handleSort('contract_number')}
              >
                Contract # {renderSortIcon('contract_number')}
              </TableHead>
              <TableHead 
                className="cursor-pointer" 
                onClick={() => handleSort('client')}
              >
                Client {renderSortIcon('client')}
              </TableHead>
              <TableHead 
                className="cursor-pointer" 
                onClick={() => handleSort('status')}
              >
                Status {renderSortIcon('status')}
              </TableHead>
              <TableHead 
                className="cursor-pointer" 
                onClick={() => handleSort('start_date')}
              >
                Start Date {renderSortIcon('start_date')}
              </TableHead>
              <TableHead 
                className="cursor-pointer" 
                onClick={() => handleSort('end_date')}
              >
                End Date {renderSortIcon('end_date')}
              </TableHead>
              <TableHead 
                className="text-right cursor-pointer" 
                onClick={() => handleSort('monthly_value')}
              >
                Monthly Value {renderSortIcon('monthly_value')}
              </TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedContracts.map((contract) => (
              <TableRow key={contract.id}>
                <TableCell className="font-medium">{contract.contract_number}</TableCell>
                <TableCell>{contract.client?.company_name}</TableCell>
                <TableCell>
                  <ContractStatusBadge
                    status={contract.status}
                    underNegotiation={contract.under_negotiation}
                  />
                </TableCell>
                <TableCell>{formatDate(contract.start_date)}</TableCell>
                <TableCell>{formatDate(contract.end_date)}</TableCell>
                <TableCell className="text-right">
                  {contract.monthly_value ? formatCurrency(contract.monthly_value) : 'N/A'}
                </TableCell>
                <TableCell className="text-center">
                  <Button variant="ghost" size="sm" asChild>
                    <Link to={`/operations/contracts/${contract.id}`}>
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="mt-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
              
              {Array.from({ length: totalPages }).map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    isActive={currentPage === i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  )
}

export default ContractsTable
