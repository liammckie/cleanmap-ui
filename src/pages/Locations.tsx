import { useState, useEffect } from 'react'
import { Building2, MapPin, Plus, Search, Filter, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import LocationsMap from '@/components/Map/LocationsMap'
import { MapLocation } from '@/components/Map/types'

interface Location {
  id: string
  name: string
  address: string
  city: string
  type: string
  clientName: string
  area: string
  cleaningFrequency: string
  status: 'active' | 'inactive' | 'upcoming'
  lat?: number
  lng?: number
  count?: number
}

const mockLocations: Location[] = [
  {
    id: '1',
    name: 'Corporate Headquarters',
    address: '123 Business Ave',
    city: 'Sydney',
    type: 'Office Building',
    clientName: 'Acme Corporation',
    area: '3,500 m²',
    cleaningFrequency: 'Daily',
    status: 'active',
    lat: -33.865143,
    lng: 151.2099,
    count: 5,
  },
  {
    id: '2',
    name: 'Downtown Branch',
    address: '456 Main Street',
    city: 'Melbourne',
    type: 'Bank Branch',
    clientName: 'City Financial',
    area: '850 m²',
    cleaningFrequency: '3x Weekly',
    status: 'active',
    lat: -37.813629,
    lng: 144.963058,
    count: 3,
  },
  {
    id: '3',
    name: 'Tech Park Campus',
    address: '789 Innovation Drive',
    city: 'Brisbane',
    type: 'Office Complex',
    clientName: 'Global Tech Industries',
    area: '5,200 m²',
    cleaningFrequency: 'Daily',
    status: 'active',
    lat: -27.470125,
    lng: 153.021072,
    count: 7,
  },
  {
    id: '4',
    name: 'Westside Mall',
    address: '321 Retail Road',
    city: 'Perth',
    type: 'Shopping Center',
    clientName: 'Retail Properties Inc.',
    area: '12,000 m²',
    cleaningFrequency: 'Daily',
    status: 'active',
    lat: -31.952712,
    lng: 115.857048,
    count: 10,
  },
  {
    id: '5',
    name: 'Medical Center Building',
    address: '555 Healthcare Boulevard',
    city: 'Adelaide',
    type: 'Medical Facility',
    clientName: 'Omega Healthcare',
    area: '2,800 m²',
    cleaningFrequency: 'Daily',
    status: 'active',
    lat: -34.928497,
    lng: 138.599959,
    count: 6,
  },
  {
    id: '6',
    name: 'North Side Factory',
    address: '888 Industrial Parkway',
    city: 'Newcastle',
    type: 'Industrial Facility',
    clientName: 'Manufacturing Solutions',
    area: '7,500 m²',
    cleaningFrequency: 'Weekly',
    status: 'inactive',
    lat: -32.916668,
    lng: 151.75,
    count: 2,
  },
]

const Locations = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [locations, setLocations] = useState(mockLocations)
  const [viewType, setViewType] = useState<'grid' | 'map'>('grid')
  const [filter, setFilter] = useState('all')
  const [mapLocations, setMapLocations] = useState<MapLocation[]>([])

  const filteredLocations = locations.filter((location) => {
    const matchesSearch =
      location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.clientName.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter = filter === 'all' || location.status === filter

    return matchesSearch && matchesFilter
  })

  useEffect(() => {
    const mapData: MapLocation[] = filteredLocations
      .filter((location) => location.lat && location.lng)
      .map((location) => ({
        id: location.id,
        name: location.name,
        lat: location.lat || 0,
        lng: location.lng || 0,
        count: location.count || 0,
        address: location.address,
        city: location.city,
        clientName: location.clientName,
      }))

    setMapLocations(mapData)
  }, [filteredLocations])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
      case 'inactive':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
      case 'upcoming':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex-1 flex flex-col sm:flex-row gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              className="pl-10 w-full sm:w-80"
              placeholder="Search locations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex gap-2 items-center">
                <Filter className="h-4 w-4" />
                Filter
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setFilter('all')}>All Locations</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter('active')}>
                Active Locations
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter('inactive')}>
                Inactive Locations
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter('upcoming')}>
                Upcoming Locations
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex gap-2">
          <Button
            variant={viewType === 'grid' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewType('grid')}
          >
            <Building2 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewType === 'map' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewType('map')}
          >
            <MapPin className="h-4 w-4" />
          </Button>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Location
          </Button>
        </div>
      </div>

      {viewType === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLocations.map((location) => (
            <Card key={location.id} className="overflow-hidden transition-all hover:shadow-glossy">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{location.name}</CardTitle>
                    <CardDescription>{location.type}</CardDescription>
                  </div>
                  <span
                    className={cn(
                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                      getStatusColor(location.status),
                    )}
                  >
                    {location.status.charAt(0).toUpperCase() + location.status.slice(1)}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="pb-6">
                <div className="space-y-3">
                  <div className="flex items-start">
                    <MapPin className="h-4 w-4 text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{location.address}</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{location.city}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Client</p>
                      <p className="text-sm font-medium">{location.clientName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Area</p>
                      <p className="text-sm font-medium">{location.area}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Frequency</p>
                      <p className="text-sm font-medium">{location.cleaningFrequency}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-gray-50 dark:bg-gray-800/50 px-6 py-3 border-t">
                <Button variant="ghost" className="text-brand-blue" size="sm">
                  View Details
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <LocationsMap locations={mapLocations} />
        </div>
      )}
    </div>
  )
}

export default Locations
