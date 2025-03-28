
import { useState, useEffect } from 'react';
import LocationsMap from './LocationsMap';
import { useLocations } from '@/hooks/useLocations';

const DashboardMap = () => {
  const { data: locations, isLoading, error } = useLocations({ onlyActive: true });

  if (isLoading) {
    return <LocationsMap />;
  }

  if (error) {
    console.error('Error loading locations:', error);
    return <LocationsMap />;
  }

  return <LocationsMap locations={locations} />;
};

export default DashboardMap;
